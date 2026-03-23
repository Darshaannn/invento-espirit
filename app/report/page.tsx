// app/report/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// CLINICAL REPORT PAGE
// Displays results mapped to real clinical scales:
// MoCA, MMSE, ACE-III, Mini-Cog, SAGE + Gemini AI insights
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Brain, AlertTriangle, CheckCircle2, Clock,
  Download, ArrowLeft, RefreshCw, Info,
  ChevronDown, ChevronUp, Activity,
} from "lucide-react";
import type { ClinicalScores } from "@/lib/utils/clinicalScoring";
import type { GeminiOutput } from "@/lib/services/gemini";
import { IMPAIRMENT_CONTEXT, SCALE_REFERENCE } from "@/lib/utils/clinicalScoring";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReportData {
  clinicalScores: ClinicalScores;
  geminiInsights: GeminiOutput;
  completedAt: string;
  totalTimeSec: number;
  ageGroup: string;
  symptoms: string[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function ScaleBar({
  label, value, max, normalThreshold, small,
}: {
  label: string; value: number; max: number;
  normalThreshold: number; small?: boolean;
}) {
  const pct = Math.round((value / max) * 100);
  const normPct = Math.round((normalThreshold / max) * 100);
  const isNormal = value >= normalThreshold;
  const color = isNormal ? "#16a34a" : value >= normalThreshold * 0.7 ? "#d97706" : "#dc2626";

  return (
    <div className={small ? "space-y-1" : "space-y-2"}>
      <div className="flex items-center justify-between">
        <span className={`font-bold text-[#1A1A1A] uppercase tracking-widest ${small ? "text-[10px]" : "text-xs"}`}>
          {label}
        </span>
        <span className={`font-black ${small ? "text-sm" : "text-base"}`} style={{ color }}>
          {value}<span className="text-[#1A1A1A]/30 font-normal">/{max}</span>
        </span>
      </div>
      <div className="relative h-2 bg-[#E8E2DE] rounded-none overflow-hidden">
        {/* Normal threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-[#1A1A1A]/20 z-10"
          style={{ left: `${normPct}%` }}
          title={`Normal threshold: ${normalThreshold}`}
        />
        {/* Score bar */}
        <div
          className="absolute top-0 left-0 bottom-0 transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-bold text-[#1A1A1A]/30 uppercase tracking-widest">
        <span>0</span>
        <span>Normal ≥{normalThreshold}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function DomainRing({ domain, score, flagged }: {
  domain: string; score: number; flagged: boolean;
}) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = flagged ? (score < 50 ? "#dc2626" : "#d97706") : "#16a34a";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r={r} fill="none" stroke="#E8E2DE" strokeWidth="6" />
          <circle
            cx="44" cy="44" r={r} fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="butt"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-black text-[#1A1A1A]">{score}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/60">
          {domain}
        </p>
        {flagged && (
          <p className="text-[9px] font-bold uppercase tracking-wider text-amber-600 mt-0.5">
            ⚠ Flagged
          </p>
        )}
      </div>
    </div>
  );
}

function UrgencyBadge({ level }: { level: GeminiOutput["urgencyLevel"] }) {
  const config = {
    routine: { label: "Routine Follow-up", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    soon: { label: "Consult Soon", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    prompt: { label: "Prompt Referral", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    urgent: { label: "Urgent Evaluation", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  }[level];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 border text-[11px] font-black uppercase tracking-widest ${config.bg} ${config.text} ${config.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {config.label}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ReportPage() {
  const router = useRouter();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>("findings");

  useEffect(() => {
    async function load() {
      try {
        // Logged-in: fetch from API
        const res = await fetch("/api/assessments/latest");
        if (res.ok) {
          const d = await res.json();
          setData(d);
        } else {
          // Guest: read from localStorage
          const stored = localStorage.getItem("invento_last_result");
          if (stored) setData(JSON.parse(stored));
          else router.push("/screening");
        }
      } catch {
        const stored = localStorage.getItem("invento_last_result");
        if (stored) setData(JSON.parse(stored));
        else setError("Could not load results. Please retake the assessment.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const handleExport = useCallback(async () => {
    const { exportReportToPDF } = await import("@/lib/utils/export");
    await exportReportToPDF("report-content", "invento-clinical-report.pdf");
  }, []);

  const toggle = (section: string) =>
    setExpandedSection(prev => prev === section ? null : section);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-[#8B0000]/20 border-t-[#8B0000] rounded-full animate-spin" />
          <div className="text-center">
            <p className="font-black text-sm uppercase tracking-widest text-[#1A1A1A]">
              Generating Clinical Report
            </p>
            <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest mt-1">
              Calculating scale equivalents · Running AI analysis
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F5F1EE] flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-6">
          <AlertTriangle className="mx-auto text-[#8B0000]" size={40} />
          <p className="font-black uppercase tracking-widest text-[#1A1A1A]">
            {error ?? "No results found"}
          </p>
          <Link
            href="/screening"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#8B0000] transition-colors"
          >
            <RefreshCw size={14} /> Retake Assessment
          </Link>
        </div>
      </div>
    );
  }

  // Provide a fallback for GeminiInsights in case it's missing or null
  const ai = data.geminiInsights || {
    urgencyLevel: "routine" as const,
    domainInsights: {
      Memory: "Awaiting analysis.",
      Attention: "Awaiting analysis.",
      "Executive Function": "Awaiting analysis.",
      Orientation: "Awaiting analysis."
    },
    clinicalSummary: "Clinical summary is not available at this time.",
    screeningContext: "",
    keyFindings: [],
    recommendations: ["Review scores with a healthcare provider."],
    followUpAdvised: false
  };

  const cs = data.clinicalScores;
  const impCtx = IMPAIRMENT_CONTEXT[cs.impairment];
  const flaggedCount = Object.values(cs.domainFlags).filter(Boolean).length;

  // ── Full Report ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F1EE]">
      {/* ── Sticky header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-[#1A1A1A]/5 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-[#F5F1EE] rounded transition-colors"
            >
              <ArrowLeft size={18} className="text-[#1A1A1A]/60" />
            </Link>
            <div>
              <h1 className="font-black text-sm uppercase tracking-widest text-[#1A1A1A]">
                Clinical Report
              </h1>
              <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-widest">
                {new Date(data.completedAt).toLocaleDateString("en-IN", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
                {" · "}{formatTime(data.totalTimeSec)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UrgencyBadge level={ai.urgencyLevel} />
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white text-[11px] font-black uppercase tracking-widest hover:bg-[#8B0000] transition-colors"
            >
              <Download size={13} /> Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* ── Report content (PDF target) ─────────────────────────────────── */}
      <div id="report-content" className="max-w-5xl mx-auto px-6 py-10 space-y-8">

        {/* ── 1. IMPAIRMENT STATUS CARD ────────────────────────────────── */}
        <section
          className="p-8 border"
          style={{
            background: impCtx.bgColor,
            borderColor: impCtx.borderColor,
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1A1A]/40 mb-2">
                Clinical Classification
              </p>
              <h2
                className="text-3xl font-black tracking-tight mb-3"
                style={{ color: impCtx.color }}
              >
                {impCtx.label}
              </h2>
              <p className="text-sm font-medium text-[#1A1A1A]/70 leading-relaxed max-w-xl">
                {impCtx.description}
              </p>
            </div>
            <div className="shrink-0 text-center space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40">
                MoCA Equivalent
              </p>
              <div
                className="text-6xl font-black"
                style={{ color: impCtx.color }}
              >
                {cs.moca}
                <span className="text-2xl text-[#1A1A1A]/20">/30</span>
              </div>
              <p className="text-[10px] font-bold text-[#1A1A1A]/40">
                Normal ≥ 26
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. CLINICAL SCALE EQUIVALENTS ───────────────────────────── */}
        <section className="bg-white border border-[#1A1A1A]/5 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B0000]/70 mb-1">
                Standard Clinical Scales
              </p>
              <h3 className="text-xl font-black tracking-tight text-[#1A1A1A]">
                How Your Scores Compare
              </h3>
            </div>
            <button
              onClick={() => toggle("scales")}
              className="p-2 hover:bg-[#F5F1EE] rounded transition-colors"
              aria-expanded={expandedSection === "scales"}
            >
              {expandedSection === "scales"
                ? <ChevronUp size={18} className="text-[#1A1A1A]/40" />
                : <ChevronDown size={18} className="text-[#1A1A1A]/40" />
              }
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <ScaleBar
              label={`${SCALE_REFERENCE.moca.label} — ${SCALE_REFERENCE.moca.full}`}
              value={cs.moca} max={30} normalThreshold={26}
            />
            <ScaleBar
              label={`${SCALE_REFERENCE.mmse.label} — ${SCALE_REFERENCE.mmse.full}`}
              value={cs.mmse} max={30} normalThreshold={24}
            />
            <ScaleBar
              label={`${SCALE_REFERENCE.aceIII.label} — ${SCALE_REFERENCE.aceIII.full}`}
              value={cs.aceIII} max={100} normalThreshold={88}
            />
            <ScaleBar
              label={`${SCALE_REFERENCE.sage.label} — ${SCALE_REFERENCE.sage.full}`}
              value={cs.sage} max={22} normalThreshold={17}
            />
          </div>

          {/* Mini-Cog separate — dot scale */}
          <div className="mt-6 pt-6 border-t border-[#1A1A1A]/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]/60 mb-1">
                  Mini-Cog — 3-Minute Screen
                </p>
                <p className="text-[10px] text-[#1A1A1A]/40 font-medium">
                  Memory recall (0–3) + Clock drawing (0–2) · Normal ≥ 3
                </p>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-5 h-5 border-2 flex items-center justify-center"
                    style={{
                      borderColor: i < cs.miniCog ? impCtx.color : "#E8E2DE",
                      background: i < cs.miniCog ? impCtx.color : "transparent",
                    }}
                  >
                    {i < cs.miniCog && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                ))}
                <span className="ml-2 font-black text-base" style={{ color: impCtx.color }}>
                  {cs.miniCog}/5
                </span>
              </div>
            </div>
          </div>

          {/* Scale context note */}
          {expandedSection === "scales" && (
            <div className="mt-6 p-4 bg-[#F5F1EE] border border-[#1A1A1A]/5 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40 flex items-center gap-2">
                <Info size={12} /> About These Scales
              </p>
              <ul className="space-y-1.5 text-[11px] font-medium text-[#1A1A1A]/60 leading-relaxed">
                <li><strong>MoCA:</strong> Gold standard for detecting MCI. 90% sensitivity vs MMSE's 18–25%. Normal ≥26; scores add 1pt for &lt;12 years education.</li>
                <li><strong>MMSE:</strong> Most widely used globally. 30 questions, 5–10 min. Normal ≥24; declines 2–4pts/year in Alzheimer's.</li>
                <li><strong>ACE-III:</strong> 100-point scale. Highly sensitive for distinguishing early dementia from normal aging. Normal ≥88.</li>
                <li><strong>Mini-Cog:</strong> 3-minute screen. 76–99% sensitivity. Combines word recall with clock-drawing task.</li>
                <li><strong>SAGE:</strong> Self-administered. Detects MCI up to 6 months earlier than MMSE. Normal ≥17/22.</li>
              </ul>
              <p className="text-[10px] text-[#1A1A1A]/40 font-medium mt-2">
                These are estimated equivalents derived from your performance. Only a licensed clinician administering the full tests can produce validated scores.
              </p>
            </div>
          )}
        </section>

        {/* ── 3. DOMAIN BREAKDOWN ──────────────────────────────────────── */}
        <section className="bg-white border border-[#1A1A1A]/5 p-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B0000]/70 mb-1">
            Cognitive Domains
          </p>
          <h3 className="text-xl font-black tracking-tight text-[#1A1A1A] mb-6">
            Domain Performance
            {flaggedCount > 0 && (
              <span className="ml-3 text-sm font-bold text-amber-600">
                {flaggedCount} domain{flaggedCount > 1 ? "s" : ""} flagged
              </span>
            )}
          </h3>

          {/* Rings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {(["Memory", "Attention", "Executive Function", "Orientation"] as const).map(domain => (
              <DomainRing
                key={domain}
                domain={domain}
                score={cs.domainScores[domain]}
                flagged={cs.domainFlags[domain]}
              />
            ))}
          </div>

          {/* Domain insights from Gemini */}
          <div className="space-y-4">
            {(["Memory", "Attention", "Executive Function", "Orientation"] as const).map(domain => (
              <div
                key={domain}
                className={`p-4 border-l-4 ${cs.domainFlags[domain] ? "border-amber-400 bg-amber-50" : "border-[#E8E2DE] bg-[#F5F1EE]/50"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/50 mb-1">
                      {domain}
                    </p>
                    <p className="text-sm font-medium text-[#1A1A1A]/70 leading-relaxed">
                      {ai.domainInsights[domain]}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-2xl font-black text-[#1A1A1A]">
                      {cs.domainScores[domain]}
                    </span>
                    <span className="text-sm text-[#1A1A1A]/30">/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. AI CLINICAL SUMMARY ───────────────────────────────────── */}
        <section className="bg-[#1A1A1A] border border-[#1A1A1A] p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 bg-[#8B0000] flex items-center justify-center shrink-0">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F5F1EE]/40 mb-1">
                Gemini AI Clinical Analysis
              </p>
              <h3 className="text-xl font-black tracking-tight text-white">
                Clinical Summary
              </h3>
            </div>
          </div>
          <p className="text-sm font-medium text-[#F5F1EE]/80 leading-relaxed mb-6">
            {ai.clinicalSummary}
          </p>
          <div className="p-4 bg-white/5 border border-white/10">
            <p className="text-[10px] text-[#F5F1EE]/50 font-medium italic leading-relaxed">
              {ai.screeningContext}
            </p>
          </div>
        </section>

        {/* ── 5. KEY FINDINGS ──────────────────────────────────────────── */}
        <section className="bg-white border border-[#1A1A1A]/5 p-8">
          <button
            onClick={() => toggle("findings")}
            className="w-full flex items-center justify-between mb-6"
            aria-expanded={expandedSection === "findings"}
          >
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B0000]/70 mb-1">
                Assessment Results
              </p>
              <h3 className="text-xl font-black tracking-tight text-[#1A1A1A]">
                Key Findings
              </h3>
            </div>
            {expandedSection === "findings"
              ? <ChevronUp size={18} className="text-[#1A1A1A]/40" />
              : <ChevronDown size={18} className="text-[#1A1A1A]/40" />
            }
          </button>

          {(expandedSection === "findings" || true) && (
            <ul className="space-y-3">
              {ai.keyFindings.map((finding, i) => (
                <li key={i} className="flex items-start gap-4 p-4 bg-[#F5F1EE]">
                  <span className="text-[10px] font-black text-[#8B0000] w-5 shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-medium text-[#1A1A1A]/70 leading-relaxed">
                    {finding}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── 6. RECOMMENDATIONS ───────────────────────────────────────── */}
        <section
          className="p-8 border"
          style={{ borderColor: impCtx.borderColor, background: impCtx.bgColor }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-1"
            style={{ color: impCtx.color }}>
            Next Steps
          </p>
          <h3 className="text-xl font-black tracking-tight text-[#1A1A1A] mb-6">
            {ai.followUpAdvised ? "Clinical Recommendations" : "Recommendations"}
          </h3>
          <ul className="space-y-4">
            {ai.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-4">
                <div
                  className="w-6 h-6 shrink-0 flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: impCtx.color }}
                >
                  {i + 1}
                </div>
                <p className="text-sm font-medium text-[#1A1A1A]/80 leading-relaxed pt-0.5">
                  {rec}
                </p>
              </li>
            ))}
          </ul>

          {ai.followUpAdvised && (
            <div className="mt-6 pt-6 border-t" style={{ borderColor: impCtx.borderColor }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: impCtx.color }} />
                <p className="text-[11px] font-black uppercase tracking-widest"
                  style={{ color: impCtx.color }}>
                  Professional consultation is advised based on these results
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── 7. MEDICAL DISCLAIMER ────────────────────────────────────── */}
        <section className="p-6 border border-[#1A1A1A]/5 bg-white">
          <div className="flex items-start gap-3">
            <Info size={14} className="text-[#1A1A1A]/30 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#8B0000]/60">
                Important Medical Disclaimer
              </p>
              <p className="text-[11px] font-medium text-[#1A1A1A]/50 leading-relaxed">
                This report presents estimated equivalents to standard clinical screening tools (MoCA, MMSE, ACE-III, Mini-Cog, SAGE) based on performance in this assessment. It is <strong>not a clinical diagnosis</strong> and should not replace evaluation by a qualified neurologist, geriatrician, or cognitive specialist. Scores may be affected by education level, language proficiency, fatigue, anxiety, and cultural background. Cognitive screening tools are designed to identify individuals who may benefit from further evaluation — not to provide a definitive diagnosis of any condition.
              </p>
              <p className="text-[11px] font-medium text-[#1A1A1A]/40 leading-relaxed">
                If you have concerns about cognitive health, please consult a licensed healthcare professional. For urgent concerns, contact your physician immediately.
              </p>
            </div>
          </div>
        </section>

        {/* ── 8. ACTION BUTTONS ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-center gap-4 pb-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#8B0000] transition-colors w-full md:w-auto justify-center"
          >
            <Activity size={16} /> View Dashboard
          </Link>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-8 py-4 border border-[#1A1A1A]/10 text-[#1A1A1A] font-bold text-sm uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-colors w-full md:w-auto justify-center"
          >
            <Download size={16} /> Download PDF
          </button>
          <Link
            href="/screening"
            className="flex items-center gap-2 px-8 py-4 border border-[#1A1A1A]/10 text-[#1A1A1A] font-bold text-sm uppercase tracking-widest hover:bg-[#1A1A1A]/5 transition-colors w-full md:w-auto justify-center"
          >
            <RefreshCw size={16} /> Retake Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
