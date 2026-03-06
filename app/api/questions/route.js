import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('dementia_ai');

        const questions = await db
            .collection('questions')
            .find({})
            .toArray();

        return NextResponse.json(questions);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}
