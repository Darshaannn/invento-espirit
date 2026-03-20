// lib/models/User.ts
import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IUser extends Document {
    email: string;
    name: string;
    phone?: string;
    image?: string;
    onboardingComplete: boolean;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        name: { type: String, required: true, trim: true },
        phone: { type: String, sparse: true }, // sparse: allows multiple null values
        image: { type: String },
        onboardingComplete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Index for fast auth lookups
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 }, { sparse: true });

const User: Model<IUser> =
    (mongoose.models.User as Model<IUser>) ||
    mongoose.model<IUser>("User", UserSchema);

export default User;
