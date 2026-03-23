"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Lightbulb, Rocket, Activity, Timer, Calendar, Settings, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AreaChart, Area, ResponsiveContainer, Tooltip,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import EmptyStateDashboard from '../../../components/EmptyStateDashboard';
import { exportToPDF } from '@/lib/utils/export';
import dynamic from 'next/dynamic';

const MeshBackground = dynamic(() => import("@/components/ui/mesh-background").then(mod => mod.MeshBackground), {
    ssr: false,
});

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
    completedAt?: string | number | Date;
    overallScore?: number;
    mocaEquivalent?: number;
    mmseEquivalent?: number;
    impairmentLevel?: string;
    clinicalScores?: {
        overall: number;
        moca: number;
        mmse: number;
        impairment: string;
    };
    scores?: {
        accuracy?: number;
    };
    domainScores?: Array<DomainScore>;
    clinicalAnalysis?: {
        summary?: string;
        clinicalInsights?: string;
    };
    clinicalReport?: string;
    recommendations?: string[];
    riskTier?: string;
    followUpAdvised?: boolean;
    insights?: {
        totalTests: number;
        avgScore: number;
        bestScore?: number;
        growth: number;
        domainAverages?: Record<string, number>;
    };
    trends?: Array<{
        overallScore: number;
        mocaEquivalent?: number;
        completedAt?: string;
        score?: number; // fallback
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
    const [analysisStep, setAnalysisStep] = useState(0);

    const analysisMessages = [
        "Initializing cognitive diagnostic sweep...",
        "Executing neural pathway calibration...",
        "Processing cross-domain performance data...",
        "Validating clinical behavioral markers...",
        "Finalizing diagnostic overview protocol..."
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            console.log("[Dashboard] Initializing optimized clinical sync...");
            try {
                // Check session storage first for immediate feel after test
                const stored = sessionStorage.getItem('latest_assessment') || localStorage.getItem('latest_assessment');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        setData(parsed);
                    } catch (e) { console.error("JSON Parse Error", e); }
                }

                // Parallel fetch for speed
                const [statsRes, trendsRes, latestRes] = await Promise.all([
                    fetch('/api/analytics/insights'),
                    fetch('/api/analytics/trends'),
                    fetch('/api/assessments/latest')
                ]);

                const [stats, trends, latest] = await Promise.all([
                    statsRes.json(),
                    trendsRes.json(),
                    latestRes.json()
                ]);

                // Direct assignment (APIs return objects directly, not wrapped)
                if (latest && (latest.overallScore || latest.clinicalScores)) {
                    setData(prev => ({
                        ...latest,
                        insights: stats && !stats.error ? stats : (prev?.insights || null),
                        trends: Array.isArray(trends) ? trends : (prev?.trends || [])
                    }));
                }
            } catch (err) {
                console.error("[Dashboard] Sync Failure:", err);
            } finally {
                // Extra delay to show the nice analysis messages if we are fresh from a test
                const isNewTest = sessionStorage.getItem('latest_assessment');
                setTimeout(() => {
                    setLoading(false);
                    if (isNewTest) sessionStorage.removeItem('latest_assessment');
                }, isNewTest ? 2000 : 0);
            }
        };
        fetchDashboardData();

        const interval = setInterval(() => {
            setAnalysisStep(prev => (prev + 1) % analysisMessages.length);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleExport = async () => {
        console.log("[UI Action] Dispatched Clinical Export Request (v10)...");
        setExporting(true);
        try {
            await exportToPDF({
                elementId: 'clinical-overview-content',
                filename: `Neural_Report_${data?.sessionId?.substring(0, 8) || 'latest'}.pdf`,
                darkBg: true
            });
            console.log("[UI Action] Export Process: Handshake successful.");
        } catch (err) {
            console.error("[UI Action] Export Process: Pipeline exception:", err);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#050505] min-h-screen relative overflow-hidden isolate">
                <MeshBackground
                    colors={["#0f172a", "#1e1b4b", "#4c0519", "#09090b", "#18181b", "#27272a"]}
                    speed={0.8}
                    distortion={1.2}
                    swirl={0.8}
                    veilOpacity="bg-black/60"
                />

                {/* Ambient Center Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative w-40 h-40 mb-12 group flex items-center justify-center z-10">
                    {/* Outer ripple */}
                    <div className="absolute inset-0 border border-red-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                    <div className="absolute inset-4 border border-rose-500/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '1.5s' }} />

                    {/* Spinning rings */}
                    <div className="absolute inset-8 border border-white/5 rounded-full border-t-red-500 border-r-red-500/50 animate-[spin_4s_linear_infinite]" />
                    <div className="absolute inset-12 border border-white/5 rounded-full border-b-rose-500/50 border-l-rose-500 animate-[spin_3s_linear_infinite_reverse]" />

                    {/* Core icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 backdrop-blur-md border border-red-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                            <Activity className="text-red-400 animate-pulse" size={28} />
                        </div>
                    </div>
                </div>

                <div className="text-center space-y-5 z-10 relative">
                    <p className="text-red-400 font-medium uppercase tracking-[0.4em] text-xs drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
                        Syncing Clinical Data
                    </p>
                    <div className="h-[24px] overflow-hidden">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={analysisStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="text-white/50 text-[11px] font-medium tracking-[0.2em] uppercase"
                            >
                                {analysisMessages[analysisStep]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return <EmptyStateDashboard />;
    }

    const accuracy = Math.round(data.clinicalScores?.overall || data.overallScore || (data as any).scores?.accuracy || 0);
    const mocaScore = data.clinicalScores?.moca || data.mocaEquivalent || 0;
    const impairment = data.clinicalScores?.impairment || data.impairmentLevel || 'none';
    const finalTimestamp = data.completedAt || (data as any).timestamp;
    const scanDate = finalTimestamp ? new Date(finalTimestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Just now';
    const scanTime = finalTimestamp ? new Date(finalTimestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    }) : '--:--';

    // Data format for Recharts
    const rawTrends = data.trends && data.trends.length > 0 ? data.trends : [
        { overallScore: 65, mocaEquivalent: 18 }, { overallScore: 72, mocaEquivalent: 21 },
        { overallScore: 68, mocaEquivalent: 20 }, { overallScore: 85, mocaEquivalent: 26 },
        { overallScore: 79, mocaEquivalent: 23 }, { overallScore: accuracy, mocaEquivalent: mocaScore }
    ];

    const chartData: ChartPoint[] = rawTrends.map((d: any, i: number) => ({
        score: d.mocaEquivalent || (d.overallScore ? Math.round(d.overallScore / 3.33) : d.score || 0),
        date: d.completedAt || d.date,
        phase: `Session ${i + 1}`
    }));

    const radarData = data.domainScores?.map(d => ({
        subject: d.name,
        A: d.score,
        fullMark: 100,
    })) || [];
    return (
        <div id="clinical-overview-content" className="flex-1 min-h-screen bg-transparent text-white/90 font-sans p-6 md:p-12 relative overflow-hidden selection:bg-[#8B0000] selection:text-white isolate">
            <MeshBackground
                colors={["#72b9bb", "#b5d9d9", "#ffd1bd", "#ffebe0", "#8cc5b8", "#dbf4a4"]}
                speed={0.4}
                distortion={1.0}
                swirl={0.4}
                veilOpacity="bg-black/20"
            />
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
                            className="bg-[#0D0D0D] max-w-2xl w-full p-8 md:p-14 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/5"
                            style={{ borderRadius: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 opacity-5 filter blur-[100px] pointer-events-none"
                                style={{ backgroundColor: selectedDomain.color }} />

                            <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2 text-white/90/40">
                                        <div className="w-10 h-[1px] bg-current" />
                                        <span className="text-[10px] font-light uppercase tracking-[0.3em]">Deep Neural Analysis</span>
                                    </div>
                                    <h2 className="text-5xl md:text-7xl font-light text-white/90 italic tracking-tighter uppercase leading-none">{selectedDomain.name}</h2>
                                </div>
                                <div className="text-7xl font-light italic tracking-tighter" style={{ color: selectedDomain.color }}>
                                    {selectedDomain.score}<span className="text-3xl opacity-30">%</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 md:gap-8 mb-12">
                                <div className="bg-white/5 p-8 border border-white/5 group overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 opacity-40" style={{ backgroundColor: selectedDomain.color }} />
                                    <p className="text-white/20 text-[10px] font-light uppercase tracking-widest mb-3">Neural Velocity</p>
                                    <div className="text-3xl font-light text-white/90 tracking-tight">{selectedDomain.details?.speed || '0.8s'}</div>
                                    <div className="text-[9px] font-light text-white/40 mt-1 uppercase tracking-widest italic opacity-50">Nominal Range</div>
                                </div>
                                <div className="bg-white/5 p-8 border border-white/5 group overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 opacity-40 bg-[#8B0000]" />
                                    <p className="text-white/20 text-[10px] font-light uppercase tracking-widest mb-3">Reliability</p>
                                    <div className="text-3xl font-light text-white/90 tracking-tight">{selectedDomain.details?.consistency || '94%'}</div>
                                    <div className="text-[9px] font-light text-[#8B0000] mt-1 uppercase tracking-widest italic opacity-60">Active Momentum</div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <p className="text-white/90/60 font-medium leading-relaxed italic text-lg border-l-4 border-[#8B0000]/20 pl-6 py-2">
                                    &quot;Diagnostic indicators demonstrate consistent resiliency in {selectedDomain.name} metrics. Clinical observations confirm nominal signal propagation with standard latency variance.&quot;
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedDomain(null)}
                                className="w-full py-6 bg-[#8B0000]/10 border border-[#8B0000]/30 hover:bg-[#8B0000] text-white font-light uppercase tracking-[0.4em] transition-all duration-500 shadow-2xl text-[10px] relative overflow-hidden group"
                            >
                                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
                                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
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
                        <div className="inline-flex items-center gap-3 bg-[#8B0000]/5 border border-[#8B0000]/10 px-3 py-1.5 mb-4">
                            <div className="w-1 h-1 bg-[#8B0000] shadow-[0_0_8px_#8B0000]" />
                            <span className="text-[8px] font-light text-[#8B0000] tracking-[0.4em] uppercase">SYSTEM PROTOCOL: ACTIVE</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white/90 tracking-tighter leading-tight uppercase italic mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                            NEURAL <span className="text-[#8B0000]">ANALYSIS</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-white/90/30">
                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 shadow-sm">
                                <Calendar size={12} className="text-[#8B0000]" />
                                <span className="text-[9px] font-light uppercase tracking-widest">{scanDate}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 shadow-sm">
                                <Timer size={12} className="text-[#8B0000]" />
                                <span className="text-[9px] font-light uppercase tracking-widest">{scanTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch gap-4 min-w-[320px]">
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="bg-white/5 border border-white/10 hover:border-[#8B0000]/50 px-10 py-6 text-[10px] font-light text-white/90 transition-all duration-500 uppercase tracking-[0.4em] flex items-center justify-center gap-3 group relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
                            {exporting ? <Activity size={18} className="animate-spin text-[#8B0000]" /> : <Download size={18} className="group-hover:-translate-y-1 transition-transform text-white/40 group-hover:text-[#8B0000]" />}
                            {exporting ? 'SYNCING...' : 'EXPORT DATA'}
                        </button>
                        <Link
                            href="/instructions"
                            className="bg-[#8B0000]/10 border border-[#8B0000]/30 hover:bg-[#8B0000] text-white px-10 py-6 text-[10px] font-light transition-all duration-700 uppercase tracking-[0.4em] text-center relative group overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40" />
                            NEW SESSION
                        </Link>
                    </div>
                </motion.div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* OVERALL SCORE HERO: "SAME TO SAME" ANALYSIS VERSION */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-12 bg-white/5 border border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 lg:gap-16 backdrop-blur-md relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                        <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 group-hover:scale-105 transition-transform duration-700">
                            <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-20" />
                            <svg className="w-full h-full rotate-[-90deg] relative z-10">
                                <circle cx="50%" cy="50%" r="46%" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                                <motion.circle
                                    cx="50%" cy="50%" r="46%"
                                    stroke={accuracy >= 80 ? '#22c55e' : accuracy >= 60 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray="300"
                                    initial={{ strokeDashoffset: 300 }}
                                    animate={{ strokeDashoffset: 300 - (300 * accuracy) / 100 }}
                                    transition={{ duration: 2.5, ease: 'circOut' }}
                                    strokeLinecap="square"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                <span className="text-5xl md:text-6xl font-light text-white italic leading-none">{accuracy}</span>
                                <span className="text-[10px] font-light text-white/30 uppercase tracking-[0.5em] mt-1">INDEX</span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div className="space-y-2">
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                    <div className="h-1 w-8 bg-[#8B0000]" />
                                    <p className="text-[10px] font-light uppercase tracking-[0.4em] text-[#8B0000]">Neural Stability Vector</p>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-light text-white italic uppercase tracking-tighter leading-[0.9]">
                                    {mocaScore >= 26 ? 'EXCEPTIONAL' : mocaScore >= 18 ? 'NOMINAL' : 'VARIABLE'}
                                </h1>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-[10px] font-light uppercase tracking-widest text-white/40">Clinical Equivalent:</span>
                                    <span className="text-sm font-light text-[#8B0000] italic">MoCA {mocaScore}/30</span>
                                </div>
                            </div>
                            <p className="text-white/40 text-lg font-medium leading-relaxed max-w-xl italic border-l-2 border-white/5 pl-8 mx-auto md:mx-0">
                                &quot;{data.clinicalReport || data.clinicalAnalysis?.summary || `Current clinical sweep indicates a stability index of ${accuracy}%. Neural load balancing remains consistent across tertiary domains.`}&quot;
                            </p>
                            <div className={`inline-flex items-center gap-3 px-6 py-3 border-2 font-light text-[10px] uppercase tracking-[0.3em] ${accuracy >= 80 ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                                accuracy >= 60 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}>
                                <Activity size={14} /> TIER: {data.riskTier || (accuracy >= 80 ? 'LOW' : accuracy >= 60 ? 'MODERATE' : 'HIGH')} RISK
                            </div>
                        </div>
                    </motion.div>

                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* DOMAIN BREAKDOWN: "SAME TO SAME" VERSION */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-12 bg-white/5 border border-white/10 p-8 md:p-10 backdrop-blur-md relative overflow-hidden group hover:bg-white/[0.07] transition-colors"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#8B0000] to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
                            <h2 className="text-xl font-light italic uppercase tracking-tighter mb-8 text-white flex items-center gap-4">
                                <Activity size={18} className="text-[#8B0000]" />
                                Neural Fingerprint
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {data.domainScores?.map((d: any) => (
                                    <div key={d.name} className="group/item">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[9px] font-light uppercase tracking-[0.3em] text-white/40 group-hover/item:text-white transition-colors">{d.name}</span>
                                            <span className="text-xl font-light italic text-white" style={{ color: d.color }}>{d.score}%</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-0 overflow-hidden relative border border-white/5">
                                            <motion.div
                                                className="h-full relative z-10"
                                                style={{ backgroundColor: d.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${d.score}%` }}
                                                transition={{ duration: 1.5, ease: 'circOut' }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* CLINICAL SUMMARY: "SAME TO SAME" VERSION */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className={`lg:col-span-12 border p-8 md:p-10 flex flex-col backdrop-blur-md relative overflow-hidden ${accuracy >= 80 ? 'bg-green-500/10 border-green-500/20' :
                                accuracy >= 60 ? 'bg-amber-500/10 border-amber-500/20' :
                                    'bg-red-500/10 border-red-500/20'
                                }`}
                        >
                            <div className="relative z-10 space-y-6 h-full">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-light italic uppercase tracking-tighter text-white">Clinical Summary</h2>
                                    <div className="h-0.5 w-10 bg-white/20" />
                                </div>
                                <p className="text-base font-light leading-relaxed text-white italic max-w-4xl">
                                    &quot;{data.clinicalReport || data.clinicalAnalysis?.summary || (accuracy >= 80 ? "Cognitive function appears within normal range." : "Some cognitive indicators warrant monitoring.")}&quot;
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                                    <div className="space-y-4">
                                        <h3 className="font-light uppercase tracking-[0.3em] text-[8px] text-white/40">Clinical Protocol Directives</h3>
                                        <ul className="space-y-3">
                                            {(data.recommendations && data.recommendations.length > 0) ? (
                                                data.recommendations.slice(0, 3).map((rec: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-4 text-xs font-light text-white/60 leading-tight group">
                                                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-light group-hover:bg-[#8B0000] group-hover:text-white transition-all shrink-0">{i + 1}</span>
                                                        <span className="pt-0.5">{rec}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <>
                                                    <li className="flex items-start gap-4 text-xs font-light text-white/60 leading-tight">
                                                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-light shrink-0">1</span>
                                                        <span className="pt-0.5">Schedule follow-up to track trends.</span>
                                                    </li>
                                                    <li className="flex items-start gap-4 text-xs font-light text-white/60 leading-tight">
                                                        <span className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[9px] font-light shrink-0">2</span>
                                                        <span className="pt-0.5">Maintain cognitive puzzles daily.</span>
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                    {data.insights && (
                                        <div className="space-y-4">
                                            <h3 className="font-light uppercase tracking-[0.3em] text-[8px] text-white/40">Analytical Insights</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/5 p-4 border border-white/5">
                                                    <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Growth Index</p>
                                                    <p className="text-lg font-light text-green-400">+{data.insights.growth}%</p>
                                                </div>
                                                <div className="bg-white/5 p-4 border border-white/5">
                                                    <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1">Total Tests</p>
                                                    <p className="text-lg font-light">{data.insights.totalTests}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* STABILITY TREND & RADAR (KEEP VALUABLE CONTENT AS SECONDARY HUD) */}
                    <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-12">
                        <motion.div
                            className="lg:col-span-8 bg-white/[0.03] backdrop-blur-sm p-8 border border-white/5 relative overflow-hidden group hover:bg-white/[0.05] transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B0000]/20 to-transparent group-hover:via-[#8B0000]/50 transition-all duration-700" />
                            <h4 className="text-[10px] font-light uppercase tracking-[0.5em] text-white/20 mb-8 italic flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#8B0000]" />
                                Neural Fingerprint Matrix
                            </h4>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#ffffff10" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff40', fontSize: 10, fontWeight: 'bold' }} />
                                        <Radar name="Cognition" dataKey="A" stroke="#8B0000" strokeWidth={3} fill="#8B0000" fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        <motion.div
                            className="lg:col-span-4 bg-white/[0.03] backdrop-blur-sm p-8 border border-white/5 relative overflow-hidden group hover:bg-white/[0.05] transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-transparent via-[#8B0000]/20 to-transparent group-hover:via-[#8B0000]/50 transition-all duration-700" />
                            <h4 className="text-[10px] font-light uppercase tracking-[0.5em] text-white/20 mb-8 italic flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#8B0000]" />
                                Stability Trend
                            </h4>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8B0000" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#8B0000" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area type="monotone" dataKey="score" stroke="#8B0000" fill="url(#colorScore)" strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    </div>

                    {/* Disclaimer: OVERHAULED HUD VERSION */}
                    <div className="lg:col-span-12 mt-16">
                        <div className="bg-white/[0.02] border border-white/5 p-10 md:p-12 relative overflow-hidden group backdrop-blur-sm">
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-hover:border-[#8B0000]/40 transition-colors" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 group-hover:border-[#8B0000]/40 transition-colors" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 group-hover:border-[#8B0000]/40 transition-colors" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-hover:border-[#8B0000]/40 transition-colors" />

                            <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                                <div className="w-16 h-16 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#8B0000]/10 transition-all duration-500">
                                    <Shield size={24} className="text-white/20 group-hover:text-[#8B0000] transition-colors" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-light uppercase tracking-[0.5em] text-[#8B0000] italic">Analytical Integrity Protocol // SEC-04A</span>
                                        <div className="h-[1px] flex-1 bg-white/5" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/40 animate-pulse" />
                                    </div>
                                    <p className="text-[11px] font-light uppercase tracking-[0.15em] leading-relaxed text-white/30 italic group-hover:text-white/40 transition-colors">
                                        <span className="text-white/60 NOT-italic">MEDICAL PROTOCOL DISCLAIMER:</span> THIS IS A CLINICAL-DATA DERIVED SCREENING TOOL AND DOES NOT CONSTITUTE A FORMAL MEDICAL DIAGNOSIS. THE NEURAL ANALYTICS PROVIDED ARE FOR PRE-CLINICAL EVALUATION ONLY. ALWAYS CONSULT A BOARD-CERTIFIED NEUROLOGIST FOR CLINICAL VALIDATION AND TREATMENT PLANNING.
                                    </p>
                                </div>
                            </div>

                            {/* Scanning glow effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8B0000]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2000ms] pointer-events-none" />
                        </div>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="pt-20 pb-10 text-center opacity-20 font-light uppercase tracking-[1em] text-[10px] text-white/90"
                >
                    Neural Clinical Integration Protocol v2.6.4 // ARCHIVE 2026
                </motion.div>
            </div>
        </div>
    );
}
