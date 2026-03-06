"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  Brain, Heart, Sparkles, Smile, ArrowRight, Activity,
  ShieldCheck, Zap, BarChart3, Globe, Lock, Info, CheckCircle2,
  Clock, Cpu, Layout, Layers, FileText, Instagram, Twitter, Linkedin, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import Lenis from 'lenis';

// --- ANIMATION WRAPPERS ---

const FadeIn = ({ children, delay = 0, direction = "up" }: any) => {
  const directions: any = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

// --- UI COMPONENTS ---

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-[#3D2C2E]/5 h-16 md:h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D61B7D] flex items-center justify-center text-white font-black italic shadow-lg rotate-2">E</div>
          <span className="font-bold text-lg md:text-xl tracking-tighter text-[#3D2C2E]">Espirit <span className="gradient-text font-black">Invento</span></span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-8 font-black uppercase text-[9px] md:text-[10px] tracking-[0.1em] text-[#3D2C2E]/60">
          <Link href="#how" className="hover:text-[#D61B7D] transition-all">How it works</Link>
          <Link href="#domains" className="hover:text-[#D61B7D] transition-all">Domains</Link>
          <Link href="#ai-tech" className="hover:text-[#D61B7D] transition-all">AI Tech</Link>
        </div>

        <Link href="/screening">
          <motion.button whileHover={{ scale: 1.05 }} className="yobe-btn yobe-btn-primary h-10 px-6 text-[10px]">
            Start Screening
          </motion.button>
        </Link>
      </div>
    </nav>
  );
};

const FloatingShapes = () => (
  <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
    <motion.div animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 90, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute顶-[10%] left-[5%] w-32 h-32 bg-pink-500/10 blur-[60px] rounded-full" />
    <motion.div animate={{ y: [0, 60, 0], x: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute bottom-[15%] right-[10%] w-64 h-64 bg-orange-400/10 blur-[80px] rounded-full" />
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute top-[30%] right-[20%] w-[300px] h-[300px] border border-pink-500/5 rounded-full" />
  </div>
);

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] pt-28 md:pt-40 pb-16 overflow-hidden flex flex-col items-center justify-center">
      <FloatingShapes />

      <div className="absolute top-0 left-0 right-0 h-full bg-[#D61B7D] z-[-1] overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`, backgroundSize: '40px 40px' }} />
        <svg className="absolute bottom-0 left-0 w-full h-32 fill-[#FFF8F0]" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160L40,176C80,192,160,224,240,213.3C320,203,400,149,480,149.3C560,149,640,203,720,218.7C800,235,880,213,960,186.7C1040,160,1120,128,1160,112L1200,96L1200,320C1160,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center text-white relative z-10">
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] shadow-glow">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#FFCB05] animate-pulse" />
            AI-Neural Analytics Engine V2
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-black italic mb-8 leading-[1] tracking-tighter">
            AI Dementia <br />
            <span className="gradient-text not-italic">Screening.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl font-medium mb-12 text-white/80 max-w-lg leading-relaxed">
            A quick AI-assisted cognitive screening tool that analyzes memory, attention, orientation, and decision-making patterns.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-5">
            <Link href="/screening">
              <button className="yobe-btn yobe-btn-primary glow-btn px-10 py-5 text-sm font-black uppercase">
                Start Screening <ArrowRight size={18} className="ml-2" />
              </button>
            </Link>
            <Link href="#how">
              <button className="yobe-btn border-white/20 bg-white/5 text-white backdrop-blur-xl px-10 py-5 text-sm uppercase font-black">
                How It Works
              </button>
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, cubicBezier: [0.16, 1, 0.3, 1] }} className="relative flex justify-center">
          <div className="absolute inset-0 bg-pink-500/20 blur-[120px] rounded-full animate-pulse" />
          <Image src="/hero-brain.png" alt="AI Neural Mapping" width={550} height={550} priority className="w-full max-w-md animate-float drop-shadow-[0_40px_80px_rgba(0,0,0,0.4)]" />

          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -top-6 -right-6 lg:right-0 bg-white/10 backdrop-blur-3xl p-6 rounded-[32px] border border-white/10 shadow-2xl z-20">
            <Cpu className="text-[#FFCB05] mb-2" size={32} />
            <div className="text-2xl font-black italic">Live AI</div>
            <div className="text-[9px] uppercase tracking-widest opacity-60">Processing</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const TechSection = () => {
  return (
    <section id="ai-tech" className="section-spacing bg-[#3D2C2E] py-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <FadeIn direction="left">
              <span className="text-[#D61B7D] font-black uppercase tracking-[0.3em] text-xs mb-6 block">The Lab</span>
              <h2 className="text-4xl md:text-6xl text-white font-black italic leading-tight mb-8">AI-Driven Cognitive <br /><span className="text-[#A1C45A] not-italic">Pattern Analysis.</span></h2>
              <p className="text-white/40 text-lg md:text-xl leading-relaxed mb-12">
                Our platform analyzes how users respond to cognitive challenges including memory recall, focus tasks, and reasoning patterns.
              </p>
              <div className="grid sm:grid-cols-2 gap-8 text-white">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <Activity className="text-[#D61B7D] mb-4" />
                  <h4 className="font-bold mb-2">Neural Telemetry</h4>
                  <p className="text-xs text-white/30">Tracking response latency down to milliseconds.</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                  <Brain className="text-[#A1C45A] mb-4" />
                  <h4 className="font-bold mb-2">Cognitive Load</h4>
                  <p className="text-xs text-white/30">Measuring logical consistency under stress.</p>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="relative flex justify-center items-center h-[500px]">
            <div className="absolute inset-0 bg-[#A1C45A]/10 blur-[150px] rounded-full" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-[400px] h-[400px] border-2 border-dashed border-[#A1C45A]/20 rounded-full flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-[300px] h-[300px] border border-white/10 rounded-full flex items-center justify-center"
              >
                <Brain size={80} className="text-[#A1C45A] animate-pulse" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StepsSection = () => (
  <section id="how" className="section-spacing bg-white px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <span className="text-[#F58220] font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Process</span>
        <h2 className="text-5xl md:text-7xl italic font-black text-[#3D2C2E]">How Screening <span className="gradient-text not-italic">Works.</span></h2>
      </div>

      <div className="grid lg:grid-cols-3 gap-12 relative">
        {[
          { icon: Layers, title: "Take Test", desc: "Engage in a curated 10-question cognitive assessment." },
          { icon: Zap, title: "AI Analysis", desc: "System decodes response patterns and timing logic." },
          { icon: FileText, title: "Get Report", desc: "Review your detailed multidimensional health score." }
        ].map((step, idx) => (
          <FadeIn key={idx} delay={idx * 0.1}>
            <div className="organic-card group p-12 text-center h-full">
              <div className="w-20 h-20 rounded-3xl bg-[#FFF8F0] flex items-center justify-center mb-8 mx-auto text-[#D61B7D] group-hover:scale-110 group-hover:bg-[#D61B7D] group-hover:text-white transition-all shadow-xl">
                <step.icon size={40} />
              </div>
              <h3 className="text-2xl font-black uppercase italic mb-4">{step.title}</h3>
              <p className="text-gray-400 font-medium leading-relaxed">{step.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

const DomainCard = ({ title, desc, icon: Icon, color, delay }: any) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay }} className="organic-card group h-full p-10 border border-transparent hover:border-black/5">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 text-white shadow-lg rotate-[-2deg] transition-all group-hover:rotate-0 group-hover:scale-110" style={{ background: color }}>
      <Icon size={32} />
    </div>
    <h3 className="text-2xl mb-4 text-[#3D2C2E] uppercase font-black italic">{title}</h3>
    <p className="text-[#3D2C2E]/50 text-base font-medium leading-relaxed">{desc}</p>
  </motion.div>
);

const DomainsSection = () => {
  const domains = [
    { title: "Memory", icon: Heart, desc: "Recalling patterns and fragments with temporal precision.", color: "#D61B7D" },
    { title: "Attention", icon: Sparkles, desc: "Sustained focus during multifaceted noise-filtering tasks.", color: "#F58220" },
    { title: "Executive", icon: Brain, desc: "High-level planning and rapid logical error-correction.", color: "#FFCB05" },
    { title: "Orientation", icon: Globe, desc: "Deep awareness of spatial context and timeline anchoring.", color: "#A1C45A" }
  ];

  return (
    <section id="domains" className="section-spacing bg-[#FFF8F0] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl tracking-tight italic font-black mb-6">Tested <span className="text-[#F58220] not-italic">Cognitive Domains.</span></h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Evaluating the four pillars of neural agility and functional orientation.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {domains.map((domain, i) => <DomainCard key={i} {...domain} delay={i * 0.1} />)}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#3D2C2E] text-[#FFF8F0] pt-24 pb-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-16 mb-20">
        <div>
          <h2 className="text-4xl mb-6 uppercase tracking-tighter italic font-black">Invento</h2>
          <p className="text-sm text-white/30 max-w-xs mb-8">Empowering brain health through accessible AI screening.</p>
        </div>
        <div>
          <h4 className="font-black uppercase text-[10px] tracking-widest text-[#D61B7D] mb-8">Privacy</h4>
          <div className="flex gap-4 items-center">
            <div className="p-4 bg-white/5 rounded-2xl text-[#A1C45A]"><ShieldCheck /></div>
            <p className="text-xs text-white/40 font-bold lowercase tracking-tight italic">Compliant neural data storage and encryption secured by AES-256 protocols.</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Link href="/screening"><button className="yobe-btn yobe-btn-primary px-8 py-4 mb-4">Start Assessment</button></Link>
          <div className="flex gap-6 opacity-40"><Instagram size={18} /><Twitter size={18} /><Linkedin size={18} /></div>
        </div>
      </div>
      <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-4 border border-white/10 p-4 rounded-2xl bg-white/5">
          <AlertTriangle className="text-orange-500 shrink-0" size={20} />
          <p className="text-[9px] text-white/30 leading-tight uppercase font-black tracking-widest">
            * Medical Disclaimer: This tool is an AI cognitive screening aid and does not provide clinical diagnosis. Consult a professional.
          </p>
        </div>
        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">© 2024 Invento AI Biosystems</p>
      </div>
    </div>
  </footer>
);

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
  }, []);

  return (
    <main className="selection:bg-[#FFCB05] selection:text-[#3D2C2E] bg-[#FFF8F0] overflow-x-hidden antialiased">
      <Navbar />
      <Hero />
      <div className="h-20 wavy-stripes rotate-[-1deg] relative z-20 shadow-2xl" />
      <StepsSection />
      <TechSection />
      <DomainsSection />
      <Footer />
    </main>
  );
}