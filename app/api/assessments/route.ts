import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Assessment from '../../../lib/models/Assessment';

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await dbConnect();

        // Fetch all assessments, sorted by most recent first
        // We select only the fields needed for the history list to keep payload small
        const assessments = await Assessment.find({})
            .sort({ timestamp: -1 })
            .select('scores timestamp sessionId aiAnalysis.summary')
            .lean();

        return NextResponse.json({
            success: true,
            count: assessments.length,
            data: assessments
        });

    } catch (error: any) {
        console.error("Fetch Assessments Error:", error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch assessments',
            message: error.message
        }, { status: 500 });
    }
}
