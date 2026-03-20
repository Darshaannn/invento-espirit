// app/api/analytics/insights/route.ts
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

    // Single aggregation pipeline — replaces multiple separate queries
    const [stats] = await Assessment.aggregate([
      { $match: { userId: (session.user as any).id } },
      {
        $group: {
          _id:          null,
          totalTests:   { $sum: 1 },
          avgScore:     { $avg: "$overallScore" },
          bestScore:    { $max: "$overallScore" },
          latestScore:  { $last: "$overallScore" },
          latestRisk:   { $last: "$riskTier" },
          avgMemory:    { $avg: "$domainScores.Memory" },
          avgAttention: { $avg: "$domainScores.Attention" },
          avgExecutive: { $avg: "$domainScores.ExecutiveFunction" },
          avgOrient:    { $avg: "$domainScores.Orientation" },
        },
      },
      {
        $project: {
          _id:         0,
          totalTests:  1,
          avgScore:    { $round: ["$avgScore", 0] },
          bestScore:   1,
          latestScore: 1,
          latestRisk:  1,
          domainAverages: {
            Memory:                 { $round: ["$avgMemory",    0] },
            Attention:              { $round: ["$avgAttention", 0] },
            "Executive Function":   { $round: ["$avgExecutive", 0] },
            Orientation:            { $round: ["$avgOrient",    0] },
          },
        },
      },
    ]);

    if (!stats) {
      return NextResponse.json({ error: "No data" }, { status: 404 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[/api/analytics/insights]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
