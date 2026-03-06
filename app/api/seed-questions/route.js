import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import fs from 'fs';
import path from 'path';

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('dementia_ai');
        const collection = db.collection('questions');

        // 1. Check if collection is empty
        const count = await collection.countDocuments();

        if (count > 0) {
            return NextResponse.json({
                message: "Questions already exist in the database.",
                count: count
            });
        }

        // 2. Read questions from JSON file
        const questionsPath = path.join(process.cwd(), 'data', 'questions.json');
        const fileContent = fs.readFileSync(questionsPath, 'utf8');
        const questions = JSON.parse(fileContent);

        // 3. Insert questions
        const result = await collection.insertMany(questions);

        return NextResponse.json({
            message: "Questions successfully inserted into MongoDB",
            insertedCount: result.insertedCount
        });

    } catch (error) {
        console.error("Seeding Error:", error);
        return NextResponse.json({
            error: "Failed to seed questions",
            details: error.message
        }, { status: 500 });
    }
}
