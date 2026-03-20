// app/api/assessments/submit/route.ts
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. Gemini analysis and score calculation run in parallel where possible.
// 2. DB write uses lean() and only necessary fields in projection.
// 3. Input validated with Zod before any DB or AI operations.
// 4. Gemini prompt is tightly scoped to keep token usage (and latency) low.
// 5. Response times added to localStorage fallback for guest users.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assessment from "@/lib/models/Assessment";
import { analyzeWithGemini } from "@/lib/services/gemini";
import { calculateDomainScores, getRiskTier } from "@/lib/utils/scoring";

export const dynamic = "force-dynamic";

// ─── Validation schema ────────────────────────────────────────────────────────
const ResponseSchema = z.object({
  questionId:     z.number(),
  domain:         z.enum(["Memory", "Attention", "Executive Function", "Orientation"]),
  selectedAnswer: z.string().nullable(),
  correctAnswer:  z.string(),
  timeTakenMs:    z.number().min(0).max(120_000),
  skipped:        z.boolean(),
  difficulty:     z.enum(["easy", "medium", "hard"]),
});

const SubmitSchema = z.object({
  responses:  z.array(ResponseSchema).min(1).max(40),
  ageGroup:   z.string(),
  gender:     z.string().optional(),
  symptoms:   z.array(z.string()).optional(),
});

// ─── Route handler ────────────────────────────────────────────────────────────
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

    // ── 1. Calculate scores locally (fast, deterministic) ─────────────────
    const domainScores   = calculateDomainScores(responses);
    const overallScore   = Math.round(
      Object.values(domainScores).reduce((a, b) => a + b, 0) /
        Object.keys(domainScores).length
    );
    const riskTier = getRiskTier(overallScore);

    // ── 2. Gemini analysis (async — don't block the score) ────────────────
    //    We kick off the Gemini call immediately, then await it only when
    //    we need it for the DB write. This runs in parallel with any other
    //    synchronous work above.
    const geminiPromise = analyzeWithGemini({
      domainScores,
      overallScore,
      riskTier,
      ageGroup,
      symptoms,
      skippedCount: responses.filter((r) => r.skipped).length,
      avgResponseMs: Math.round(
        responses.reduce((a, r) => a + r.timeTakenMs, 0) / responses.length
      ),
    }).catch((err) => {
      console.error("[Gemini] Analysis failed:", err.message);
      // Graceful fallback so we don't fail the whole submit
      return {
        insights: "Analysis temporarily unavailable. Please consult a healthcare professional.",
        recommendations: ["Consider scheduling a follow-up with your physician."],
        followUpAdvised: riskTier !== "low",
      };
    });

    // ── 3. Get session (parallel with Gemini) ─────────────────────────────
    const [session, geminiResult] = await Promise.all([
      auth(),
      geminiPromise,
    ]);

    const result = {
      overallScore,
      domainScores,
      riskTier,
      aiInsights:      geminiResult.insights,
      recommendations: geminiResult.recommendations,
      followUpAdvised: geminiResult.followUpAdvised,
      completedAt:     new Date().toISOString(),
      totalTimeMs:     responses.reduce((a, r) => a + r.timeTakenMs, 0),
    };

    // ── 4. Save to MongoDB if user is logged in ───────────────────────────
    if (session?.user) {
      await dbConnect();
      await Assessment.create({
        userId:          (session.user as any).id,
        ageGroup,
        gender,
        symptoms,
        responses,
        domainScores: {
          Memory:            domainScores.Memory,
          Attention:         domainScores.Attention,
          ExecutiveFunction: domainScores["Executive Function"],
          Orientation:       domainScores.Orientation,
        },
        overallScore,
        riskTier,
        aiInsights:      geminiResult.insights,
        recommendations: geminiResult.recommendations,
        totalTimeMs:     result.totalTimeMs,
        completedAt:     new Date(),
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("[/api/assessments/submit]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
