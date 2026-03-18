"use client";
import React from 'react';
import { Search, Zap, Play, Clock, Brain, Target, Layers, Activity } from 'lucide-react';

export default function GamesPage() {
    return (
        <div className="flex-1 p-6 md:p-12 bg-[#F5F1EE] min-h-screen font-sans relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8B0000]/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1A1A]/20" size={18} />
                        <input
                            type="text"
                            placeholder="Search cognitive challenges..."
                            className="w-full bg-white text-[#1A1A1A] border border-[#1A1A1A]/5 py-4 pl-12 pr-4 focus:outline-none focus:border-[#8B0000]/30 transition-all font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-3 bg-white border border-[#1A1A1A]/5 px-6 py-3 shadow-sm">
                        <Zap size={18} className="text-[#8B0000]" />
                        <span className="text-[#1A1A1A] font-black uppercase tracking-widest text-xs">1,240 XP Cumulative</span>
                    </div>
                </div>

                {/* FEATURED BANNER */}
                <div className="bg-[#1A1A1A] text-white p-10 md:p-16 mb-12 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
                    {/* Visual Decor */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #8B0000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#8B0000]/20 blur-[100px] translate-y-1/2 translate-x-1/2" />

                    <div className="flex-1 relative z-10 text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                            <span className="bg-[#8B0000] text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.3em]">Module 04: Active</span>
                            <span className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-2">
                                <Clock size={12} /> 5 Min Neural Sweep
                            </span>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black tracking-tighter italic mb-4 uppercase">Synapse Shift: Alpha</h1>
                        <p className="text-white/50 mb-10 max-w-lg leading-relaxed italic font-medium">
                            Improve your neural plasticity with high-speed logical sequence analysis. This tool measures Inductive Reasoning and Mental Speed.
                        </p>

                        <div className="inline-block border-2 border-[#8B0000] bg-[#8B0000]/10 px-8 py-4">
                            <p className="text-[#8B0000] font-black uppercase tracking-[0.2em] text-sm animate-pulse">
                                Will be Integrated soon!!
                            </p>
                        </div>
                    </div>

                    {/* Sphere Visual */}
                    <div className="w-[300px] h-[300px] hidden md:flex items-center justify-center shrink-0 relative bg-white/5 border border-white/10">
                        <div className="absolute inset-0 border border-[#8B0000]/20 animate-pulse" />
                        <div className="w-[80%] h-[80%] border border-[#8B0000]/20 flex items-center justify-center">
                            <div className="w-[60%] h-[60%] border border-[#8B0000]/30" />
                        </div>
                        <Activity size={48} className="text-[#8B0000]/40" />
                    </div>
                </div>

                {/* FILTERS */}
                <div className="flex gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    <button className="bg-[#1A1A1A] text-white px-8 py-3 text-xs font-black uppercase tracking-widest shadow-xl">All Protocols</button>
                    {['Memory', 'Logic', 'Focus', 'Speed'].map((filter) => (
                        <button key={filter} className="bg-white text-[#1A1A1A]/40 hover:text-[#1A1A1A] px-8 py-3 text-xs font-black uppercase tracking-widest border border-[#1A1A1A]/5 transition-all">
                            {filter}
                        </button>
                    ))}
                </div>

                {/* GAMES GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { title: "Pattern Recognition", domain: "Logic", measures: "Inductive Reasoning", color: "bg-blue-600" },
                        { title: "Sequence Recall", domain: "Memory", measures: "Working Memory", color: "bg-[#8B0000]" },
                        { title: "Distraction Filter", domain: "Focus", measures: "Selective Attention", color: "bg-emerald-600" }
                    ].map((game, i) => (
                        <div key={i} className="bg-white border border-[#1A1A1A]/5 p-6 group relative overflow-hidden flex flex-col">
                            <div className="aspect-video bg-[#F5F1EE] mb-6 relative overflow-hidden border border-[#1A1A1A]/5">
                                <div className="absolute top-4 left-4 bg-white text-[#1A1A1A] text-[9px] font-black px-3 py-1 uppercase tracking-widest z-10 border border-[#1A1A1A]/5">
                                    {game.domain}
                                </div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                    <div className={`w-24 h-24 ${game.color} opacity-20 rotate-45`} />
                                    <Activity size={64} className="absolute text-[#1A1A1A]/10" />
                                </div>
                                {/* SOON OVERLAY */}
                                <div className="absolute inset-0 bg-[#F5F1EE]/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <p className="text-[#8B0000] font-black uppercase tracking-widest text-[10px]">Upcoming Integration</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-[#1A1A1A] tracking-tight uppercase mb-2 italic">{game.title}</h3>
                            <p className="text-[#1A1A1A]/40 text-xs font-bold leading-relaxed mb-8 italic flex-1 truncate">
                                Analyzing complex datasets to establish neural baselines for {game.domain.toLowerCase()} function.
                            </p>
                            <div className="flex justify-between items-end border-t border-[#1A1A1A]/5 pt-6 mt-auto">
                                <div>
                                    <p className="text-[9px] text-[#1A1A1A]/20 font-black uppercase tracking-widest mb-1 text-center md:text-left">Measure Index</p>
                                    <p className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-tighter">{game.measures}</p>
                                </div>
                                <div className="p-3 bg-[#F5F1EE] text-[#1A1A1A]/20 border border-[#1A1A1A]/5 group-hover:text-[#8B0000] transition-colors">
                                    <Play size={16} fill="currentColor" className="opacity-40" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-12 border-t border-[#1A1A1A]/5 flex flex-col md:flex-row items-center justify-between gap-8 mb-20 text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]/30">
                    <p>Core Diagnostic Library Status: 12 Modules Pending</p>
                    <div className="bg-white p-6 border border-[#1A1A1A]/5 flex flex-col md:flex-row gap-8 items-center shadow-sm">
                        <div className="w-12 h-12 bg-[#F5F1EE] border border-[#1A1A1A]/5 flex items-center justify-center overflow-hidden">
                            <span className="text-[#1A1A1A] font-black text-lg">AR</span>
                        </div>
                        <div className="text-center md:text-left">
                            <p className="text-[#1A1A1A] font-black mb-0.5">Clinical Profile</p>
                            <p className="text-[#1A1A1A]/40">Alex Rivera • Level 12 Architect</p>
                        </div>
                        <button className="bg-[#8B0000] text-white px-6 py-3 hover:bg-black transition-all shadow-xl font-black uppercase tracking-[0.2em] text-[10px]">
                            Update Record
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
