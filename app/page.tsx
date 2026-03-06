"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Brain, Heart, Sparkles, Smile, ArrowRight, Instagram,
  Twitter, Linkedin, Activity, ShieldCheck, FileText,
  Settings, Globe, CheckCircle2, AlertTriangle, Layers, Lock,
  HelpCircle, ChevronDown, MousePointer2, Zap, BarChart3
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
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-[#D61B7D] flex items-center justify-center text-white font-black italic shadow-lg rotate-2">E</div>
          <span className="font-bold text-lg md:text-xl tracking-tighter text-[#3D2C2E]">Espirit <span className="gradient-text font-black">Invento</span></span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-8 font-black uppercase text-[9px] md:text-[10px] tracking-[0.1em] text-[#3D2C2E]/60">
          <Link href="#about" className="hover:text-[#D61B7D] transition-all">About AI</Link>
          <Link href="#domains" className="hover:text-[#D61B7D] transition-all">Domains</Link>
          <Link href="#how" className="hover:text-[#D61B7D] transition-all">How it works</Link>
          <Link href="#faq" className="hover:text-[#D61B7D] transition-all">FAQ</Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="yobe-btn yobe-btn-primary h-10 px-6 text-[10px]"
        >
          Get Started
        </motion.button>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section className="relative min-h-[90vh] pt-24 md:pt-32 pb-12 overflow-hidden flex flex-col items-center justify-center">
      <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[5%] w-72 h-72 bg-pink-500/10 rounded-full blur-[100px]" />

      <div className="absolute top-0 left-0 right-0 h-full bg-[#D61B7D] z-[-1] overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`, backgroundSize: '40px 40px' }}
        />
        <svg className="absolute bottom-0 left-0 w-full h-32 fill-[#FFF8F0]" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160L40,176C80,192,160,224,240,213.3C320,203,400,149,480,149.3C560,149,640,203,720,218.7C800,235,880,213,960,186.7C1040,160,1120,128,1160,112L1200,96L1200,320C1160,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center text-white relative z-10">
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#FFCB05]" />
            AI-Neural Analytics Active
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black italic mb-6 leading-[1.1]">
            Stay Sharp. <br />
            <span className="gradient-text not-italic">Stay Human.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-base md:text-lg font-medium mb-10 text-white/80 max-w-md leading-relaxed">
            Sophisticated AI screening for early cognitive risk patterns. Fast, secure, and built for a vibrant future.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4">
            <button className="yobe-btn yobe-btn-primary glow-btn text-sm px-8 py-4">Start Screening <ArrowRight size={16} className="ml-2" /></button>
            <button className="yobe-btn border-white/20 bg-white/5 text-white backdrop-blur-xl text-sm px-8 py-4">View Report</button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative flex justify-center">
          <Image src="/hero-brain.png" alt="AI Brain" width={450} height={450} priority className="w-full max-w-sm animate-float" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-3xl p-4 rounded-2xl shadow-xl hidden md:block border border-white/20">
            <BarChart3 className="text-[#FFCB05] mb-1" size={24} />
            <div className="text-lg font-black italic">98.2%</div>
            <div className="text-[8px] uppercase tracking-widest opacity-60">Accuracy</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="section-spacing bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
            <div className="relative rounded-[40px] overflow-hidden border-[10px] border-[#FFF8F0] shadow-xl rotate-[-2deg]">
              <Image src="/vibrant_health_lifestyle.png" alt="Healthy Lifestyle" width={600} height={750} className="w-full" />
            </div>
          </FadeIn>
          <div className="flex flex-col gap-6">
            <FadeIn><h2 className="text-4xl md:text-5xl tracking-tighter leading-tight">Your Brain, <br /><span className="text-[#A1C45A]">Refreshed.</span></h2></FadeIn>
            <FadeIn delay={0.1}><p className="text-lg md:text-xl leading-relaxed italic border-l-4 border-[#F58220]/20 pl-6 py-2">"Neural telemetry scanning 5 years before symptoms manifest."</p></FadeIn>
            <FadeIn delay={0.2}><p className="accessible-p opacity-80 text-base">We measure subtle shifts in latency and patterns to provide a non-invasive window into your cognitive future.</p></FadeIn>
            <div className="grid grid-cols-2 gap-6 mt-4 italic">
              <div className="p-6 bg-[#FFF8F0] rounded-[30px] border border-black/5">
                <Zap className="text-[#F58220] mb-3" size={32} />
                <span className="font-black text-[10px] uppercase tracking-widest">Instant Scan</span>
              </div>
              <div className="p-6 bg-[#FFF8F0] rounded-[30px] border border-black/5">
                <ShieldCheck className="text-[#A1C45A] mb-3" size={32} />
                <span className="font-black text-[10px] uppercase tracking-widest">Safe Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DomainCard = ({ title, desc, icon: Icon, color, delay }: any) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }} className="organic-card group h-full p-8">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg rotate-[-2deg] transition-all group-hover:rotate-0" style={{ background: color }}>
      <Icon size={32} />
    </div>
    <h3 className="text-xl mb-3 text-[#3D2C2E] uppercase font-black">{title}</h3>
    <p className="text-[#3D2C2E]/60 text-sm font-medium leading-relaxed">{desc}</p>
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
        <div className="text-center mb-16">
          <FadeIn><h2 className="text-4xl md:text-6xl tracking-tighter mb-4 italic">The Cognitive <span className="gradient-text not-italic font-black">Matrix</span></h2></FadeIn>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {domains.map((domain, i) => <DomainCard key={i} {...domain} delay={i * 0.1} />)}
        </div>
      </div>
    </section>
  );
};

const StepsSection = () => {
  return (
    <section id="how" className="section-spacing bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl italic tracking-tighter text-center mb-20 md:mb-24">Simplicity <span className="gradient-text not-italic font-black">By Design</span></h2>
        <div className="grid md:grid-cols-3 gap-12 relative">
          {[
            { num: "01", title: "Interact", sub: "5-minute gamified challenges designed by neuroscientists.", color: "#D61B7D" },
            { num: "02", title: "Analyze", sub: "Cloud AI deciphers 1,000+ behavioral signals in real-time.", color: "#F58220" },
            { num: "03", title: "Insight", sub: "Receive a multidimensional dashboard of your status.", color: "#FFCB05" }
          ].map((step, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="relative group">
                <span className="text-7xl font-black absolute -top-12 -left-4 text-gray-50 -z-10">{step.num}</span>
                <h3 className="text-2xl font-black mb-4 uppercase" style={{ color: step.color }}>{step.title}</h3>
                <p className="text-base font-medium text-[#3D2C2E]/70 leading-relaxed">{step.sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#3D2C2E] text-[#FFF8F0] pt-20 pb-10 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="lg:col-span-2">
          <h2 className="text-4xl mb-6 uppercase tracking-tighter italic font-black">Invento</h2>
          <p className="text-sm text-white/40 max-w-xs mb-8">Empowering brain health through accessible AI screening.</p>
          <div className="flex gap-6"><Instagram size={20} /><Twitter size={20} /><Linkedin size={20} /></div>
        </div>
        <div>
          <h4 className="font-black uppercase text-[10px] tracking-widest text-white/20 mb-6">Explore</h4>
          <div className="flex flex-col gap-3 text-sm font-medium opacity-60 italic">
            <Link href="#">Assessment</Link><Link href="#">The Science</Link>
          </div>
        </div>
        <div>
          <h4 className="font-black uppercase text-[10px] tracking-widest text-white/20 mb-6">Safety</h4>
          <div className="flex flex-col gap-3 text-sm font-medium opacity-60 italic">
            <Link href="#">Privacy</Link><Link href="#">Terms</Link>
          </div>
        </div>
      </div>
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4 mb-10 italic">
        <AlertTriangle size={24} className="text-orange-400 shrink-0" />
        <p className="text-[10px] text-white/40 leading-relaxed"><strong>Medical Disclaimer:</strong> This is a screening tool, not a clinical diagnosis. Consult a professional for medical decisions.</p>
      </div>
      <div className="pt-8 border-t border-white/5 text-[9px] font-black tracking-widest text-white/10 flex justify-between">
        <p>© 2024 Invento AI Biosystems</p><p>Stay Sharp.</p>
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
      <div className="h-16 wavy-stripes rotate-[-1deg] relative z-20 shadow-xl" />
      <AboutSection />
      <DomainsSection />

      <section className="section-spacing px-6 bg-[#3D2C2E] text-white relative flex flex-col items-center overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-[150px]" />
        <div className="max-w-3xl mx-auto text-center relative z-10 py-12">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl mb-8 italic leading-tight">Your Future <span className="gradient-text not-italic font-black">Unseen</span></h2>
            <p className="text-lg md:text-xl text-white/50 mb-10 font-medium">Take the 5-minute cognitive baseline screening today.</p>
            <button className="yobe-btn yobe-btn-primary glow-btn px-10 py-5 text-sm">Start Neural Scan</button>
          </FadeIn>
        </div>
      </section>

      <StepsSection />
      <Footer />
    </main>
  );
}