"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Brain, Heart, Sparkles, Smile, ArrowRight, Instagram,
  Twitter, Linkedin, Activity, ShieldCheck, Info, FileText,
  Settings, Globe, CheckCircle2, AlertTriangle, Layers, Lock,
  HelpCircle, ChevronDown, MousePointer2, Zap, BarChart3
} from 'lucide-react';
import Link from 'next/link';
import Lenis from 'lenis';

// --- ANIMATION WRAPPERS ---

const FadeIn = ({ children, delay = 0, direction = "up" }: any) => {
  const directions: any = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

// --- UI COMPONENTS ---

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-[#3D2C2E]/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 md:h-24 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#D61B7D] flex items-center justify-center text-white font-black italic shadow-2xl shadow-pink-500/30 rotate-3 hover:rotate-0 transition-transform cursor-pointer">E</div>
          <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#3D2C2E]">Espirit <span className="gradient-text font-black">Invento</span></span>
        </motion.div>

        <div className="hidden lg:flex items-center gap-12 font-black uppercase text-[10px] md:text-[11px] tracking-[0.2em] text-[#3D2C2E]/60">
          <Link href="#about" className="hover:text-[#D61B7D] transition-all relative group">
            About AI
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D61B7D] transition-all group-hover:w-full" />
          </Link>
          <Link href="#domains" className="hover:text-[#D61B7D] transition-all relative group">
            Domains
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D61B7D] transition-all group-hover:w-full" />
          </Link>
          <Link href="#how" className="hover:text-[#D61B7D] transition-all relative group">
            How it works
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D61B7D] transition-all group-hover:w-full" />
          </Link>
          <Link href="#faq" className="hover:text-[#D61B7D] transition-all relative group">
            FAQ
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D61B7D] transition-all group-hover:w-full" />
          </Link>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="yobe-btn yobe-btn-primary h-12 md:h-14 font-black shadow-2xl"
        >
          Get Started
        </motion.button>
      </div>
    </nav>
  );
};

const Hero = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section className="relative min-h-screen pt-40 md:pt-48 pb-20 overflow-hidden flex flex-col items-center">
      {/* Dynamic colorful blobs */}
      <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[5%] w-96 h-96 bg-pink-500/20 rounded-full blur-[120px] mix-blend-multiply" />
      <motion.div style={{ y: y2 }} className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-[150px] mix-blend-multiply" />

      <div className="absolute top-0 left-0 right-0 h-full bg-[#D61B7D] z-[-1] overflow-hidden">
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        <svg className="absolute bottom-0 left-0 w-full h-48 md:h-64 fill-[#FFF8F0]" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160L40,176C80,192,160,224,240,213.3C320,203,400,149,480,149.3C560,149,640,203,720,218.7C800,235,880,213,960,186.7C1040,160,1120,128,1160,112L1200,96L1200,320L1160,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-20 lg:gap-32 items-center text-white relative z-10">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 mb-10 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-black/5"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FFCB05] animate-ping" />
            AI-Neural Analytics Active
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="accessible-heading mb-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] leading-none italic"
          >
            Stay Sharp. <br />
            <span className="gradient-text font-black not-italic drop-shadow-none">Stay Human.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl font-medium mb-16 text-white/80 max-w-xl leading-relaxed"
          >
            Sophisticated AI screening for early cognitive risk patterns. Fast, secure, and built for a vibrant future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
          >
            <button className="yobe-btn yobe-btn-primary glow-btn text-lg md:text-xl px-12 py-6 shadow-[0_20px_60px_-15px_rgba(214,27,125,0.6)]">
              Start Screening <ArrowRight className="ml-2 group-hover:translate-x-1" />
            </button>
            <button className="yobe-btn border-white/20 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10 text-lg px-12 py-6">
              View Sample Report
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-orange-500/30 blur-[100px] animate-pulse rounded-full" />
          <Image
            src="/hero-brain.png"
            alt="AI Powered Neural Brain Mapping"
            width={700}
            height={700}
            priority
            className="w-full max-w-2xl relative z-20 drop-shadow-[0_60px_100px_rgba(0,0,0,0.4)] animate-float"
          />
          {/* Decorative stats card floating */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 md:right-0 bg-white/20 backdrop-blur-3xl border border-white/30 p-6 rounded-3xl shadow-2xl z-30 hidden md:block"
          >
            <BarChart3 className="text-[#FFCB05] mb-2" size={32} />
            <div className="text-2xl font-black italic">98.2%</div>
            <div className="text-[9px] uppercase font-black tracking-widest opacity-60">Accuracy Rate</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="section-spacing bg-white px-6 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#D61B7D]/3 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#A1C45A]/3 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-40 items-center">
          <FadeIn direction="left">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#D61B7D] to-[#F58220] rounded-[70px] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative rounded-[60px] overflow-hidden border-[16px] border-[#FFF8F0] shadow-2xl rotate-[-3deg] hover:rotate-0 transition-transform duration-700">
                <Image
                  src="/vibrant_health_lifestyle.png"
                  alt="Joyful healthy living"
                  width={800}
                  height={1000}
                  className="w-full h-auto scale-105 group-hover:scale-100 transition-transform duration-[2s]"
                />
              </div>
            </div>
          </FadeIn>

          <div className="flex flex-col gap-10">
            <FadeIn>
              <h2 className="text-6xl md:text-8xl text-[#3D2C2E] leading-none tracking-tighter">Your Brain, <br /><span className="text-[#A1C45A]">Refreshed.</span></h2>
              <div className="h-3 w-32 bg-gradient-to-r from-[#D61B7D] to-pink-300 rounded-full mt-8" />
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="accessible-p text-2xl leading-relaxed italic border-l-8 border-[#F58220]/20 pl-8 py-4">
                "Our platform uses advanced neural telemetry to scan for cognitive patterns 5 years before symptoms typically manifest."
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <p className="accessible-p opacity-80 text-lg">
                We believe healthcare should be as beautiful as it is clinical. By measuring subtle shifts in latency, pattern consistency, and executive decision paths, Espirit Invento provides a non-invasive window into your cognitive future.
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="grid grid-cols-2 gap-10 mt-6">
                <div className="flex flex-col gap-4 p-8 bg-[#FFF8F0] rounded-[40px] border border-black/5 hover:bg-white hover:shadow-xl transition-all">
                  <Zap className="text-[#F58220]" size={40} />
                  <span className="font-black text-sm uppercase tracking-[0.2em] text-[#3D2C2E]">Instant Analysis</span>
                </div>
                <div className="flex flex-col gap-4 p-8 bg-[#FFF8F0] rounded-[40px] border border-black/5 hover:bg-white hover:shadow-xl transition-all">
                  <ShieldCheck className="text-[#A1C45A]" size={40} />
                  <span className="font-black text-sm uppercase tracking-[0.2em] text-[#3D2C2E]">Bank-Grade Security</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

const DomainCard = ({ title, desc, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotate: -2 }}
    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -25, rotate: 2 }}
    className="organic-card shadow-3xl group flex flex-col h-full bg-white border-none py-16 px-12"
  >
    <div className="w-24 h-24 rounded-[32px] flex items-center justify-center mb-10 text-white shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-12 duration-500"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)`, boxShadow: `0 20px 40px -10px ${color}88` }}>
      <Icon size={48} strokeWidth={1.5} />
    </div>
    <h3 className="text-4xl mb-6 text-[#3D2C2E] tracking-tighter leading-none italic group-hover:not-italic transition-all uppercase">{title}</h3>
    <p className="text-[#3D2C2E]/60 text-lg font-medium leading-relaxed mb-12 flex-1">{desc}</p>

    <div className="flex items-center justify-between mt-auto">
      <span className="h-0.5 w-12 bg-gray-100 group-hover:w-full group-hover:bg-[#D61B7D] transition-all duration-700" />
      <ArrowRight className="text-[#D61B7D] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all ml-4" />
    </div>
  </motion.div>
);

const DomainsSection = () => {
  const domains = [
    { title: "Memory", icon: Heart, desc: "Recalling patterns, sequences, and informational fragments with temporal precision.", color: "#D61B7D" },
    { title: "Attention", icon: Sparkles, desc: "Sustained focus and the ability to filter environmental noise during complex tasks.", color: "#F58220" },
    { title: "Executive", icon: Brain, desc: "High-level planning, resource allocation, and rapid logical error-correction.", color: "#FFCB05" },
    { title: "Orientation", icon: Globe, desc: "Deep awareness of spatial context, timeline anchoring, and physical surrounding.", color: "#A1C45A" }
  ];

  return (
    <section id="domains" className="section-spacing bg-[#FFF8F0] px-6 relative">
      <div className="absolute inset-0 bg-transparent" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <FadeIn>
            <h2 className="text-6xl md:text-9xl mb-10 tracking-tighter leading-none uppercase italic">The Cognitive <span className="gradient-text not-italic font-black">Matrix</span></h2>
            <p className="text-xl md:text-3xl text-[#3D2C2E]/40 max-w-4xl mx-auto font-medium lowercase">Sophisticated metrics for the most complex system in the universe.</p>
          </FadeIn>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {domains.map((domain, i) => <DomainCard key={i} {...domain} delay={i * 0.15} />)}
        </div>
      </div>
    </section>
  );
};

// --- FAQ & FINAL TOUCHES ---

const StepsSection = () => {
  return (
    <section id="how" className="section-spacing bg-white px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-32">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            className="h-1 bg-gradient-to-r from-pink-100 via-pink-500 to-pink-100 mb-8"
          />
          <h2 className="text-6xl md:text-8xl italic tracking-tighter text-center">Simplicity <span className="not-italic gradient-text">By Design</span></h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-24 relative">
          {[
            { num: "01", title: "Interact", sub: "Engage with 5-minute gamified challenges designed by neuroscientists.", color: "#D61B7D" },
            { num: "02", title: "Analyze", sub: "Cloud-based AI deciphers 1,000+ behavioral signals in real-time.", color: "#F58220" },
            { num: "03", title: "Insight", sub: "Receive a multidimensional dashboard of your cognitive health.", color: "#FFCB05" }
          ].map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="flex flex-col relative group"
            >
              <span className="text-[12rem] font-black absolute -top-32 -left-10 text-gray-50 -z-10 group-hover:text-pink-50 transition-colors duration-500">{step.num}</span>
              <h3 className="text-5xl font-black mb-8 italic uppercase" style={{ color: step.color }}>{step.title}</h3>
              <p className="text-2xl font-medium text-[#3D2C2E]/70 leading-snug">{step.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#3D2C2E] text-[#FFF8F0] pt-40 pb-16 px-6 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#FFF8F0] to-transparent" />
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-32 mb-40">
        <div>
          <h2 className="text-7xl md:text-9xl mb-12 uppercase tracking-tighter leading-none italic font-black">Invento</h2>
          <p className="text-2xl md:text-3xl text-white/40 max-w-lg mb-16 leading-tight">Empowering a world where brain health is transparent and accessible.</p>
          <div className="flex gap-12">
            <Instagram className="hover:text-[#D61B7D] cursor-pointer scale-125 transition-all hover:rotate-12" />
            <Twitter className="hover:text-[#F58220] cursor-pointer scale-125 transition-all hover:rotate-12" />
            <Linkedin className="hover:text-[#FFCB05] cursor-pointer scale-125 transition-all hover:rotate-12" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-8">
            <h4 className="font-black uppercase text-[12px] tracking-[0.4em] text-white/20">Matrix</h4>
            <div className="flex flex-col gap-6 text-2xl font-medium opacity-60">
              <Link href="#" className="hover:opacity-100 transition-opacity italic">Assessment</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity italic">The Science</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity italic">Data Vault</Link>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h4 className="font-black uppercase text-[12px] tracking-[0.4em] text-white/20">Safety</h4>
            <div className="flex flex-col gap-6 text-2xl font-medium opacity-60">
              <Link href="#" className="hover:opacity-100 transition-opacity italic">Privacy</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity italic">HIPAA</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity italic">Terms</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-10">
        <div className="p-6 bg-orange-500/10 rounded-3xl text-orange-400">
          <AlertTriangle size={48} />
        </div>
        <p className="text-lg text-white/50 leading-relaxed font-bold max-w-3xl italic">
          <strong>Medical Disclaimer:</strong> This tool is an AI-based cognitive screening system. It provides predictive analytics, not a clinical diagnosis. Consultation with a neurological professional is essential for medical decisions.
        </p>
      </div>

      <div className="mt-24 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between gap-8 uppercase text-[11px] font-black tracking-[0.5em] text-white/10">
        <p>© 2024 Espirit Invento AI Biosystems</p>
        <p>Stay Sharp. Stay Vibrant.</p>
      </div>
    </div>
  </footer>
);

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <main className="selection:bg-[#FFCB05] selection:text-[#3D2C2E] bg-[#FFF8F0] overflow-x-hidden antialiased">
      <Navbar />
      <Hero />

      <div className="h-40 wavy-stripes rotate-[-2.5deg] relative z-20 shadow-2xl scale-110" />

      <AboutSection />
      <DomainsSection />

      {/* Dynamic Scrolling CTA Section */}
      <section className="section-spacing px-6 bg-[#3D2C2E] text-white relative flex flex-col items-center overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute w-[1200px] h-[1200px] bg-pink-500/20 rounded-full blur-[200px]"
        />
        <div className="max-w-5xl mx-auto text-center relative z-10 py-20">
          <FadeIn>
            <h2 className="text-6xl md:text-9xl mb-12 italic leading-none tracking-tighter">Your Future <span className="gradient-text not-italic font-black">Unseen</span></h2>
            <p className="text-2xl md:text-4xl text-white/50 mb-20 font-medium leading-tight">
              Take the 5-minute cognitive baseline screening today.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
              className="yobe-btn yobe-btn-primary scale-125 px-20 py-8 shadow-[0_40px_100px_-20px_rgba(214,27,125,1)]"
            >
              Start Neural Scan
            </motion.button>
          </FadeIn>
        </div>
      </section>

      <StepsSection />

      <Footer />
    </main>
  );
}