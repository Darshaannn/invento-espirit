// app/api/analytics/trends/route.ts
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

    // Aggregation pipeline — single DB round-trip for sparkline data
    const trends = await Assessment.aggregate([
      { $match: { userId: (session.user as any).id } },
      { $sort: { completedAt: -1 } },
      { $limit: 8 }, // last 8 sessions for the sparkline
      {
        $project: {
          _id: 0,
          overallScore: 1,
          mocaEquivalent: 1,
          mmseEquivalent: 1,
          impairmentLevel: 1,
          riskTier: 1,
          completedAt: 1,
          domainScores: 1,
        },
      },
      { $sort: { completedAt: 1 } }, // re-sort ascending for chart display
    ]);

    return NextResponse.json(trends);
  } catch (error) {
    console.error("[/api/analytics/trends]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
