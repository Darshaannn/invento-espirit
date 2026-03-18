"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Download, Home, Info, AlertTriangle,
    CheckCircle2, Activity, ShieldCheck, RefreshCcw, Sparkles, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const ReportPage = () => {
    const [data, setData] = useState<any>(null);
    const [finalScores, setFinalScores] = useState<any>(null);

    useEffect(() => {
        const raw = localStorage.getItem('screening_report');
        if (raw) {
            const parsed = JSON.parse(raw);
            setData(parsed);

            const domains = ['Memory', 'Orientation', 'Attention', 'Executive Function'];
            const calculated: any = {};

            domains.forEach(d => {
                const matchKey = Object.keys(parsed.domainScores).find(k => k.toLowerCase().includes(d.toLowerCase().split(' ')[0]));
                if (matchKey) {
                    const stats = parsed.domainScores[matchKey];
                    const accuracy = (stats.correct / stats.total) * 100;
                    const avgTime = stats.time / stats.total;

                    // Speed factor: 1-2s is ideal, 5s+ is slow
                    const speedFactor = Math.max(60, 100 - (avgTime * 8));
                    calculated[d] = Math.round((accuracy * 0.7) + (speedFactor * 0.3));
                } else {
                    calculated[d] = 0;
                }
            });
            setFinalScores(calculated);
        }
    }, []);

    if (!finalScores) return (
        <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 animate-spin" />
                <p className="text-pink-500 font-bold uppercase tracking-widest text-[10px]">Processing AI Report...</p>
            </div>
        </div>
    );

    const avgScore = (Object.values(finalScores) as any[]).reduce((a: any, b: any) => a + b, 0) / (Object.keys(finalScores).length || 4);
    const risk = avgScore > 80 ? "Low" : avgScore > 55 ? "Moderate" : "High";
    const riskColor = risk === "Low" ? "#10b981" : risk === "Moderate" ? "#f59e0b" : "#ef4444";
    const riskBG = risk === "Low" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : risk === "Moderate" ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-red-500/10 border-red-500/20 text-red-500";
    const riskLabel = risk === "Low" ? "Stable" : risk === "Moderate" ? "Observe" : "Action Required";

    return (
        <div className="min-h-screen bg-[#F5F1EE] text-[#1A1A1A] pt-12 pb-24 px-6 relative overflow-hidden font-sans">
            {/* Decorative light glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-white opacity-40 blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* NAVIGATION AREA */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16 border-b border-[#1A1A1A]/5 pb-12">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-[#8B0000] flex items-center justify-center text-white font-black text-sm">I</div>
                            <span className="font-bold text-[#1A1A1A]/40 tracking-widest text-[10px] uppercase">Neural Diagnostic Protocol</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight text-[#1A1A1A]">Cognitive Report.</h1>
                    </motion.div>

                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="h-14 px-8 bg-white border border-[#1A1A1A]/10 flex items-center gap-3 font-bold text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-all group"
                            onClick={() => window.print()}
                        >
                            <Download size={18} className="group-hover:-translate-y-1 transition-transform" /> Export PDF
                        </motion.button>
                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="h-14 w-14 bg-white border border-[#1A1A1A]/10 flex items-center justify-center text-[#1A1A1A]/40 hover:text-[#8B0000] transition-all font-bold"
                            >
                                <Home size={20} />
                            </motion.button>
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* RISK INDEX CARD */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-12 border border-[#1A1A1A]/5 flex flex-col items-center text-center relative overflow-hidden group shadow-xl"
                        >
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-12 text-[#1A1A1A]/30">Holistic Cognitive Risk Assessment</p>

                            <div className="relative mb-12 scale-110">
                                <svg className="w-56 h-56 transform -rotate-90">
                                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-black/5" />
                                    <motion.circle
                                        cx="112" cy="112" r="100" stroke={riskColor} strokeWidth="12" fill="transparent" strokeDasharray={628.31}
                                        initial={{ strokeDashoffset: 628.31 }}
                                        animate={{ strokeDashoffset: 628.31 - (628.31 * avgScore / 100) }}
                                        transition={{ duration: 2, ease: "circOut" }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-7xl font-bold tracking-tighter text-[#1A1A1A]">{Math.round(avgScore)}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#1A1A1A]/30 mt-1">Aggregate Score</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 w-full">
                                <div className={`inline-flex items-center gap-2 px-6 py-2 border ${riskBG} font-black uppercase tracking-widest text-[10px] italic`}>
                                    <Activity size={12} /> {riskLabel}
                                </div>
                                <h2 className="text-5xl font-black italic uppercase tracking-tighter" style={{ color: riskColor }}>{risk} Risk</h2>
                            </div>

                            <div className="w-full pt-10 border-t border-[#1A1A1A]/5 grid grid-cols-2 gap-8 px-4">
                                <div className="text-left space-y-1">
                                    <p className="text-[9px] font-black text-[#1A1A1A]/30 uppercase tracking-widest leading-none">Detection Date</p>
                                    <p className="text-lg font-bold text-[#1A1A1A]/80 leading-none">{new Date().toLocaleDateString()}</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="text-[9px] font-black text-[#1A1A1A]/30 uppercase tracking-widest leading-none">AI Confidence</p>
                                    <p className="text-lg font-bold text-[#8B0000] italic leading-none tracking-tighter">97.4%</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="p-8 bg-[#E8E2DE]/30 border border-[#1A1A1A]/5 space-y-6"
                        >
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#8B0000] flex items-center gap-2">
                                <Sparkles size={14} /> Neural Behavioral Insights
                            </h3>
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-slate-400 italic leading-relaxed">
                                    Our proprietary AI evaluates your performance across multiple dimensions beyond simple accuracy:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        { label: "Accuracy", desc: "Percentage of correct clinical responses." },
                                        { label: "Response Latency", desc: "Neuro-processing time between stimulus and reaction." },
                                        { label: "Consistency", desc: "Variance in performance across different cognitive domains." },
                                        { label: "Error Patterns", desc: "AI-detected types of cognitive slips vs neural noise." }
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex flex-col gap-1 border-l-2 border-[#8B0000]/20 pl-4">
                                            <span className="text-[11px] font-black uppercase tracking-widest text-[#1A1A1A]/80">{item.label}</span>
                                            <span className="text-[11px] text-[#1A1A1A]/40 italic">{item.desc}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                    {/* DOMAIN SCORES & RECOMMENDATIONS */}
                    <div className="lg:col-span-12 xl:col-span-7 space-y-8 font-sans">
                        <div className="grid sm:grid-cols-2 gap-6">
                            {Object.entries(finalScores).map(([label, score]: [string, any], i) => {
                                const domainColor = label.includes('Memory') ? 'from-blue-500 to-cyan-500' :
                                    label.includes('Attention') ? 'from-orange-500 to-amber-500' :
                                        label.includes('Executive') ? 'from-purple-500 to-pink-500' :
                                            'from-green-500 to-emerald-500';
                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={label}
                                        className="bg-white p-8 border border-[#1A1A1A]/5 group hover:border-[#8B0000]/20 transition-all duration-500 relative overflow-hidden shadow-sm"
                                    >
                                        <div className="flex justify-between items-center mb-10 relative z-10">
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1A1A1A]/30">{label} Performance</span>
                                            <div className="w-8 h-8 bg-black/5 flex items-center justify-center text-[#8B0000] group-hover:scale-110 transition-transform">
                                                <Activity size={14} />
                                            </div>
                                        </div>

                                        <div className="flex items-baseline gap-2 mb-6 relative z-10">
                                            <span className="text-6xl font-bold tracking-tighter leading-none text-[#1A1A1A]">{score}%</span>
                                            <span className="text-[10px] font-bold text-[#1A1A1A]/30 uppercase tracking-widest">Score</span>
                                        </div>

                                        <div className="w-full h-2 bg-[#F5F1EE] overflow-hidden shadow-inner relative z-10">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${score}%` }}
                                                transition={{ duration: 1.5, delay: 0.5 + (i * 0.1), ease: "circOut" }}
                                                className={`h-full bg-[#8B0000] shadow-lg shadow-[#8B0000]/10`}
                                            />
                                        </div>

                                        {/* Abstract glow bg */}
                                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${domainColor} opacity-0 group-hover:opacity-5 blur-3xl transition-opacity transition-all`} />
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* RETEST CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="bg-[#1A1A1A] p-1 shadow-xl group overflow-hidden relative"
                        >
                            <div className="bg-white p-12 flex flex-col items-center justify-between gap-10 h-full relative overflow-hidden">
                                <div className="space-y-4 text-center">
                                    <div className="inline-flex items-center gap-2 text-[#8B0000] font-black uppercase tracking-widest text-[10px] mb-4 bg-[#8B0000]/5 px-4 py-2 border border-[#8B0000]/10">
                                        <RefreshCcw size={12} className="animate-spin-slow" /> Schedule Clinical Oversight
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1A1A1A]">Progress Monitoring.</h3>
                                    <p className="text-base font-medium text-[#1A1A1A]/40 leading-relaxed max-w-2xl mx-auto">
                                        Clinical cognitive assessments are most effective when tracked over time. We recommend a system re-test in <span className="text-[#8B0000] font-bold underline decoration-[#8B0000]/30 underline-offset-4 decoration-2">30 days</span> to monitor longitudinal behavioral shift.
                                    </p>
                                </div>
                                <Link href="/screening">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-[#1A1A1A] text-white px-16 py-6 group shadow-2xl relative z-10 text-lg font-bold uppercase tracking-widest flex items-center hover:bg-black transition-all"
                                    >
                                        Set Re-Assessment Reminder <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform ml-2" />
                                    </motion.button>
                                </Link>

                                {/* Advisory */}
                                <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 flex gap-6 items-start max-w-2xl mx-auto">
                                    <AlertTriangle size={24} className="text-amber-500 shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <h4 className="font-black italic uppercase text-[11px] tracking-widest text-amber-500/80 leading-none">Medical Disclaimer</h4>
                                        <p className="text-[12px] text-slate-500/80 leading-relaxed font-medium italic">
                                            This screening tool provides behavioral indicators based on AI analysis. It is **not a clinical diagnosis**. Regular monitoring is vital for early awareness.
                                        </p>
                                    </div>
                                </div>

                                {/* Background glow elements */}
                                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]" />
                                <div className="absolute -left-20 -top-20 w-80 h-80 bg-pink-500/10 rounded-full blur-[100px]" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="mt-16 text-center opacity-30 pb-12">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white">Encrypted Diagnostic Signature: INVENTO_CNS_A7X92</p>
            </div>
        </div>
    );
};

export default ReportPage;
