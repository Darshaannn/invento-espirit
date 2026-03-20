// lib/models/Question.ts
import mongoose, { Schema, type Model } from "mongoose";

const QuestionSchema = new Schema(
    {
        id: { type: Number, required: true, unique: true },
        domain: { type: String, required: true, index: true },
        question: { type: String, required: true },
        type: { type: String, enum: ["choice", "text"], required: true },
        difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
        options: [{ type: String }],
        correct: { type: String },
        subType: { type: String },
        sequenceId: { type: String, index: true },
    },
    { versionKey: false }
);

const Question: Model<any> =
    mongoose.models.Question || mongoose.model("Question", QuestionSchema);

export default Question;
