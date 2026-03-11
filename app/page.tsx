"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Shield, Sparkles, Activity,
  ArrowRight, Mic, LineChart, Users
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center font-sans tracking-tight">
      <div className="ambient-bg" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Invento</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link href="/assessment" className="hover:text-white transition-colors">Assessment</Link>
          <button className="yobe-btn-outline py-2.5">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 text-center px-4 max-w-4xl pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 status-pill px-4 py-2"
        >
          <Sparkles size={14} className="text-pink-400" />
          <span className="text-pink-400">Next-Gen Cognitive Tracking</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter gradient-text"
        >
          Better AI for <br /> Better Aging.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto font-medium"
        >
          Advanced dementia screening powered by Gemini AI. Track cognitive health over time with state-of-the-art voice analysis.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Link href="/screening" className="yobe-btn-premium w-full md:w-auto text-lg px-12">
            Start Free Check-up <ArrowRight size={20} />
          </Link>
          <button className="yobe-btn-outline w-full md:w-auto">
            Clinical Overview
          </button>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 px-8 max-w-7xl w-full pb-32">
        <FeatureCard
          icon={<Mic className="text-indigo-400" />}
          title="Voice Analysis"
          desc="Real-time STT engine detects hesitation and micro-patterns in cognitive recall."
        />
        <FeatureCard
          icon={<Activity className="text-pink-400" />}
          title="Trend Tracking"
          desc="Long-term visualization of cognitive decline risk based on periodic check-ins."
        />
        <FeatureCard
          icon={<Shield className="text-cyan-400" />}
          title="Clinical Grade"
          desc="AI-generated reports formatted for medical reviews and family consultations."
        />
      </section>

      {/* Background Decorative Element */}
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-pink-600/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-1 p-10 rounded-[32px] border border-white/5 hover:border-white/10 transition-all flex flex-col items-start text-left group"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}