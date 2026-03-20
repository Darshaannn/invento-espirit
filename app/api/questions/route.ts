// app/api/questions/route.ts
// ─── Adaptive Question Selection ─────────────────────────────────────────────
// Returns a tailored set of questions based on:
//   - age  : patient age group → determines base cognitive difficulty
//   - symptoms : comma-separated symptom list → boosts relevant domains
// Without params, returns a balanced default set.
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse } from "next/server";
import questions from "@/data/questions.json";
import { selectQuestions, Question } from "@/lib/utils/questionSelector";

export const dynamic = "force-dynamic"; // must be dynamic since output varies per request

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const age = searchParams.get("age") ?? "adult";
  const symptomsRaw = searchParams.get("symptoms") ?? "";
  const symptoms = symptomsRaw
    ? symptomsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const { questions: selected, profile, segment } = selectQuestions(
    questions as Question[],
    age,
    symptoms
  );

  return NextResponse.json(selected, {
    headers: {
      // Short cache since results are personalized per intake
      "Cache-Control": "private, max-age=60",
      // Expose the active profile for debugging
      "X-Assessment-Profile": profile,
      "X-Assessment-Segment": segment,
    },
  });
}
