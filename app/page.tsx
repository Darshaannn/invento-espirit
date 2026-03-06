"use client";
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Heart, Sparkles, Smile, ArrowRight, Check,
  Search, Play, MessageCircle, Star, Instagram,
  Twitter, Linkedin, Plus, Clock, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import Lenis from 'lenis';

// --- COMPONENTS ---

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F0]/80 backdrop-blur-xl border-b border-[#3D2C2E]/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-[#D61B7D] flex items-center justify-center text-white font-black italic shadow-lg">E</div>
          <span className="font-bold text-2xl tracking-tighter text-[#3D2C2E]">Espirit <span className="text-[#D61B7D]">Invento</span></span>
        </div>
        <div className="hidden md:flex items-center gap-10 font-black uppercase text-[10px] tracking-widest text-[#3D2C2E]">
          <Link href="#about" className="hover:text-[#D61B7D] transition-colors">Our Tool</Link>
          <Link href="#domains" className="hover:text-[#D61B7D] transition-colors">Cognitive Map</Link>
          <Link href="#how" className="hover:text-[#D61B7D] transition-colors">How it Works</Link>
          <Link href="#community" className="hover:text-[#D61B7D] transition-colors">Community</Link>
        </div>
        <button className="yobe-btn yobe-btn-primary">Sign In</button>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen pt-40 pb-20 overflow-hidden flex flex-col items-center">
      {/* Wavy background decoration */}
      <div className="absolute top-0 left-0 right-0 h-[70vh] bg-[#D61B7D] z-[-1] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        <svg className="absolute bottom-0 left-0 w-full h-32 fill-[#FFF8F0]" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,218.7C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-6xl md:text-8xl leading-[0.9] mb-8 drop-shadow-lg">
            Light, Bold, <br />
            <span className="text-[#FFCB05]">Espirit Invento</span>
          </h1>
          <p className="text-xl font-medium mb-10 text-white/90 max-w-lg">
            Our AI analyzes memory, attention, and executive function to help you stay sharp and discover potential risks early.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="yobe-btn bg-white text-[#D61B7D] text-lg px-10 py-5">Start Screening</button>
            <button className="yobe-btn border-white bg-transparent text-white text-lg px-10 py-5">View Results</button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative h-[500px] flex items-center justify-center"
        >
          <div className="absolute w-[450px] h-[450px] bg-[#F58220] rounded-full blur-[80px] opacity-30 animate-pulse" />
          <img
            src="/hero-brain.png"
            alt="Vibrant Brain Analysis"
            className="w-full max-w-lg relative z-10 drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] rotate-3"
          />
        </motion.div>
      </div>
    </section>
  );
};

const DomainCard = ({ title, desc, icon: Icon, color }: any) => (
  <motion.div
    whileHover={{ y: -10, rotate: 1 }}
    className="organic-card shadow-lg bg-white group flex flex-col h-full"
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-8 text-white shadow-inner`} style={{ backgroundColor: color }}>
      <Icon size={32} />
    </div>
    <h3 className="text-3xl mb-4 text-[#3D2C2E] uppercase tracking-tighter leading-none">{title}</h3>
    <p className="text-[#3D2C2E]/70 text-sm leading-relaxed mb-8 flex-1">{desc}</p>
    <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-[#D61B7D] group-hover:gap-4 transition-all">
      Learn More <ArrowRight size={14} />
    </div>
    <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: color }} />
  </motion.div>
);

const DomainsSection = () => {
  const domains = [
    { title: "Memory", icon: Heart, desc: "Recalling words, recent events, and patterns to stay connected.", color: "#D61B7D" },
    { title: "Attention", icon: Sparkles, desc: "Focusing on what matters most in your daily life.", color: "#F58220" },
    { title: "Planning", icon: Smile, desc: "Designing your day and making healthy decisions with ease.", color: "#FFCB05" },
    { title: "Context", icon: Brain, desc: "Staying aware of time, place, and the beauty around you.", color: "#A1C45A" }
  ];

  return (
    <section id="domains" className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl mb-6">Our 4 Core Pillars</h2>
          <p className="text-xl text-[#3D2C2E]/60 max-w-2xl mx-auto">We look at the key pillars of brain health using advanced AI to keep your cognitive profile balanced with Espirit.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {domains.map((domain, i) => <DomainCard key={i} {...domain} />)}
        </div>
      </div>
    </section>
  );
};

const LifestyleSection = () => {
  return (
    <section className="bg-[#A1C45A] py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="rounded-[60px] overflow-hidden shadow-2xl rotate-[-2deg]"
        >
          <img
            src="/vibrant_health_lifestyle.png"
            alt="Healthy Elderly Lifestyle"
            className="w-full aspect-[4/5] object-cover"
          />
        </motion.div>

        <div className="text-white">
          <h2 className="text-6xl md:text-8xl leading-[0.9] mb-10">Bold Thinking for Better Living</h2>
          <p className="text-xl mb-12 opacity-90 leading-relaxed font-medium">
            At Espirit Invento, cognitive health isn't just a test—it's about living your life to the fullest. Our screenings provide peace of mind and actionable insights for a vibrant tomorrow.
          </p>
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div>
              <h4 className="text-4xl mb-2">500k+</h4>
              <p className="uppercase text-[10px] font-black tracking-widest opacity-80">Check-ups done</p>
            </div>
            <div>
              <h4 className="text-4xl mb-2">98%</h4>
              <p className="uppercase text-[10px] font-black tracking-widest opacity-80">High Satisfaction</p>
            </div>
          </div>
          <button className="yobe-btn bg-white text-[#A1C45A]">Our Community</button>
        </div>
      </div>

      {/* Abstract floating elements */}
      <div className="absolute top-10 right-20 w-40 h-40 bg-[#FFB84C] rounded-full blur-[80px] opacity-40" />
      <div className="absolute bottom-10 left-10 w-60 h-60 bg-white rounded-full blur-[100px] opacity-20" />
    </section>
  );
};

const StepsSection = () => {
  const steps = [
    { title: "Answer Cognitive Challenges", color: "#D61B7D" },
    { title: "AI Scans Your Response Patterns", color: "#F58220" },
    { title: "Get Your Cognitive Insights", color: "#FFCB05" }
  ];

  return (
    <section id="how" className="py-32 px-6 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl mb-20 text-center">3 Steps to Discovery</h2>
        <div className="grid md:grid-cols-3 gap-8 w-full">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group cursor-default">
              <div className="w-24 h-48 rounded-[60px] bg-white shadow-xl flex items-center justify-center mb-8 border-t-4 group-hover:scale-105 transition-transform"
                style={{ borderColor: step.color }}>
                <span className="text-4xl font-black italic" style={{ color: step.color }}>{i + 1}</span>
              </div>
              <h3 className="text-2xl uppercase tracking-tighter leading-none">{step.title}</h3>
            </div>
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
          <p className="text-white/50 max-w-sm mb-12">Keeping your cognitive health vibrant and bold. Modern AI screening with a human touch.</p>
          <div className="flex gap-6">
            <Instagram className="hover:text-[#D61B7D] cursor-pointer" />
            <Twitter className="hover:text-[#F58220] cursor-pointer" />
            <Linkedin className="hover:text-[#FFCB05] cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="font-black uppercase text-[10px] tracking-widest text-white/30 mb-8">Navigation</h4>
          <ul className="space-y-4 font-bold">
            <li><Link href="#">Tool</Link></li>
            <li><Link href="#">Results</Link></li>
            <li><Link href="#">Community</Link></li>
            <li><Link href="#">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-black uppercase text-[10px] tracking-widest text-white/30 mb-8">Legal</h4>
          <ul className="space-y-4 font-bold text-white/50">
            <li><Link href="#">Terms</Link></li>
            <li><Link href="#">Science</Link></li>
            <li><Link href="#">Contact</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 uppercase text-[9px] font-black tracking-[0.2em] text-white/20">
        <p>© 2024 Espirit Invento Labs. Not medical advice.</p>
        <p>Built for a Vibrant Tomorrow</p>
      </div>
    </div>
  </footer>
);

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  }, []);

  return (
    <main className="selection:bg-[#FFCB05] selection:text-[#3D2C2E]">
      <Navbar />
      <Hero />

      {/* Wavy Stripe section */}
      <div className="h-32 wavy-stripes rotate-[-1deg] relative z-10" />

      <DomainsSection />
      <LifestyleSection />
      <StepsSection />

      {/* Newsletter / CTA Section */}
      <section className="py-40 px-6 bg-[#D61B7D] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, white 2px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-6xl md:text-8xl leading-none mb-10 drop-shadow-xl font-heading">Ready for <br />Espirit Insight?</h2>
          <p className="text-2xl mb-12 opacity-90 max-w-2xl mx-auto font-medium">Join 500k+ people staying sharp with our cognitive screening tools.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input
              type="text"
              placeholder="YOUR EMAIL HERE"
              className="bg-white/10 border-2 border-white/20 rounded-full px-10 py-5 text-lg font-bold placeholder:text-white/50 focus:outline-none focus:bg-white/20 w-full max-w-md"
            />
            <button className="yobe-btn bg-white text-[#D61B7D] text-lg px-12 py-5">Subcribe</button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}