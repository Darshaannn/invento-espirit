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

    // Single aggregation pipeline — replaces 4 separate DB queries
    const [result] = await Assessment.aggregate([
      { $match: { userId: (session.user as any).id } },
      {
        $group: {
          _id:          null,
          totalCount:   { $sum: 1 },
          avgScore:     { $avg: "$overallScore" },
          bestScore:    { $max: "$overallScore" },
          latestScore:  { $last: "$overallScore" },
          latestRisk:   { $last: "$riskTier" },
          latestDate:   { $last: "$completedAt" },
          avgMemory:    { $avg: "$domainScores.Memory" },
          avgAttention: { $avg: "$domainScores.Attention" },
          avgExec:      { $avg: "$domainScores.ExecutiveFunction" },
          avgOrient:    { $avg: "$domainScores.Orientation" },
        },
      },
      {
        $project: {
          _id:         0,
          totalCount:  1,
          avgScore:    { $round: ["$avgScore",     0] },
          bestScore:   { $round: ["$bestScore",    0] },
          latestScore: { $round: ["$latestScore",  0] },
          latestRisk:  1,
          latestDate:  1,
          domainAverages: {
            Memory:            { $round: ["$avgMemory",    0] },
            Attention:         { $round: ["$avgAttention", 0] },
            ExecutiveFunction: { $round: ["$avgExec",      0] },
            Orientation:       { $round: ["$avgOrient",    0] },
          },
        },
      },
    ]);

    if (!result) {
      return NextResponse.json({ empty: true });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/analytics/insights]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
