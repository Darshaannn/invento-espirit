"use client";
import React from 'react';
import { Search, Calendar, CheckCircle2, AlertTriangle, XCircle, ChevronRight, ChevronLeft, Download } from 'lucide-react';

export default function HistoryPage() {
    return (
        <div className="flex-1 p-8 lg:p-12 min-h-screen font-sans">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Screening History</h1>
                    <p className="text-gray-400">You have completed <span className="text-white font-bold">42</span> cognitive assessments this year.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white hover:bg-white/5 transition-colors">
                    <Download size={16} />
                    Export Data
                </button>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by patient ID, name, or keywords..."
                        className="w-full bg-[#1A142E] text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#9D50FF]/50 transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 bg-[#1A142E] text-white px-4 py-3 rounded-xl border border-white/5 font-medium hover:bg-white/5">
                    <Calendar size={18} className="text-gray-400" />
                    Date Range
                </button>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-[#1A4D2E]/20 text-[#4ADE80] px-4 py-3 rounded-xl border border-[#4ADE80]/20 font-bold text-xs uppercase hover:bg-[#1A4D2E]/40">
                        Low Risk <CheckCircle2 size={14} />
                    </button>
                    <button className="bg-[#1A142E] text-amber-500 px-4 py-3 rounded-xl border border-white/5 font-bold text-xs uppercase hover:bg-white/5">
                        Medium Risk
                    </button>
                    <button className="bg-[#1A142E] text-rose-500 px-4 py-3 rounded-xl border border-white/5 font-bold text-xs uppercase hover:bg-white/5">
                        High Risk
                    </button>
                </div>
            </div>

            {/* LIST */}
            <div className="space-y-4 mb-10">

                {/* Item 1 */}
                <div className="p-1 rounded-[20px] bg-gradient-to-r from-[#1A142E] to-[#130D26] hover:from-[#251B3D] hover:to-[#1A142E] transition-all group">
                    <div className="bg-[#1A142E] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-32 h-20 rounded-xl bg-gradient-to-br from-emerald-900 to-[#1A142E] overflow-hidden relative shrink-0 border border-white/5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent opacity-50" />
                            {/* Abstract Lines */}
                            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0,50 Q50,0 100,50" stroke="#4ADE80" fill="none" />
                                <path d="M0,50 Q50,100 100,50" stroke="#4ADE80" fill="none" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-bold bg-[#1A4D2E] text-[#4ADE80] px-2 py-0.5 rounded border border-[#4ADE80]/20 uppercase">Low Risk</span>
                                <span className="text-xs text-gray-500">• Oct 24, 2023, 14:32</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Screening #A92-421</h3>
                            <p className="text-gray-400 text-sm">Score: <span className="text-white font-bold">88/100</span> • Patient shows consistent cognitive stability. Visual recognition performance is above average.</p>
                        </div>
                        <button className="bg-[#251B3D] text-white px-5 py-2.5 rounded-xl font-bold text-sm border border-white/5 group-hover:bg-[#9D50FF] group-hover:border-[#9D50FF] transition-all flex items-center gap-2 shrink-0">
                            View Details <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="p-1 rounded-[20px] bg-gradient-to-r from-[#1A142E] to-[#130D26] hover:from-[#251B3D] hover:to-[#1A142E] transition-all group">
                    <div className="bg-[#1A142E] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-32 h-20 rounded-xl bg-gradient-to-br from-amber-900/50 to-[#1A142E] overflow-hidden relative shrink-0 border border-white/5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent opacity-50" />
                            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="40" stroke="#F59E0B" fill="none" strokeDasharray="4 4" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-bold bg-[#422006] text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 uppercase">Medium Risk</span>
                                <span className="text-xs text-gray-500">• Oct 22, 2023, 09:15</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Screening #B77-109</h3>
                            <p className="text-gray-400 text-sm">Score: <span className="text-white font-bold">64/100</span> • Slight decrease in memory recall tasks compared to previous session. Recommended follow-up.</p>
                        </div>
                        <button className="bg-[#251B3D] text-white px-5 py-2.5 rounded-xl font-bold text-sm border border-white/5 group-hover:bg-[#9D50FF] group-hover:border-[#9D50FF] transition-all flex items-center gap-2 shrink-0">
                            View Details <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Item 3 */}
                <div className="p-1 rounded-[20px] bg-gradient-to-r from-[#1A142E] to-[#130D26] hover:from-[#251B3D] hover:to-[#1A142E] transition-all group">
                    <div className="bg-[#1A142E] rounded-2xl p-6 border-l-4 border-rose-500 flex flex-col md:flex-row gap-6 items-center shadow-[inset_0_0_20px_rgba(244,63,94,0.1)]">
                        <div className="w-full md:w-32 h-20 rounded-xl bg-black overflow-hidden relative shrink-0 border border-white/10">
                            <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-bold bg-[#4C0519] text-rose-500 px-2 py-0.5 rounded border border-rose-500/20 uppercase">High Risk</span>
                                <span className="text-xs text-gray-500">• Oct 18, 2023, 11:45</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Screening #D12-983</h3>
                            <p className="text-gray-400 text-sm">Score: <span className="text-white font-bold">42/100</span> • Significant anomalies detected in executive function tests. Immediate clinical review required.</p>
                        </div>
                        <button className="bg-[#251B3D] text-white px-5 py-2.5 rounded-xl font-bold text-sm border border-white/5 group-hover:bg-[#9D50FF] group-hover:border-[#9D50FF] transition-all flex items-center gap-2 shrink-0">
                            View Details <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Item 4 */}
                <div className="p-1 rounded-[20px] bg-gradient-to-r from-[#1A142E] to-[#130D26] hover:from-[#251B3D] hover:to-[#1A142E] transition-all group">
                    <div className="bg-[#1A142E] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row gap-6 items-center">
                        <div className="w-full md:w-32 h-20 rounded-xl bg-gradient-to-br from-cyan-900/50 to-[#1A142E] overflow-hidden relative shrink-0 border border-white/5">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent opacity-50" />
                            {/* Abstract Lines */}
                            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M50,50 L10,10 M50,50 L90,10 M50,50 L10,90 M50,50 L90,90" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-bold bg-[#1A4D2E] text-[#4ADE80] px-2 py-0.5 rounded border border-[#4ADE80]/20 uppercase">Low Risk</span>
                                <span className="text-xs text-gray-500">• Oct 12, 2023, 16:05</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">Screening #C55-221</h3>
                            <p className="text-gray-400 text-sm">Score: <span className="text-white font-bold">92/100</span> • Patient exhibits exceptional performance in spatial reasoning and pattern recognition.</p>
                        </div>
                        <button className="bg-[#251B3D] text-white px-5 py-2.5 rounded-xl font-bold text-sm border border-white/5 group-hover:bg-[#9D50FF] group-hover:border-[#9D50FF] transition-all flex items-center gap-2 shrink-0">
                            View Details <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* PAGINATION */}
            <div className="flex justify-between items-center text-xs text-gray-400 font-medium">
                <p>Showing 1-10 of 42 screenings</p>
                <div className="flex items-center gap-2">
                    <button className="w-8 h-8 rounded-lg bg-[#1A142E] hover:bg-white/5 flex items-center justify-center transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 rounded-lg bg-[#9D50FF] text-white flex items-center justify-center shadow-lg shadow-[#9D50FF]/25">1</button>
                    <button className="w-8 h-8 rounded-lg bg-[#1A142E] hover:bg-white/5 flex items-center justify-center transition-colors">2</button>
                    <button className="w-8 h-8 rounded-lg bg-[#1A142E] hover:bg-white/5 flex items-center justify-center transition-colors">3</button>
                    <button className="w-8 h-8 rounded-lg bg-[#1A142E] hover:bg-white/5 flex items-center justify-center transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

        </div>
    );
}
