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
import dynamic from 'next/dynamic';

const MeshBackground = dynamic(() => import("@/components/ui/mesh-background").then(mod => mod.MeshBackground), {
  ssr: false,
});

// ─── Static data (never re-created) ──────────────────────────────────────────
const CLINICAL_PARTNERS = [
  "Mayo Clinic Neuro",
  "Johns Hopkins Health",
  "Cleveland Clinic",
  "Mass General",
  "UCSF Medical Center",
];

const STATS = [
  { value: "12.4k+", label: "Active Users", Icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "group-hover:border-blue-500/30" },
  { value: "98.2%", label: "Analysis Accuracy", Icon: Activity, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/30" },
  { value: "50+", label: "Clinical Partners", Icon: Building2, color: "text-rose-400", bg: "bg-rose-500/10", border: "group-hover:border-rose-500/30" },
] as const;

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Component ────────────────────────────────────────────────────────────────
const EmptyStateDashboard = memo(function EmptyStateDashboard() {
  return (
    <LazyMotion features={domAnimation} strict>
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-[#050505] min-h-[85vh] relative overflow-hidden text-white isolate">
        <MeshBackground
          colors={["#0f172a", "#1e1b4b", "#4c0519", "#09090b", "#18181b", "#27272a"]}
          speed={0.6}
          distortion={0.8}
          swirl={0.5}
          veilOpacity="bg-black/60"
        />

        {/* Ambient Glows */}
        <div aria-hidden className="absolute top-0 right-[10%] w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div aria-hidden className="absolute bottom-0 left-[10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />

        <m.div
          variants={CONTAINER_VARIANTS}
          initial="hidden"
          animate="visible"
          className="max-w-5xl w-full text-center relative z-10 mx-auto"
        >
          {/* Badge */}
          <m.div variants={ITEM_VARIANTS} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
              <Sparkles size={14} className="text-red-400 animate-pulse" aria-hidden />
              <span className="text-xs font-medium text-white/80 tracking-widest uppercase">
                System Initialized
              </span>
            </div>
          </m.div>

          {/* Heading */}
          <m.h1 variants={ITEM_VARIANTS} className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-[0.95] mb-8">
            <span className="text-white/90">Cognitive</span> <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-600 to-rose-700">Architecture.</span>
          </m.h1>

          <m.p variants={ITEM_VARIANTS} className="text-white/50 text-lg md:text-xl font-light max-w-2xl mx-auto mb-14 leading-relaxed">
            Precision neurological baselining and diagnostic measurement. Join over{" "}
            <span className="text-white font-medium">12,400+ patients</span> who
            trust our clinical sync for early detection.
          </m.p>

          {/* CTA */}
          <m.div variants={ITEM_VARIANTS} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <Link
              href="/instructions"
              className="relative inline-flex items-center justify-center bg-gradient-to-br from-red-700 to-red-900 text-white text-sm font-medium uppercase tracking-[0.2em] px-10 py-5 rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-[0_0_40px_-10px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_-15px_rgba(220,38,38,0.6)] group overflow-hidden border border-red-500/30"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative flex items-center gap-3">
                INITIALIZE SCAN
                <ArrowRight
                  className="group-hover:translate-x-1 transition-transform"
                  size={18}
                  aria-hidden
                />
              </span>
            </Link>

            <div className="flex items-center gap-3 text-white/60 font-medium uppercase tracking-widest text-[11px] bg-white/5 px-6 py-5 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
              <ShieldCheck className="text-blue-400" size={18} aria-hidden />
              HIPAA Compliant Data Layer
            </div>
          </m.div>

          {/* Stats */}
          <m.div variants={CONTAINER_VARIANTS} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {STATS.map(({ value, label, Icon, color, bg, border }) => (
              <m.div
                variants={ITEM_VARIANTS}
                key={label}
                className={`bg-white/[0.03] p-8 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl relative group hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1 ${border}`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl ${bg}`}>
                    <Icon className={color} size={22} aria-hidden />
                  </div>
                </div>
                <div className="text-left space-y-1">
                  <h4 className="text-3xl font-semibold text-white tracking-tight">{value}</h4>
                  <p className="text-white/40 text-[11px] uppercase font-semibold tracking-widest">
                    {label}
                  </p>
                </div>
              </m.div>
            ))}
          </m.div>

          {/* Partners */}
          <m.div variants={ITEM_VARIANTS} className="pt-8 border-t border-white/10">
            <p className="text-white/30 font-medium uppercase tracking-[0.3em] text-[10px] mb-8">
              Trusted by Leading Medical Institutions
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6 opacity-40 hover:opacity-80 transition-opacity duration-700">
              {CLINICAL_PARTNERS.map((partner) => (
                <span
                  key={partner}
                  className="text-white/80 font-medium text-sm md:text-base tracking-tight flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-500" aria-hidden />
                  {partner}
                </span>
              ))}
            </div>
          </m.div>
        </m.div>
      </div>
    </LazyMotion>
  );
});

export default EmptyStateDashboard;
