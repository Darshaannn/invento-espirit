import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Assessment from '@/lib/models/Assessment';
import { z } from 'zod';
import { analyzeAssessment } from '@/lib/services/gemini';
import { calculateDomainScores, calculateOverallScore, getRiskTier } from '@/lib/utils/scoring';
import type { Response as ScoringResponse } from '@/lib/utils/scoring';

export const dynamic = 'force-dynamic';

const SubmitSchema = z.object({
    sessionId: z.string(),
    ageGroup: z.string().optional().default('Unknown'),
    gender: z.string().optional().default(''),
    symptoms: z.array(z.string()).optional().default([]),
    questions: z.array(z.object({
        questionId: z.number(),
        domain: z.string(),
        responseText: z.string().optional(),
        correctAnswer: z.string().optional(),
        latencyMs: z.number().optional().default(0),
        skipped: z.boolean().optional().default(false),
        difficulty: z.enum(['easy', 'medium', 'hard']).optional().default('medium'),
    })),
    // Legacy: pre-calculated scores from client (used as fallback)
    scores: z.object({
        accuracy: z.number().optional(),
        overallRisk: z.string().optional(),
    }).optional(),
});

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const data = SubmitSchema.parse(body);

        // Build scoring input from submitted questions
        const scoringResponses: ScoringResponse[] = data.questions.map(q => ({
            questionId: q.questionId,
            domain: (q.domain?.includes('Executive') ? 'Executive Function' : q.domain) as ScoringResponse['domain'],
            selectedAnswer: q.responseText ?? null,
            correctAnswer: q.correctAnswer ?? '',
            timeTakenMs: q.latencyMs ?? 0,
            skipped: q.skipped ?? false,
            difficulty: (q.difficulty as 'easy' | 'medium' | 'hard') ?? 'medium',
        }));

        // Calculate real scores server-side
        const domainScores = calculateDomainScores(scoringResponses);
        const overallScore = calculateOverallScore(domainScores);
        const riskTier = getRiskTier(overallScore);

        // Build AI analysis payload
        const geminiPayload = {
            responses: data.questions.map(q => ({
                questionId: q.questionId,
                domain: q.domain,
                correct: q.responseText === q.correctAnswer,
                timeTakenMs: q.latencyMs ?? 0,
                skipped: q.skipped ?? false,
            })),
            ageGroup: data.ageGroup,
            symptoms: data.symptoms,
            domainScores: domainScores as Record<string, number>,
            overallScore,
            riskTier,
        };

        const aiInsights = await analyzeAssessment(geminiPayload);

        // Save to MongoDB
        const assessment = await Assessment.create({
            sessionId: data.sessionId,
            ageGroup: data.ageGroup,
            gender: data.gender,
            symptoms: data.symptoms,
            responses: scoringResponses,
            domainScores: {
                Memory: domainScores['Memory'],
                Attention: domainScores['Attention'],
                ExecutiveFunction: domainScores['Executive Function'],
                Orientation: domainScores['Orientation'],
            },
            overallScore,
            riskTier,
            aiInsights: aiInsights.insights,
            recommendations: aiInsights.recommendations,
            completedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            id: assessment._id,
            overallScore,
            domainScores,
            riskTier,
            aiAnalysis: {
                summary: aiInsights.insights,
                clinicalInsights: aiInsights.insights,
                strengths: aiInsights.strengths,
                concerns: aiInsights.concerns,
                recommendations: aiInsights.recommendations,
                followUpAdvised: aiInsights.followUpAdvised,
            },
        });

    } catch (error: unknown) {
        const err = error as { name?: string; message?: string; errors?: unknown };
        console.error('[API /assessments/submit]:', error);
        return NextResponse.json({
            success: false,
            error: err.name === 'ZodError' ? 'Validation Failed' : 'Server Error',
            details: err.errors ?? err.message,
        }, { status: err.name === 'ZodError' ? 400 : 500 });
    }
}
