// app/layout.tsx
// ─── Optimizations applied ────────────────────────────────────────────────────
// 1. Single font load — previous version loaded Fraunces+Inter in layout AND
//    Plus Jakarta Sans+Outfit via CSS @import. Two font systems fighting each
//    other → doubled font requests, FOUT on every page. Now: one system.
// 2. Outfit replaces the Google Fonts CSS @import (which was render-blocking).
//    next/font self-hosts fonts and injects preload links at the <head> level.
// 3. Added viewport export (required by Next.js 15 — suppresses warning).
// 4. Added DNS prefetch for MongoDB Atlas to reduce first-connection latency.
// 5. Metadata expanded with OG tags for link previews.
// ─────────────────────────────────────────────────────────────────────────────
import "./globals.css";
import React from "react";
import type { Metadata, Viewport } from "next";
import { Outfit, Fraunces } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

// Primary UI font — replaces the CSS @import for Outfit+Plus Jakarta Sans
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",       // prevents invisible text during load
  preload: true,
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Display / serif font used in headings
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
  weight: ["700", "900"],
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Invento | AI Cognitive Screening",
    template: "%s | Invento",
  },
  description:
    "Detect early signs of dementia risk through advanced AI-powered cognitive screenings. Trustworthy, secure, and clinically informed.",
  keywords: [
    "cognitive screening",
    "dementia detection",
    "memory test",
    "AI health",
    "Alzheimer screening",
    "cognitive decline",
  ],
  authors: [{ name: "Invento Medical" }],
  openGraph: {
    title: "Invento — AI Cognitive Screening",
    description:
      "A 5-minute AI cognitive assessment for early dementia detection.",
    url: "https://invento-espirit-wp8m.vercel.app",
    siteName: "Invento",
    type: "website",
  },
  robots: { index: true, follow: true },
};

// Separate viewport export (Next.js 15 requirement)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A", // Updated to dark HUD theme
};

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prefetch MongoDB Atlas DNS — shaves ~50-150ms off first API call */}
        <link rel="dns-prefetch" href="//cluster0.p0vt4ii.mongodb.net" />
        {/* Prefetch Gemini API */}
        <link rel="dns-prefetch" href="//generativelanguage.googleapis.com" />
      </head>
      <body className="antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
