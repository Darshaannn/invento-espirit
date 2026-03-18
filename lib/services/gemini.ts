import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

let genAI: any = null;
if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
} else {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Clinical analysis will be disabled.");
}

export interface AnalysisResult {
    overallSummary: string;
    clinicalInsights: string;
    domainStrengths: string[];
    riskMarkers: string[];
}

/**
 * Analyzes cognitive assessment responses for nuanced metrics like hesitation,
 * complexity, and pattern-based risk.
 */
export async function analyzeCognitiveResponse(answers: any[]): Promise<AnalysisResult> {
    try {
        if (!genAI) {
            throw new Error("Gemini AI not initialized.");
        }
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Analyze the following cognitive screening responses from an elderly patient.
            For each answer, evaluate:
            1. Accuracy (is the answer correct?)
            2. Linguistic Complexity (sentence structure stability)
            3. Qualitative Nuance (signs of confusion, repeated words, or significant hesitation if timing is provided).

            Data: ${JSON.stringify(answers)}

            Return a structured JSON report. THE RESPONSE MUST BE ONLY THE JSON OBJECT.
            - overallSummary: String
            - clinicalInsights: String (for doc review)
            - domainStrengths: Array of strings
            - riskMarkers: Array of strings
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Remove markdown formatting if Gemini adds it
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return {
            overallSummary: "Automated analysis currently unavailable.",
            clinicalInsights: "Manual review required due to processing error.",
            domainStrengths: [],
            riskMarkers: []
        };
    }
}
