import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Assessment from '../../../../lib/models/Assessment';
import { z } from 'zod';
import { analyzeCognitiveResponse } from '../../../../lib/services/gemini';

const AssessmentSchema = z.object({
    sessionId: z.string(),
    questions: z.array(z.object({
        questionId: z.number(),
        domain: z.enum(['Memory', 'Attention', 'Executive', 'Orientation']),
        responseText: z.string().optional(),
        latencyMs: z.number().optional(),
        totalTimeMs: z.number().optional(),
        hesitationFlags: z.boolean().optional()
    })),
    scores: z.object({
        accuracy: z.number(),
        latencyPercentile: z.number().optional(),
        overallRisk: z.enum(['Low', 'Moderate', 'High'])
    })
});

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Validate request body
        const validatedData = AssessmentSchema.parse(body);

        const assessment = await Assessment.create(validatedData);

        // Perform async AI analysis
        const aiResults = await analyzeCognitiveResponse(validatedData.questions);

        // Update assessment with AI results
        assessment.aiAnalysis = {
            summary: aiResults.overallSummary,
            clinicalInsights: aiResults.clinicalInsights
        };
        await assessment.save();

        return NextResponse.json({
            success: true,
            id: assessment._id,
            aiAnalysis: assessment.aiAnalysis,
            message: "Assessment submitted and analyzed successfully"
        });

    } catch (error: any) {
        console.error("Submission Error:", error);
        return NextResponse.json({
            success: false,
            error: error.name === 'ZodError' ? 'Validation Failed' : 'Server Error',
            details: error.errors || error.message
        }, { status: error.name === 'ZodError' ? 400 : 500 });
    }
}
