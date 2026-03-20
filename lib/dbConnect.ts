// lib/dbConnect.ts
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. Added maxPoolSize: 10 — allows concurrent DB operations without queuing.
//    Default is 5; 10 handles Vercel's concurrent serverless invocations better.
// 2. Added serverSelectionTimeoutMS: 5000 — fast failure instead of 30s hang.
// 3. Added socketTimeoutMS: 45000 — prevents zombie connections.
// 4. Added connectTimeoutMS: 10000 — sensible connection timeout.
// 5. MONGODB_URI check moved to module-level — fails at startup not at runtime.
// ─────────────────────────────────────────────────────────────────────────────
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Augment global for Next.js hot-reload caching
declare global {
  // eslint-disable-next-line no-var
  var _mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const MONGOOSE_OPTS: mongoose.ConnectOptions = {
  bufferCommands: false,       // fail fast instead of buffering when disconnected
  maxPoolSize: 10,             // up to 10 concurrent connections
  minPoolSize: 2,              // keep 2 warm for quick cold starts
  serverSelectionTimeoutMS: 5_000,  // fail after 5s if no server found
  socketTimeoutMS: 45_000,    // close idle sockets after 45s
  connectTimeoutMS: 10_000,   // connection timeout 10s
  family: 4,                   // use IPv4 (avoids some DNS resolution hangs)
};

async function dbConnect(): Promise<typeof mongoose> {
  // Return existing connection immediately
  if (cached.conn) return cached.conn;

  // Reuse in-flight promise (prevents race conditions in concurrent requests)
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI!, MONGOOSE_OPTS)
      .then((m) => {
        console.log("[MongoDB] Connected to Atlas");
        return m;
      })
      .catch((err) => {
        cached.promise = null; // allow retry on next call
        console.error("[MongoDB] Connection failed:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
