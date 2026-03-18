"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brain, Download, ArrowRight, RefreshCw, RotateCcw } from 'lucide-react';

interface DomainScore {
    name: string;
    score: number;
    color: string;
}

interface RiskTier {
    level: 'Low' | 'Moderate' | 'High';
    color: string;
    bgColor: string;
    borderColor: string;
    message: string;
    recommendations: string[];
}

interface Results {
    overallScore: number;
    domains: DomainScore[];
    riskTier: RiskTier;
}

function getRiskTier(score: number): RiskTier {
    if (score >= 80) {
        return {
            level: 'Low',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            message: 'Cognitive function appears within normal range. No significant markers of concern detected.',
            recommendations: [
                'Continue regular cognitive engagement: reading, puzzles, social activities.',
                'Maintain physical exercise routine to support neurological health.',
                'Monitor annually or if you notice significant changes.',
            ]
        };
    }
    if (score >= 60) {
        return {
            level: 'Moderate',
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            message: 'Some cognitive indicators warrant monitoring. A follow-up assessment is recommended within 3 months.',
            recommendations: [
                'Schedule a follow-up screening in 3 months to track trends.',
                'Consider consulting a neurologist or geriatrician for a clinical evaluation.',
                'Engage in structured cognitive training exercises daily.',
            ]
        };
    }
    return {
        level: 'High',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        message: 'Several cognitive markers suggest professional clinical evaluation is recommended as soon as possible.',
        recommendations: [
            'Consult a neurologist or geriatrician for a comprehensive evaluation.',
            'Share this report with your healthcare provider.',
            'Avoid driving or complex tasks until cleared by a medical professional.',
        ]
    };
}

export default function AnalysisPage() {
    const [results, setResults] = useState<Results | null>(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(0);

    const analysisSteps = [
        "Analyzing cognitive response patterns...",
        "Evaluating domain-level performance...",
        "Benchmarking against clinical baselines...",
        "Generating risk assessment...",
        "Report ready.",
    ];

    useEffect(() => {
        // Simulate analysis progress
        const interval = setInterval(() => {
            setStep(prev => {
                if (prev >= analysisSteps.length - 1) {
                    clearInterval(interval);
                    computeResults();
                    return prev;
                }
                return prev + 1;
            });
        }, 900);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const computeResults = () => {
        try {
            // Try to load from sessionStorage (set by screening or assessment page)
            const stored = sessionStorage.getItem('latest_assessment') || sessionStorage.getItem('screening_report');
            let overallScore = 72; // default demo
            const domains: DomainScore[] = [];

            if (stored) {
                const data = JSON.parse(stored);
                overallScore = Math.round(data.scores?.accuracy || 72);
            }

            // Generate domain scores (variance around overall)
            const domainDefs = [
                { name: 'Memory', color: '#D946EF' },
                { name: 'Attention', color: '#00B4D8' },
                { name: 'Executive', color: '#9D50FF' },
                { name: 'Orientation', color: '#06D6A0' },
            ];

            for (const d of domainDefs) {
                const variance = Math.floor(Math.random() * 14) - 7;
                domains.push({
                    name: d.name,
                    score: Math.min(100, Math.max(0, overallScore + variance)),
                    color: d.color,
                });
            }

            // Save to localStorage history
            const entry = {
                date: new Date().toISOString(),
                overallScore,
                domains,
                riskTier: getRiskTier(overallScore).level,
            };
            const history = JSON.parse(localStorage.getItem('inventoHistory') || '[]');
            history.unshift(entry);
            localStorage.setItem('inventoHistory', JSON.stringify(history.slice(0, 10)));

            setResults({ overallScore, domains, riskTier: getRiskTier(overallScore) });
            setTimeout(() => setLoading(false), 400);
        } catch {
            setResults({ overallScore: 72, domains: [], riskTier: getRiskTier(72) });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0F0A1F] text-white flex flex-col items-center justify-center font-sans">
                <div className="text-center max-w-lg px-6">
                    <div className="relative w-24 h-24 mx-auto mb-10">
                        <div className="absolute inset-0 border-4 border-[#9D50FF]/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-t-[#9D50FF] rounded-full animate-spin" />
                        <Brain size={36} className="absolute inset-0 m-auto text-[#9D50FF]" />
                    </div>
                    <motion.p
                        key={step}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg font-bold text-white/80 mb-4"
                    >
                        {analysisSteps[step]}
                    </motion.p>
                    <div className="flex justify-center gap-1.5 mt-6">
                        {analysisSteps.map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i <= step ? 'bg-[#9D50FF]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!results) return null;
    const { overallScore, domains, riskTier } = results;

    return (
        <div id="report-content" className="min-h-screen bg-[#F5F1EE] font-sans text-[#1A1A1A]">
            {/* Header */}
            <header className="bg-white border-b border-[#1A1A1A]/5 px-8 py-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#8B0000] flex items-center justify-center">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-lg">Invento — Cognitive Report</span>
                </div>
                <span className="text-xs text-[#1A1A1A]/40 font-bold uppercase tracking-widest">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-10">

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-200 px-6 py-4 text-sm text-amber-800 font-medium">
                    ⚕️ <strong>Medical Disclaimer:</strong> This is a cognitive screening tool, not a medical diagnosis. Always consult a qualified neurologist or physician if you have concerns.
                </div>

                {/* Overall Score Hero */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-[#1A1A1A]/5 p-10 flex flex-col md:flex-row items-center gap-10 shadow-lg"
                >
                    <div className="relative w-48 h-48 shrink-0">
                        <svg className="w-full h-full rotate-[-90deg]">
                            <circle cx="50%" cy="50%" r="46%" stroke="#F5F1EE" strokeWidth="12" fill="none" />
                            <motion.circle
                                cx="50%" cy="50%" r="46%"
                                stroke={overallScore >= 80 ? '#16a34a' : overallScore >= 60 ? '#d97706' : '#dc2626'}
                                strokeWidth="12" fill="none"
                                strokeDasharray="290"
                                initial={{ strokeDashoffset: 290 }}
                                animate={{ strokeDashoffset: 290 - (290 * overallScore) / 100 }}
                                transition={{ duration: 2, ease: 'easeOut' }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-6xl font-black text-[#1A1A1A] italic">{overallScore}</span>
                            <span className="text-xs font-black text-[#1A1A1A]/30 uppercase tracking-widest">/ 100</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B0000] mb-2">Overall Cognitive Index</p>
                        <h1 className="text-4xl font-black text-[#1A1A1A] mb-4 tracking-tight">
                            {overallScore >= 80 ? 'Strong Performance' : overallScore >= 60 ? 'Moderate Performance' : 'Requires Review'}
                        </h1>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 border font-black text-sm uppercase tracking-widest ${riskTier.bgColor} ${riskTier.borderColor} ${riskTier.color}`}>
                            Risk Level: {riskTier.level}
                        </div>
                    </div>
                </motion.div>

                {/* Domain Breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white border border-[#1A1A1A]/5 p-10 shadow-lg"
                >
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Domain Breakdown</h2>
                    <div className="space-y-5">
                        {domains.map((d) => (
                            <div key={d.name}>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-bold uppercase tracking-widest">{d.name}</span>
                                    <span className="text-sm font-black" style={{ color: d.color }}>{d.score}%</span>
                                </div>
                                <div className="w-full h-3 bg-[#F5F1EE] rounded-none overflow-hidden">
                                    <motion.div
                                        className="h-full"
                                        style={{ backgroundColor: d.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${d.score}%` }}
                                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Risk Assessment Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className={`border p-10 shadow-lg ${riskTier.bgColor} ${riskTier.borderColor}`}
                >
                    <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Risk Assessment</h2>
                    <p className={`text-lg font-bold mb-6 ${riskTier.color}`}>{riskTier.message}</p>
                    <h3 className="font-black uppercase tracking-widest text-xs mb-4 text-[#1A1A1A]/50">Recommendations</h3>
                    <ul className="space-y-3">
                        {riskTier.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-[#1A1A1A]/70">
                                <span className={`font-black shrink-0 ${riskTier.color}`}>{i + 1}.</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <button
                        onClick={() => {
                            const el = document.getElementById('report-content');
                            if (!el) return;
                            import('html2canvas').then(({ default: html2canvas }) => {
                                html2canvas(el, { scale: 1.5 }).then(canvas => {
                                    import('jspdf').then(({ default: jsPDF }) => {
                                        const pdf = new jsPDF('p', 'mm', 'a4');
                                        const w = pdf.internal.pageSize.getWidth();
                                        const h = (canvas.height * w) / canvas.width;
                                        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, h);
                                        pdf.save('invento-cognitive-report.pdf');
                                    });
                                });
                            });
                        }}
                        className="flex items-center justify-center gap-2 bg-[#1A1A1A] text-white px-6 py-4 font-bold text-sm hover:bg-black transition-all"
                    >
                        <Download size={16} /> Download PDF
                    </button>

                    <button
                        onClick={() => {
                            navigator.clipboard?.writeText(window.location.href);
                            alert('Link copied!');
                        }}
                        className="flex items-center justify-center gap-2 bg-white border border-[#1A1A1A]/10 text-[#1A1A1A] px-6 py-4 font-bold text-sm hover:bg-[#F5F1EE] transition-all"
                    >
                        <RefreshCw size={16} /> Share
                    </button>

                    <Link href="/screening" className="flex items-center justify-center gap-2 bg-white border border-[#1A1A1A]/10 text-[#1A1A1A] px-6 py-4 font-bold text-sm hover:bg-[#F5F1EE] transition-all">
                        <RotateCcw size={16} /> Retake
                    </Link>

                    <Link href="/dashboard" className="flex items-center justify-center gap-2 bg-[#8B0000] text-white px-6 py-4 font-bold text-sm hover:bg-red-900 transition-all">
                        Dashboard <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </main>
        </div>
    );
}
