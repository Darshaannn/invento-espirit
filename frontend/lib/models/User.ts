import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    dateOfBirth: { type: Date },
    onboardingComplete: { type: Boolean, default: false },
    preferences: {
        voiceAssist: { type: Boolean, default: true },
        highContrast: { type: Boolean, default: false }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
