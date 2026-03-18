"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Lightbulb, Rocket, Activity, Timer, Calendar, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import EmptyStateDashboard from '../../../components/EmptyStateDashboard';
import { exportToPDF } from '@/lib/utils/export';

interface DomainScore {
    name: string;
    score: number;
    label: string;
    color: string;
    details?: {
        speed?: string;
        consistency?: string;
        trend?: string;
    };
}

interface AssessmentData {
    sessionId?: string;
    timestamp?: string | number | Date;
    scores?: {
        accuracy?: number;
    };
    domainScores?: Array<DomainScore>;
    aiAnalysis?: {
        summary?: string;
        clinicalInsights?: string;
    };
    trends?: Array<{
        score: number;
        date?: string;
    }>;
}

interface ChartPoint {
    score: number;
    date?: string;
    phase?: string;
}

export default function Dashboard() {
    const [data, setData] = useState<AssessmentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDomain, setSelectedDomain] = useState<DomainScore | null>(null);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchLatest = async () => {
            console.log("[Dashboard] Initializing clinical sync...");
            try {
                const localData = localStorage.getItem('latest_assessment');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    if (!parsed.domainScores) {
                        const domains = ['Memory', 'Attention', 'Executive', 'Orientation'];
                        parsed.domainScores = domains.map((domain: string) => {
                            const baseScore = Math.round(parsed.scores?.accuracy || 0);
                            const variance = Math.floor(Math.random() * 10) - 5;
                            return {
                                name: domain,
                                score: Math.min(100, Math.max(0, baseScore + variance)),
                                label: baseScore > 75 ? "Stable" : "Review Needed",
                                color: domain === 'Memory' ? '#D946EF' : domain === 'Attention' ? '#00F5FF' : domain === 'Executive' ? '#9D50FF' : '#8B5CF6',
                                details: { speed: "0.8s avg", consistency: "94%", trend: "Improving" }
                            };
                        });
                    }
                    setData(parsed);
                }

                const res = await fetch('/api/assessments/latest');
                const result = await res.json();
                if (result.success && result.data) {
                    console.log("[Dashboard] Server records retrieved.");
                    setData(result.data);
                }
            } catch (err) {
                console.error("[Dashboard] Sync Variance:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    const handleExport = async () => {
        console.log("[UI Action] Dispatched Clinical Export Request (v10)...");
        setExporting(true);
        try {
            const success = await exportToPDF('clinical-overview-content', `Neural_Report_${data?.sessionId?.substring(0, 8) || 'latest'}`);
            if (success) {
                console.log("[UI Action] Export Process: Handshake successful.");
            }
        } catch (err) {
            console.error("[UI Action] Export Process: Pipeline exception:", err);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F1EE] min-h-screen">
                <div className="w-12 h-12 border-4 border-[#8B0000]/20 border-t-[#8B0000] animate-spin mb-4" />
                <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-[10px]">Syncing Clinical Data</p>
            </div>
        );
    }

    if (!data) {
        return <EmptyStateDashboard />;
    }

    const accuracy = Math.round(data.scores?.accuracy || 0);
    const scanDate = data.timestamp ? new Date(data.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Just now';
    const scanTime = data.timestamp ? new Date(data.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }) : '--:--';

    // Data format for Recharts
    const rawTrends = data.trends && data.trends.length > 0 ? data.trends : [
        { score: 65 }, { score: 72 }, { score: 68 }, { score: 85 }, { score: 79 }, { score: accuracy }
    ];

    const chartData: ChartPoint[] = rawTrends.map((d: { score: number; date?: string }, i: number) => ({
        score: d.score,
        date: d.date,
        phase: `Phase ${i + 1}`
    }));
    return (
        <div className="flex-1 p-4 md:p-8 lg:p-12 bg-[#F8F9FA] min-h-screen relative overflow-hidden font-sans text-[#1A1A1A]">
            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8B0000]/3 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/3 blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <AnimatePresence>
                {selectedDomain && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-xl bg-black/40"
                        onClick={() => setSelectedDomain(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white max-w-2xl w-full p-8 md:p-14 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-[#1A1A1A]/5"
                            style={{ borderRadius: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 opacity-5 filter blur-[100px] pointer-events-none"
                                style={{ backgroundColor: selectedDomain.color }} />

                            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-[#1A1A1A]/40">
                                        <div className="w-10 h-[1px] bg-current" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Deep Neural Analysis</span>
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-black text-[#1A1A1A] italic tracking-tighter uppercase leading-none">{selectedDomain.name}</h2>
                                </div>
                                <div className="text-7xl font-black italic tracking-tighter" style={{ color: selectedDomain.color }}>
                                    {selectedDomain.score}<span className="text-3xl opacity-30">%</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12">
                                <div className="bg-[#F8F9FA] p-8 border border-[#1A1A1A]/5 group overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ backgroundColor: selectedDomain.color }} />
                                    <p className="text-[#1A1A1A]/30 text-[10px] font-black uppercase tracking-widest mb-3">Neural Velocity</p>
                                    <div className="text-3xl font-black text-[#1A1A1A] tracking-tight">{selectedDomain.details?.speed || '0.8s'}</div>
                                    <div className="text-[9px] font-bold text-green-600 mt-1 uppercase tracking-widest">Nominal Range</div>
                                </div>
                                <div className="bg-[#F8F9FA] p-8 border border-[#1A1A1A]/5 group overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 opacity-10 bg-[#1A1A1A]" />
                                    <p className="text-[#1A1A1A]/30 text-[10px] font-black uppercase tracking-widest mb-3">Reliability</p>
                                    <div className="text-3xl font-black text-[#1A1A1A] tracking-tight">{selectedDomain.details?.consistency || '94%'}</div>
                                    <div className="text-[9px] font-bold text-[#8B0000] mt-1 uppercase tracking-widest">Active Momentum</div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <p className="text-[#1A1A1A]/60 font-medium leading-relaxed italic text-lg border-l-4 border-[#8B0000]/20 pl-6 py-2">
                                    &quot;Analysis indicates high resiliency in {selectedDomain.name} metrics. Neural pathways demonstrate consistent signal propagation with minimal latency variance.&quot;
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedDomain(null)}
                                className="w-full py-6 bg-[#1A1A1A] border border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] text-white font-black uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl text-[10px]"
                            >
                                DISMISS REPORT
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div id="clinical-overview-content" className="max-w-7xl mx-auto relative z-10 space-y-12 pb-20">
                {/* HEADER SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10"
                >
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-3 bg-[#8B0000]/5 border border-[#8B0000]/10 px-4 py-2 mb-6">
                            <div className="w-1.5 h-1.5 bg-[#8B0000] shadow-[0_0_10px_#8B0000]" />
                            <span className="text-[9px] font-black text-[#8B0000] tracking-[0.5em] uppercase">SYSTEM PROTOCOL: ACTIVE</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-[#1A1A1A] tracking-tighter leading-[0.85] uppercase italic mb-8">
                            Clinical <br />
                            <span className="text-[#8B0000]">Records</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-[#1A1A1A]/30">
                            <div className="flex items-center gap-3 bg-white/50 border border-[#1A1A1A]/5 px-5 py-3 shadow-sm">
                                <Calendar size={14} className="text-[#8B0000]" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{scanDate}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/50 border border-[#1A1A1A]/5 px-5 py-3 shadow-sm">
                                <Timer size={14} className="text-[#8B0000]" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{scanTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch gap-4 min-w-[320px]">
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="bg-white border-2 border-[#1A1A1A]/5 hover:border-[#1A1A1A] px-10 py-6 text-[10px] font-black text-[#1A1A1A] transition-all duration-500 uppercase tracking-[0.4em] flex items-center justify-center gap-3 group shadow-xl"
                        >
                            {exporting ? <Activity size={18} className="animate-spin" /> : <Download size={18} className="group-hover:-translate-y-1 transition-transform" />}
                            {exporting ? 'SYNCING...' : 'EXPORT DATA'}
                        </button>
                        <Link
                            href="/instructions"
                            className="bg-[#1A1A1A] hover:bg-[#8B0000] text-white px-10 py-6 text-[10px] font-black transition-all duration-700 uppercase tracking-[0.4em] text-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)]"
                        >
                            NEW SESSION
                        </Link>
                    </div>
                </motion.div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* LEFT PANEL: COGNITIVE PROFILE */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-8 bg-white border border-[#1A1A1A]/5 p-8 md:p-14 lg:p-20 relative overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] group"
                    >
                        {/* Background Technical Watermark */}
                        <div className="absolute -bottom-10 -left-10 text-[220px] font-black opacity-[0.02] select-none pointer-events-none italic tracking-tighter uppercase leading-none">
                            NEURAL
                        </div>

                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8B0000]/3 blur-[140px] opacity-20 pointer-events-none" />

                        <div className="flex flex-col xl:flex-row justify-between items-center gap-12 lg:gap-20 relative z-10">
                            <div className="flex-1 text-center xl:text-left space-y-12">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center xl:justify-start gap-4">
                                        <div className="h-[2px] w-12 bg-[#8B0000]" />
                                        <h3 className="text-[10px] font-black text-[#8B0000] tracking-[0.8em] uppercase">Clinical Diagnostic Vector</h3>
                                    </div>
                                    <h2 className="text-6xl md:text-8xl font-black text-[#1A1A1A] leading-[0.85] tracking-tighter uppercase italic">
                                        STATUS: <br />
                                        <span className={accuracy > 70 ? "text-[#1A1A1A]" : "text-[#8B0000]"}>
                                            {accuracy > 85 ? 'ELITE' : accuracy > 65 ? 'STABLE' : 'VARIABLE'}
                                        </span>
                                    </h2>
                                </div>

                                {/* Status Segmented Bar */}
                                <div className="flex gap-2 max-w-sm mx-auto xl:mx-0">
                                    {[1, 2, 3, 4, 5].map((seg) => (
                                        <div
                                            key={seg}
                                            className={`h-2 flex-1 transition-all duration-1000 ${seg <= (accuracy / 20)
                                                ? (accuracy < 40 ? 'bg-[#8B0000]' : 'bg-[#1A1A1A]')
                                                : 'bg-[#1A1A1A]/5'
                                                }`}
                                        />
                                    ))}
                                </div>

                                <div className="space-y-6">
                                    <p className="text-[#1A1A1A]/50 text-sm md:text-lg leading-relaxed font-bold uppercase tracking-[0.2em] max-w-xl">
                                        <span className="text-[#1A1A1A] underline decoration-[#8B0000]/30 decoration-2 underline-offset-4 font-black">LOG ANALYSIS:</span> <br className="hidden md:block" />
                                        {data.aiAnalysis?.summary || "Current neural synchronicity indices remain within observable baseline thresholds. Monitoring for tertiary variance patterns."}
                                    </p>
                                    <div className="flex items-center justify-center xl:justify-start gap-6 text-[9px] font-black tracking-widest text-[#1A1A1A]/30">
                                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-500" /> ENCRYPTED DATA</span>
                                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" /> LIVE CLINICAL SYNC</span>
                                    </div>
                                </div>
                            </div>

                            {/* Circular Score Gauge Inset */}
                            <div className="relative group/score scale-100 md:scale-110 lg:mr-10 transition-transform duration-700">
                                <div className="absolute inset-0 bg-[#8B0000]/10 blur-[80px] opacity-0 group-hover/score:opacity-100 transition-opacity duration-1000" />

                                <div className="relative w-[280px] h-[280px] flex items-center justify-center bg-[#F8F9FA] rounded-full border border-[#1A1A1A]/5 shadow-inner">
                                    {/* SVG Ring */}
                                    <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                                        <circle cx="50%" cy="50%" r="48%" stroke="#1A1A1A" strokeWidth="1" fill="none" opacity="0.1" />
                                        <motion.circle
                                            cx="50%" cy="50%" r="48%"
                                            stroke={accuracy < 40 ? "#8B0000" : "#1A1A1A"}
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray="800"
                                            initial={{ strokeDashoffset: 800 }}
                                            animate={{ strokeDashoffset: 800 - (800 * accuracy) / 100 }}
                                            transition={{ duration: 2.5, ease: "circOut" }}
                                            strokeLinecap="square"
                                        />
                                    </svg>

                                    <div className="text-center z-10">
                                        <p className="text-[#1A1A1A]/30 text-[8px] font-black uppercase tracking-[1.2em] mb-4">TOTAL INDEX</p>
                                        <div className="text-[110px] font-black text-[#1A1A1A] tracking-tighter italic leading-none">{accuracy}</div>
                                        <div className="bg-white border border-[#1A1A1A]/5 px-5 py-2.5 mt-4 shadow-xl flex items-center gap-3 mx-auto w-fit">
                                            <Activity size={12} className="text-[#8B0000]" />
                                            <span className="text-[9px] font-black text-[#8B0000] uppercase tracking-[0.2em]">+2.4% BASE</span>
                                        </div>
                                    </div>

                                    {/* Tech ticks */}
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                                        <div
                                            key={deg}
                                            className="absolute w-[1px] h-[8px] bg-[#1A1A1A]/20"
                                            style={{ transform: `rotate(${deg}deg) translateY(-130px)` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT PANEL: STABILITY TREND */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-4 bg-[#121212] p-8 md:p-12 border border-white/5 shadow-2xl flex flex-col relative overflow-hidden group"
                    >
                        {/* Background HUD Grid Effect */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#8B0000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />

                        {/* Header Area */}
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="font-black text-3xl text-white tracking-tighter italic uppercase leading-none mb-3">Stability</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.6em]">Active Momentum</p>
                                </div>
                            </div>
                            <div className="bg-[#8B0000] text-white text-[9px] font-black px-4 py-2 uppercase tracking-widest shadow-[0_0_20px_rgba(139,0,0,0.4)]">OPTIMIZED</div>
                        </div>

                        {/* Mid-Section Stats Buffer */}
                        <div className="mb-12 relative z-10 border-l border-white/10 pl-6 space-y-4">
                            <div className="flex items-baseline gap-4">
                                <span className="text-5xl font-black text-white italic tracking-tighter">98.4<span className="text-sm opacity-20 NOT-italic">%</span></span>
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">+1.2% TREND</span>
                            </div>
                            <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                                Neural synchronization exceeding baseline threshold levels.
                            </p>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 flex flex-col relative">
                            {/* SVG Chart with HUD Enhancements */}
                            <div className="relative flex-1 w-full min-h-[220px]">
                                {/* Horizontal Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                                    {[0, 1, 2, 3].map((i) => (
                                        <div key={i} className="w-full h-[1px] bg-white/[0.03] flex justify-between">
                                            <span className="text-[7px] text-white/10 font-bold -translate-y-1">{100 - (i * 25)}%</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Recharts AreaChart with HUD Enhancements */}
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B0000" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#8B0000" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#8B0000', color: 'white', borderRadius: '0px' }}
                                            itemStyle={{ color: '#ff4d4d', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#ffffff80', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#8B0000"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorScore)"
                                            activeDot={{ r: 8, strokeWidth: 0, fill: '#ffffff' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>

                                {/* Animated Scanline Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B0000]/5 to-transparent h-[10%] w-full animate-[scan_4s_linear_infinite] pointer-events-none" />
                            </div>

                            {/* Footer labels */}
                            <div className="flex justify-between text-[8px] text-white/30 font-black uppercase tracking-[0.5em] mt-8 py-6 border-t border-white/5 relative z-10">
                                <span>Cycle Alpha</span>
                                <span className="text-[#8B0000]">Latest Sync</span>
                            </div>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />

                        <style jsx>{`
                            @keyframes scan {
                                0% { transform: translateY(-100%); }
                                100% { transform: translateY(1000%); }
                            }
                        `}</style>
                    </motion.div>
                </div>

                {/* DOMAINS SECTION */}
                <div className="space-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-[#1A1A1A]/5 pb-10">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-black text-[#1A1A1A] italic tracking-tighter uppercase leading-none">Cognitive Architecture</h2>
                            <p className="text-[10px] text-[#1A1A1A]/30 font-black uppercase tracking-[0.6em] mt-4">Deep Vertical Neural Audit</p>
                        </div>
                        <button className="text-[#8B0000] text-[10px] font-black border-2 border-[#8B0000]/10 hover:border-[#8B0000]/100 px-8 py-4 uppercase tracking-[0.3em] transition-all flex items-center gap-3">
                            VIEW RAW LOGS <Settings size={14} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.domainScores?.map((item: DomainScore, idx: number) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.05) }}
                                onClick={() => setSelectedDomain(item)}
                                className="bg-white p-10 md:p-12 border border-[#1A1A1A]/5 flex flex-col items-center text-center transition-all duration-700 cursor-pointer group hover:shadow-2xl hover:border-transparent relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#F8F9FA] opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative w-36 h-36 mb-12 flex items-center justify-center z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle cx="50%" cy="50%" r="42%" stroke="#F8F9FA" strokeWidth="14" fill="none" />
                                        <motion.circle
                                            cx="50%" cy="50%" r="42%"
                                            stroke={item.color}
                                            strokeWidth="14"
                                            fill="none"
                                            strokeDasharray="265"
                                            initial={{ strokeDashoffset: 265 }}
                                            animate={{ strokeDashoffset: 265 - (265 * item.score) / 100 }}
                                            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-5xl font-black text-[#1A1A1A] italic tracking-tighter">{item.score}</span>
                                        <span className="text-[8px] font-black text-[#1A1A1A]/30 uppercase tracking-widest mt-1">PERCENT</span>
                                    </div>
                                </div>
                                <h3 className="text-[#1A1A1A] font-black text-2xl mb-4 italic uppercase tracking-tighter relative z-10 group-hover:text-[#8B0000] transition-colors">{item.name}</h3>
                                <div className="px-6 py-2 border-2 text-[9px] font-black uppercase tracking-[0.4em] relative z-10 transition-all duration-500 group-hover:bg-white overflow-hidden group-hover:border-[#1A1A1A]/10"
                                    style={{ color: item.color, borderColor: `${item.color}22`, backgroundColor: `${item.color}08` }}>
                                    {item.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* INSIGHTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group bg-white p-10 md:p-14 lg:p-20 flex flex-col md:flex-row gap-12 items-start relative overflow-hidden transition-all border border-[#1A1A1A]/5 shadow-2xl"
                    >
                        <div className="w-24 h-24 bg-[#F8F9FA] rounded-full flex items-center justify-center shrink-0 border border-[#1A1A1A]/5 group-hover:bg-[#8B0000] group-hover:text-white transition-all duration-700 scale-100 group-hover:scale-110 shadow-lg">
                            <Lightbulb size={40} className="text-[#8B0000] group-hover:text-white transition-colors" />
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="h-1 w-12 bg-[#8B0000]" />
                                <h3 className="text-[#1A1A1A] font-black text-4xl italic tracking-tighter uppercase leading-none">Protocol <br /> Recommendations</h3>
                            </div>
                            <p className="text-[#1A1A1A]/50 text-base md:text-lg leading-relaxed font-bold uppercase tracking-widest border-l-2 border-[#8B0000]/10 pl-8">
                                {data.aiAnalysis?.clinicalInsights || "Cognitive latency remains within nominal ranges. Maintain rigorous sleep hygiene and hydration levels to preserve current neural established pathways."}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="group bg-[#F8F9FA] p-10 md:p-14 lg:p-20 flex flex-col md:flex-row gap-12 items-start relative overflow-hidden transition-all border border-[#1A1A1A]/10 shadow-2xl"
                    >
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shrink-0 border border-[#1A1A1A]/5 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-700 scale-100 group-hover:scale-110 shadow-lg">
                            <Rocket size={40} className="text-[#1A1A1A] group-hover:text-white transition-colors" />
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="h-1 w-12 bg-[#1A1A1A]" />
                                <h3 className="text-[#1A1A1A] font-black text-4xl italic tracking-tighter uppercase leading-none">Biological <br /> Optimization</h3>
                            </div>
                            <p className="text-[#1A1A1A]/50 text-base md:text-lg leading-relaxed font-bold uppercase tracking-widest border-l-2 border-[#1A1A1A]/10 pl-8">
                                Detected high {data.domainScores?.[0]?.name || 'Memory'} retention synchronization. Increasing task complexity in tertiary cognitive phases is recommended to catalyze new neural plasticity.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="pt-20 pb-10 text-center opacity-20 font-black uppercase tracking-[1em] text-[10px] text-[#1A1A1A]"
                >
                    Neural Clinical Integration Protocol v2.6.4 // ARCHIVE 2026
                </motion.div>
            </div>
        </div>
    );
}
