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
import { Outfit, Oswald } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

// Primary UI font — replaces the CSS @import for Outfit+Plus Jakarta Sans
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",       // prevents invisible text during load
  preload: true,
  weight: ["400", "500", "600", "700", "800", "900"],
});

// Display font for headers
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
  preload: true,
  weight: ["300", "400", "500", "600", "700"], // Including 300 specifically
});

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "Invento Esprit — Cognitive Screening",
    template: "%s | Invento",
  },
  description:
    "Detect early signs of cognitive decline through precision diagnostic screenings. Trusted platform for neural health tracking.",
  keywords: [
    "cognitive screening",
    "memory assessment",
    "clinical health",
    "neural tracking",
    "cognitive decline",
    "invento esprit",
  ],
  authors: [{ name: "Invento Esprit" }],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Invento Esprit — Precision Cognitive Screening",
    description:
      "A 5-minute clinical assessment for neural health monitoring.",
    url: "https://invento-espirit-wp8m.vercel.app",
    siteName: "Invento Esprit",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
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
      className={`${outfit.variable} ${oswald.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prefetch MongoDB Atlas DNS — shaves ~50-150ms off first API call */}
        <link rel="dns-prefetch" href="//cluster0.p0vt4ii.mongodb.net" />
      </head>
      <body className="antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
