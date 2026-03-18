import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Assessment from '../../../../lib/models/Assessment';

export async function GET(req: Request) {
    try {
        await dbConnect();

        // In a real app, we would filter by userId from searchParams
        // const { searchParams } = new URL(req.url);
        // const userId = searchParams.get('userId');

        // Fetch last 10 assessments to build trend analysis
        const assessments = await Assessment.find({})
            .sort({ timestamp: -1 })
            .limit(10)
            .lean();

        // Basic trend processing: group by domain average over time
        const trends = assessments.reverse().map(a => ({
            date: a.timestamp,
            score: a.scores?.accuracy || 0,
            risk: a.scores?.overallRisk || 'Unknown'
        }));

        return NextResponse.json({
            success: true,
            data: trends
        });

    } catch (error: any) {
        console.error("Analytics Error:", error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch trends'
        }, { status: 500 });
    }
}
