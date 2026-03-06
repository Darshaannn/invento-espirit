"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Brain, Heart, Sparkles, Smile, ArrowRight, Instagram,
  Twitter, Linkedin, Activity, ShieldCheck, Info, FileText,
  Settings, Globe, CheckCircle2, AlertTriangle, Layers, Lock,
  HelpCircle, ChevronDown, MousePointer2
} from 'lucide-react';
import Link from 'next/link';
import Lenis from 'lenis';

// --- UI COMPONENTS ---

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F0]/90 backdrop-blur-xl border-b border-[#3D2C2E]/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 md:h-24 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D61B7D] flex items-center justify-center text-white font-black italic shadow-lg shadow-pink-500/20">E</div>
          <span className="font-bold text-xl md:text-2xl tracking-tighter text-[#3D2C2E]">Espirit <span className="text-[#D61B7D]">Invento</span></span>
        </div>
        <div className="hidden lg:flex items-center gap-10 font-black uppercase text-[10px] md:text-[11px] tracking-[0.15em] text-[#3D2C2E]">
          <Link href="#about" className="hover:text-[#D61B7D] transition-all">About AI</Link>
          <Link href="#domains" className="hover:text-[#D61B7D] transition-all">Cognitive Pillars</Link>
          <Link href="#how" className="hover:text-[#D61B7D] transition-all">How it Works</Link>
          <Link href="#faq" className="hover:text-[#D61B7D] transition-all">Common Questions</Link>
        </div>
        <button className="yobe-btn yobe-btn-primary h-12 md:h-14 font-black shadow-xl">Get Started</button>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-40 md:pt-48 pb-20 overflow-hidden flex flex-col items-center">
      {/* Wavy background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[80vh] bg-[#D61B7D] z-[-1] overflow-hidden">
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Subtle glowing elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-400 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-400 rounded-full blur-[100px] opacity-20" />

        <svg className="absolute bottom-0 left-0 w-full h-48 fill-[#FFF8F0]" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,218.7C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 lg:gap-24 items-center text-white">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center lg:text-left z-10"
        >
          <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-black uppercase tracking-[0.2em]">
            <Sparkles size={16} className="text-[#FFCB05]" /> NEW: AI Screening Tool
          </div>
          <h1 className="accessible-heading mb-8 drop-shadow-2xl">
            AI-Powered <br />
            <span className="text-[#FFCB05]">Dementia Risk Detection</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium mb-12 text-white/90 max-w-xl leading-relaxed">
            Take a quick cognitive test that evaluates memory, attention, and thinking patterns using artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <button className="yobe-btn yobe-btn-primary glow-btn text-lg md:text-xl px-10 md:px-12 py-5 md:py-6 shadow-2xl">
              Start Cognitive Test <ArrowRight className="ml-2" />
            </button>
            <button className="yobe-btn border-white/30 bg-white/10 text-white backdrop-blur-md text-lg px-10 py-5 hover:bg-white/20">
              Learn How It Works
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative h-[400px] md:h-[550px] flex items-center justify-center z-0"
        >
          <div className="absolute w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-orange-500 rounded-full blur-[100px] opacity-30 animate-pulse" />
          <Image
            src="/hero-brain.png"
            alt="AI Powered Neural Brain Mapping"
            width={600}
            height={600}
            priority
            className="w-full max-w-lg md:max-w-xl relative z-20 drop-shadow-[0_40px_80px_rgba(0,0,0,0.4)] animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="section-spacing bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FFB84C]/20 rounded-full blur-[50px] -z-10" />
            <Image
              src="/vibrant_health_lifestyle.png"
              alt="Joyful healthy living"
              width={800}
              height={1000}
              className="rounded-[60px] shadow-2xl rotate-[-2deg] border-[12px] border-white"
            />
          </motion.div>

          <div className="flex flex-col gap-8">
            <h2 className="text-5xl md:text-6xl text-[#3D2C2E] leading-none mb-4">About the AI Tool</h2>
            <div className="h-2 w-24 bg-[#D61B7D] rounded-full mb-4" />
            <p className="accessible-p text-xl leading-relaxed italic">
              "This platform uses artificial intelligence to analyze cognitive responses and detect patterns that may indicate dementia risk."
            </p>
            <p className="accessible-p opacity-80">
              Unlike traditional questionnaires, our AI evaluates the <strong>way</strong> you interact with the test—measuring latency, pattern consistency, and subtle cognitive shifts across multiple domains including memory, attention, executive function, and orientation.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFF8F0] rounded-2xl flex items-center justify-center text-[#D61B7D] shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <span className="font-bold text-[#3D2C2E]">Evidence-Based</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#FFF8F0] rounded-2xl flex items-center justify-center text-[#D61B7D] shadow-sm">
                  <ShieldCheck size={24} />
                </div>
                <span className="font-bold text-[#3D2C2E]">Clinical Accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const DomainCard = ({ title, desc, icon: Icon, color }: { title: string, desc: string, icon: React.ElementType, color: string }) => (
  <motion.div
    whileHover={{ y: -12, scale: 1.02 }}
    className="organic-card shadow-2xl hover:shadow-pink-500/5 group flex flex-col h-full bg-white border-none"
  >
    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-8 text-white shadow-xl rotate-[-4deg] group-hover:rotate-0 transition-all duration-300`}
      style={{ backgroundColor: color, boxShadow: `0 10px 30px -5px ${color}66` }}>
      <Icon size={40} />
    </div>
    <h3 className="text-3xl mb-6 text-[#3D2C2E] leading-none">{title}</h3>
    <p className="text-[#3D2C2E]/70 text-base font-medium leading-relaxed mb-10 flex-1">{desc}</p>
    <div className="flex items-center gap-2 font-black text-[11px] uppercase tracking-widest text-[#D61B7D] group-hover:gap-4 transition-all">
      Explore Metric <ArrowRight size={14} />
    </div>
    <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: color }} />
  </motion.div>
);

const DomainsSection = () => {
  const domains = [
    { title: "Memory", icon: FileText, desc: "Evaluating your ability to recall words, spatial sequences, and recent informational patterns.", color: "#D61B7D" },
    { title: "Attention", icon: Sparkles, desc: "Testing focus duration and the speed of processing multifaceted information without distraction.", color: "#F58220" },
    { title: "Executive Function", icon: Settings, desc: "Analyzing high-level skills for planning, problem solving, and decision-making capabilities.", color: "#FFCB05" },
    { title: "Orientation", icon: Globe, desc: "Determining clarity regarding time, person, place, and the immediate environmental context.", color: "#A1C45A" }
  ];

  return (
    <section id="domains" className="section-spacing bg-[#FFF8F0] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl mb-8">Four Cognitive Pillars</h2>
          <p className="text-xl md:text-2xl text-[#3D2C2E]/60 max-w-3xl mx-auto font-medium">We analyze 100+ data points across these core domains to build your comprehensive cognitive safety score.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {domains.map((domain, i) => <DomainCard key={i} {...domain} />)}
        </div>
      </div>
    </section>
  );
};

const StepsSection = () => {
  const steps = [
    { title: "Answer Cognitive Questions", sub: "Standardized challenges spanning memory and focus.", color: "#D61B7D", icon: MousePointer2 },
    { title: "AI Analyzes Response Patterns", sub: "Sophisticated neural scanning of your reaction speed.", color: "#F58220", icon: Activity },
    { title: "Receive Cognitive Insights", sub: "Download a detailed report of your cognitive profile.", color: "#FFCB05", icon: Layers }
  ];

  return (
    <section id="how" className="section-spacing bg-white px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl mb-24 text-center">3 Steps to Insight</h2>
        <div className="grid lg:grid-cols-3 gap-12 w-full relative">
          {/* Connecting line (Desktop only) */}
          <div className="hidden lg:block absolute top-[100px] left-[15%] right-[15%] h-1 bg-gradient-to-r from-[#D61B7D]/20 via-[#F58220]/20 to-[#FFCB05]/20 rounded-full" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center text-center group z-10"
            >
              <div className="w-48 h-48 rounded-[60px] bg-[#FFF8F0] shadow-2xl flex flex-col items-center justify-center mb-10 border-t-8 transition-all hover:shadow-orange-200/50"
                style={{ borderColor: step.color }}>
                <span className="text-5xl font-black italic mb-3" style={{ color: step.color }}>0{i + 1}</span>
                <step.icon size={36} className="text-[#3D2C2E]/20" />
              </div>
              <h3 className="text-2xl md:text-3xl uppercase tracking-tighter leading-none mb-4">{step.title}</h3>
              <p className="text-[#3D2C2E]/60 font-medium px-4">{step.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ResultsPreview = () => {
  return (
    <section className="section-spacing bg-[#FFF8F0] px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white p-12 rounded-[60px] shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-16 -mt-16" />
              <h4 className="text-3xl mb-12 flex items-center gap-4">
                <Activity className="text-[#D61B7D]" /> Your Assessment Data
              </h4>

              <div className="space-y-10">
                {[
                  { name: "Memory Score", val: "84%", color: "bg-[#D61B7D]" },
                  { name: "Attention Span", val: "72%", color: "bg-[#F58220]" },
                  { name: "Executive Ability", val: "91%", color: "bg-[#FFCB05]" },
                  { name: "Orientation Awareness", val: "88%", color: "bg-[#A1C45A]" }
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-black text-[11px] uppercase tracking-widest text-[#3D2C2E]/60">{item.name}</span>
                      <span className="font-black text-lg text-[#3D2C2E]">{item.val}</span>
                    </div>
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: item.val }}
                        transition={{ duration: 1.5, delay: idx * 0.2 }}
                        className={`h-full ${item.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between">
                <p className="text-xs uppercase font-black text-gray-400 tracking-[0.2em]">Overall Cognitive Status</p>
                <div className="px-4 py-1 bg-green-100 text-green-600 rounded-full text-xs font-black uppercase">STABLE</div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-5xl md:text-7xl mb-10 leading-[0.9]">Understand Your Results</h2>
            <p className="text-xl md:text-2xl font-medium mb-12 opacity-80 leading-relaxed">
              The AI analyzes your responses and provides insights across different cognitive domains. You'll receive a detailed breakdown that helps monitor your brain health over time.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-3xl shadow-sm border border-black/5">
                <div className="w-12 h-12 bg-[#D61B7D]/10 rounded-2xl flex items-center justify-center shrink-0 text-[#D61B7D]">
                  <Brain size={24} />
                </div>
                <p className="text-sm font-medium text-[#3D2C2E]/80">Longitudinal tracking compares your scores with your previous assessments for accurate cognitive delta detection.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PrivacySafety = () => (
  <section className="py-24 px-6 bg-[#3D2C2E] text-white">
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
      <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-xl rounded-[40px] flex items-center justify-center text-[#FFCB05] shadow-2xl shrink-0">
        <Lock size={56} />
      </div>
      <div>
        <h2 className="text-4xl md:text-5xl mb-6">Privacy & Data Safety</h2>
        <p className="text-xl opacity-70 mb-2">"Your responses are processed securely. No personal health data is stored permanently."</p>
        <p className="text-sm opacity-50 uppercase font-black tracking-[0.3em]">AES-256 Cloud Encryption / GDPR Compliant</p>
      </div>
    </div>
  </section>
);

const FAQ = () => {
  const faqs = [
    { q: "How long does the test take?", a: "Around 5–7 minutes. It's designed to be quick but comprehensive enough for our AI to scan for subtle cognitive patterns." },
    { q: "Is this a medical diagnosis?", a: "No, it is a screening tool. While highly accurate in pattern detection, it is not a clinical diagnosis. Always consult a healthcare professional." },
    { q: "Who should take this test?", a: "Anyone concerned about cognitive health, memory lapses, or those who want to establish a healthy cognitive baseline as they age." }
  ];

  return (
    <section id="faq" className="section-spacing px-6 bg-[#FFF8F0]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-[#D61B7D] mx-auto mb-8 shadow-xl">
            <HelpCircle size={32} />
          </div>
          <h2 className="text-5xl md:text-6xl mb-4">Common Questions</h2>
        </div>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <details key={i} className="organic-card p-10 group cursor-pointer border-none shadow-md">
              <summary className="flex justify-between items-center font-bold text-2xl text-[#3D2C2E] list-none">
                {faq.q}
                <ChevronDown className="text-gray-400 transition-transform group-open:rotate-180" size={24} />
              </summary>
              <p className="mt-8 text-[#3D2C2E]/60 text-lg leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#3D2C2E] text-[#FFF8F0] pt-32 pb-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-16 mb-24">
        <div className="col-span-2">
          <h2 className="text-6xl mb-8 uppercase tracking-tighter">Espirit Invento</h2>
          <p className="text-white/50 text-lg max-w-sm mb-12 font-medium">Empowering older adults through AI-powered cognitive screening. Privacy-first, science-backed.</p>
          <div className="flex gap-8">
            <Instagram className="hover:text-[#D61B7D] cursor-pointer transition-colors" size={28} />
            <Twitter className="hover:text-[#F58220] cursor-pointer transition-colors" size={28} />
            <Linkedin className="hover:text-[#FFCB05] cursor-pointer transition-colors" size={28} />
          </div>
        </div>
        <div>
          <h4 className="font-black uppercase text-[11px] tracking-[0.3em] text-white/20 mb-10">Product</h4>
          <ul className="space-y-5 font-black uppercase text-xs tracking-widest">
            <li><Link href="#" className="hover:text-[#D61B7D]">The Test</Link></li>
            <li><Link href="#" className="hover:text-[#D61B7D]">AI Science</Link></li>
            <li><Link href="#" className="hover:text-[#D61B7D]">Security</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black uppercase text-[11px] tracking-[0.3em] text-white/20 mb-10">Company</h4>
          <ul className="space-y-5 font-black uppercase text-xs tracking-widest text-white/40">
            <li><Link href="#" className="hover:text-[#D61B7D]">Privacy</Link></li>
            <li><Link href="#" className="hover:text-[#D61B7D]">Compliance</Link></li>
            <li><Link href="#" className="hover:text-[#D61B7D]">Contact Us</Link></li>
          </ul>
        </div>
      </div>

      <div className="mb-12 p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6">
        <AlertTriangle className="text-orange-400 shrink-0" size={32} />
        <p className="text-xs md:text-sm text-white/60 leading-relaxed font-bold">
          <strong>Medical Disclaimer:</strong> This tool is not a medical diagnosis. It is an AI-based cognitive screening system designed to identify potential patterns associated with dementia. Consult a healthcare professional for medical advice.
        </p>
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 uppercase text-[10px] font-black tracking-[0.3em] text-white/10">
        <p>© 2024 Espirit Invento AI Laboratory. All Rights Reserved.</p>
        <p>Built for a Secure & Vibrant Tomorrow</p>
      </div>
    </div>
  </footer>
);

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        const href = target.getAttribute('href');
        if (href) {
          const el = document.querySelector(href);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }, []);

  return (
    <main className="selection:bg-[#FFCB05] selection:text-[#3D2C2E] bg-[#FFF8F0]">
      <Navbar />
      <Hero />

      {/* Wavy Stripe Separator */}
      <div className="h-40 wavy-stripes rotate-[-1.5deg] relative z-10 translate-y-[-20px]" />

      <AboutSection />
      <DomainsSection />

      {/* Middle CTA Section */}
      <section className="section-spacing px-6 bg-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#D61B7D]/5 rounded-full blur-[140px] -z-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl mb-12">Take the Cognitive Screening Test</h2>
          <p className="text-xl md:text-2xl text-[#3D2C2E]/70 mb-14 font-medium italic">
            The test takes about 5–7 minutes and provides a detailed profile of your mental agility.
          </p>
          <button className="yobe-btn yobe-btn-primary glow-btn text-2xl px-16 py-7 shadow-3xl shadow-pink-500/20">
            Start Assessment <ArrowRight className="ml-2" />
          </button>
          <div className="mt-12 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-gray-300">
            <ShieldCheck size={16} /> Data Encryption Active
          </div>
        </div>
      </section>

      <StepsSection />
      <ResultsPreview />
      <PrivacySafety />
      <FAQ />

      <Footer />
    </main>
  );
}