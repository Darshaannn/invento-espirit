"use client";
import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, ChevronLeft, Download, Activity, FileText } from 'lucide-react';
import Link from 'next/link';
import { exportToPDF } from '@/lib/utils/export';
import { useSession } from 'next-auth/react';

interface AssessmentHistory {
    sessionId: string;
    timestamp: string | number | Date;
    aiAnalysis?: {
        summary?: string;
    };
    scores?: {
        overallRisk?: string;
        accuracy?: number;
    };
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
            // IF GUEST: Fetch from SessionStorage (volatile)
            else {
                console.log("[Clinical History] Guest mode. Checking local session storage...");
                const localData = sessionStorage.getItem('latest_assessment');
                if (localData) {
                    try {
                        const parsed = JSON.parse(localData);
                        setHistory([parsed]); // Show only the latest test for guest
                    } catch (e) {
                        console.error("Failed to parse local history", e);
                    }
                } else {
                    setHistory([]);
                }
            }

            setLoading(false);
        };

        fetchHistory();
    }, [session]);

    const filteredHistory = history.filter(item =>
        item.sessionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aiAnalysis?.summary?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedHistory = filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleExport = async () => {
        console.log("[UI Action] Dispatched Clinical Archive Request (v10)...");
        setExporting(true);
        try {
            const success = await exportToPDF('clinical-history-content', `Clinical_Archive_${new Date().toISOString().split('T')[0]}`);
            if (success) {
                console.log("[UI Action] Archive Process: Handshake successful.");
            }
        } catch (err) {
            console.error("[UI Action] Archive Process: Pipeline exception:", err);
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-[#F5F1EE] min-h-screen">
                <div className="w-12 h-12 border-4 border-[#8B0000]/20 border-t-[#8B0000] animate-spin mb-4" />
                <p className="text-[#8B0000] font-black uppercase tracking-[0.3em] text-[10px]">Retrieving Clinical Records</p>
            </div>
        );
    }

    return (
        <div className="flex-1 p-6 md:p-12 bg-[#F5F1EE] min-h-screen font-sans relative">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1A1A1A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div id="clinical-history-content" className="max-w-7xl mx-auto relative z-10">
                {/* Header with high Z-index to ensure clickability */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-8 relative z-20">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-[#8B0000] text-white px-3 py-1 text-[8px] font-black uppercase tracking-[0.3em]">Module 01</span>
                            <span className="text-[#1A1A1A]/40 text-[8px] font-black uppercase tracking-[0.3em]">SECURE ACCESS</span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-[#1A1A1A] tracking-tighter italic mb-3 uppercase">Clinical History</h1>
                        <p className="text-[#1A1A1A]/40 font-bold uppercase tracking-widest text-[10px] leading-relaxed max-w-xl">
                            Validated repository for longitudinal cognitive data tracking. Filter by Session ID or analyze behavioral variance across clinical trials.
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="bg-[#1A1A1A] text-white px-10 py-5 font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all flex items-center gap-4 disabled:opacity-50 relative overflow-hidden group"
                    >
                        <div className={`absolute inset-0 bg-[#8B0000] transition-transform duration-500 ${exporting ? 'translate-y-0' : 'translate-y-full'}`} />
                        <span className="relative z-10 flex items-center gap-3">
                            {exporting ? <Activity size={18} className="animate-pulse" /> : <Download size={18} />}
                            {exporting ? 'GENERATING ARCHIVE...' : 'EXPORT ARCHIVE'}
                        </span>
                    </button>
                </div>

                {/* Dashboard Search */}
                <div className="bg-white border border-[#1A1A1A]/10 p-2 mb-10 shadow-sm flex items-center relative z-10">
                    <div className="px-8 text-[#1A1A1A]/20">
                        <Search size={22} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search records by Session Protocol ID or Summary..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full h-16 bg-transparent outline-none font-bold text-[#1A1A1A] placeholder:text-[#1A1A1A]/20 uppercase text-[10px] tracking-widest"
                    />
                </div>

                {/* Records List */}
                <div className="space-y-6">
                    {paginatedHistory.length > 0 ? paginatedHistory.map((item) => (
                        <div key={item.sessionId} className="group bg-white border border-[#1A1A1A]/5 p-8 hover:border-[#8B0000]/40 transition-all cursor-default relative overflow-hidden flex flex-col md:flex-row md:items-center gap-10">
                            <div className="flex items-center gap-6 min-w-[280px]">
                                <div className="p-4 bg-[#F5F1EE] text-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-white transition-colors">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-[#1A1A1A]/30 uppercase tracking-widest leading-none mb-2 text-black">Observation Date</p>
                                    <p className="font-black text-[#1A1A1A] uppercase italic text-base tracking-tight">{new Date(item.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-[10px] font-black text-[#1A1A1A]/30 uppercase tracking-widest leading-none mb-2 text-black">Session Protocol ID</p>
                                <p className="font-mono text-xs text-[#1A1A1A]/60 font-bold truncate max-w-[200px] bg-[#F5F1EE] px-3 py-1 inline-block border border-[#1A1A1A]/5">{item.sessionId}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-12">
                                <div className="min-w-[140px]">
                                    <p className="text-[10px] font-black text-[#1A1A1A]/30 uppercase tracking-widest leading-none mb-3 text-black">Neural Risk</p>
                                    <span className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm ${item.scores?.overallRisk === 'Low' ? 'bg-green-600 text-white' :
                                        item.scores?.overallRisk === 'Moderate' ? 'bg-amber-600 text-white' :
                                            'bg-[#8B0000] text-white'
                                        }`}>
                                        {item.scores?.overallRisk || 'N/A'}
                                    </span>
                                </div>

                                <div className="min-w-[120px]">
                                    <p className="text-[10px] font-black text-[#1A1A1A]/30 uppercase tracking-widest leading-none mb-2 text-black">Precision</p>
                                    <p className="font-black text-[#1A1A1A] text-2xl italic tracking-tighter">{item.scores?.accuracy || 0}<span className="text-[10px] ml-1 opacity-30">%</span></p>
                                </div>

                                <Link
                                    href={`/report?sessionId=${item.sessionId}`}
                                    className="p-5 bg-[#F5F1EE] text-[#1A1A1A]/20 group-hover:text-[#8B0000] group-hover:border-[#8B0000]/20 border border-[#1A1A1A]/5 transition-all shadow-sm"
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
                    <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-8 pt-16 border-t border-[#1A1A1A]/10">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="p-5 border border-[#1A1A1A]/10 bg-white text-[#1A1A1A] hover:bg-[#8B0000] hover:text-white transition-all disabled:opacity-30 shadow-sm"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`w-16 h-16 border border-[#1A1A1A]/10 font-bold text-[11px] transition-all shadow-sm ${currentPage === i + 1 ? 'bg-[#1A1A1A] text-white scale-110' : 'bg-white text-[#1A1A1A]/40 hover:text-[#1A1A1A]'
                                        }`}
                                >
                                    {(i + 1).toString().padStart(2, '0')}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="p-5 border border-[#1A1A1A]/10 bg-white text-[#1A1A1A] hover:bg-[#8B0000] hover:text-white transition-all disabled:opacity-30 shadow-sm"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#1A1A1A]/40 italic">
                                DISPENSING PHASE {startIndex + 1}—{Math.min(startIndex + ITEMS_PER_PAGE, filteredHistory.length)}
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#1A1A1A]/20 mt-1">
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
