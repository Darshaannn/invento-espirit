"use client";
import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, ChevronLeft, Download, Activity, FileText } from 'lucide-react';
import Link from 'next/link';
import { exportToPDF } from '@/lib/utils/export';
import { useSession } from 'next-auth/react';

interface AssessmentHistory {
    sessionId?: string;
    _id?: string;
    timestamp?: string | number | Date;
    completedAt?: string | number | Date;
    aiAnalysis?: {
        summary?: string;
    };
    aiInsights?: string;
    scores?: {
        overallRisk?: string;
        accuracy?: number;
    };
    overallScore?: number;
    riskTier?: string;
}

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
    const [history, setHistory] = useState<AssessmentHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [exporting, setExporting] = useState(false);

    const { data: session } = useSession();

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);

            // IF LOGGED IN: Fetch from DB
            if (session?.user) {
                console.log("[Clinical History] User detected. Fetching from database...");
                try {
                    const res = await fetch('/api/assessments');
                    const result = await res.json();
                    if (result.success) {
                        setHistory(result.data);
                    }
                } catch (err) {
                    console.error("[Clinical History] API Fetch Variance:", err);
                }
            }
            // IF GUEST: Fetch from LocalStorage
            else {
                console.log("[Clinical History] Guest mode. Checking local history...");
                const localHistory = localStorage.getItem('inventoHistory');
                if (localHistory) {
                    try {
                        const parsed = JSON.parse(localHistory);
                        setHistory(Array.isArray(parsed) ? parsed : [parsed]);
                    } catch (e) {
                        console.error("Failed to parse local history", e);
                        setHistory([]);
                    }
                } else {
                    const localData = sessionStorage.getItem('latest_assessment');
                    if (localData) {
                        try {
                            const parsed = JSON.parse(localData);
                            setHistory([parsed]);
                        } catch (e) {
                            console.error("Failed to parse local latest", e);
                            setHistory([]);
                        }
                    } else {
                        setHistory([]);
                    }
                }
            }

            setLoading(false);
        };

        fetchHistory();
    }, [session]);

    const filteredHistory = history.filter(item => {
        if (!item) return false;
        const query = searchQuery.toLowerCase();
        const sId = (item.sessionId || item._id || "").toLowerCase();
        const summary = (item.aiAnalysis?.summary || item.aiInsights || "").toLowerCase();
        return sId.includes(query) || summary.includes(query);
    });

    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedHistory = filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleExport = async () => {
        console.log("[UI Action] Dispatched Clinical Archive Request (v10)...");
        setExporting(true);
        try {
            await exportToPDF({
                elementId: 'clinical-history-content',
                filename: `Clinical_Archive_${new Date().toISOString().split('T')[0]}.pdf`,
                darkBg: true
            });
            console.log("[UI Action] Archive Process: Handshake successful.");
        } catch (err) {
            console.error("[UI Action] Archive Process: Pipeline exception:", err);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0A0A] min-h-screen relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8B0000]/5 blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative w-32 h-32 mb-10 group">
                    <div className="absolute inset-0 border-2 border-[#8B0000]/20 rounded-full animate-ping shadow-[0_0_20px_#8B0000]/10" />
                    <div className="absolute inset-4 border-2 border-[#8B0000]/40 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-8 border-2 border-[#8B0000] rounded-full animate-[spin_1.5s_linear_infinite] border-t-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="text-[#8B0000] animate-pulse" size={32} />
                    </div>
                </div>
                <p className="text-[#ff4444] font-black uppercase tracking-[0.5em] text-[10px] italic shadow-[0_0_15px_rgba(255,68,68,0.3)] animate-pulse text-center">Retrieving Clinical Archive</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-12 bg-[#0A0A0A] min-h-screen font-sans relative text-white/90">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div id="clinical-history-content" className="max-w-7xl mx-auto relative z-10">
                {/* Header with high Z-index to ensure clickability */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-20">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#8B0000] text-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.3em]">Module 01</span>
                            <span className="text-[#1A1A1A]/40 text-[8px] font-black uppercase tracking-[0.3em]">SECURE ACCESS</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white/90 tracking-tighter italic mb-3 uppercase">Clinical History</h1>
                        <p className="text-white/30 font-bold uppercase tracking-widest text-[10px] leading-relaxed max-w-xl">
                            Validated repository for longitudinal cognitive data tracking. Filter by Session ID or analyze behavioral variance across clinical trials.
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="bg-white/5 border border-white/10 text-white px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-white/10 transition-all flex items-center gap-4 disabled:opacity-50 relative overflow-hidden group"
                    >
                        <div className={`absolute inset-0 bg-[#8B0000] transition-transform duration-500 ${exporting ? 'translate-y-0' : 'translate-y-full'}`} />
                        <span className="relative z-10 flex items-center gap-3">
                            {exporting ? <Activity size={18} className="animate-pulse" /> : <Download size={18} />}
                            {exporting ? 'GENERATING ARCHIVE...' : 'EXPORT ARCHIVE'}
                        </span>
                    </button>
                </div>

                {/* Dashboard Search */}
                <div className="bg-white/5 border border-white/10 p-2 mb-10 shadow-sm flex items-center relative z-10 backdrop-blur-md">
                    <div className="px-8 text-white/20">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search records by Session Protocol ID or Summary..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full h-16 bg-transparent outline-none font-bold text-white placeholder:text-white/20 uppercase text-[10px] tracking-widest"
                    />
                </div>

                {/* Records List */}
                <div className="space-y-6">
                    {paginatedHistory.length > 0 ? paginatedHistory.map((item) => (
                        <div key={item.sessionId} className="group bg-white/5 border border-white/10 p-8 hover:border-[#8B0000]/40 transition-all cursor-default relative overflow-hidden flex flex-col md:flex-row md:items-center gap-10 backdrop-blur-sm">
                            <div className="flex items-center gap-6 min-w-[280px]">
                                <div className="p-4 bg-white/5 text-[#8B0000] border border-white/5 group-hover:bg-[#8B0000] group-hover:text-white transition-colors">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-2">Observation Date</p>
                                    <p className="font-black text-white/90 uppercase italic text-base tracking-tight">
                                        {new Date(item.timestamp || item.completedAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-2">Session Protocol ID</p>
                                <p className="font-mono text-xs text-white/50 font-bold truncate max-w-[200px] bg-white/5 px-3 py-1 inline-block border border-white/5">{item.sessionId}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-12">
                                <div className="min-w-[140px]">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-3">Neural Risk</p>
                                    <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${(item.scores?.overallRisk === 'Low' || item.riskTier === 'Low') ? 'bg-green-600/20 text-green-500 border border-green-500/20' :
                                        (item.scores?.overallRisk === 'Moderate' || item.riskTier === 'Moderate') ? 'bg-amber-600/20 text-amber-500 border border-amber-500/20' :
                                            'bg-[#8B0000]/20 text-[#ff4444] border border-[#8B0000]/40'
                                        }`}>
                                        {item.riskTier || item.scores?.overallRisk || 'N/A'}
                                    </span>
                                </div>

                                <div className="min-w-[120px]">
                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none mb-2">Precision</p>
                                    <p className="font-black text-white/90 text-2xl italic tracking-tighter">{item.overallScore || item.scores?.accuracy || 0}<span className="text-[10px] ml-1 opacity-30">%</span></p>
                                </div>

                                <Link
                                    href={`/dashboard?sessionId=${item.sessionId || item._id}`}
                                    className="p-5 bg-white/5 text-white/20 group-hover:text-[#8B0000] group-hover:border-[#8B0000]/20 border border-white/5 transition-all shadow-sm"
                                >
                                    <FileText size={24} />
                                </Link>
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 text-center bg-white border border-[#1A1A1A]/5 shadow-sm">
                            <Activity size={64} className="mx-auto text-[#1A1A1A]/5 mb-8 animate-pulse" />
                            <p className="text-[#1A1A1A]/30 font-black uppercase tracking-[0.4em] text-[10px]">No laboratory records indexed</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 pt-16 border-t border-white/10">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-5 border border-white/10 bg-white/5 text-white/50 hover:bg-[#8B0000] hover:text-white transition-all disabled:opacity-10 shadow-sm"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-16 h-16 border border-white/10 font-black text-[11px] transition-all shadow-sm ${currentPage === i + 1 ? 'bg-white text-black scale-110' : 'bg-white/5 text-white/30 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {(i + 1).toString().padStart(2, '0')}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-5 border border-white/10 bg-white/5 text-white/50 hover:bg-[#8B0000] hover:text-white transition-all disabled:opacity-10 shadow-sm"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/20 italic">
                                DISPENSING PHASE {startIndex + 1}—{Math.min(startIndex + ITEMS_PER_PAGE, filteredHistory.length)}
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/10 mt-1">
                                TOTAL ARCHIVE SIZE: {filteredHistory.length} VALIDATED ENTRIES
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Clinical Footer Disclaimer */}
            <div className="mt-20 max-w-7xl mx-auto pt-10 border-t border-[#1A1A1A]/5 pb-20 relative z-10">
                <p className="text-[9px] text-[#1A1A1A]/20 font-bold uppercase tracking-[0.5em] leading-loose text-center">
                    CONFIDENTIAL CLINICAL DATA • AUTHORIZED ACCESS ONLY • PII PROTECTED PER PROTOCOL 24/B
                </p>
            </div>
        </div>
    );
}
