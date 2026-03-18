import { NextRequest, NextResponse } from 'next/server';
import questions from '@/data/questions.json';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const age = searchParams.get('age');
        const symptomsParam = searchParams.get('symptoms');
        const symptoms = symptomsParam ? symptomsParam.split(',').filter(Boolean) : [];

        // Filter out instruction-only cards for basic requests; keep full set for screening
        let selected = questions as Array<Record<string, unknown>>;

        // If age/symptoms provided, can apply adaptive weighting in future
        // For now: shuffle and return 25 questions ensuring domain balance
        const domains = ['Memory', 'Attention', 'Executive Function', 'Orientation'];
        const balanced: Array<Record<string, unknown>> = [];

        // Ensure instruction+recall pairs are included together
        const instructions = selected.filter(q => q.subType === 'instruction');
        const others = selected.filter(q => !q.subType);

        // Include all instructions
        for (const inst of instructions) {
            balanced.push(inst);
            // Find matching recall
            const recall = others.find(q => q.sequenceId === inst.sequenceId && q.id !== inst.id);
            if (recall) balanced.push(recall);
        }

        // Fill with non-sequence questions per domain
        const seqIds = new Set(balanced.map(q => q.id));
        for (const domain of domains) {
            const domainQ = others.filter(q => q.domain === domain && !seqIds.has(q.id));
            // Shuffle domain questions
            domainQ.sort(() => Math.random() - 0.5);
            // Take up to 5 per domain
            for (const q of domainQ.slice(0, 5)) {
                if (!seqIds.has(q.id)) {
                    balanced.push(q);
                    seqIds.add(q.id as number);
                }
            }
        }

        // Interleave: ensure instructions are spaced from their recall pairs
        const finalOrder: Array<Record<string, unknown>> = [];
        const nonInstructions = balanced.filter(q => !q.subType);
        const instrList = balanced.filter(q => q.subType === 'instruction');

        // Place instructions at positions 0, 5, 10...
        let instrIdx = 0;
        for (let i = 0; i < nonInstructions.length; i++) {
            if (i % 6 === 0 && instrIdx < instrList.length) {
                finalOrder.push(instrList[instrIdx++]);
            }
            finalOrder.push(nonInstructions[i]);
        }
        // Append any remaining instructions
        while (instrIdx < instrList.length) {
            finalOrder.push(instrList[instrIdx++]);
        }

        return NextResponse.json(
            age || symptoms.length ? finalOrder : finalOrder,
            { status: 200 }
        );
    } catch (error) {
        console.error('[API /questions]:', error);
        return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
    }
}
