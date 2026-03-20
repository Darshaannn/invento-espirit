// components/EmptyStateDashboard.tsx
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. LazyMotion with domAnimation — reduces Framer Motion bundle by ~85%.
// 2. Static arrays outside component so they aren't re-created on re-renders.
// 3. memo() wraps the component — parent re-renders don't re-render this.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { memo } from "react";
import Link from "next/link";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { ShieldCheck, Activity, Users, ArrowRight, Sparkles, Building2 } from "lucide-react";

// ─── Static data (never re-created) ──────────────────────────────────────────
const CLINICAL_PARTNERS = [
  "Mayo Clinic Neuro",
  "Johns Hopkins Health",
  "Cleveland Clinic",
  "Mass General",
  "UCSF Medical Center",
];

const STATS = [
  { value: "12.4k+", label: "Active Users", Icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/20" },
  { value: "98.2%", label: "Analysis Accuracy", Icon: Activity, color: "text-cyan-400", bg: "bg-cyan-500/20" },
  { value: "50+", label: "Clinical Partners", Icon: Building2, color: "text-pink-400", bg: "bg-pink-500/20" },
] as const;

const HERO_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

// ─── Component ────────────────────────────────────────────────────────────────
const EmptyStateDashboard = memo(function EmptyStateDashboard() {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-[#0A0A0A] min-h-[80vh] relative overflow-hidden text-white/90">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8B0000]/5 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <m.div
          variants={HERO_VARIANTS}
          initial="hidden"
          animate="visible"
          className="max-w-4xl w-full text-center relative z-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
            <Sparkles size={16} className="text-indigo-400" aria-hidden />
            <span className="text-xs font-black text-indigo-400 tracking-widest uppercase">
              System Ready
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl lg:text-9xl font-black text-white italic tracking-tighter leading-[0.8] mb-12 uppercase">
            Cognitive <br />
            <span className="text-[#8B0000]">Architecture.</span>
          </h1>

          <p className="text-white/40 text-xl font-medium max-w-2xl mx-auto mb-16 leading-relaxed italic border-l-2 border-[#8B0000]/20 pl-8 text-left">
            Personalized AI-driven neurological baselining. Join over{" "}
            <span className="text-white font-black italic">12,400+ patients</span> who
            trust our clinical sync for early detection.
          </p>

          {/* CTA */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20">
            <Link
              href="/instructions"
              className="bg-[#8B0000] text-white text-[11px] font-black uppercase tracking-[0.5em] px-16 py-8 hover:bg-red-700 transition-all shadow-[0_0_30px_rgba(139,0,0,0.3)] group"
            >
              INITIALIZE SCAN{" "}
              <ArrowRight
                className="group-hover:translate-x-3 transition-transform ml-4"
                aria-hidden
              />
            </Link>

            <div className="flex items-center gap-3 text-white/40 font-bold uppercase tracking-widest text-[10px] bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
              <ShieldCheck className="text-indigo-500" size={18} aria-hidden />
              HIPAA Compliant Data Layer
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {STATS.map(({ value, label, Icon, color }) => (
              <div
                key={label}
                className="bg-white/5 p-8 border border-white/10 text-center backdrop-blur-md shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#8B0000]/20" />
                <div className="flex justify-center mb-4">
                  <Icon className={color} size={24} aria-hidden />
                </div>
                <h4 className="text-2xl font-black text-white mb-1">{value}</h4>
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Partners */}
          <div className="border-t border-white/5 pt-12">
            <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[9px] mb-8">
              Trusted by Leading Medical Institutions
            </p>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {CLINICAL_PARTNERS.map((partner) => (
                <span
                  key={partner}
                  className="text-white font-bold text-lg tracking-tighter flex items-center gap-2 italic"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" aria-hidden />
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </m.div>

        {/* Decorative circles */}
        <div
          aria-hidden
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl opacity-20 pointer-events-none hidden xl:block"
        />
        <div
          aria-hidden
          className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#8B0000]/5 rounded-full blur-3xl opacity-10 pointer-events-none hidden xl:block"
        />
      </div>
    </LazyMotion>
  );
});

export default EmptyStateDashboard;
