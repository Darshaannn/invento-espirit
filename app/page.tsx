"use client";
import Link from "next/link";
import { ArrowRight, Database, Eye, Brain, Compass, Activity, ShieldCheck, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [scores, setScores] = useState({
    logic: 0,
    memory: 0,
    attention: 0,
    orientation: 0
  })
  useEffect(() => {
    const getCongnativeData = async () => {
      try {
        const response = await fetch("http://localhost:8000/status");
        const data = await response.json();

        // Prevent infinite re-render by only updating state if data changed
        setScores(prev => {
          if (
            prev.logic === data.logic &&
            prev.memory === data.memory &&
            prev.attention === data.attention &&
            prev.orientation === data.orientation
          ) {
            return prev;
          }
          return data;
        });
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    getCongnativeData();
  }, [])

  const domainData = [
    {
      name: "Memory",
      desc: "Assessing short-term recall and spatial recognition patterns over time.",
      icon: <Database size={24} className="text-[#9D50FF]" />,
      sub: "3 SUB-TESTS",
      score: 0
    },
    {
      name: "Attention",
      desc: "Measuring focus consistency and visual processing speeds in complex tasks.",
      icon: <Eye size={24} className="text-[#00F5FF]" />,
      sub: "2 SUB-TESTS",
      score: 0
    },
    {
      name: "Logic",
      desc: "Analyzing abstract reasoning and deductive problem-solving abilities.",
      icon: <Brain size={24} className="text-emerald-400" />,
      sub: "4 SUB-TESTS",
      score: 0
    },
    {
      name: "Orientation",
      desc: "Grounding assessment of temporal awareness and situational context.",
      icon: <Compass size={24} className="text-orange-400" />,
      sub: "2 SUB-TESTS",
      score: 0
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F0A1F] text-white font-sans selection:bg-[#9D50FF] selection:text-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#9D50FF] flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="font-bold text-xl tracking-tight">Invento Espirit</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400 font-medium">
          <Link href="#" className="hover:text-white transition-colors">How it Works</Link>
          <Link href="#" className="hover:text-white transition-colors">Science</Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="#" className="hidden md:block hover:text-white transition-colors text-gray-400">Log In</Link>
          <Link href="/instructions" className="bg-[#9D50FF] text-white px-5 py-2.5 rounded-full hover:bg-[#8338ec] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#9D50FF]/25">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 mt-20 mb-32 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A142E] border border-white/10 mb-8">
          <div className="w-2 h-2 rounded-full bg-[#9D50FF]" />
          <span className="text-[10px] font-bold text-[#9D50FF] tracking-widest uppercase">Next-Gen Early Detection</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
          AI that understands <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9D50FF] to-[#00F5FF]">cognitive patterns</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Early risk awareness through interactive, non-invasive screening. Fast, accurate, and designed for the digital age.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/instructions" className="bg-[#9D50FF] text-white px-8 py-3.5 rounded-full font-bold text-lg hover:bg-[#8338ec] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#9D50FF]/20">
            Start Screening
          </Link>
          <button className="bg-[#1A142E] text-white border border-white/10 px-8 py-3.5 rounded-full font-bold text-lg hover:bg-white/5 transition-all hover:border-white/20">
            View Sample Report
          </button>
        </div>
      </section>

      {/* CORE DOMAINS */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold mb-4">Core Cognitive Domains</h2>
            <p className="text-gray-400">Our AI assesses the four pillars of mental health through quick, engaging interactive tasks.</p>
          </div>
          <Link href="#" className="flex items-center gap-2 text-[#9D50FF] font-bold hover:gap-3 transition-all group">
            Explore Methodology
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {domainData.map((item) => (
            <div key={item.name} className="bg-[#1A142E] p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group">
              <div className="w-20 h-20 rounded-full border-4 border-[#9D50FF] flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">
                  {/* Use the live state instead of the static item.score */}
                  {scores[item.name.toLowerCase() as keyof typeof scores] || item.score}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">{item.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 h-20">{item.desc}</p>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PATTERN RECOGNITION */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="bg-[#130D26] rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">AI-Powered Pattern <br /> Recognition</h2>
            <p className="text-gray-400 mb-10 leading-relaxed text-lg">
              Our advanced neural networks detect subtle micro-fluctuations in cognitive performance long before they become visible to clinical observation.
            </p>

            <div className="space-y-6">
              {[
                { icon: <Activity size={20} className="text-[#9D50FF]" />, title: "Real-time Analysis", desc: "Instant feedback on your digital biomarker screening results." },
                { icon: <ShieldCheck size={20} className="text-[#9D50FF]" />, title: "Privacy First", desc: "Your health data is zero-knowledge encrypted and remains your own." },
                { icon: <Zap size={20} className="text-[#9D50FF]" />, title: "Gen-Z Focused", desc: "Intuitive UI designed for digital natives, not hospital clipboards." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-[#9D50FF]/20 flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link href="/instructions" className="inline-block bg-[#9D50FF] text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-[#9D50FF]/25 hover:bg-[#8338ec] transition-all">
                Learn more about our AI
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 group cursor-pointer">
              {/* Fake Video UI */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#9D50FF]/20 to-[#00F5FF]/20 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#9D50FF] flex items-center justify-center pl-1 shadow-lg shadow-[#9D50FF]/50">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent" />
                  </div>
                </div>
              </div>

              {/* Abstract Lines Decoration */}
              <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 50 Q 25 20 50 50 T 100 50" stroke="#00F5FF" fill="none" strokeWidth="0.5" />
                <path d="M0 60 Q 25 30 50 60 T 100 60" stroke="#9D50FF" fill="none" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="px-6 mb-32">
        <div className="max-w-4xl mx-auto bg-[#1A142E] rounded-[3rem] p-12 md:p-20 text-center border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#9D50FF] rounded-full filter blur-[100px] opacity-10 -mr-20 -mt-20" />
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to check your cognitive <br /> health?</h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              Join 50,000+ users proactively monitoring their mental performance. No appointment necessary.
            </p>
            <Link href="/instructions" className="inline-block bg-[#9D50FF] text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-[#9D50FF]/30 hover:scale-105 transition-transform">
              Start Your 5-Min Screening
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#9D50FF] flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-[1px] rotate-45" />
            </div>
            <span className="font-bold tracking-tight">Invento Espirit</span>
          </div>

          <div className="flex gap-8 text-xs text-gray-500 font-medium uppercase tracking-wider">
            <a href="#" className="hover:text-white transition-colors">Product</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
            <a href="#" className="hover:text-white transition-colors">Social</a>
          </div>

          <div className="text-xs text-gray-600">
            © 2024 Invento Espirit. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}