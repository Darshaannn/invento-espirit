// components/HeroAnimations.tsx
// ─── Client component ─────────────────────────────────────────────────────────
// This is the ONLY client-side JS shipped for the landing page hero.
// It is dynamically imported with { ssr: false } from page.tsx, so it never
// blocks the initial HTML render. Users see text immediately; animations layer
// on top once the ~8kb Framer Motion chunk loads.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Timer, Brain, LineChart } from "lucide-react";

// LazyMotion with domAnimation only ships ~18kb instead of the full ~120kb
// framer-motion bundle. It supports all standard animations but not 3D/SVG draw.

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HeroAnimations() {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex flex-col items-center gap-8">
        {/* Badge */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 bg-[#8B0000]/5 border border-[#8B0000]/20"
        >
          <Sparkles size={14} className="text-[#8B0000]" aria-hidden />
          <span className="text-[#8B0000] font-bold uppercase tracking-[0.2em] text-[10px]">
            Medical Intelligence V2.5
          </span>
        </m.div>

        {/* Heading */}
        <m.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-[#1A1A1A]"
        >
          AI Cognitive Screening for{" "}
          <br className="hidden md:block" />
          Early Dementia Detection.
        </m.h1>

        {/* Subheading */}
        <m.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          className="text-lg md:text-2xl text-[#1A1A1A]/60 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          A 5-minute AI powered cognitive assessment that evaluates memory,
          attention, executive function and orientation to identify early signs
          of cognitive decline.
        </m.p>

        {/* CTAs */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.45}
          className="flex flex-col md:flex-row items-center justify-center gap-4 w-full"
        >
          <Link
            href="/screening"
            className="bg-[#1A1A1A] text-white hover:bg-black w-full md:w-auto text-lg px-12 py-5 font-bold flex items-center justify-center gap-3 group shadow-xl transition-colors active:scale-95"
          >
            Start Screening{" "}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden
            />
          </Link>
          <Link
            href="#how-it-works"
            className="px-12 py-5 border border-[#1A1A1A]/10 text-[#1A1A1A] font-bold hover:bg-[#1A1A1A]/5 transition-colors w-full md:w-auto text-center"
          >
            Learn How It Works
          </Link>
        </m.div>

        {/* Metadata tags */}
        <m.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.6}
          className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/40"
        >
          <div className="flex items-center gap-2">
            <Timer size={14} className="text-[#1A1A1A]/20" aria-hidden />
            Takes only 5 minutes
          </div>
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-[#1A1A1A]/20" aria-hidden />
            25 Cognitive Questions
          </div>
          <div className="flex items-center gap-2">
            <LineChart size={14} className="text-[#1A1A1A]/20" aria-hidden />
            Instant AI Report
          </div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
