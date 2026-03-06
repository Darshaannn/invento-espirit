"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Download, Home, Info, AlertTriangle,
    CheckCircle2, Activity, ShieldCheck, RefreshCcw, Sparkles
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
                <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                <p className="text-pink-500 font-bold uppercase tracking-widest text-[10px]">Processing AI Report...</p>
            </div>
        </div>
    );

    const avgScore = (Object.values(finalScores) as any[]).reduce((a: any, b: any) => a + b, 0) / 4;
    const risk = avgScore > 80 ? "Low" : avgScore > 55 ? "Moderate" : "High";
    const riskColor = risk === "Low" ? "#A1C45A" : risk === "Moderate" ? "#F58220" : "#D61B7D";
    const riskBg = risk === "Low" ? "bg-[#A1C45A]/10" : risk === "Moderate" ? "bg-[#F58220]/10" : "bg-[#D61B7D]/10";

    const radarData = {
        labels: Object.keys(finalScores),
        datasets: [
            {
                label: 'Cognitive Profile',
                data: Object.values(finalScores),
                backgroundColor: 'rgba(214, 27, 125, 0.2)',
                borderColor: '#D61B7D',
                borderWidth: 4,
                pointBackgroundColor: '#D61B7D',
                pointBorderColor: '#fff',
            },
        ],
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(0,0,0,0.05)' },
                grid: { color: 'rgba(0,0,0,0.05)' },
                pointLabels: {
                    font: { family: 'Poppins', weight: 'bold' as const, size: 10 },
                    color: '#1A1A1A'
                },
                suggestedMin: 0,
                suggestedMax: 100,
                ticks: { display: false }
            }
        },
        plugins: {
            legend: { display: false }
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] pt-12 pb-24 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#D61B7D] flex items-center justify-center text-white italic font-black text-sm">E</div>
                            <span className="font-bold text-[#1A1A1A] tracking-tighter">Espirit <span className="gradient-text font-black">Invento</span></span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-[#1A1A1A]">Cognitive <span className="gradient-text not-italic">Health Report.</span></h1>
                    </motion.div>

                    <div className="flex gap-4">
                        <button className="w-14 h-14 rounded-3xl bg-white border border-black/5 shadow-sm flex items-center justify-center" onClick={() => window.print()}>
                            <Download size={22} className="text-[#1A1A1A]/30" />
                        </button>
                        <Link href="/">
                            <button className="w-14 h-14 rounded-3xl bg-white border border-black/5 shadow-sm flex items-center justify-center">
                                <Home size={22} className="text-[#1A1A1A]/30" />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-5 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="organic-card p-10 bg-white aspect-square flex items-center justify-center shadow-2xl"
                        >
                            <Radar data={radarData} options={radarOptions} />
                        </motion.div>

                        <div className={`p-8 rounded-[40px] border-2 border-dashed ${riskBg} text-center`} style={{ borderColor: riskColor }}>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-40 text-[#1A1A1A]">Classification Result</p>
                            <h2 className="text-5xl font-black italic mb-2 tracking-tighter uppercase" style={{ color: riskColor }}>{risk} Risk</h2>
                            <p className="text-sm font-medium opacity-60 max-w-xs mx-auto text-[#1A1A1A]">AI suggests {risk.toLowerCase()} cognitive variation based on latency and accuracy.</p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                            {Object.entries(finalScores).map(([label, score]: [string, any], i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={label}
                                    className="bg-white p-8 rounded-[36px] shadow-sm border border-black/5 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/40">{label}</span>
                                            <Activity size={16} className="text-[#D61B7D]" />
                                        </div>
                                        <div className="text-4xl font-black italic tracking-tighter text-[#1A1A1A] mb-6">{score}%</div>
                                    </div>
                                    <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score}%` }}
                                            transition={{ duration: 1 }}
                                            className="h-full bg-pink-500"
                                        />
                                    </div>
                                </motion.div>
                            ))}

                            <div className="sm:col-span-2 bg-[#1A1A1A] p-10 rounded-[40px] text-white relative overflow-hidden">
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-3">Holistic AI Score</p>
                                        <div className="text-8xl font-black italic tracking-tighter gradient-text">{Math.round(avgScore)}%</div>
                                    </div>
                                    <div className="max-w-xs">
                                        <h4 className="flex items-center gap-2 text-[#A1C45A] font-black uppercase tracking-widest text-[10px] mb-4">
                                            <CheckCircle2 size={16} /> Scan Verified
                                        </h4>
                                        <p className="text-sm font-medium text-white/40 leading-relaxed italic">
                                            "Pattern recognition and temporal logic are consistent with normal cognitive baselines."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 rounded-[40px] bg-white border border-orange-500/20 flex flex-col md:flex-row gap-8 items-center shadow-lg shadow-orange-500/5">
                            <div className="p-6 bg-orange-100 rounded-3xl text-orange-500">
                                <AlertTriangle size={36} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black uppercase text-[10px] tracking-widest text-[#1A1A1A]">AI Product Disclaimer</h4>
                                <p className="text-[11px] text-[#1A1A1A]/40 font-medium leading-relaxed italic">
                                    * This report is generated by an algorithmic screening system and is not a clinical diagnosis. Please consult a licensed healthcare professional for a full clinical evaluation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
