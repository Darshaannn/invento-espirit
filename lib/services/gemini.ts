// lib/services/gemini.ts
// ─────────────────────────────────────────────────────────────────────────────
// GEMINI CLINICAL ANALYSIS SERVICE
// Uses real clinical scale equivalents (MoCA, MMSE, ACE-III, Mini-Cog, SAGE)
// to prompt Gemini with medically grounded context — not internal app scores.
// ─────────────────────────────────────────────────────────────────────────────
import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";
import type { ClinicalScores } from "@/lib/utils/clinicalScoring";
import { IMPAIRMENT_CONTEXT, SCALE_REFERENCE } from "@/lib/utils/clinicalScoring";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("[Gemini] GEMINI_API_KEY is not set in .env.local");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const CONFIG: GenerationConfig = {
  temperature: 0.25,  // very low — clinical content must be consistent
  maxOutputTokens: 900,   // enough for full structured JSON
  responseMimeType: "application/json",
};

// ─── Input ────────────────────────────────────────────────────────────────────
export interface GeminiInput {
  clinicalScores: ClinicalScores;
  ageGroup: string;
  gender?: string;
  symptoms: string[];
  skippedCount: number;
  avgResponseSec: number;
  totalTimeSec: number;
}

// ─── Output ───────────────────────────────────────────────────────────────────
export interface GeminiOutput {
  clinicalSummary: string;   // 2-3 sentences, measured clinical tone
  domainInsights: Record<string, string>; // per-domain plain-English insight
  keyFindings: string[]; // 3–4 bullet observations
  recommendations: string[]; // 3–4 actionable next steps
  screeningContext: string;   // 1 sentence: what these scores mean in context of clinical tools
  followUpAdvised: boolean;
  urgencyLevel: "routine" | "soon" | "prompt" | "urgent";
}

// ─── Main analysis function ───────────────────────────────────────────────────
export async function analyzeWithGemini(input: GeminiInput): Promise<GeminiOutput> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: CONFIG,
  });

  const { clinicalScores: cs, ageGroup, gender, symptoms, skippedCount, avgResponseSec } = input;
  const impCtx = IMPAIRMENT_CONTEXT[cs.impairment];

  // Flag which domains scored below clinical threshold
  const flaggedDomains = Object.entries(cs.domainFlags)
    .filter(([, flagged]) => flagged)
    .map(([d]) => d);

  const symptomsStr = symptoms.length ? symptoms.join("; ") : "None reported";

  const prompt = `You are a clinical neurology AI assistant helping interpret a cognitive screening result.
This is a SCREENING TOOL ONLY — not a clinical diagnosis. Use measured, accurate language.

PATIENT PROFILE:
- Age group: ${ageGroup}${gender ? ` | Gender: ${gender}` : ""}
- Reported symptoms: ${symptomsStr}

COGNITIVE SCREENING RESULTS (equivalent standard clinical scale scores):
- MoCA-equivalent: ${cs.moca}/30 (normal ≥26; mild MCI 18–25; moderate 10–17; severe <10)
- MMSE-equivalent: ${cs.mmse}/30 (normal ≥24; mild 19–23; moderate 10–18; severe ≤9)
- ACE-III-equivalent: ${cs.aceIII}/100 (normal ≥88; mild 76–87; moderate 50–75; severe <50)
- Mini-Cog-equivalent: ${cs.miniCog}/5 (normal ≥3)
- SAGE-equivalent: ${cs.sage}/22 (normal ≥17)
- Classification: ${impCtx.label}

DOMAIN BREAKDOWN (0–100 internal scale, lower = more impaired):
- Memory: ${cs.domainScores["Memory"]}/100${cs.domainFlags["Memory"] ? " ⚠ Below threshold" : ""}
- Attention: ${cs.domainScores["Attention"]}/100${cs.domainFlags["Attention"] ? " ⚠ Below threshold" : ""}
- Executive Function: ${cs.domainScores["Executive Function"]}/100${cs.domainFlags["Executive Function"] ? " ⚠ Below threshold" : ""}
- Orientation: ${cs.domainScores["Orientation"]}/100${cs.domainFlags["Orientation"] ? " ⚠ Below threshold" : ""}

PERFORMANCE NOTES:
- Questions skipped: ${skippedCount}
- Average response time: ${avgResponseSec}s per question
- Flagged domains: ${flaggedDomains.length ? flaggedDomains.join(", ") : "None"}

IMPORTANT CLINICAL CONTEXT:
- MoCA detects ~90% of MCI cases vs MMSE's 18–25% sensitivity (AAFP 2022 review)
- Normal MoCA population avg: 27.4 | MCI avg: 22.1 | Alzheimer's avg: 16.2
- MMSE declines 2–4 pts/year in Alzheimer's; earlier detection window exists
- Education, language, and cultural factors can affect scores by 2–4 points

Return ONLY this JSON structure (no markdown, no explanation, raw JSON):
{
  "clinicalSummary": "2-3 sentences. Accurate, measured. Reference specific scale scores. State what the pattern suggests and what it does NOT confirm.",
  "domainInsights": {
    "Memory": "1-2 sentences on Memory performance and what it suggests clinically.",
    "Attention": "1-2 sentences on Attention performance.",
    "Executive Function": "1-2 sentences on Executive Function performance.",
    "Orientation": "1-2 sentences on Orientation performance."
  },
  "keyFindings": [
    "Finding 1 — specific observation with scale reference",
    "Finding 2",
    "Finding 3",
    "Finding 4 (if warranted)"
  ],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3",
    "Specific actionable recommendation 4 (if warranted)"
  ],
  "screeningContext": "One sentence explaining what these results mean in the context of clinical tools like MoCA and MMSE.",
  "followUpAdvised": ${cs.impairment !== "none"},
  "urgencyLevel": "${cs.impairment === "none" ? "routine" : cs.impairment === "mild" ? "soon" : cs.impairment === "moderate" ? "prompt" : "urgent"}"
}

Rules:
- NEVER use language that implies a confirmed diagnosis
- ALWAYS note that scores can be affected by education, fatigue, and language
- Keep clinical language professional but accessible
- For urgency "routine": suggest annual re-screening
- For "soon": suggest 30–60 day physician consultation
- For "prompt": suggest specialist referral within days
- For "urgent": recommend immediate medical evaluation`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    const parsed = JSON.parse(text) as GeminiOutput;
    // Validate structure
    if (!parsed.clinicalSummary || !parsed.recommendations || !parsed.domainInsights) {
      throw new Error("Incomplete JSON structure");
    }
    return parsed;
  } catch (err) {
    console.error("[Gemini] Execution/Parse failed:", err);
    return buildFallback(input);
  }
}

// ─── Fallback (if Gemini fails) ───────────────────────────────────────────────
function buildFallback(input: GeminiInput): GeminiOutput {
  const cs = input.clinicalScores;
  const ctx = IMPAIRMENT_CONTEXT[cs.impairment];
  return {
    clinicalSummary: `MoCA-equivalent score of ${cs.moca}/30 and MMSE-equivalent of ${cs.mmse}/30 places this result in the "${ctx.label}" category. ${ctx.description} This is a screening result only and does not constitute a clinical diagnosis.`,
    domainInsights: {
      "Memory": `Memory score of ${cs.domainScores["Memory"]}/100 — ${cs.domainFlags["Memory"] ? "below the screening threshold; this domain warrants close monitoring." : "within acceptable range for this assessment."}`,
      "Attention": `Attention score of ${cs.domainScores["Attention"]}/100 — ${cs.domainFlags["Attention"] ? "below threshold; sustained attention tasks may be affected." : "within acceptable range."}`,
      "Executive Function": `Executive Function score of ${cs.domainScores["Executive Function"]}/100 — ${cs.domainFlags["Executive Function"] ? "below threshold; higher-order reasoning and planning tasks showed difficulty." : "within acceptable range."}`,
      "Orientation": `Orientation score of ${cs.domainScores["Orientation"]}/100 — ${cs.domainFlags["Orientation"] ? "below threshold; awareness of time and context may be affected." : "within acceptable range."}`,
    },
    keyFindings: [
      `MoCA-equivalent: ${cs.moca}/30 (normal ≥26)`,
      `MMSE-equivalent: ${cs.mmse}/30 (normal ≥24)`,
      `Mini-Cog-equivalent: ${cs.miniCog}/5 (normal ≥3)`,
      `${Object.values(cs.domainFlags).filter(Boolean).length} of 4 domains flagged below clinical threshold`,
    ],
    recommendations: [
      ctx.nextStep,
      "Document this result and compare with future screenings to track trends.",
      "Ensure adequate sleep, hydration, and reduction of cognitive stressors before re-testing.",
      input.clinicalScores.impairment !== "none"
        ? "Inform your GP about these results and request a formal cognitive assessment."
        : "Repeat this screening in 12 months or earlier if new symptoms emerge.",
    ],
    screeningContext: `These scores are equivalent to what would typically be observed on standard clinical tools such as the MoCA and MMSE used by neurologists and geriatricians.`,
    followUpAdvised: cs.impairment !== "none",
    urgencyLevel:
      cs.impairment === "none" ? "routine"
        : cs.impairment === "mild" ? "soon"
          : cs.impairment === "moderate" ? "prompt"
            : "urgent",
  };
}
