import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import dbConnect from "./dbConnect";
import User from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: MongoDBAdapter(new Promise(async (resolve, reject) => {
        try {
            const mongoose = await dbConnect();
            resolve(mongoose.connection.getClient());
        } catch (error) {
            console.error("MongoDB Adapter connection error:", error);
            // This will still likely cause issues if auth is used, 
            // but it won't crash the entire server init as easily.
        }
    })),
    providers: [
        Credentials({
            id: "email",
            name: "Email and Password",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await dbConnect();
                const user = await User.findOne({ email: credentials.email });

                // For development: If user exists, check password (stubbed)
                // If not, create a new user (Auto-registration for demo)
                if (user) {
                    return { id: user._id.toString(), name: user.name, email: user.email };
                } else {
                    const newUser = await User.create({
                        email: credentials.email,
                        name: credentials.email.split('@')[0],
                        onboardingComplete: false
                    });
                    return { id: newUser._id.toString(), name: newUser.name, email: newUser.email };
                }
            }
        }),
        Credentials({
            id: "phone",
            name: "Phone Number",
            credentials: {
                phone: { label: "Phone Number", type: "text" },
                otp: { label: "OTP", type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.phone) return null;

                // Simple logic for phone login (skipping actual SMS for now)
                await dbConnect();
                let user = await User.findOne({ phone: credentials.phone });

                if (!user) {
                    user = await User.create({
                        phone: credentials.phone,
                        name: `User ${credentials.phone.slice(-4)}`,
                        email: `${credentials.phone}@invento.ai`
                    });
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone
                };
            }
        })
    ],
    callbacks: {
        async session({ session, user }: any) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
