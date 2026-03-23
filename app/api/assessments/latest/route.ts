// app/api/assessments/latest/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assessment from "@/lib/models/Assessment";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const latest = await Assessment.findOne(
      { userId: (session.user as any).id },
      {
        overallScore: 1,
        mocaEquivalent: 1,
        mmseEquivalent: 1,
        aceIII: 1,
        miniCog: 1,
        sage: 1,
        impairmentLevel: 1,
        domainScores: 1,
        riskTier: 1,
        aiInsights: 1,
        recommendations: 1,
        geminiInsights: 1,
        completedAt: 1,
        totalTimeSec: 1,
        ageGroup: 1,
        symptoms: 1,
      }
    )
      .sort({ completedAt: -1 })
      .lean();

    if (!latest) {
      return NextResponse.json({ error: "No assessments found" }, { status: 404 });
    }

    // Reconstruct the clinicalScores shape the report page expects:
    const response = {
      clinicalScores: {
        overall: latest.overallScore,
        moca: latest.mocaEquivalent ?? 0,
        mmse: latest.mmseEquivalent ?? 0,
        aceIII: latest.aceIII ?? 0,
        miniCog: latest.miniCog ?? 0,
        sage: latest.sage ?? 0,
        impairment: latest.impairmentLevel ?? "none",
        domainScores: {
          "Memory": latest.domainScores?.Memory ?? 0,
          "Attention": latest.domainScores?.Attention ?? 0,
          "Executive Function": latest.domainScores?.ExecutiveFunction ?? 0,
          "Orientation": latest.domainScores?.Orientation ?? 0,
        },
        domainFlags: {
          "Memory": (latest.domainScores?.Memory ?? 0) < 65,
          "Attention": (latest.domainScores?.Attention ?? 0) < 60,
          "Executive Function": (latest.domainScores?.ExecutiveFunction ?? 0) < 60,
          "Orientation": (latest.domainScores?.Orientation ?? 0) < 70,
        },
        riskTier: latest.riskTier ?? "low",
      },
      geminiInsights: latest.geminiInsights || {
        clinicalSummary: latest.aiInsights ?? "",
        domainInsights: { Memory: "", Attention: "", "Executive Function": "", Orientation: "" },
        keyFindings: [],
        recommendations: latest.recommendations ?? [],
        screeningContext: "",
        followUpAdvised: latest.riskTier !== "low",
        urgencyLevel: latest.riskTier === "high" ? "prompt" : latest.riskTier === "moderate" ? "soon" : "routine",
      },
      completedAt: latest.completedAt,
      totalTimeSec: latest.totalTimeSec ?? 0,
      ageGroup: latest.ageGroup ?? "",
      symptoms: latest.symptoms ?? [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("[/api/assessments/latest]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
