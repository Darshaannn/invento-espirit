import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Compiler ─────────────────────────────────────────────────────────────
  // Remove console.log in production builds only
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // ─── Tree-shake heavy packages — massive bundle reduction ─────────────────
  // Framer Motion alone ships ~120kb; this ensures only used exports are bundled
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "chart.js",
      "react-chartjs-2",
      "recharts",
      "@google/generative-ai",
    ],
  },

  // ─── Image optimization ───────────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ─── Headers: cache static assets aggressively ───────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
      {
        // Cache all static assets for 1 year
        source: "/(.*)\\.(ico|jpg|jpeg|png|svg|webp|avif|woff2|woff|ttf)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // ─── Keep these until all TS errors are resolved ─────────────────────────
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
