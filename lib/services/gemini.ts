// lib/services/gemini.ts
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. Uses gemini-1.5-flash (not pro) — 5-10x faster, cheaper, sufficient for
//    this use case. Pro is overkill for structured JSON generation.
// 2. maxOutputTokens: 512 — the response is a small JSON object. No need to
//    allow 2048+ tokens; capping this reduces latency significantly.
// 3. responseMimeType: "application/json" — tells Gemini to output raw JSON
//    without markdown fences, so no regex cleaning needed.
// 4. temperature: 0.3 — lower randomness for medical content = more consistent
//    structured output and fewer JSON parse failures.
// 5. Single instance (module-level) — avoids re-initializing on every call.
// ─────────────────────────────────────────────────────────────────────────────
import { GoogleGenerativeAI, type GenerationConfig } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("[Gemini] GEMINI_API_KEY is not defined in .env.local");
}

// Single instance — reused across all calls in the same serverless instance
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GENERATION_CONFIG: GenerationConfig = {
  temperature: 0.3,   // low randomness for clinical content
  maxOutputTokens: 512,   // small JSON response — no need for more
  responseMimeType: "application/json", // no markdown fences to strip
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GeminiInput {
  domainScores: Record<string, number>;
  overallScore: number;
  riskTier: "low" | "moderate" | "high";
  ageGroup: string;
  symptoms: string[];
  skippedCount: number;
  avgResponseMs: number;
}

export interface GeminiOutput {
  insights: string;
  recommendations: string[];
  followUpAdvised: boolean;
}

// ─── Main function ────────────────────────────────────────────────────────────
export async function analyzeWithGemini(input: GeminiInput): Promise<GeminiOutput> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: GENERATION_CONFIG,
  });

  const weakDomains = Object.entries(input.domainScores)
    .filter(([, score]) => score < 65)
    .map(([domain]) => domain);

  const prompt = `You are a clinical cognitive screening assistant. Analyze this result and return JSON.

Patient:
- Age group: ${input.ageGroup}
- Reported symptoms: ${input.symptoms.length ? input.symptoms.join(", ") : "None"}

Scores:
- Overall: ${input.overallScore}/100 (${input.riskTier} risk)
- Memory: ${input.domainScores.Memory}/100
- Attention: ${input.domainScores.Attention}/100
- Executive Function: ${input.domainScores["Executive Function"]}/100
- Orientation: ${input.domainScores.Orientation}/100
- Skipped questions: ${input.skippedCount}
- Average response time: ${Math.round(input.avgResponseMs / 1000)}s
${weakDomains.length ? `- Weak domains: ${weakDomains.join(", ")}` : ""}

Return ONLY this JSON (no explanation, no markdown):
{
  "insights": "2-3 sentence clinical observation. Measured tone. Not alarmist.",
  "recommendations": ["specific action 1", "specific action 2", "specific action 3"],
  "followUpAdvised": ${input.riskTier !== "low"}
}

Important: This is screening only, not diagnosis. Keep language measured.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  try {
    const parsed = JSON.parse(text) as GeminiOutput;

    // Validate structure before returning
    if (
      typeof parsed.insights !== "string" ||
      !Array.isArray(parsed.recommendations) ||
      typeof parsed.followUpAdvised !== "boolean"
    ) {
      throw new Error("Unexpected JSON shape from Gemini");
    }

    return parsed;
  } catch {
    console.error("[Gemini] JSON parse failed, raw response:", text);
    // Return structured fallback rather than throwing
    return {
      insights: `Cognitive screening completed. Overall score: ${input.overallScore}/100 (${input.riskTier} risk tier).`,
      recommendations: [
        "Maintain regular cognitive engagement through reading and social activities.",
        weakDomains.length
          ? `Focus on ${weakDomains.join(" and ")} exercises.`
          : "Continue current cognitive habits.",
        input.riskTier !== "low"
          ? "Schedule a consultation with a neurologist or geriatrician."
          : "Consider a follow-up screening in 3-6 months.",
      ],
      followUpAdvised: input.riskTier !== "low",
    };
  }
}
