// lib/models/Assessment.ts
import mongoose, { Schema, type Document, type Model } from "mongoose";

// ─── Interface ────────────────────────────────────────────────────────────────
export interface IAssessment extends Document {
  userId:      mongoose.Types.ObjectId | null;
  ageGroup:    string;
  gender?:     string;
  symptoms:    string[];
  responses: Array<{
    questionId:     number;
    domain:         string;
    selectedAnswer: string | null;
    correctAnswer:  string;
    timeTakenMs:    number;
    skipped:        boolean;
    difficulty:     string;
  }>;
  domainScores: {
    Memory:            number;
    Attention:         number;
    ExecutiveFunction: number;
    Orientation:       number;
  };
  overallScore:    number;
  riskTier:        "low" | "moderate" | "high";
  aiInsights:      string;
  recommendations: string[];
  totalTimeMs:     number;
  completedAt:     Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const AssessmentSchema = new Schema<IAssessment>(
  {
    userId:   { type: Schema.Types.ObjectId, ref: "User", default: null },
    ageGroup: { type: String, required: true },
    gender:   { type: String },
    symptoms: [{ type: String }],

    responses: [
      {
        questionId:     { type: Number,  required: true },
        domain:         { type: String,  required: true },
        selectedAnswer: { type: String,  default: null  },
        correctAnswer:  { type: String,  required: true },
        timeTakenMs:    { type: Number,  required: true },
        skipped:        { type: Boolean, default: false },
        difficulty:     { type: String,  default: "medium" },
      },
    ],

    domainScores: {
      Memory:            { type: Number, min: 0, max: 100 },
      Attention:         { type: Number, min: 0, max: 100 },
      ExecutiveFunction: { type: Number, min: 0, max: 100 },
      Orientation:       { type: Number, min: 0, max: 100 },
    },

    overallScore:    { type: Number, required: true, min: 0, max: 100 },
    riskTier:        { type: String, enum: ["low", "moderate", "high"], required: true },
    aiInsights:      { type: String, default: "" },
    recommendations: [{ type: String }],
    totalTimeMs:     { type: Number, default: 0 },
    completedAt:     { type: Date, default: Date.now },
  },
  {
    // Auto-adds createdAt + updatedAt
    timestamps: true,
    // Faster reads: don't return __v
    versionKey: false,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Compound index for the most common query pattern: user's history sorted by date
AssessmentSchema.index({ userId: 1, completedAt: -1 });
// For analytics aggregations filtered by userId
AssessmentSchema.index({ userId: 1, overallScore: 1 });

// ─── Model (singleton pattern — safe for hot reload) ──────────────────────────
const Assessment: Model<IAssessment> =
  (mongoose.models.Assessment as Model<IAssessment>) ||
  mongoose.model<IAssessment>("Assessment", AssessmentSchema);

export default Assessment;
