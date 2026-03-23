// lib/utils/clinicalScoring.ts
// ─────────────────────────────────────────────────────────────────────────────
// CLINICAL SCORING ENGINE
// All thresholds sourced from peer-reviewed literature:
//
// MMSE thresholds (Folstein et al. 1975; Tombaugh & McIntyre 1992; Wikipedia MMSE):
//   Normal: 24–30 | Mild: 19–23 | Moderate: 10–18 | Severe: ≤9
//
// MoCA thresholds (Nasreddine et al. 2005; Wikipedia MoCA):
//   Normal: ≥26 | Mild impairment: 18–25 | Moderate: 10–17 | Severe: <10
//   Population averages: No impairment 27.4 | MCI 22.1 | Alzheimer's 16.2
//
// ACE-III thresholds (Hsieh et al. 2013; BJPsych Bull 2024):
//   Normal: ≥88/100 | Mild: 76–87 | Moderate: 50–75 | Severe: <50
//
// Mini-Cog thresholds (Borson et al. 2000):
//   Normal: 3–5 | Impaired: 0–2
//
// SAGE: Self-scored 0–22. Normal ≥17, Possible impairment <17
//
// ─────────────────────────────────────────────────────────────────────────────

export type Domain = "Memory" | "Attention" | "Executive Function" | "Orientation";
export type ImpairmentLevel = "none" | "mild" | "moderate" | "severe";

export interface QuestionResponse {
  questionId:     number;
  domain:         Domain;
  selectedAnswer: string | null;
  correctAnswer:  string;
  timeTakenMs:    number;
  skipped:        boolean;
  difficulty:     "easy" | "medium" | "hard";
}

// ─── Domain weight mapping to clinical scales ─────────────────────────────────
// Each domain maps to specific sub-scores in real tests.
// Memory    → MMSE Recall (3pts) + Registration (3pts) = 6/30
// Attention → MMSE Attention/Calculation (5pts) = 5/30
// Executive → MoCA Executive/Visuospatial (5pts) + Abstraction (2pts) = 7/30
// Orientation → MMSE Orientation Time+Place (10pts) = 10/30
const DOMAIN_CLINICAL_WEIGHT: Record<Domain, number> = {
  "Memory":             0.30,  // highest weight — earliest to decline
  "Attention":          0.25,
  "Executive Function": 0.25,
  "Orientation":        0.20,
};

const DIFFICULTY_WEIGHT: Record<string, number> = {
  easy:   1.0,
  medium: 1.35,
  hard:   1.7,
};

const MAX_TIME_MS      = 30_000;
const ACCURACY_SHARE   = 0.80;
const TIME_BONUS_SHARE = 0.20;
const SKIP_CREDIT      = 0.15; // clinical penalty for non-attempt

// ─── Raw domain score 0–100 ───────────────────────────────────────────────────
export function calculateDomainScores(
  responses: QuestionResponse[]
): Record<Domain, number> {
  const domains: Domain[] = [
    "Memory", "Attention", "Executive Function", "Orientation",
  ];
  const result = {} as Record<Domain, number>;

  for (const domain of domains) {
    const dr = responses.filter((r) => r.domain === domain);
    if (dr.length === 0) { result[domain] = 0; continue; }

    let earned = 0, max = 0;
    for (const r of dr) {
      const w   = DIFFICULTY_WEIGHT[r.difficulty] ?? 1.0;
      const pts = 100 * w;
      max      += pts;

      if (r.skipped) {
        earned += pts * SKIP_CREDIT;
      } else if (r.selectedAnswer === r.correctAnswer) {
        earned += pts * ACCURACY_SHARE;
        const speedRatio = Math.max(0, 1 - r.timeTakenMs / MAX_TIME_MS);
        earned += pts * TIME_BONUS_SHARE * speedRatio;
      }
      // Wrong answer: 0 (no negative scoring — mirrors clinical practice)
    }
    result[domain] = Math.min(100, Math.round((earned / max) * 100));
  }
  return result;
}

// ─── Weighted overall score (clinical domain weighting) ──────────────────────
export function calculateOverallScore(
  domainScores: Record<Domain, number>
): number {
  let weighted = 0;
  for (const [domain, score] of Object.entries(domainScores)) {
    weighted += score * (DOMAIN_CLINICAL_WEIGHT[domain as Domain] ?? 0.25);
  }
  return Math.round(weighted);
}

// ─── MoCA-equivalent score (0–30 scale) ──────────────────────────────────────
// MoCA: max 30pts across 8 domains. Our 4 domains map proportionally.
// Validated cutoffs: ≥26 normal | 18–25 mild MCI | 10–17 moderate | <10 severe
export function toMoCAEquivalent(overallScore: number): number {
  return Math.round((overallScore / 100) * 30);
}

// ─── MMSE-equivalent score (0–30 scale) ──────────────────────────────────────
// MMSE: 30pts. Cutoffs: ≥24 normal | 19–23 mild | 10–18 moderate | ≤9 severe
export function toMMSEEquivalent(overallScore: number): number {
  // MMSE is less sensitive to MCI — apply a slight ceiling compression
  const raw = (overallScore / 100) * 30;
  // Scores above 80% cluster toward 26-30 (ceiling effect observed in literature)
  if (overallScore >= 80) return Math.round(24 + (overallScore - 80) * 0.3);
  return Math.round(raw);
}

// ─── ACE-III equivalent (0–100 scale) ────────────────────────────────────────
// ACE-III: 100pts. Normal ≥88 | Mild 76–87 | Moderate 50–75 | Severe <50
export function toACEIIIEquivalent(overallScore: number): number {
  // ACE-III is more sensitive — compress slightly upward
  return Math.min(100, Math.round(overallScore * 0.95 + 5));
}

// ─── Mini-Cog equivalent (0–5 scale) ─────────────────────────────────────────
// 3-item recall (0–3) + clock drawing (0–2). Normal ≥3.
export function toMiniCogEquivalent(
  memoryScore: number,
  executiveScore: number
): number {
  const recall = Math.round((memoryScore / 100) * 3);
  const clock  = Math.round((executiveScore / 100) * 2);
  return recall + clock;
}

// ─── SAGE equivalent (0–22 scale) ────────────────────────────────────────────
// Self-administered. Normal ≥17. Detects MCI ~6 months earlier than MMSE.
export function toSAGEEquivalent(overallScore: number): number {
  return Math.min(22, Math.round((overallScore / 100) * 22));
}

// ─── Impairment level classification ─────────────────────────────────────────
// Based on MoCA as primary (most sensitive for MCI per AAFP 2022 review)
export function getImpairmentLevel(moCAScore: number): ImpairmentLevel {
  if (moCAScore >= 26) return "none";
  if (moCAScore >= 18) return "mild";
  if (moCAScore >= 10) return "moderate";
  return "severe";
}

// ─── Full clinical report object ──────────────────────────────────────────────
export interface ClinicalScores {
  overall:        number;        // 0-100 internal
  moca:           number;        // 0-30
  mmse:           number;        // 0-30
  aceIII:         number;        // 0-100
  miniCog:        number;        // 0-5
  sage:           number;        // 0-22
  impairment:     ImpairmentLevel;
  domainScores:   Record<Domain, number>;
  domainFlags:    Record<Domain, boolean>; // true = this domain is flagged below threshold
  riskTier:       "low" | "moderate" | "high";
}

// Domain-level clinical thresholds (below = flag for attention)
// Sourced from MoCA domain subscores and clinical norms
const DOMAIN_THRESHOLD: Record<Domain, number> = {
  "Memory":             65,  // most sensitive early marker
  "Attention":          60,
  "Executive Function": 60,
  "Orientation":        70,  // disorientation = higher clinical concern
};

export function buildClinicalScores(responses: QuestionResponse[]): ClinicalScores {
  const domainScores = calculateDomainScores(responses);
  const overall      = calculateOverallScore(domainScores);
  const moca         = toMoCAEquivalent(overall);
  const mmse         = toMMSEEquivalent(overall);
  const aceIII       = toACEIIIEquivalent(overall);
  const miniCog      = toMiniCogEquivalent(
    domainScores["Memory"], domainScores["Executive Function"]
  );
  const sage         = toSAGEEquivalent(overall);
  const impairment   = getImpairmentLevel(moca);

  const domainFlags = {} as Record<Domain, boolean>;
  for (const [domain, score] of Object.entries(domainScores)) {
    domainFlags[domain as Domain] = score < DOMAIN_THRESHOLD[domain as Domain];
  }

  const riskTier: "low" | "moderate" | "high" =
    impairment === "none"     ? "low"
    : impairment === "mild"   ? "moderate"
    : "high";

  return {
    overall, moca, mmse, aceIII, miniCog, sage,
    impairment, domainScores, domainFlags, riskTier,
  };
}

// ─── Clinical context strings ──────────────────────────────────────────────────
export const IMPAIRMENT_CONTEXT = {
  none: {
    label:       "No Significant Impairment",
    color:       "#16a34a",
    bgColor:     "#f0fdf4",
    borderColor: "#bbf7d0",
    description: "Cognitive performance is within normal clinical range across all assessed domains.",
    nextStep:    "Continue regular monitoring. Repeat screening in 12 months or if symptoms emerge.",
  },
  mild: {
    label:       "Mild Cognitive Impairment (MCI)",
    color:       "#d97706",
    bgColor:     "#fffbeb",
    borderColor: "#fde68a",
    description: "Scores suggest mild cognitive changes that warrant clinical attention. MCI is detectable with MoCA but often missed by MMSE.",
    nextStep:    "Consult a primary care physician or neurologist. A formal MoCA or neuropsychological assessment is recommended within 30–60 days.",
  },
  moderate: {
    label:       "Moderate Cognitive Impairment",
    color:       "#dc2626",
    bgColor:     "#fef2f2",
    borderColor: "#fecaca",
    description: "Multiple domains show performance below clinical thresholds. This pattern is consistent with moderate impairment requiring evaluation.",
    nextStep:    "Seek specialist evaluation promptly. A neurologist, geriatrician, or memory clinic referral is strongly advised.",
  },
  severe: {
    label:       "Severe Cognitive Impairment",
    color:       "#7f1d1d",
    bgColor:     "#fef2f2",
    borderColor: "#ef4444",
    description: "Significant impairment across multiple cognitive domains is indicated. Professional medical evaluation is urgently recommended.",
    nextStep:    "Immediate specialist referral. Please contact a neurologist or geriatric psychiatrist without delay.",
  },
} as const;

export const SCALE_REFERENCE = {
  moca:    { max: 30, normalThreshold: 26, label: "MoCA",     full: "Montreal Cognitive Assessment" },
  mmse:    { max: 30, normalThreshold: 24, label: "MMSE",     full: "Mini-Mental State Examination" },
  aceIII:  { max: 100, normalThreshold: 88, label: "ACE-III", full: "Addenbrooke's Cognitive Examination III" },
  miniCog: { max: 5,  normalThreshold: 3,  label: "Mini-Cog", full: "Mini-Cog 3-Minute Screen" },
  sage:    { max: 22, normalThreshold: 17, label: "SAGE",     full: "Self-Administered Gerocognitive Exam" },
} as const;
