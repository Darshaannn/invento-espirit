// app/api/seed-questions/route.ts
// DEV ONLY — seeds the question bank into MongoDB.
// Protected: only runs in non-production environments.
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Question from "@/lib/models/Question";
import questions from "@/data/questions.json";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    await dbConnect();

    // Idempotent bulk upsert — safe to run multiple times
    const ops = questions.map((q: any) => ({
      updateOne: {
        filter: { id: q.id },
        update: { $set: q },
        upsert: true,
      },
    }));

    const result = await Question.bulkWrite(ops);

    return NextResponse.json({
      message: "Questions seeded successfully",
      upserted: result.upsertedCount,
      modified: result.modifiedCount,
      total:    questions.length,
    });
  } catch (error) {
    console.error("[/api/seed-questions]:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
