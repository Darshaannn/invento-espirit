"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Shield, Sparkles, Activity,
  ArrowRight, Mic, LineChart, Users, Timer
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F1EE] text-[#1A1A1A] relative overflow-hidden flex flex-col items-center justify-center font-sans tracking-tight">
      {/* Decorative center light glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-40 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Invento</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]/40">
          <Link href="/dashboard" className="hover:text-[#1A1A1A] transition-colors">Dashboard</Link>
          <Link href="/assessment" className="hover:text-[#1A1A1A] transition-colors">Assessment</Link>
          <Link href="/login" className="px-6 py-2 border border-[#1A1A1A]/10 hover:bg-[#1A1A1A]/5 transition-all text-[#1A1A1A] flex items-center justify-center">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 text-center px-4 max-w-5xl pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 bg-[#8B0000]/5 border border-[#8B0000]/20"
        >
          <Sparkles size={14} className="text-[#8B0000]" />
          <span className="text-[#8B0000] font-bold uppercase tracking-[0.2em] text-[10px]">Medical Intelligence V2.5</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-[#1A1A1A]"
        >
          AI Cognitive Screening for <br className="hidden md:block" /> Early Dementia Detection.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-[#1A1A1A]/60 mb-12 max-w-3xl mx-auto font-medium leading-relaxed"
        >
          A 5-minute AI powered cognitive assessment that evaluates memory, attention, executive function and orientation to identify early signs of cognitive decline.
        </motion.p>

        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 w-full"
          >
            <Link href="/screening" className="bg-[#1A1A1A] text-white hover:bg-black w-full md:w-auto text-lg px-12 py-5 font-bold flex items-center justify-center gap-3 group shadow-xl transition-all active:scale-95">
              Start Screening <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#how-it-works" className="px-12 py-5 border border-[#1A1A1A]/10 text-[#1A1A1A] font-bold hover:bg-[#1A1A1A]/5 transition-all w-full md:w-auto text-center">
              Learn How It Works
            </Link>
          </motion.div>

          {/* Test Metadata Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap justify-center gap-6 text-[11px] font-black uppercase tracking-[0.2em] text-[#1A1A1A]/40"
          >
            <div className="flex items-center gap-2">
              <Timer size={14} className="text-[#1A1A1A]/20" /> ⏱ Takes only 5 minutes
            </div>
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-[#1A1A1A]/20" /> 🧠 25 Cognitive Questions
            </div>
            <div className="flex items-center gap-2">
              <LineChart size={14} className="text-[#1A1A1A]/20" /> 📊 Instant AI Report
            </div>
          </motion.div>
        </div>
      </main>

      {/* Trust Signal Section: AI METHODOLOGY */}
      <section className="relative z-10 w-full max-w-7xl px-8 py-32 border-t border-[#1A1A1A]/5">
        <div id="how-it-works" className="text-center mb-20">
          <h2 className="text-4xl font-black mb-4 tracking-tighter text-[#1A1A1A]">How Our AI Screening Works</h2>
          <p className="text-[#1A1A1A]/50 max-w-2xl mx-auto font-medium">Invento uses proprietary machine learning models to analyze behavioral nuance beyond simple accuracy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StepCard
            number="01"
            title="Cognitive Questions"
            desc="Memory, attention and reasoning questions evaluate core functional neuro-pathways."
            icon={<Brain size={20} />}
          />
          <StepCard
            number="02"
            title="Behavioral Analysis"
            desc="AI evaluates phonetic accuracy and response time patterns to detect hesitation."
            icon={<Activity size={20} />}
          />
          <StepCard
            number="03"
            title="Pattern Detection"
            desc="Machine learning models analyze cross-domain signals for subtle decline markers."
            icon={<Shield size={20} />}
          />
          <StepCard
            number="04"
            title="AI Clinical Report"
            desc="Personalized cognitive scores and localized risk indicators for medical review."
            icon={<LineChart size={20} />}
          />
        </div>
      </section>

      {/* DOMAINS TESTED SECTION */}
      <section className="relative z-10 w-full max-w-7xl px-8 py-32 bg-[#E8E2DE]/50 border border-[#1A1A1A]/5 mb-32">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1">
            <h2 className="text-5xl font-black mb-8 tracking-tighter text-[#1A1A1A]">Clinical Domains Tested.</h2>
            <div className="grid gap-8">
              <DomainItem title="Memory" desc="Recall ability and information retention metrics." />
              <DomainItem title="Attention" desc="Focus, concentration, and selective filtering ability." />
              <DomainItem title="Executive Function" desc="Problem solving and high-level logical reasoning." />
              <DomainItem title="Orientation" desc="Awareness of time, place, and clinical situation." />
            </div>
          </div>
          <div className="w-full md:w-[400px] aspect-square bg-[#1A1A1A] p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/20 to-transparent opacity-50" />
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E8E2DE]/60 mb-2">Neural Accuracy</p>
              <h4 className="text-4xl font-black text-white">98.4%</h4>
            </div>
            <div className="relative z-10 mt-auto">
              <p className="text-xs text-white/40 leading-relaxed italic">"Dynamic learning allows Invento to calibrate against population baselines in real-time."</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP SECTION */}
      <section className="relative z-10 w-full max-w-7xl px-8 py-20 text-center mb-32">
        <h3 className="text-[#8B0000] font-bold uppercase tracking-[0.3em] text-[10px] mb-6">Upcoming Innovation</h3>
        <h2 className="text-4xl font-black mb-16 tracking-tighter text-[#1A1A1A]">Research Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-10">
          <RoadmapTag title="Speech Pattern Detection" status="active" />
          <RoadmapTag title="Writing Analysis" status="pending" />
          <RoadmapTag title="Longitudinal Tracking" status="pending" />
          <RoadmapTag title="Doctor Export Protocol" status="pending" />
        </div>
      </section>

      {/* MEDICAL DISCLAIMER FOOTER */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-8 py-20 border-t border-[#1A1A1A]/5 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8B0000]/60">Important Medical Disclaimer</p>
          <p className="text-xs text-[#1A1A1A]/40 leading-relaxed font-medium">
            This tool provides cognitive screening and is not a medical diagnosis. If you have concerns about memory or cognitive health, please consult a healthcare professional. All data is processed using AES-256 clinical-grade encryption.
          </p>
        </div>
      </footer>

      {/* Background Decorative Element */}
      <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-pink-600/5 blur-[100px] pointer-events-none" />
    </div>
  );
}

function StepCard({ number, title, desc, icon }: { number: string, title: string, desc: string, icon: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-8 border border-[#1A1A1A]/5 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-md transition-all"
    >
      <div className="text-[40px] font-black italic text-[#1A1A1A]/5 select-none tracking-tighter">{number}</div>
      <div className="w-10 h-10 bg-[#E8E2DE] flex items-center justify-center text-[#8B0000] mb-2">
        {icon}
      </div>
      <h3 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A]">{title}</h3>
      <p className="text-xs text-[#1A1A1A]/50 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function DomainItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-1.5 h-1.5 bg-[#1A1A1A] mt-2.5 group-hover:scale-150 transition-transform bg-[#8B0000]/20" />
      <div>
        <h4 className="text-lg font-bold group-hover:text-[#8B0000] transition-colors uppercase tracking-widest text-[13px] text-[#1A1A1A]/80">{title}</h4>
        <p className="text-[#1A1A1A]/40 text-sm font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function RoadmapTag({ title, status }: { title: string, status: 'active' | 'pending' }) {
  return (
    <div className={`p-4 border ${status === 'active' ? 'border-[#8B0000]/30 bg-[#8B0000]/5' : 'border-[#1A1A1A]/5 bg-white'} text-center`}>
      <p className={`text-[10px] font-black tracking-widest uppercase ${status === 'active' ? 'text-[#8B0000]' : 'text-[#1A1A1A]/30'}`}>{title}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-1 p-10 border border-white/5 hover:border-white/10 transition-all flex flex-col items-start text-left group"
    >
      <div className="w-12 h-12 bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors shadow-glow-blue">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}