// lib/utils/scoring.ts
export type Domain = 'Memory' | 'Attention' | 'Executive Function' | 'Orientation';

export interface Response {
    questionId: number;
    domain: Domain;
    selectedAnswer: string | null;
    correctAnswer: string;
    timeTakenMs: number;
    skipped: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
}

const DIFFICULTY_WEIGHT: Record<string, number> = { easy: 1.0, medium: 1.3, hard: 1.6 };
const MAX_TIME_MS = 30_000;

export function calculateDomainScores(responses: Response[]): Record<Domain, number> {
    const domains: Domain[] = ['Memory', 'Attention', 'Executive Function', 'Orientation'];
    const scores: Record<Domain, number> = {
        'Memory': 0,
        'Attention': 0,
        'Executive Function': 0,
        'Orientation': 0,
    };

    for (const domain of domains) {
        const domainResponses = responses.filter(r => r.domain === domain && !r.skipped);
        const skipped = responses.filter(r => r.domain === domain && r.skipped);

        if (domainResponses.length === 0 && skipped.length === 0) continue;

        let totalPoints = 0;
        let maxPoints = 0;

        for (const r of domainResponses) {
            const weight = DIFFICULTY_WEIGHT[r.difficulty] ?? 1.0;
            maxPoints += 100 * weight;
            if (r.selectedAnswer !== null && r.selectedAnswer === r.correctAnswer) {
                const accuracyPoints = 80 * weight;
                const timeRatio = Math.max(0, 1 - r.timeTakenMs / MAX_TIME_MS);
                const timeBonus = 20 * weight * timeRatio;
                totalPoints += accuracyPoints + timeBonus;
            }
        }

        for (const r of skipped) {
            const weight = DIFFICULTY_WEIGHT[r.difficulty] ?? 1.0;
            maxPoints += 100 * weight;
            totalPoints += 20 * weight; // partial credit
        }

        scores[domain] = maxPoints > 0
            ? Math.min(100, Math.round((totalPoints / maxPoints) * 100))
            : 0;
    }

    return scores;
}

export function calculateOverallScore(domainScores: Record<Domain, number>): number {
    const values = Object.values(domainScores);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function getRiskTier(score: number): 'low' | 'moderate' | 'high' {
    if (score >= 78) return 'low';
    if (score >= 55) return 'moderate';
    return 'high';
}
