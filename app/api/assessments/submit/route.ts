// app/api/assessments/submit/route.ts
// Wires the clinical scoring engine + Gemini service together.
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assessment from "@/lib/models/Assessment";
import { analyzeWithGemini } from "@/lib/services/gemini";
import { buildClinicalScores } from "@/lib/utils/clinicalScoring";

export const dynamic = "force-dynamic";

const ResponseSchema = z.object({
  questionId: z.number(),
  domain: z.enum(["Memory", "Attention", "Executive Function", "Orientation"]),
  selectedAnswer: z.string().nullable(),
  correctAnswer: z.string(),
  timeTakenMs: z.number().min(0).max(120_000),
  skipped: z.boolean(),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const SubmitSchema = z.object({
  responses: z.array(ResponseSchema).min(1).max(40),
  ageGroup: z.string(),
  gender: z.string().optional(),
  symptoms: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = SubmitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { responses, ageGroup, gender, symptoms = [] } = parsed.data;

    // ── 1. Clinical scoring (synchronous, deterministic) ──────────────────
    const clinicalScores = buildClinicalScores(responses);
    const avgResponseSec = Math.round(
      responses.reduce((a, r) => a + r.timeTakenMs, 0) / responses.length / 1000
    );
    const totalTimeSec = Math.round(
      responses.reduce((a, r) => a + r.timeTakenMs, 0) / 1000
    );

    // ── 2. Gemini analysis + session auth (parallel) ───────────────────────
    const [geminiResult, session] = await Promise.all([
      analyzeWithGemini({
        clinicalScores,
        ageGroup,
        gender,
        symptoms,
        skippedCount: responses.filter(r => r.skipped).length,
        avgResponseSec,
        totalTimeSec,
      }).catch(err => {
        console.error("[Submit] Gemini failed:", err.message);
        return null; // handled below
      }),
      auth(),
    ]);

    // Build final result object
    const result = {
      clinicalScores,
      geminiInsights: geminiResult,
      completedAt: new Date().toISOString(),
      totalTimeSec,
      ageGroup,
      symptoms,
    };

    // ── 3. Save to MongoDB (logged-in users) ──────────────────────────────
    if (session?.user) {
      await dbConnect();
      await Assessment.create({
        userId: (session.user as any).id,
        ageGroup, gender, symptoms, responses,
        domainScores: {
          Memory: clinicalScores.domainScores["Memory"],
          Attention: clinicalScores.domainScores["Attention"],
          ExecutiveFunction: clinicalScores.domainScores["Executive Function"],
          Orientation: clinicalScores.domainScores["Orientation"],
        },
        overallScore: clinicalScores.overall,
        mocaEquivalent: clinicalScores.moca,
        mmseEquivalent: clinicalScores.mmse,
        riskTier: clinicalScores.riskTier,
        impairmentLevel: clinicalScores.impairment,
        aiInsights: geminiResult?.clinicalSummary ?? "",
        recommendations: geminiResult?.recommendations ?? [],
        geminiInsights: geminiResult,
        totalTimeSec,
        completedAt: new Date(),
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[/api/assessments/submit]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
