import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-dynamic";

const parseCSVFromPath = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) return [];
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim() !== '');

        // Header identifying line (Line 2 in original file)
        // We look for where data starts.
        const headerIndex = lines.findIndex(l => l.includes('Question_ID'));
        if (headerIndex === -1) return [];

        const headers = lines[headerIndex].split(',').map(h => h.trim());
        const qIdIdx = headers.indexOf('Question_ID');
        const domainIdx = headers.indexOf('Domain');
        const diffIdx = headers.indexOf('Difficulty');
        const qIdx = headers.indexOf('Question');
        const optAIdx = headers.indexOf('Option_A');
        const optBIdx = headers.indexOf('Option_B');
        const optCIdx = headers.indexOf('Option_C');
        const optDIdx = headers.indexOf('Option_D');
        const correctIdx = headers.indexOf('Correct_Option');

        const results = [];
        for (let i = headerIndex + 1; i < lines.length; i++) {
            const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cell => cell.replace(/^"|"$/g, '').trim());
            if (row.length <= qIdx || !row[qIdx]) continue;

            const options = [row[optAIdx], row[optBIdx], row[optCIdx], row[optDIdx]].filter(Boolean);
            const correctLetter = row[correctIdx]?.toUpperCase();
            let correctVal = row[optAIdx]; // Default
            if (correctLetter === 'B') correctVal = row[optBIdx];
            if (correctLetter === 'C') correctVal = row[optCIdx];
            if (correctLetter === 'D') correctVal = row[optDIdx];

            results.push({
                id: parseInt(row[qIdIdx]) || i,
                domain: row[domainIdx] || 'General',
                difficulty: (row[diffIdx] || 'medium').toLowerCase(),
                question: row[qIdx],
                options: options,
                correct: correctVal,
                type: 'choice'
            });
        }
        return results;
    } catch (e) {
        console.error("CSV Parse Error:", e);
        return [];
    }
};

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const age = searchParams.get('age') || '';
        const symptoms = (searchParams.get('symptoms') || '').split(',').filter(Boolean);

        let rawAllQuestions = [];

        // 1. Load JSON
        const jsonPath = path.join(process.cwd(), 'data', 'questions.json');
        if (fs.existsSync(jsonPath)) {
            rawAllQuestions = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            console.log(`Loaded ${rawAllQuestions.length} questions from JSON`);
        }

        // 2. Load CSV
        const csvPath = path.join(process.cwd(), '..', 'Ai- Invento spreadsheet.csv');
        const csvQuestions = parseCSVFromPath(csvPath);
        console.log(`Loaded ${csvQuestions.length} questions from CSV`);

        // 3. Mandatory Deduplication (Prioritize JSON for sequenceIds)
        let deduplicatedPool = [];
        let poolSeenText = new Set();

        // Add JSON first
        rawAllQuestions.forEach(q => {
            const text = q.question.trim().toLowerCase();
            if (!poolSeenText.has(text)) {
                deduplicatedPool.push(q);
                poolSeenText.add(text);
            }
        });

        // Add CSV (only if not already in JSON)
        csvQuestions.forEach(q => {
            const text = q.question.trim().toLowerCase();
            if (!poolSeenText.has(text)) {
                deduplicatedPool.push(q);
                poolSeenText.add(text);
            }
        });

        console.log(`Final unique pool size: ${deduplicatedPool.length}`);

        // Symptom-Based Distribution (Total: 25)
        let domainCounts = {
            'Memory': 6,
            'Attention': 6,
            'Executive Function': 7,
            'Orientation': 6
        };

        // Increase weights for symptoms
        if (symptoms.includes('memory')) {
            domainCounts['Memory'] += 4;
            domainCounts['Attention'] -= 2;
            domainCounts['Orientation'] -= 1;
            domainCounts['Executive Function'] -= 1;
        }
        if (symptoms.includes('confusion')) {
            domainCounts['Orientation'] += 3;
            domainCounts['Attention'] -= 1;
            domainCounts['Memory'] -= 1;
            domainCounts['Executive Function'] -= 1;
        }
        if (symptoms.includes('judgment') || symptoms.includes('language')) {
            domainCounts['Executive Function'] += 3;
            domainCounts['Attention'] -= 1;
            domainCounts['Memory'] -= 1;
            domainCounts['Orientation'] -= 1;
        }

        const domains = ['Memory', 'Attention', 'Executive Function', 'Orientation'];
        let finalBlocks = [];
        let sessionSeenText = new Set();
        let sessionSeenSequenceIds = new Set();

        domains.forEach(domain => {
            const countNeeded = domainCounts[domain] || 1;
            let currentDomainCount = 0;

            let pool = deduplicatedPool.filter(q =>
                (q.domain === domain || (domain === 'Executive Function' && q.domain === 'Executive')) &&
                !sessionSeenText.has(q.question.trim().toLowerCase())
            );

            // Difficulty Steering
            if (age.includes('66-80') || age.includes('80+')) {
                const easyPool = pool.filter(q => q.difficulty === 'easy' || q.difficulty === 'medium');
                if (easyPool.length > 0) pool = easyPool;
            } else if (age.includes('18-35') || age.includes('36-50')) {
                const hardPool = pool.filter(q => q.difficulty === 'medium' || q.difficulty === 'hard');
                if (hardPool.length > 0) pool = hardPool;
            }

            const shuffledPool = pool.sort(() => 0.5 - Math.random());

            for (const q of shuffledPool) {
                if (currentDomainCount >= countNeeded) break;

                const text = q.question.trim().toLowerCase();
                if (sessionSeenText.has(text)) continue;

                if (q.sequenceId) {
                    if (sessionSeenSequenceIds.has(q.sequenceId)) continue;

                    // Pull sequence from deduplicated pool
                    const sequence = deduplicatedPool
                        .filter(sq => sq.sequenceId === q.sequenceId)
                        .sort((a, b) => {
                            if (a.subType === 'instruction' && b.subType !== 'instruction') return -1;
                            if (a.subType !== 'instruction' && b.subType === 'instruction') return 1;
                            return 0;
                        });

                    if (sequence.length > 0) {
                        finalBlocks.push(sequence);
                        sequence.forEach(sq => {
                            sessionSeenText.add(sq.question.trim().toLowerCase());
                        });
                        sessionSeenSequenceIds.add(q.sequenceId);
                        currentDomainCount += sequence.length;
                    }
                } else {
                    finalBlocks.push([q]);
                    sessionSeenText.add(text);
                    currentDomainCount++;
                }
            }
        });

        // Final shuffle of atomic blocks
        const shuffledBlocks = finalBlocks.sort(() => 0.5 - Math.random());
        const finalSet = shuffledBlocks.flat();
        console.log(`Delivering ${finalSet.length} unique questions.`);

        return NextResponse.json(finalSet);

    } catch (e) {
        console.error("Critical API Error:", e);
        return NextResponse.json({ error: 'Critical failure', message: e.message }, { status: 500 });
    }
}
