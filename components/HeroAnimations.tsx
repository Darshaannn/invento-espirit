// components/HeroAnimations.tsx
// ─── Client component ─────────────────────────────────────────────────────────
// This is the ONLY client-side JS shipped for the landing page hero.
// It is dynamically imported with { ssr: false } from page.tsx.
// UPDATED: Dark Clinical HUD Theme
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React from "react";
import { m, LazyMotion, domAnimation, Variants } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight, Timer, Brain, LineChart } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.22, 1, 0.36, 1]
    },
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
          className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 bg-red-500/5 border border-red-500/20"
        >
          <Sparkles size={14} className="text-red-500" aria-hidden />
          <span className="text-red-500 font-bold uppercase tracking-[0.2em] text-[10px]">
            Medical Intelligence V2.5
          </span>
        </m.div>

        {/* Heading */}
        <m.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.15}
          className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-white italic"
        >
          Precision Cognitive <br className="hidden md:block" />
          Screening Protocol.
        </m.h1>

        {/* Subheading */}
        <m.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0.3}
          className="text-lg md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto font-medium leading-relaxed italic"
        >
          A 5-minute diagnostic cognitive assessment evaluating memory,
          attention, executive function and orientation to established clinical benchmarks.
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
            className="bg-white text-black hover:bg-white/90 w-full md:w-auto text-lg px-12 py-5 font-bold flex items-center justify-center gap-3 group shadow-xl transition-all hover:scale-105 active:scale-95"
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
            className="px-12 py-5 border border-white/10 text-white font-bold hover:bg-white/5 transition-all w-full md:w-auto text-center hover:scale-105 active:scale-95"
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
          className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-white/30"
        >
          <div className="flex items-center gap-2">
            <Timer size={14} className="text-white/10" aria-hidden />
            Takes only 5 minutes
          </div>
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-white/10" aria-hidden />
            25 Cognitive Questions
          </div>
          <div className="flex items-center gap-2">
            <LineChart size={14} className="text-white/10" aria-hidden />
            Instant Diagnostic report
          </div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
