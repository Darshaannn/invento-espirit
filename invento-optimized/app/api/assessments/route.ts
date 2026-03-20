// app/api/assessments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Assessment from "@/lib/models/Assessment";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Pagination
    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const skip  = (page - 1) * limit;

    // lean() returns plain JS objects — ~40% faster than full Mongoose docs
    // Projection: only fields needed for the history list
    const assessments = await Assessment.find(
      { userId: (session.user as any).id },
      {
        overallScore: 1,
        riskTier:     1,
        domainScores: 1,
        completedAt:  1,
        totalTimeMs:  1,
      }
    )
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Assessment.countDocuments({
      userId: (session.user as any).id,
    });

    return NextResponse.json({
      assessments,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[/api/assessments]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
