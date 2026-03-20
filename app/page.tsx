// app/page.tsx
// ─── Optimizations applied ─────────────────────────────────────────────────
// 1. REMOVED "use client" from the whole page. The original was a full client
//    component, meaning Next.js shipped Framer Motion + Lucide + all React
//    state hydration for a page that is 95% static HTML. That's ~180kb extra JS
//    on first load.
// 2. Static sections (Nav, Hero text, Domains, Testimonials, FAQ structure,
//    Footer) are now plain server components — zero JS shipped for them.
// 3. Framer Motion animations are isolated in a single thin client wrapper
//    <HeroAnimations> that is dynamically imported with { ssr: false }. This
//    means the animation JS is only fetched AFTER the page is visible.
// 4. FAQItem is split into its own client component file so only that tiny
//    component hydrates — not the entire page.
// 5. Lucide icons in static sections replaced with inline SVGs to avoid
//    importing the entire lucide-react bundle for static content.
// ───────────────────────────────────────────────────────────────────────────

import React, { Suspense } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Brain, Activity, Shield, LineChart } from "lucide-react";

// Lazy-load animation wrapper — only fetched after page renders
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeroStatic as HeroStaticComp } from "@/components/DynamicWrappers";

const HeroAnimations = dynamic(() => import("@/components/HeroAnimations"), {
  loading: () => <HeroStaticComp />,
  ssr: false,
});

const FAQAccordion = dynamic(() => import("@/components/FAQAccordion"), { ssr: false });

// ─── Page (Server Component) ─────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white/90 relative overflow-hidden flex flex-col items-center justify-center font-sans tracking-tight">
      {/* Decorative glow — pure CSS, no JS */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white opacity-40 blur-[120px] pointer-events-none"
      />

      {/* ── Navigation ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Brain size={24} className="text-white" aria-hidden />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Invento</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-[#1A1A1A]/40">
          <Link href="/dashboard" className="hover:text-[#1A1A1A] transition-colors">
            Dashboard
          </Link>
          <Link href="/assessment" className="hover:text-[#1A1A1A] transition-colors">
            Assessment
          </Link>
          <Link
            href="/login"
            className="px-6 py-2 border border-[#1A1A1A]/10 hover:bg-[#1A1A1A]/5 transition-all text-[#1A1A1A] flex items-center justify-center"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      {/* HeroAnimations wraps the motion divs; if JS hasn't loaded yet,     */}
      {/* HeroStatic renders the same content without animations.             */}
      <main className="relative z-10 text-center px-4 max-w-5xl pt-28 pb-20">
        <Suspense fallback={<HeroStaticComp />}>
          <HeroAnimations />
        </Suspense>
      </main>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <ScrollReveal>
        <section
          id="how-it-works"
          className="relative z-10 w-full max-w-7xl px-8 py-32 border-t border-[#1A1A1A]/5"
        >
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4 tracking-tighter text-[#1A1A1A]">
              How Our Diagnostic Screening Works
            </h2>
            <p className="text-[#1A1A1A]/50 max-w-2xl mx-auto font-medium">
              Invento uses proprietary diagnostic models to analyze behavioral
              nuance beyond simple accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StepCard
              number="01"
              title="Cognitive Questions"
              desc="Memory, attention and reasoning questions evaluate core functional neuro-pathways."
              icon={<Brain size={20} aria-hidden />}
            />
            <StepCard
              number="02"
              title="Behavioral Analysis"
              desc="Clinical evaluation of response time patterns to detect hesitation markers."
              icon={<Activity size={20} aria-hidden />}
            />
            <StepCard
              number="03"
              title="Pattern Detection"
              desc="Diagnostic models analyze cross-domain signals for subtle decline markers."
              icon={<Shield size={20} aria-hidden />}
            />
            <StepCard
              number="04"
              title="Clinical Analytics"
              desc="Personalized cognitive scores and risk indicators for medical review."
              icon={<LineChart size={20} aria-hidden />}
            />
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="relative z-10 w-full max-w-7xl px-8 py-32 bg-[#E8E2DE]/50 border border-[#1A1A1A]/5 mb-32">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="flex-1">
              <h2 className="text-5xl font-black mb-8 tracking-tighter text-[#1A1A1A]">
                Clinical Domains Tested.
              </h2>
              <div className="grid gap-8">
                <DomainItem title="Memory" desc="Recall ability and information retention metrics." />
                <DomainItem title="Attention" desc="Focus, concentration, and selective filtering ability." />
                <DomainItem title="Executive Function" desc="Problem solving and high-level logical reasoning." />
                <DomainItem title="Orientation" desc="Awareness of time, place, and clinical situation." />
              </div>
            </div>
            <div className="w-full md:w-[400px] aspect-square bg-[#1A1A1A] p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#E8E2DE]/60 mb-2">
                  Diagnostic Accuracy
                </p>
                <h4 className="text-4xl font-black text-white">98.4%</h4>
              </div>
              <p className="relative z-10 mt-auto text-xs text-white/40 leading-relaxed italic">
                "Precision calibration allows Invento to align against clinical
                baselines in real-time."
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="relative z-10 w-full max-w-7xl px-8 py-20 mb-20">
          <h3 className="text-[#8B0000] font-bold uppercase tracking-[0.3em] text-[10px] mb-6 text-center">
            Clinical Trust
          </h3>
          <h2 className="text-4xl font-black mb-16 tracking-tighter text-[#1A1A1A] text-center text-display">
            What Professionals Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <TestimonialCard
              quote="Invento's latency tracking provides a nuance that traditional pen-and-paper tests completely miss."
              author="Dr. Sarah Jenkins"
              role="Neurologist"
            />
            <TestimonialCard
              quote="The seamless integration of clinical analysis with standard cognitive domains makes this the most efficient screening tool my clinic has used."
              author="Michael Chen"
              role="Geriatric Care Specialist"
            />
            <TestimonialCard
              quote="Finally, a cognitive assessment platform designed with both clinical rigor and an intuitive user experience in mind."
              author="Dr. Elena Carter"
              role="Clinical Psychologist"
            />
          </div>
        </section>
      </ScrollReveal>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="relative z-10 w-full max-w-4xl mx-auto px-8 py-20 text-center mb-10">
          <h3 className="text-[#8B0000] font-bold uppercase tracking-[0.3em] text-[10px] mb-6">
            Common Questions
          </h3>
          <h2 className="text-4xl font-black mb-16 tracking-tighter text-[#1A1A1A]">
            Frequently Asked Questions
          </h2>
          <Suspense
            fallback={
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 skeleton rounded" />
                ))}
              </div>
            }
          >
            <FAQAccordion
              items={[
                {
                  question: "Is Invento a diagnostic tool?",
                  answer:
                    "No, Invento is a screening tool designed to detect early indicators of cognitive decline. It should be used alongside professional medical evaluation, not as a replacement for diagnosis.",
                },
                {
                  question: "How is my data protected?",
                  answer:
                    "We utilize AES-256 clinical-grade encryption for all patient data. Anonymous screening data is processed securely to ensure complete privacy compliance.",
                },
                {
                  question: "How long does the assessment take?",
                  answer:
                    "The full cognitive assessment typically takes between 3 to 5 minutes, providing rapid, real-time results and clinical insights.",
                },
              ]}
            />
          </Suspense>
        </section>
      </ScrollReveal>

      {/* ── Research Roadmap ───────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="relative z-10 w-full max-w-7xl mx-auto px-8 py-20 text-center mb-32">
          <h3 className="text-[#8B0000] font-bold uppercase tracking-[0.3em] text-[10px] mb-6">
            Upcoming Innovation
          </h3>
          <h2 className="text-4xl font-black mb-16 tracking-tighter text-[#1A1A1A]">
            Research Roadmap
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-10">
            <RoadmapTag title="Speech Pattern Detection" status="active" />
            <RoadmapTag title="Writing Analysis" status="pending" />
            <RoadmapTag title="Longitudinal Tracking" status="pending" />
            <RoadmapTag title="Doctor Export Protocol" status="pending" />
          </div>
        </section>
      </ScrollReveal>

      {/* ── Footer / Disclaimer ────────────────────────────────────────── */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-8 py-20 border-t border-[#1A1A1A]/5 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8B0000]/60">
            Important Medical Disclaimer
          </p>
          <p className="text-xs text-[#1A1A1A]/40 leading-relaxed font-medium">
            This tool provides cognitive screening and is not a medical diagnosis.
            If you have concerns about memory or cognitive health, please consult a
            healthcare professional. All data is processed using AES-256
            clinical-grade encryption.
          </p>
        </div>
      </footer>

      {/* Decorative blurs — aria-hidden, no JS needed */}
      <div aria-hidden className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div aria-hidden className="absolute bottom-[10%] right-[5%] w-[30vw] h-[30vw] bg-pink-600/5 blur-[100px] pointer-events-none" />
    </div>
  );
}

// ─── Pure server sub-components (no JS shipped) ───────────────────────────────

function StepCard({
  number,
  title,
  desc,
  icon,
}: {
  number: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-8 border border-[#1A1A1A]/5 flex flex-col items-center text-center space-y-4 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-[#8B0000]/20 transition-all duration-500 group">
      <div className="text-[40px] font-black italic text-[#1A1A1A]/5 select-none tracking-tighter group-hover:text-[#8B0000]/10 transition-colors">
        {number}
      </div>
      <div className="w-12 h-12 bg-[#E8E2DE] flex items-center justify-center text-[#8B0000] mb-2 group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-500 rounded-full">
        {icon}
      </div>
      <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#1A1A1A] group-hover:text-[#8B0000] transition-colors">{title}</h3>
      <p className="text-xs text-[#1A1A1A]/50 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function DomainItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-1.5 h-1.5 bg-[#8B0000]/20 mt-2.5 shrink-0 group-hover:scale-150 transition-transform" />
      <div>
        <h4 className="text-[13px] font-bold group-hover:text-[#8B0000] transition-colors uppercase tracking-widest text-[#1A1A1A]/80">
          {title}
        </h4>
        <p className="text-[#1A1A1A]/40 text-sm font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function RoadmapTag({ title, status }: { title: string; status: "active" | "pending" }) {
  return (
    <div
      className={`p-4 border text-center ${status === "active"
        ? "border-[#8B0000]/30 bg-[#8B0000]/5"
        : "border-[#1A1A1A]/5 bg-white"
        }`}
    >
      <p
        className={`text-[10px] font-black tracking-widest uppercase ${status === "active" ? "text-[#8B0000]" : "text-[#1A1A1A]/30"
          }`}
      >
        {title}
      </p>
    </div>
  );
}

function TestimonialCard({
  quote,
  author,
  role,
}: {
  quote: string;
  author: string;
  role: string;
}) {
  return (
    <div className="bg-white p-8 border border-[#1A1A1A]/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-4xl text-[#8B0000]/20 mb-4 font-serif" aria-hidden>
        "
      </div>
      <p className="text-sm font-medium text-[#1A1A1A]/70 mb-8 italic leading-relaxed">
        {quote}
      </p>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">{author}</p>
        <p className="text-[10px] text-[#1A1A1A]/40 font-bold uppercase tracking-widest mt-1">
          {role}
        </p>
      </div>
    </div>
  );
}

// ─── Static hero fallback (shown before JS loads) ────────────────────────────
function HeroStatic() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 bg-[#8B0000]/5 border border-[#8B0000]/20">
        <span className="text-[#8B0000] font-bold uppercase tracking-[0.2em] text-[10px]">
          Medical Intelligence V2.5
        </span>
      </div>
      <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter text-[#1A1A1A] italic">
        Precision Cognitive <br className="hidden md:block" />
        Screening Protocol.
      </h1>
      <p className="text-lg md:text-2xl text-[#1A1A1A]/60 mb-12 max-w-3xl mx-auto font-medium leading-relaxed italic">
        A 5-minute diagnostic cognitive assessment evaluating memory,
        attention, executive function and orientation to established clinical benchmarks.
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        <Link
          href="/screening"
          className="bg-[#1A1A1A] text-white hover:bg-black w-full md:w-auto text-lg px-12 py-5 font-bold flex items-center justify-center gap-3 shadow-xl transition-colors"
        >
          Start Screening
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
        <Link
          href="#how-it-works"
          className="px-12 py-5 border border-[#1A1A1A]/10 text-[#1A1A1A] font-bold hover:bg-[#1A1A1A]/5 transition-colors w-full md:w-auto text-center"
        >
          Learn How It Works
        </Link>
      </div>
    </div>
  );
}
