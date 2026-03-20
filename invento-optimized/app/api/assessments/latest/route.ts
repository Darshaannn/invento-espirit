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
      // Only return what the report/dashboard needs
      {
        overallScore:    1,
        domainScores:    1,
        riskTier:        1,
        aiInsights:      1,
        recommendations: 1,
        completedAt:     1,
        totalTimeMs:     1,
      }
    )
      .sort({ completedAt: -1 })
      .lean();

    if (!latest) {
      return NextResponse.json({ error: "No assessments found" }, { status: 404 });
    }

    return NextResponse.json(latest);
  } catch (error) {
    console.error("[/api/assessments/latest]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
