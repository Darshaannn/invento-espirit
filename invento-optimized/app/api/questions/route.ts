// app/api/questions/route.ts
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. Import questions as a static JSON module (bundled at build time).
//    The original likely used fs.readFileSync or a dynamic import at runtime.
//    Static import = zero file I/O on each request.
// 2. Cache-Control header tells Vercel CDN to cache the response for 24 hours.
//    Questions don't change at runtime — this eliminates repeated serverless
//    function invocations for the same static data.
// ─────────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import questions from "@/data/questions.json";

export const dynamic = "force-static"; // build-time static generation

export async function GET() {
  return NextResponse.json(questions, {
    headers: {
      // CDN cache for 24h; stale-while-revalidate for 1h beyond that
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
