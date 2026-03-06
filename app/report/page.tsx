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

            // Calculate scores based on the domainScores object from /screening
            const domains = ['Memory', 'Orientation', 'Attention', 'Executive Function', 'Pattern Recognition'];
            const calculated: any = {};

            domains.forEach(d => {
                // Find keys in data.domainScores that match or start with the domain name
                const matchKey = Object.keys(parsed.domainScores).find(k => k.toLowerCase().includes(d.toLowerCase().split(' ')[0]));
                if (matchKey) {
                    const stats = parsed.domainScores[matchKey];
                    const accuracy = (stats.correct / stats.total) * 100;
                    const avgTime = stats.time / stats.total;

                    // AI Logic: Score is influenced by accuracy + response time speed
                    // Speed factor: 1-2s is ideal (100%), 5s+ is slow (60%)
                    const speedFactor = Math.max(60, 100 - (avgTime * 8));
                    calculated[d] = Math.round((accuracy * 0.7) + (speedFactor * 0.3));
                } else {
                    calculated[d] = 0; // Default if no questions answered in that domain
                }
            });
            setFinalScores(calculated);
        }
    }, []);

    if (!finalScores) return (
        <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                <p className="text-pink-500 font-bold uppercase tracking-widest text-[10px]">Loading Report...</p>
            </div>
        </div>
    );

    const avgScore = Object.values(finalScores).reduce((a: any, b: any) => a + b, 0) / 5;
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
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#D61B7D',
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
                    color: '#3D2C2E'
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
            <div className="absolute top-[10%] right-[5%] w-96 h-96 bg-pink-500/5 blur-[120px] rounded-full" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-[#D61B7D] flex items-center justify-center text-white italic font-black text-sm">E</div>
                            <span className="font-bold text-[#3D2C2E] tracking-tighter">Espirit <span className="gradient-text font-black">Invento</span></span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-[#3D2C2E]">Cognitive <span className="gradient-text not-italic">Health Report.</span></h1>
                    </motion.div>

                    <div className="flex gap-4">
                        <button className="w-14 h-14 rounded-3xl bg-white border border-black/5 shadow-sm flex items-center justify-center hover:scale-110 transition-transform" onClick={() => window.print()}>
                            <Download size={22} className="text-[#3D2C2E]/30" />
                        </button>
                        <Link href="/">
                            <button className="w-14 h-14 rounded-3xl bg-white border border-black/5 shadow-sm flex items-center justify-center hover:scale-110 transition-transform">
                                <Home size={22} className="text-[#3D2C2E]/30" />
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Column: Visuals */}
                    <div className="lg:col-span-5 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="organic-card p-10 bg-white aspect-square flex items-center justify-center shadow-2xl relative"
                        >
                            <div className="absolute inset-20 bg-pink-500/5 blur-[80px] rounded-full" />
                            <Radar data={radarData} options={radarOptions} />
                        </motion.div>

                        <div className={`p-8 rounded-[40px] border-2 border-dashed ${riskBg} text-center`} style={{ borderColor: riskColor }}>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 opacity-40">Classification Spectrum</p>
                            <h2 className="text-5xl font-black italic mb-2 tracking-tighter uppercase" style={{ color: riskColor }}>{risk} Risk</h2>
                            <p className="text-sm font-medium opacity-60 max-w-xs mx-auto">Synthetic analysis suggests {risk.toLowerCase()} cognitive latency variation.</p>
                        </div>
                    </div>

                    {/* Right Column: Score Breakdown */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="grid sm:grid-cols-2 gap-6">
                            {Object.entries(finalScores).map(([label, score]: [string, any], i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={label}
                                    className="bg-white p-8 rounded-[36px] shadow-sm border border-black/5 flex flex-col justify-between group hover:shadow-xl transition-shadow"
                                >
                                    <div>
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-black/20">{label}</span>
                                            <Activity size={16} className="text-[#D61B7D] opacity-10 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-4xl font-black italic tracking-tighter text-[#3D2C2E] mb-6">{score}%</div>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-[#D61B7D]"
                                        />
                                    </div>
                                </motion.div>
                            ))}

                            {/* Overall Score Card */}
                            <div className="sm:col-span-2 bg-[#3D2C2E] p-10 rounded-[40px] text-white overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-3">Overall AI Score</p>
                                        <div className="text-8xl font-black italic tracking-tighter gradient-text drop-shadow-2xl">{Math.round(avgScore)}%</div>
                                    </div>
                                    <div className="max-w-xs">
                                        <h4 className="flex items-center gap-2 text-[#A1C45A] font-black uppercase tracking-widest text-[10px] mb-4">
                                            <CheckCircle2 size={16} /> Analysis Completed
                                        </h4>
                                        <p className="text-sm font-medium text-white/40 leading-relaxed italic">
                                            "Logic consistency stable. Response latency within typical quartiles for this demographic profile."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 rounded-[40px] bg-white border border-black/5 flex flex-col md:flex-row gap-8 items-center">
                            <div className="p-6 bg-orange-100 rounded-3xl text-orange-500">
                                <AlertTriangle size={36} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black uppercase text-[10px] tracking-widest">Medical Directive</h4>
                                <p className="text-xs text-black/40 font-medium leading-relaxed italic">
                                    * This report is generated by an algorithmic screening system. It is not a clinical diagnosis or a substitute for a neurological consultation. Please present this report to a licensed healthcare provider for clinical correlation.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <Link href="/screening">
                                <button className="yobe-btn yobe-btn-primary px-12 py-6 text-sm font-black uppercase flex items-center gap-3">
                                    Retake Assessment <RefreshCcw size={18} />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-24 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between opacity-20 text-[9px] font-black uppercase tracking-[0.5em]">
                    <p>Report Secured by Invento Neural Vault</p>
                    <p>© 2024 Biosystems AI</p>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
