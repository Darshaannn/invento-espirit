import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        let allQuestions = [];
        let dbSucceeded = false;

        // 1. Try Database with a strict timeout (3 seconds)
        try {
            const connectPromise = dbConnect();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('DB Connection Timeout')), 3000)
            );
            
            const mongoose = await Promise.race([connectPromise, timeoutPromise]);
            const db = mongoose.connection.db;
            allQuestions = await db.collection('questions').find({}).toArray();
            if (allQuestions.length > 0) dbSucceeded = true;
        } catch (dbErr) {
            console.error("Database unavailable, falling back to local file:", dbErr.message);
        }

        // 2. If DB failed or empty, try local JSON file
        if (!dbSucceeded) {
            try {
                const filePath = path.join(process.cwd(), 'data', 'questions.json');
                if (fs.existsSync(filePath)) {
                    const fileData = fs.readFileSync(filePath, 'utf8');
                    allQuestions = JSON.parse(fileData);
                    console.log(`Loaded ${allQuestions.length} questions from questions.json`);
                }
            } catch (fileErr) {
                console.error("Failed to load questions.json:", fileErr);
            }
        }

        // 3. Last resort if everything else failed
        if (allQuestions.length === 0) {
            console.warn("Using emergency hardcoded fallback questions");
            allQuestions = [
                { id: 101, domain: 'Memory', question: 'Instruction: Apple, Table, Penny.', subType: 'instruction' },
                { id: 102, domain: 'Memory', question: 'What were the three words?', type: 'text', correct: 'apple, table, penny' },
                { id: 104, domain: 'Attention', question: 'Spell WORLD backwards.', type: 'text', correct: 'dlrow' },
                { id: 105, domain: 'Orientation', question: 'What is today\'s date?', type: 'text', correct: 'date' },
                { id: 106, domain: 'Executive', question: 'Abstract: How are a watch and a ruler alike?', type: 'text', correct: 'measure' },
                { id: 107, domain: 'Memory', question: 'Instruction: Recall the last name "Wrik".', subType: 'instruction' },
                { id: 108, domain: 'Memory', question: 'What was the last name?', type: 'text', correct: 'wrik' }
            ];
            // Pad to ensure we have enough for the 8-per-domain slice logic below
            const fillerDomains = ['Memory', 'Attention', 'Executive', 'Orientation'];
            while (allQuestions.length < 32) {
                const d = fillerDomains[allQuestions.length % 4];
                allQuestions.push({ id: 999 + allQuestions.length, domain: d, question: `Sample ${d} Q?`, options: ['Yes', 'No'], type: 'choice', correct: 'Yes' });
            }
        }

        // Process and Shuffle
        const domains = ['Memory', 'Attention', 'Executive', 'Orientation'];
        let selectedQuestions = [];

        domains.forEach(domain => {
            const domainQuestions = allQuestions.filter(q => 
                q.domain === domain || 
                (domain === 'Executive' && q.domain === 'Executive Function')
            );
            
            const shuffled = domainQuestions.sort(() => 0.5 - Math.random());
            // Take up to 8 from each domain
            if (shuffled.length > 0) {
                selectedQuestions = [...selectedQuestions, ...shuffled.slice(0, 8)];
            }
        });

        // Final random sort of the combined set
        const finalSet = selectedQuestions.sort(() => 0.5 - Math.random());
        
        console.log(`API returning ${finalSet.length} questions`);
        return NextResponse.json(finalSet);

    } catch (e) {
        console.error("Critical API Error:", e);
        return NextResponse.json({ error: 'Critical failure', message: e.message }, { status: 500 });
    }
}
