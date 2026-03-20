// lib/utils/scoring.ts
// Pure utility — no imports, no side effects, fast synchronous execution.

export type Domain = "Memory" | "Attention" | "Executive Function" | "Orientation";

export interface QuestionResponse {
  questionId: number;
  domain: Domain;
  selectedAnswer: string | null;
  correctAnswer: string;
  timeTakenMs: number;
  skipped: boolean;
  difficulty: "easy" | "medium" | "hard";
}

// Difficulty multipliers — harder questions worth more when correct
const DIFFICULTY_WEIGHT: Record<QuestionResponse["difficulty"], number> = {
  easy: 1.0,
  medium: 1.3,
  hard: 1.6,
};

const MAX_QUESTION_TIME_MS = 30_000; // 30s per question
const ACCURACY_WEIGHT = 0.8;   // 80% of score from accuracy
const TIME_WEIGHT = 0.2;   // 20% from response speed
const SKIP_PARTIAL_CREDIT = 0.2;   // 20% credit for skipped questions

// ─── Domain scores (0–100 each) ───────────────────────────────────────────────
export function calculateDomainScores(
  responses: QuestionResponse[]
): Record<Domain, number> {
  const domains: Domain[] = [
    "Memory",
    "Attention",
    "Executive Function",
    "Orientation",
  ];

  const result = {} as Record<Domain, number>;

  for (const domain of domains) {
    const domainResponses = responses.filter((r) => r.domain === domain);

    if (domainResponses.length === 0) {
      result[domain] = 0;
      continue;
    }

    let earned = 0;
    let max = 0;

    for (const r of domainResponses) {
      const weight = DIFFICULTY_WEIGHT[r.difficulty];
      const maxPts = 100 * weight;
      max += maxPts;

      if (r.skipped) {
        earned += maxPts * SKIP_PARTIAL_CREDIT;
        continue;
      }

      if (r.selectedAnswer === r.correctAnswer) {
        // Accuracy component
        earned += maxPts * ACCURACY_WEIGHT;
        // Time bonus (faster = higher, capped at 0)
        const timeRatio = Math.max(0, 1 - r.timeTakenMs / MAX_QUESTION_TIME_MS);
        earned += maxPts * TIME_WEIGHT * timeRatio;
      }
      // Wrong answer: 0 points (no penalty, to avoid negative scoring)
    }

    result[domain] = Math.min(100, Math.round((earned / max) * 100));
  }

  return result;
}

// ─── Overall score ─────────────────────────────────────────────────────────────
export function calculateOverallScore(domainScores: Record<Domain, number>): number {
  const values = Object.values(domainScores);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

// ─── Risk tier ─────────────────────────────────────────────────────────────────
export function getRiskTier(score: number): "low" | "moderate" | "high" {
  if (score >= 78) return "low";
  if (score >= 55) return "moderate";
  return "high";
}

// ─── Risk config (UI use) ──────────────────────────────────────────────────────
export const RISK_CONFIG = {
  low: {
    label: "Low Risk",
    color: "#22c55e",
    bgClass: "bg-green-950",
    textClass: "text-green-400",
    message: "Cognitive function appears within normal range. Continue regular monitoring.",
  },
  moderate: {
    label: "Moderate Risk",
    color: "#f59e0b",
    bgClass: "bg-amber-950",
    textClass: "text-amber-400",
    message:
      "Some indicators warrant monitoring. Consider a follow-up with your physician.",
  },
  high: {
    label: "High Risk",
    color: "#ef4444",
    bgClass: "bg-red-950",
    textClass: "text-red-400",
    message:
      "Several markers suggest professional evaluation is recommended. Please consult a neurologist.",
  },
} as const;
