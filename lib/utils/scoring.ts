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

// ─── Local Clinical Report Generation (Non-AI) ────────────────────────────────
export function generateClinicalReport(
  domainScores: Record<Domain, number>,
  overallScore: number,
  riskTier: "low" | "moderate" | "high"
) {
  const recommendations: string[] = [];
  let insights = "";

  // 1. Determine base insight
  if (riskTier === "low") {
    insights = "Cognitive indicators are within the expected physiological range. Neural stability vector shows high reliability across all primary domains.";
    recommendations.push("Continue regular cognitive maintenance exercises.");
    recommendations.push("Schedule a baseline re-assessment in 6 months.");
  } else if (riskTier === "moderate") {
    insights = "Subtle variance detected in specific cognitive pathways. Performance latency suggests potential areas for clinical observation.";
    recommendations.push("Consider a formal clinical consultation for baseline verification.");
    recommendations.push("Increase engagement in neuro-plasticity-focused activities.");
  } else {
    insights = "Significant deviation from nominal cognitive benchmarks detected. Priority clinical evaluation is advised to determine underlying factors.";
    recommendations.push("Immediate consultation with a board-certified neurologist is recommended.");
    recommendations.push("Conduct a comprehensive diagnostic workup including metabolic screening.");
  }

  // 2. Domain-specific additions
  const lowDomains = Object.entries(domainScores)
    .filter(([_, score]) => score < 60)
    .map(([name]) => name);

  if (lowDomains.length > 0) {
    insights += ` Specific attention recommended for ${lowDomains.join(" and ")} performance markers.`;
  }

  return {
    insights,
    recommendations,
    followUpAdvised: riskTier !== "low",
  };
}

export const RISK_CONFIG = {
  low: {
    label: "Stable",
    color: "#22c55e",
    bgClass: "bg-green-950",
    textClass: "text-green-400",
    message: "Cognitive function appears within normal range. Continue regular monitoring.",
  },
  moderate: {
    label: "Monitor",
    color: "#f59e0b",
    bgClass: "bg-amber-950",
    textClass: "text-amber-400",
    message:
      "Some indicators warrant monitoring. Consider a follow-up with your physician.",
  },
  high: {
    label: "Urgent",
    color: "#ef4444",
    bgClass: "bg-red-950",
    textClass: "text-red-400",
    message:
      "Several markers suggest professional evaluation is recommended. Please consult a neurologist.",
  },
} as const;
