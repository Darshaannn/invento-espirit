"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Lightbulb, Rocket, Activity, Timer, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyStateDashboard from '../../../components/EmptyStateDashboard';

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDomain, setSelectedDomain] = useState<any>(null);
    const [hoveredPoint, setHoveredPoint] = useState<any>(null);

    interface ChartPoint {
        x: number;
        y: number;
        score: number;
        date: string;
    }

    useEffect(() => {
        // ... (existing fetch logic remains same)
        const fetchLatest = async () => {
            try {
                const localData = localStorage.getItem('latest_assessment');
                if (localData) {
                    const parsed = JSON.parse(localData);
                    if (!parsed.domainScores) {
                        const domains = ['Memory', 'Attention', 'Executive', 'Orientation'];
                        parsed.domainScores = domains.map(domain => {
                           const baseScore = Math.round(parsed.scores?.accuracy || 0);
                           const variance = Math.floor(Math.random() * 10) - 5;
                           return {
                               name: domain,
                               score: Math.min(100, Math.max(0, baseScore + variance)),
                               label: baseScore > 75 ? "Stable" : "Review Needed",
                               color: domain === 'Memory' ? '#D946EF' : domain === 'Attention' ? '#00F5FF' : domain === 'Executive' ? '#9D50FF' : '#8B5CF6',
                               details: { speed: "0.8s avg", consistency: "94%", trend: "Improvin" }
                           };
                        });
                    }
                    setData(parsed);
                    setLoading(false);
                }

                const res = await fetch('/api/assessments/latest');
                const result = await res.json();
                if (result.success && result.data) {
                    setData(result.data);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLatest();
    }, []);

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0F0A1F] min-h-screen">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p className="text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px]">Syncing Clinical Data</p>
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

    // SVG Chart Helpers
    const chartData = data.trends && data.trends.length > 0 ? data.trends : [
        { score: 65 }, { score: 72 }, { score: 68 }, { score: 85 }, { score: 79 }, { score: accuracy }
    ];
    const chartWidth = 300;
    const chartHeight = 100;
    const points: ChartPoint[] = chartData.map((d: any, i: number) => ({
        x: (i / (chartData.length - 1)) * chartWidth,
        y: chartHeight - (d.score / 100) * chartHeight,
        score: d.score,
        date: d.date || `Phase ${i + 1}`
    }));

    const pathData = points.reduce((acc: string, p: ChartPoint, i: number) => {
        if (i === 0) return `M ${p.x},${p.y}`;
        const prev = points[i - 1];
        const cp1x = prev.x + (p.x - prev.x) / 2;
        return `${acc} C ${cp1x},${prev.y} ${cp1x},${p.y} ${p.x},${p.y}`;
    }, "");

    return (
        <div className="flex-1 p-6 md:p-8 lg:p-12 bg-[#0F0A1F] min-h-screen relative overflow-hidden">
            <div className="ambient-bg opacity-40" />

            <AnimatePresence>
                {selectedDomain && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-2xl bg-black/60"
                        onClick={() => setSelectedDomain(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass-2 max-w-2xl w-full p-12 rounded-[4rem] border-white/10 relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 opacity-20 filter blur-3xl pointer-events-none" 
                                 style={{ backgroundColor: selectedDomain.color }} />
                            
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter mb-2">{selectedDomain.name}</h2>
                                    <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Deep Neural Analysis</p>
                                </div>
                                <div className="text-6xl font-black italic tracking-tighter" style={{ color: selectedDomain.color }}>
                                    {selectedDomain.score}%
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-12">
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-2">Neural Speed</p>
                                    <div className="text-2xl font-bold text-white tracking-tight">0.8s <span className="text-[10px] text-green-500">(0.2s faster)</span></div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-2">Consistency</p>
                                    <div className="text-2xl font-bold text-white tracking-tight">94.1% <span className="text-xs text-indigo-400 italic font-black">STABLE</span></div>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Clinical Insights</h4>
                                <div className="flex items-start gap-4">
                                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: selectedDomain.color }} />
                                    <p className="text-gray-400 font-medium leading-relaxed italic">
                                        Patient demonstrates high resiliency in {selectedDomain.name} metrics. Neural pathways are well-established with minimal latency variance across Phase 2 stimuli.
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedDomain(null)}
                                className="w-full py-6 rounded-3xl bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest transition-all border border-white/10"
                            >
                                Close Deep Scan
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* SECTION 1: HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 status-pill px-3 py-1 mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-black text-green-500 tracking-widest uppercase italic">Neural Link Active</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-md italic">Results Dashboard</h1>
                        <div className="flex items-center gap-3 mt-4">
                            <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                                <Calendar size={14} className="text-indigo-500/50" />
                                <span>Last scan: {scanDate}</span>
                            </div>
                            <span className="text-white/10">•</span>
                            <div className="flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-widest">
                                <Timer size={14} className="text-indigo-500/50" />
                                <span>{scanTime}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/5 bg-white/[0.03] text-sm font-black text-white/60 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">
                            <Download size={18} />
                            Export Data
                        </button>
                        <Link
                            href="/instructions"
                            className="flex-1 md:flex-none yobe-btn-premium text-sm px-8 py-4"
                        >
                            New Session
                        </Link>
                    </div>
                </div>

                {/* SECTION 2: TOP GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

                    {/* CARD A: COGNITIVE PROFILE */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5, rotateX: 2, rotateY: -2 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="lg:col-span-2 glass-2 p-10 md:p-14 rounded-[4rem] relative overflow-hidden group border-white/5 cursor-default"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full filter blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity" />

                        <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10">
                            <div className="flex-1 text-center md:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_12px_cyan] animate-pulse" />
                                    <span className="text-[11px] font-black text-cyan-400 tracking-[0.2em] uppercase">Status: {data.scores?.overallRisk || 'Resilient'}</span>
                                </div>
                                <h2 className="text-4xl lg:text-7xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                                    Your profile is <br />
                                    <span className="gradient-text italic">
                                        {accuracy > 85 ? 'exceptionally' : accuracy > 65 ? 'consistently' : 'currently'} <br />
                                        {accuracy > 85 ? 'resilient.' : accuracy > 65 ? 'stable.' : 'variable.'}
                                    </span>
                                </h2>
                                <p className="text-gray-400 text-lg leading-relaxed max-w-md font-medium">
                                    {data.aiAnalysis?.summary || "Neural connectivity patterns match those of high-performance benchmarks. No immediate variance detected."}
                                </p>
                            </div>

                            {/* Global Index Card Inset */}
                            <motion.div 
                                animate={{ scale: [1, 1.02, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] w-full md:w-64 h-fit flex flex-col items-center justify-center text-center shadow-2xl relative"
                            >
                                <div className="absolute inset-0 bg-indigo-500/5 rounded-[3rem] animate-pulse" />
                                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-4 relative z-10">Neural Index</p>
                                <div className="text-8xl font-black text-white mb-4 tracking-tighter relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{accuracy}</div>
                                <div className="text-cyan-400 text-[11px] font-black bg-cyan-500/10 px-4 py-2 rounded-2xl border border-cyan-400/20 relative z-10 italic">
                                    +2.4% vs benchmark
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* CARD B: STABILITY TREND */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-2 p-10 rounded-[4rem] flex flex-col justify-between relative overflow-hidden border-white/5"
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="font-black text-2xl text-white tracking-tight italic">Neural Stability</h3>
                                <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-2">Active Momentum</p>
                            </div>
                            <span className="text-[10px] font-black bg-green-500/10 text-green-400 px-3 py-1.5 rounded-xl border border-green-500/20 uppercase tracking-widest">Optimized</span>
                        </div>

                        {/* Chart Area */}
                        <div className="relative h-48 w-full mt-auto flex flex-col cursor-crosshair">
                            <div className="flex-1 relative">
                                <svg 
                                    className="w-full h-full overflow-visible" 
                                    viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                                    preserveAspectRatio="none"
                                    onMouseLeave={() => setHoveredPoint(null)}
                                >
                                    <path
                                        d={pathData}
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_8px_rgba(157,80,255,0.5)]"
                                    />
                                    {points.map((p: ChartPoint, i: number) => (
                                        <g key={i}>
                                            <circle 
                                                cx={p.x} 
                                                cy={p.y} 
                                                r="4" 
                                                fill="#FFF" 
                                                className="opacity-0 hover:opacity-100 transition-opacity" 
                                                onMouseEnter={() => setHoveredPoint(p)}
                                            />
                                            {/* Hover Target Overlay */}
                                            <rect 
                                                x={p.x - 15} y={0} width={30} height={chartHeight} 
                                                fill="transparent" 
                                                onMouseEnter={() => setHoveredPoint(p)}
                                            />
                                        </g>
                                    ))}
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#9D50FF" />
                                            <stop offset="100%" stopColor="#00F5FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                {hoveredPoint && (
                                    <motion.div 
                                        layoutId="tooltip"
                                        className="absolute z-50 bg-white p-3 rounded-2xl shadow-2xl pointer-events-none"
                                        style={{ 
                                            left: `${(hoveredPoint.x / chartWidth) * 100}%`, 
                                            top: `${(hoveredPoint.y / chartHeight) * 100}%`,
                                            transform: "translate(-50%, -120%)"
                                        }}
                                    >
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{hoveredPoint.date}</p>
                                        <h4 className="text-xl font-black text-black tracking-tighter">{hoveredPoint.score}%</h4>
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex justify-between text-[9px] text-white/20 font-black uppercase mt-8 tracking-[0.3em] border-t border-white/5 pt-4">
                                <span>Cycle Start</span>
                                <span>Latest Sync</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* SECTION 3: DOMAINS */}
                <div className="flex justify-between items-end mb-8 px-4">
                    <div>
                        <h2 className="text-3xl font-black text-white italic tracking-tight">Cognitive Domains</h2>
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-[0.4em] mt-2">Sub-Neural Vertical Analysis</p>
                    </div>
                    <button className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                        View Deep Log <Activity size={14} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {data.domainScores?.map((item: any) => (
                        <motion.div 
                            key={item.name} 
                            onClick={() => setSelectedDomain(item)}
                            whileHover={{ y: -12, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-1 p-8 rounded-[3rem] border-white/5 flex flex-col items-center text-center transition-all duration-500 cursor-pointer group hover:bg-white/[0.05]"
                        >
                            <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                                <svg className="w-full h-full rotate-[-90deg]">
                                    <circle cx="50%" cy="50%" r="42%" stroke="rgba(255,255,255,0.03)" strokeWidth="10" fill="none" />
                                    <motion.circle
                                        initial={{ strokeDashoffset: 265 }}
                                        animate={{ strokeDashoffset: 265 - (265 * item.score) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        cx="50%" cy="50%" r="42%"
                                        stroke={item.color}
                                        strokeWidth="10"
                                        fill="none"
                                        strokeDasharray="265"
                                        strokeLinecap="round"
                                        style={{ filter: `drop-shadow(0 0 10px ${item.color}66)` }}
                                    />
                                </svg>
                                <span className="absolute text-3xl font-black text-white italic tracking-tighter group-hover:scale-110 transition-transform">{item.score}</span>
                            </div>
                            <h3 className="text-white font-black text-lg mb-2 uppercase tracking-tight italic">{item.name}</h3>
                            <div className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] border flex items-center gap-2`}
                                 style={{ color: item.color, borderColor: `${item.color}33`, backgroundColor: `${item.color}11` }}>
                                {item.label} <Activity size={10} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* SECTION 5: CLINICAL INSIGHTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    <motion.div 
                        whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.04)" }}
                        className="group glass-2 p-10 rounded-[3.5rem] flex gap-8 items-start relative overflow-hidden transition-all border-white/5 cursor-help"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-indigo-500" />
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 group-hover:rotate-12 transition-transform">
                            <Lightbulb size={28} className="text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-2xl italic tracking-tight mb-4 uppercase">System Recommendation</h3>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium capitalize">
                                {data.aiAnalysis?.clinicalInsights || "Cognitive latency remains within nominal ranges. Maintain current sleep hygiene and hydration levels for peak neural performance."}
                            </p>
                        </div>
                    </motion.div>

                    <motion.div 
                        whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.04)" }}
                        className="group glass-2 p-10 rounded-[3.5rem] flex gap-8 items-start relative overflow-hidden transition-all border-white/5 cursor-help"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-cyan-500" />
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 group-hover:-rotate-12 transition-transform">
                            <Rocket size={28} className="text-cyan-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-2xl italic tracking-tight mb-4 uppercase">Neural Optimization</h3>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                Detected high {data.domainScores?.[0]?.name || 'Memory'} retention. We recommend increasing stimulus complexity in Phase 4 tasks to drive neural plasticity.
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="pb-12 text-center opacity-10 font-black uppercase tracking-[1em] text-[10px] text-white">
                    Neural Clinical Integration v2.4 LTS
                </div>
            </div>
        </div>
    );
}
