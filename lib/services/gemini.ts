import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
    console.warn('[Gemini] GEMINI_API_KEY is not set — analysis will return fallback data.');
}

const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

export interface GeminiInsights {
    insights: string;
    strengths: string[];
    concerns: string[];
    recommendations: string[];
    followUpAdvised: boolean;
}

export async function analyzeAssessment(payload: {
    responses: Array<{
        questionId: number;
        domain: string;
        correct: boolean;
        timeTakenMs: number;
        skipped: boolean;
    }>;
    ageGroup: string;
    symptoms: string[];
    domainScores: Record<string, number>;
    overallScore: number;
    riskTier: string;
}): Promise<GeminiInsights> {
    const fallback: GeminiInsights = {
        insights: 'Automated AI analysis is unavailable. Please ensure GEMINI_API_KEY is configured.',
        strengths: ['Assessment completed successfully'],
        concerns: [],
        recommendations: [
            'Consult a healthcare professional for a clinical interpretation of these results.',
            'Take the assessment again in 3 months to track trends.',
        ],
        followUpAdvised: false,
    };

    if (!genAI) return fallback;

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are a clinical cognitive assessment assistant. Analyze this screening result and provide concise, measured clinical insights.

Patient Profile:
- Age Group: ${payload.ageGroup || 'Not provided'}
- Reported Symptoms: ${payload.symptoms?.join(', ') || 'None'}
- Overall Cognitive Score: ${payload.overallScore}/100
- Risk Tier: ${payload.riskTier}

Domain Scores:
${Object.entries(payload.domainScores).map(([k, v]) => `- ${k}: ${v}/100`).join('\n')}

Performance Notes:
- Questions skipped: ${payload.responses.filter(r => r.skipped).length}
- Correct answers: ${payload.responses.filter(r => r.correct).length} / ${payload.responses.length}
- Avg response time: ${Math.round(payload.responses.reduce((a, r) => a + r.timeTakenMs, 0) / Math.max(payload.responses.length, 1) / 1000)}s

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "insights": "2-3 sentence clinical observation about the cognitive profile",
  "strengths": ["strength 1", "strength 2"],
  "concerns": ["concern 1 if any"],
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"],
  "followUpAdvised": true
}

Important: Keep language measured and non-alarmist. This is a screening tool, not a diagnosis.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(text) as GeminiInsights;
    } catch (err) {
        console.error('[Gemini] Analysis failed:', err);
        return fallback;
    }
}

// Legacy export kept for backward compatibility with existing submit route
export async function analyzeCognitiveResponse(answers: unknown[]): Promise<{
    overallSummary: string;
    clinicalInsights: string;
    domainStrengths: string[];
    riskMarkers: string[];
}> {
    return {
        overallSummary: 'Assessment processed. Configure GEMINI_API_KEY for AI insights.',
        clinicalInsights: 'Manual clinical review recommended.',
        domainStrengths: [],
        riskMarkers: [],
    };
}
