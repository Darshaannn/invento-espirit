// lib/auth.ts
// ─── Optimizations & Fixes ────────────────────────────────────────────────────
// 1. FIXED: MongoDBAdapter was wrapped in `new Promise(async ...)` which is an
//    antipattern — it creates a floating promise that can silently fail.
//    Replaced with a lazy getter function that creates the client on demand.
// 2. Added `session: { strategy: "jwt" }` — JWT sessions are stateless and don't
//    require a DB round-trip on every page load. The original database strategy
//    hit MongoDB on EVERY request to validate the session. With JWT, session
//    data is in a signed cookie — ~0ms overhead.
// 3. Correct jwt + session callbacks so user.id is available in the session.
// 4. Phone provider cleaned up — removed unreachable credentials check.
// ─────────────────────────────────────────────────────────────────────────────
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import dbConnect from "./dbConnect";
import User from "./models/User";

// ─── Lazy MongoDB client for the adapter ─────────────────────────────────────
// MongoDBAdapter needs the native MongoClient (not mongoose).
// We create it once and reuse across warm invocations.
let clientPromise: Promise<MongoClient> | null = null;

function getMongoClientPromise(): Promise<MongoClient> {
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not defined");
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5_000,
    });
    clientPromise = client.connect();
  }
  return clientPromise;
}

// ─── Auth config ──────────────────────────────────────────────────────────────
const authConfig: NextAuthConfig = {
  adapter: MongoDBAdapter(getMongoClientPromise()),

  // JWT strategy: session is in a signed cookie, NO DB hit per request
  session: { strategy: "jwt" },

  providers: [
    // ── Email + Password ──────────────────────────────────────────────────
    Credentials({
      id: "email",
      name: "Email and Password",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await dbConnect();
          const user = await User.findOne(
            { email: credentials.email },
            { _id: 1, name: 1, email: 1 }  // projection — only fetch needed fields
          ).lean();

          if (user) {
            // TODO: add bcrypt password check here when passwords are hashed
            return {
              id:    (user._id as any).toString(),
              name:  user.name  as string,
              email: user.email as string,
            };
          }

          // Auto-register for demo — create minimal user document
          const newUser = await User.create({
            email: credentials.email,
            name:  (credentials.email as string).split("@")[0],
            onboardingComplete: false,
          });

          return {
            id:    newUser._id.toString(),
            name:  newUser.name,
            email: newUser.email,
          };
        } catch (err) {
          console.error("[Auth] Email authorize error:", err);
          return null;
        }
      },
    }),

    // ── Phone (OTP stub) ──────────────────────────────────────────────────
    Credentials({
      id: "phone",
      name: "Phone Number",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp:   { label: "OTP",          type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone) return null;

        try {
          await dbConnect();
          let user = await User.findOne(
            { phone: credentials.phone },
            { _id: 1, name: 1, email: 1, phone: 1 }
          ).lean();

          if (!user) {
            const phone = credentials.phone as string;
            user = (await User.create({
              phone,
              name:  `User ${phone.slice(-4)}`,
              email: `${phone}@invento.ai`,
            })).toObject();
          }

          return {
            id:    (user._id as any).toString(),
            name:  user.name  as string,
            email: user.email as string,
          };
        } catch (err) {
          console.error("[Auth] Phone authorize error:", err);
          return null;
        }
      },
    }),
  ],

  // ─── Callbacks ──────────────────────────────────────────────────────────
  callbacks: {
    // Persist user.id into the JWT token on sign-in
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    // Expose token.id as session.user.id on every request (no DB hit)
    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
