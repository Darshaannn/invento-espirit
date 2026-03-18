"use client";
import React, { useState, useEffect } from 'react';
import { Share2, FileText, Filter, Activity, TrendingUp, TrendingDown, Clock, ShieldCheck, Settings } from 'lucide-react';
import { exportToPDF } from '@/lib/utils/export';

export default function InsightsPage() {
    const [insights, setInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        console.log("[Clinical Insights] Contacting neural analytics server...");
        const fetchInsights = async () => {
            try {
                const res = await fetch('/api/analytics/insights');
                const result = await res.json();
                if (result.success && result.data) {
                    console.log("[Clinical Insights] Longitudinal data aggregate received.");
                    setInsights(result.data);
                }
            } catch (err) {
                console.error("[Clinical Insights] Analytics Variance:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    const handleExport = async () => {
        console.log("[UI Action] Dispatched Longitudinal Export Request (v10)...");
        setExporting(true);
        try {
            const success = await exportToPDF('clinical-insights-content', `Longitudinal_Report_${new Date().toISOString().split('T')[0]}`);
            if (success) {
                console.log("[UI Action] Report Process: Handshake successful.");
            }
        } catch (err) {
            console.error("[UI Action] Report Process: Pipeline exception:", err);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F1EE] min-h-screen">
                <div className="w-12 h-12 border-4 border-[#8B0000]/20 border-t-[#8B0000] animate-spin mb-4" />
                <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-[10px]">Processing Longitudinal Data</p>
            </div>
        );
    }

    if (!insights) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F1EE] min-h-screen">
                <Activity size={48} className="text-[#1A1A1A]/10 mb-6" />
                <h2 className="text-2xl font-black text-[#1A1A1A] uppercase italic tracking-tighter">Insufficient Data</h2>
                <p className="text-[#1A1A1A]/40 font-bold uppercase tracking-widest text-[10px] max-w-xs text-center mt-3 leading-relaxed">
                    Complete at least two clinical sessions to generate comparative longitudinal insights.
                </p>
            </div>
        );
    }

    const isImproving = !insights.improvement.startsWith('-');

    return (
        <div className="flex-1 p-6 md:p-12 bg-[#F5F1EE] min-h-screen font-sans relative overflow-hidden text-[#1A1A1A]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B0000]/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div id="clinical-insights-content" className="max-w-7xl mx-auto relative z-10">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-20">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#8B0000] text-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.3em]">Analytics V3</span>
                            <span className="text-[#1A1A1A]/40 text-[8px] font-black uppercase tracking-[0.3em]">AI AGGREGATION</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter italic mb-3 uppercase">Advanced Insights</h1>
                        <p className="text-[#1A1A1A]/40 font-bold uppercase tracking-widest text-[10px] leading-relaxed max-w-xl text-black">
                            Longitudinal analysis of neural performance trends across <span className="text-[#8B0000]">{insights.totalAssessments} clinical sessions</span>.
                            Predictive risk modeling based on individual baseline variance.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleExport}
                            disabled={exporting}
                            className="bg-white text-[#1A1A1A] px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] border border-[#1A1A1A]/10 shadow-xl hover:bg-[#F5F1EE] transition-all flex items-center gap-4 disabled:opacity-50 relative overflow-hidden"
                        >
                            <div className={`absolute left-0 top-0 bottom-0 bg-[#8B0000]/10 transition-all duration-300 ${exporting ? 'w-full' : 'w-0'}`} />
                            <span className="relative z-10 flex items-center gap-3">
                                {exporting ? <Activity size={18} className="animate-spin" /> : <FileText size={18} />}
                                {exporting ? 'REPORTING...' : 'GENERATE ARCHIVE'}
                            </span>
                        </button>
                        <button className="bg-[#1A1A1A] text-white px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all flex items-center gap-3">
                            <Share2 size={18} /> SHARE DATA
                        </button>
                    </div>
                </div>

                {/* AI RISK ASSESSMENT CARD */}
                <div className="bg-[#1A1A1A] text-white p-10 md:p-20 mb-12 relative overflow-hidden border-l-8 border-[#8B0000]">
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #8B0000 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

                    <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                        <div className="flex-1 w-full text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 mb-10">
                                <span className={`text-[9px] font-black px-5 py-2 uppercase tracking-[0.3em] ${insights.overallRisk === 'Low' ? 'bg-green-600' : insights.overallRisk === 'Moderate' ? 'bg-amber-600' : 'bg-[#8B0000]'
                                    }`}>
                                    CROSS-SESSION: {insights.overallRisk} RISK
                                </span>
                                <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                    <ShieldCheck size={14} className="text-[#8B0000]" /> VALIDATED AI ANALYSIS
                                </span>
                            </div>
                            <h2 className="text-4xl lg:text-6xl font-black mb-10 italic uppercase tracking-tighter leading-tight">
                                Clinical Trajectory: <span className={insights.overallRisk === 'Low' ? 'text-green-500' : insights.overallRisk === 'Moderate' ? 'text-amber-500' : 'text-[#FF4D4D]'}>Stable</span>
                            </h2>
                            <p className="text-white/60 leading-loose text-sm italic font-medium max-w-2xl bg-white/5 p-6 border border-white/10 uppercase tracking-wide text-[11px]">
                                {insights.riskSummary}
                            </p>
                        </div>

                        <div className="bg-white px-12 py-16 w-full md:w-96 flex flex-col items-center justify-center text-center shrink-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
                            <p className="text-[9px] font-black text-[#1A1A1A]/40 uppercase tracking-[0.4em] mb-6">Aggregate Confidence</p>
                            <div className="text-8xl font-black text-[#1A1A1A] tracking-tighter mb-6 italic">{insights.confidenceScore}<span className="text-[#8B0000] text-4xl">%</span></div>
                            <div className="w-full h-2 bg-[#F5F1EE] overflow-hidden">
                                <div className="h-full bg-[#8B0000]" style={{ width: `${insights.confidenceScore}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTERS & LEGEND */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-8">
                    <div className="flex items-center gap-3 bg-white border border-[#1A1A1A]/10 p-2 shadow-sm">
                        {['7D', '30D', '6M', '1Y'].map(t => (
                            <button key={t} className={`px-8 py-3 text-[9px] font-black uppercase tracking-widest transition-all ${t === '30D' ? 'bg-[#1A1A1A] text-white pointer-events-none' : 'text-[#1A1A1A]/30 hover:text-[#1A1A1A]'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-10 text-[9px] font-black uppercase tracking-[0.4em] text-[#1A1A1A]/40">
                        <div className="flex items-center gap-4">
                            <div className="w-3 h-3 bg-[#8B0000]" />
                            LONGITUDINAL INDEX
                        </div>
                        <button className="flex items-center gap-3 hover:text-[#1A1A1A] transition-colors border-l border-[#1A1A1A]/10 pl-10 font-black uppercase tracking-[0.4em] text-[9px]">
                            <Filter size={16} /> REFINE
                        </button>
                    </div>
                </div>

                {/* CHARTS GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20 text-black">

                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white border border-[#1A1A1A]/10 p-12 flex flex-col h-[600px] shadow-sm relative overflow-hidden group">
                        <div className="flex justify-between items-start mb-16 relative z-10">
                            <div>
                                <h3 className="font-black text-3xl uppercase tracking-tight italic text-[#1A1A1A]">Neural Trend Analysis</h3>
                                <p className="text-[9px] font-black text-[#1A1A1A]/30 uppercase tracking-[0.4em] mt-3">Detecting cross-session cognitive variance</p>
                            </div>
                            <div className="text-right">
                                <div className="text-6xl font-black tracking-tighter italic text-[#1A1A1A]">{insights.overallScore}</div>
                                <div className={`flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-[0.3em] mt-2 ${isImproving ? 'text-green-600' : 'text-[#8B0000]'}`}>
                                    {isImproving ? <TrendingUp size={14} /> : <TrendingDown size={14} />} {insights.improvement} BASELINE DELTA
                                </div>
                            </div>
                        </div>

                        {/* Dynamic SVG Chart */}
                        <div className="flex-1 relative w-full mt-10">
                            <div className="absolute inset-0 flex flex-col justify-between text-[9px] text-[#1A1A1A]/10 font-black border-l border-[#1A1A1A]/10 pl-6">
                                <div className="w-full h-px bg-[#1A1A1A]/5" />
                                <div className="w-full h-px bg-[#1A1A1A]/5" />
                                <div className="w-full h-px bg-[#1A1A1A]/5" />
                                <div className="w-full h-px bg-[#1A1A1A]/5" />
                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full pb-10 pl-6 overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 400">
                                <path
                                    d={insights.trends.length > 1
                                        ? `M ${insights.trends.map((t: any, i: number) => {
                                            const x = (i / (insights.trends.length - 1)) * 800;
                                            const y = 400 - (t.score / 100) * 400;
                                            return `${x},${y}`;
                                        }).join(' L ')}`
                                        : `M 0,200 L 800,200`
                                    }
                                    fill="none"
                                    stroke="#8B0000"
                                    strokeWidth="8"
                                    strokeLinecap="square"
                                    vectorEffect="non-scaling-stroke"
                                />
                                {insights.trends.map((t: any, i: number) => (
                                    <circle
                                        key={i}
                                        cx={(i / (insights.trends.length - 1)) * 800}
                                        cy={400 - (t.score / 100) * 400}
                                        r="8"
                                        fill="white"
                                        stroke="#1A1A1A"
                                        strokeWidth="4"
                                    />
                                ))}
                            </svg>

                            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-[#1A1A1A]/30 font-black uppercase pl-6 tracking-widest bg-white/80 py-2">
                                {insights.trends.map((t: any, i: number) => (
                                    <span key={i} className={i % 2 === 0 ? '' : 'hidden md:inline'}>{t.date}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Side Domain Breakdown */}
                    <div className="bg-white border border-[#1A1A1A]/10 p-12 flex flex-col h-[600px] shadow-sm text-black">
                        <h3 className="font-black text-3xl uppercase tracking-tight italic mb-16 border-b border-[#1A1A1A]/10 pb-8 text-[#1A1A1A]">Longitudinal Index</h3>

                        <div className="space-y-12 flex-1">
                            {insights.domainBreakdown.map((d: any, i: number) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[9px] font-black mb-5 items-end text-black">
                                        <span className="text-[#1A1A1A]/40 uppercase tracking-[0.4em]">{d.label} RATIO</span>
                                        <span className="text-[#1A1A1A] italic text-xl tracking-tighter">{d.value}%</span>
                                    </div>
                                    <div className="w-full h-4 bg-[#F5F1EE] border border-[#1A1A1A]/10 relative shadow-inner">
                                        <div className={`h-full ${d.color} transition-all duration-1000`} style={{ width: `${d.value}%` }} />
                                        <div className="absolute top-0 bottom-0 w-1 bg-[#1A1A1A]/20 left-[85%] z-10" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#1A1A1A] p-8 mt-12 relative overflow-hidden group hover:bg-black transition-colors">
                            <div className="absolute top-0 right-0 p-2 text-white/10 group-hover:text-[#8B0000]/40">
                                <Settings size={40} className="opacity-20" />
                            </div>
                            <p className="text-[9px] text-white/60 leading-relaxed italic font-bold uppercase tracking-[0.4em] relative z-10">
                                RECOMMENDATION: MAINTAIN MODULE 04 NEURAL EXERCISES. VARIANCE WITHIN TOLERANCE.
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Legend disclaimer for chart */}
            <div className="max-w-7xl mx-auto mb-20 text-[8px] font-bold text-[#1A1A1A]/20 uppercase tracking-[0.8em] text-center">
                DATA NORMALIZED COMPARED TO INDIVIDUAL BASELINE PROTOCOL V2.2
            </div>
        </div>
    );
}
