"use client";
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Rocket, Lightbulb, Search, Users, ShieldCheck, ChevronRight,
  ArrowRight, Play, CheckCircle2, Globe, Mail, Twitter,
  Instagram, Linkedin, Github, Menu, X, Plus
} from 'lucide-react';
import Link from 'next/link';
import Lenis from 'lenis';

// --- COMPONENTS ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/20">
            <Rocket className="text-white" size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#0F172A]">Invento <span className="text-[#6C5CE7]">Espirit</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Innovations', 'How it Works', 'Investors', 'Community'].map((item) => (
            <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-semibold text-gray-600 hover:text-[#6C5CE7] transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm font-semibold text-gray-600 hover:text-[#0F172A]">Log In</button>
          <button className="gradient-btn px-6 py-2.5 rounded-full text-sm font-bold">Submit Idea</button>
        </div>

        <button className="md:hidden text-[#0F172A]" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-white z-[60] p-8 flex flex-col items-center justify-center"
          >
            <button className="absolute top-8 right-8 text-[#0F172A]" onClick={() => setMobileMenuOpen(false)}>
              <X size={32} />
            </button>
            <div className="flex flex-col items-center gap-8 text-2xl font-bold">
              {['Innovations', 'How it Works', 'Investors', 'Community'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)}>
                  {item}
                </Link>
              ))}
              <button className="gradient-btn px-10 py-4 rounded-full w-full">Submit Idea</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#6C5CE7] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00D4FF] rounded-full mix-blend-multiply filter blur-[120px] opacity-10 animate-pulse" />

      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6C5CE7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6C5CE7]"></span>
            </span>
            Platform Live Now
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-[#0F172A] leading-tight mb-6">
            Turn Ideas Into <br />
            <span className="gradient-text">Funded Innovations</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-lg mb-10 leading-relaxed font-medium">
            Invento Espirit connects students, alumni, professors and investors to transform innovative ideas into real-world startups. Your journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="gradient-btn px-10 py-4 rounded-full font-bold text-lg flex items-center gap-2 group">
              🚀 Submit Your Idea
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-4 rounded-full bg-white border border-gray-200 text-gray-700 font-bold text-lg hover:bg-gray-50 transition-colors">
              💰 Explore Innovations
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[600px] flex items-center justify-center"
        >
          {/* Floating cards animation */}
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-[10%] right-[5%] glass-card p-6 w-64 shadow-2xl z-20 border-l-4 border-[#6C5CE7]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AI Crop Disease Detector</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Agriculture 4.0</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[9px] font-bold">Seed Stage</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-bold">$50k Funded</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[20%] left-[5%] glass-card p-6 w-64 shadow-2xl z-10 border-l-4 border-[#00D4FF]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-[#00D4FF]">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Smart Water Grid</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Suntanability</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[9px] font-bold">Idea Stage</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#00D4FF] text-[9px] font-bold">3 Interested</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ x: [0, 10, 0], y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-[40%] left-[20%] glass-card p-6 w-64 shadow-2xl z-0 border-l-4 border-[#F43F5E]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Blockchain Voting</h4>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Web3 / Gov</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[9px] font-bold">Series A</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[9px] font-bold">$2M Raised</span>
              </div>
            </motion.div>

            {/* Center Glow */}
            <div className="w-96 h-96 bg-gradient-to-r from-[#6C5CE7]/20 to-[#00D4FF]/20 rounded-full filter blur-[80px]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const StatsBar = () => {
  const stats = [
    { label: "Students", val: "500+" },
    { label: "Ideas Submitted", val: "120+" },
    { label: "Projects Funded", val: "35+" },
    { label: "Mentors", val: "15+" },
  ];

  return (
    <section className="py-12 bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <h3 className="text-4xl md:text-5xl font-extrabold gradient-text mb-2">{stat.val}</h3>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { title: "Submit Your Idea", desc: "Students and alumni upload their innovative startup concepts.", icon: <Plus size={32} /> },
    { title: "Get Discovered", desc: "Investors and professors explore vetted, high-potential projects.", icon: <Search size={32} /> },
    { title: "Collaborate & Build", desc: "Connect with mentors and secure funding to build your vision.", icon: <Rocket size={32} /> },
  ];

  return (
    <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">A seamless 3-step pipeline designed to take your napkin sketch to a venture-backed startup.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line (Desktop) */}
          <div className="hidden lg:block absolute top-[25%] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#6C5CE7]/20 via-[#00D4FF]/20 to-[#6C5CE7]/20 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center p-8 rounded-[2rem] bg-gray-50/50 hover:bg-white transition-all hover:shadow-2xl group border border-transparent hover:border-gray-100"
            >
              <div className="w-20 h-20 rounded-2xl gradient-btn flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h4 className="text-[10px] font-bold text-[#6C5CE7] uppercase tracking-widest mb-2">Step 0{i + 1}</h4>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const IdeaShowcase = () => {
  const ideas = [
    { title: "AI Crop Disease Detector", problem: "Farmers lose 40% of yields to undetected disease.", solution: "Neural net analysis for instant leaf diagnosis.", sector: "AgriTech", funded: "$125k" },
    { title: "Smart Water Management", problem: "Urban water grids waste 30% through silent leaks.", solution: "IoT sensor grid with predictive leak modeling.", sector: "Sustainability", funded: "$80k" },
    { title: "NeuroSync Workspace", problem: "Remote teams struggle with cognitive overload.", solution: "AI-priority tasking based on neural focus patterns.", sector: "Future of Work", funded: "$250k" },
  ];

  return (
    <section id="innovations" className="py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Active Innovation Pipeline</h2>
            <p className="text-gray-500">Discover the next generation of startups being built in our ecosystem right now.</p>
          </div>
          <button className="flex items-center gap-2 font-bold text-[#6C5CE7] hover:gap-3 transition-all">
            View All Innovations <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ideas.map((idea, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col group h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-bold px-3 py-1 bg-gray-100 rounded-full text-gray-500 uppercase">{idea.sector}</span>
                <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-[#6C5CE7] transition-colors">
                  <Linkedin size={14} />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-[#6C5CE7] transition-colors">{idea.title}</h3>
              <div className="space-y-4 mb-8 flex-1">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Problem</p>
                  <p className="text-sm text-gray-600 italic">"{idea.problem}"</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Solution</p>
                  <p className="text-sm text-gray-600">{idea.solution}</p>
                </div>
              </div>
              <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Funding Target</p>
                  <p className="font-bold text-[#0F172A]">{idea.funded}</p>
                </div>
                <button className="p-3 rounded-full bg-[#6C5CE7]/5 text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white transition-all">
                  <Play size={16} fill="currentColor" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SectionBenefits = () => {
  const users = [
    { role: "Students", items: ["Submit innovative ideas", "Build real-world startups", "Access elite mentorship"], color: "#6C5CE7" },
    { role: "Investors", items: ["Discover early-stage ideas", "Support vetted innovation", "Invest in promising unicorns"], color: "#00D4FF" },
    { role: "Professors", items: ["Guide student research", "Scale commercial patents", "Innovation coaching"], color: "#F43F5E" },
    { role: "Alumni", items: ["Pay it forward to students", "Angel investment access", "Network within founders"], color: "#0F172A" },
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Tailored for Every Stakeholder</h2>
          <p className="text-gray-500">A multi-sided engine powering the next decade of innovation from within the university walls.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 rounded-xl mb-6 flex items-center justify-center text-white font-bold" style={{ backgroundColor: user.color }}>
                {user.role[0]}
              </div>
              <h3 className="text-xl font-bold mb-6">{user.role}</h3>
              <ul className="space-y-4">
                {user.items.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-gray-600">
                    <div className="mt-1 w-4 h-4 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={10} className="text-[#6C5CE7]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section className="py-32 bg-[#0F172A] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Real Success Stories</h2>
            <p className="text-gray-400 text-lg mb-12">Hear from the founders and investors who have already scaled through the Invento pipeline.</p>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                <ArrowRight size={24} className="rotate-180" />
              </button>
              <button className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
                <ArrowRight size={24} />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="glass-card p-12 relative z-10 bg-white/5 border-white/10 backdrop-blur-xl">
              <span className="text-6xl text-[#6C5CE7] font-serif absolute top-6 left-6 opacity-30">“</span>
              <p className="text-xl md:text-2xl font-medium mb-8 relative z-10 italic">
                "Invento helped me connect with an investor who funded my prototype in just weeks. The mentorship was world-class."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#6C5CE7] to-[#00D4FF]" />
                <div>
                  <h4 className="font-bold text-lg">Rahul Sharma</h4>
                  <p className="text-gray-500 text-sm">Founder @ AgriScan AI</p>
                </div>
              </div>
            </div>
            {/* Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#6C5CE7] rounded-full blur-[100px] opacity-20 -z-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const questions = [
    { q: "Who can submit ideas?", a: "Any enrolled student, researcher, or verified alumni can submit original innovation concepts." },
    { q: "Is funding guaranteed?", a: "While we provide the exposure, funding depends on investor interest and project feasibility." },
    { q: "How much equity is taken?", a: "Invento is a facilitator; equity terms are negotiated directly between you and your investors." },
    { q: "Can I find co-founders here?", a: "Yes! Our platform has a dedicated networking section to match expertise with innovative needs." }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-center mb-16 text-[#0F172A]">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-bold text-lg">{item.q}</span>
                  <Plus size={20} className="text-[#6C5CE7] transition-transform group-open:rotate-45" />
                </summary>
                <div className="p-6 pt-0 text-gray-500 leading-relaxed text-sm">
                  {item.a}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="pt-32 pb-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center shadow-lg shadow-[#6C5CE7]/20">
                <Rocket className="text-white" size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A]">Invento <span className="text-[#6C5CE7]">Espirit</span></span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed mb-8">
              Transforming the university ecosystem into a global startup engine. Innovation backed by trust.
            </p>
            <div className="flex gap-4">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-[#6C5CE7] hover:text-white transition-all">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Innovations</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Investment Center</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Startup Directory</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Idea Voting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8">Community</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Alumni Network</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Faculty Support</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Mentorship Program</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-500 font-medium">
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Research Blog</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Pitch Guides</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Legal Framework</Link></li>
              <li><Link href="#" className="hover:text-[#6C5CE7] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-gray-400">
          <p>© 2024 Invento Espirit Research Lab. All Rights Reserved.</p>
          <div className="flex gap-8">
            <span>Built for Next Generation Founders</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN PAGE ---

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <IdeaShowcase />
      <SectionBenefits />
      <Testimonials />

      {/* Demo Video Mockup */}
      <section className="py-32 bg-white flex flex-col items-center">
        <h2 className="text-4xl font-extrabold mb-12 text-center">See How Invento Works</h2>
        <div className="w-full max-w-5xl aspect-video rounded-[3rem] bg-gradient-to-tr from-[#6C5CE7] via-[#00D4FF] to-[#6C5CE7] p-1 shadow-2xl overflow-hidden relative group cursor-pointer">
          <div className="w-full h-full bg-black rounded-[2.8rem] flex items-center justify-center relative">
            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center pl-1 shadow-xl">
                <Play size={24} fill="#0F172A" className="text-[#0F172A]" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/50 font-bold text-[10px] tracking-widest uppercase">
              <span>Invento Platform Demo v1.02</span>
              <span>04:22</span>
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      {/* Newsletter */}
      <section className="px-6 py-20 pb-0">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-[#6C5CE7] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-[#6C5CE7]/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full filter blur-[100px] -mr-20 -mt-20" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Stay ahead of innovation.</h2>
          <p className="text-white/80 mb-12 max-w-md mx-auto">Get the latest student startups and investment opportunities delivered weekly.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
            <input
              type="email"
              placeholder="you@university.edu"
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all font-medium"
            />
            <button className="bg-white text-[#6C5CE7] px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-xl">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}