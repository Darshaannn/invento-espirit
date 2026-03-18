import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for now
    sessionId: { type: String, required: true, unique: true },
    timestamp: { type: Date, default: Date.now },
    questions: [{
        questionId: { type: Number, required: true },
        domain: { type: String, enum: ['Memory', 'Attention', 'Executive', 'Orientation'], required: true },
        responseText: { type: String },
        latencyMs: { type: Number },
        totalTimeMs: { type: Number },
        hesitationFlags: { type: Boolean, default: false }
    }],
    scores: {
        accuracy: { type: Number },
        latencyPercentile: { type: Number },
        overallRisk: { type: String, enum: ['Low', 'Moderate', 'High'] }
    },
    aiAnalysis: {
        summary: { type: String },
        clinicalInsights: { type: String }
    }
});

export default mongoose.models.Assessment || mongoose.model('Assessment', AssessmentSchema);
