"use client";
import React from 'react';
import { Search, Zap, Play, Clock, Brain, Target, Layers, ArrowRight } from 'lucide-react';

export default function GamesPage() {
    return (
        <div className="flex-1 p-8 lg:p-12 min-h-screen font-sans">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-8">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search cognitive challenges..."
                        className="w-full bg-[#1A142E] text-white border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#9D50FF]/50 transition-colors text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10">
                    <Zap size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold text-sm">1,240 XP</span>
                </div>
            </div>

            {/* FEATURED BANNER */}
            <div className="bg-gradient-to-r from-[#2E1065] to-[#1A142E] rounded-[2rem] border border-white/10 p-10 mb-12 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9D50FF] rounded-full filter blur-[150px] opacity-10 pointer-events-none" />

                <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-[#9D50FF] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Daily Challenge</span>
                        <span className="text-xs text-gray-400">Earn 2x XP Today</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">Synapse Shift: Alpha</h1>
                    <p className="text-gray-400 mb-8 max-w-lg leading-relaxed">
                        Improve your neural plasticity with today's high-speed logical sequence analyzer. Measures Inductive Reasoning and Mental Speed.
                    </p>
                    <div className="flex items-center gap-6">
                        <button className="bg-[#9D50FF] text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#8338ec] shadow-lg shadow-[#9D50FF]/25 hover:scale-105 transition-all">
                            <Play size={18} fill="currentColor" /> Play Now
                        </button>
                        <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                            <Clock size={16} /> 5 min duration
                        </div>
                    </div>
                </div>

                {/* Visual Element (Sphere) */}
                <div className="w-[350px] h-[350px] hidden md:flex items-center justify-center shrink-0 relative bg-black/20 rounded-full border border-white/5 backdrop-blur-sm">
                    <div className="absolute inset-0 border border-[#9D50FF]/20 rounded-full animate-pulse" />
                    <div className="w-[80%] h-[80%] border border-[#9D50FF]/20 rounded-full flex items-center justify-center">
                        <div className="w-[60%] h-[60%] border border-[#9D50FF]/30 rounded-full" />
                    </div>
                    {/* Simple Dot Mesh Overlay (CSS) */}
                    <div className="absolute inset-0 bg-[radial-gradient(#9D50FF_1px,transparent_1px)] [background-size:20px_20px] opacity-30 rounded-full" />
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                <button className="bg-[#9D50FF] text-white px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap shadow-md shadow-[#9D50FF]/20">All Domains</button>
                <button className="bg-[#1A142E] text-gray-400 hover:text-white px-6 py-2.5 rounded-full text-sm font-bold border border-white/5 hover:bg-white/5 whitespace-nowrap flex items-center gap-2 transition-colors">
                    <Brain size={14} /> Memory
                </button>
                <button className="bg-[#1A142E] text-gray-400 hover:text-white px-6 py-2.5 rounded-full text-sm font-bold border border-white/5 hover:bg-white/5 whitespace-nowrap flex items-center gap-2 transition-colors">
                    <Layers size={14} /> Logic
                </button>
                <button className="bg-[#1A142E] text-gray-400 hover:text-white px-6 py-2.5 rounded-full text-sm font-bold border border-white/5 hover:bg-white/5 whitespace-nowrap flex items-center gap-2 transition-colors">
                    <Target size={14} /> Focus
                </button>
                <button className="bg-[#1A142E] text-gray-400 hover:text-white px-6 py-2.5 rounded-full text-sm font-bold border border-white/5 hover:bg-white/5 whitespace-nowrap flex items-center gap-2 transition-colors">
                    <Zap size={14} /> Speed
                </button>
            </div>

            {/* GAMES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Card 1 */}
                <div className="bg-[#151024] border border-white/5 rounded-3xl p-5 hover:border-[#9D50FF]/30 transition-all group cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-white/5">
                        <div className="absolute top-3 left-3 bg-[#0EA5E9] text-white text-[9px] font-bold px-2 py-1 rounded opacity-90 uppercase tracking-wide z-10">Logic</div>
                        {/* Visual */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1A142E] to-black" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500">
                            <div className="w-20 h-20 bg-[#E6B89C] rotate-45 blur-sm opacity-50" />
                            <div className="absolute w-16 h-16 border-2 border-[#E6B89C] rotate-12" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Pattern Recognition</h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                        Decode hidden sequences and algorithmic flows in dynamic environments.
                    </p>
                    <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-auto">
                        <div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Measures</p>
                            <p className="text-xs font-bold text-white">Inductive Reasoning</p>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-[#1A142E] hover:bg-[#9D50FF] hover:text-white border border-white/10 flex items-center justify-center transition-colors">
                            <Play size={16} fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#151024] border border-white/5 rounded-3xl p-5 hover:border-[#9D50FF]/30 transition-all group cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-white/5">
                        <div className="absolute top-3 left-3 bg-[#9D50FF] text-white text-[9px] font-bold px-2 py-1 rounded opacity-90 uppercase tracking-wide z-10">Memory</div>
                        {/* Visual */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1A142E] to-black" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500">
                            <Brain size={64} className="text-[#9D50FF] opacity-50" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Sequence Recall</h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                        Memorize complex visual paths and retrace them under timed pressure.
                    </p>
                    <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-auto">
                        <div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Measures</p>
                            <p className="text-xs font-bold text-white">Working Memory</p>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-[#1A142E] hover:bg-[#9D50FF] hover:text-white border border-white/10 flex items-center justify-center transition-colors">
                            <Play size={16} fill="currentColor" />
                        </button>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#151024] border border-white/5 rounded-3xl p-5 hover:border-[#9D50FF]/30 transition-all group cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden mb-6 border border-white/5">
                        <div className="absolute top-3 left-3 bg-[#10B981] text-white text-[9px] font-bold px-2 py-1 rounded opacity-90 uppercase tracking-wide z-10">Focus</div>
                        {/* Visual */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1A142E] to-black" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500">
                            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full scale-150" />
                            <div className="absolute inset-0 border-4 border-cyan-500/40 rounded-full scale-110" />
                            <div className="absolute inset-0 border-4 border-cyan-500/60 rounded-full scale-75" />
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Distraction Filter</h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                        Identify target patterns amidst high-entropy background noise.
                    </p>
                    <div className="flex justify-between items-end border-t border-white/5 pt-4 mt-auto">
                        <div>
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Measures</p>
                            <p className="text-xs font-bold text-white">Selective Attention</p>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-[#1A142E] hover:bg-[#9D50FF] hover:text-white border border-white/10 flex items-center justify-center transition-colors">
                            <Play size={16} fill="currentColor" />
                        </button>
                    </div>
                </div>

            </div>

            <div className="flex items-center justify-between mt-8 text-xs text-gray-500 font-medium">
                <p>12 Games Available</p>
                <div className="bg-[#1A142E] p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-[#FFE4C4] border-2 border-white/10" />
                    <div>
                        <p className="text-white font-bold">Alex Rivera</p>
                        <p>Level 12 Architect</p>
                    </div>
                    <button className="bg-[#9D50FF]/20 text-[#D8B4FE] text-[10px] font-bold px-3 py-1.5 rounded-full hover:bg-[#9D50FF]/40 transition-colors">Upgrade to Pro</button>
                </div>
            </div>

        </div>
    );
}
