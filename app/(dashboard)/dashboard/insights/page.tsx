"use client";
import React from 'react';
import { Share2, FileText, Filter, MoreHorizontal, Activity } from 'lucide-react';

export default function InsightsPage() {
    return (
        <div className="flex-1 p-8 lg:p-12 min-h-screen font-sans">

            {/* HEADER */}
            <div className="flex justify-between items-start mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Advanced Insights</h1>
                    <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
                        Longitudinal analysis of neural performance trends and predictive risk modeling.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white hover:bg-white/5 transition-colors">
                        <FileText size={16} />
                        Generate Report
                    </button>
                    <button className="bg-[#9D50FF] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#8338ec] transition-all flex items-center gap-2 shadow-lg shadow-[#9D50FF]/25">
                        <Share2 size={16} />
                        Share View
                    </button>
                </div>
            </div>

            {/* AI RISK ASSESSMENT CARD */}
            <div className="bg-[#151024] rounded-3xl border border-white/5 p-8 mb-8 relative overflow-hidden">
                <div className="flex flex-col md:flex-row gap-12 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-bold bg-[#1A4D2E] text-[#4ADE80] px-3 py-1 rounded-full border border-[#4ADE80]/20 uppercase tracking-wider">Active Analysis</span>
                            <span className="text-xs text-gray-500">• 2 minutes ago</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">
                            AI Risk Assessment: <span className="text-[#4ADE80]">Low</span>
                        </h2>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            Longitudinal data indicates a stable neural trajectory. The probability of cognitive decline within the next 5 years remains under 12%. Performance in <span className="text-white font-bold">Logic</span> and <span className="text-white font-bold">Memory</span> clusters are currently 18% above age-group baseline.
                        </p>
                    </div>

                    <div className="bg-[#1A142E] rounded-2xl p-6 border border-white/5 w-full md:w-64 flex flex-col items-center justify-center text-center shadow-2xl">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Confidence Score</p>
                        <div className="text-6xl font-bold text-white mb-4">94<span className="text-[#9D50FF] text-3xl">%</span></div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[#9D50FF] w-[94%]" />
                        </div>
                    </div>
                </div>
                {/* Glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#9D50FF] rounded-full filter blur-[150px] opacity-5 pointer-events-none" />
            </div>

            {/* FILTERS */}
            <div className="flex justify-between items-center mb-6">
                <div className="bg-[#1A142E] rounded-full p-1 border border-white/5 flex gap-1">
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">7D</button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#9D50FF] text-white shadow-lg shadow-[#9D50FF]/25">30D</button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">6M</button>
                    <button className="px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors">1Y</button>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#9D50FF]" />
                        Global Score
                    </div>
                    <button className="flex items-center gap-2 hover:text-white transition-colors">
                        <Filter size={14} /> Filters
                    </button>
                </div>
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Chart */}
                <div className="lg:col-span-2 bg-[#1A142E] rounded-3xl border border-white/5 p-8 flex flex-col h-[500px]">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="font-bold text-lg text-white">Overall Cognitive Trend</h3>
                            <p className="text-xs text-gray-500 mt-1">Aggregated performance across 5 neural domains</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-white">88.4</div>
                            <div className="text-[#4ADE80] text-xs font-bold">↗ +4.2%</div>
                        </div>
                    </div>

                    {/* Dynamic CSS Chart */}
                    <div className="flex-1 relative w-full mt-4">
                        {/* Y Axis Grid */}
                        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-600 font-bold border-l border-white/5 pl-2">
                            <div className="w-full h-px bg-white/5 absolute top-[0%]" />
                            <div className="w-full h-px bg-white/5 absolute top-[25%]" />
                            <div className="w-full h-px bg-white/5 absolute top-[50%]" />
                            <div className="w-full h-px bg-white/5 absolute top-[75%]" />
                        </div>

                        {/* Line Graph SVG */}
                        <svg className="absolute inset-0 w-full h-full pb-6 pl-2 overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 500">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#9D50FF" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#9D50FF" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,450 C50,450 100,420 150,380 C200,340 250,280 300,280 C350,280 400,290 450,250 C500,210 550,150 600,100"
                                fill="none"
                                stroke="#9D50FF"
                                strokeWidth="4"
                                strokeLinecap="round"
                                vectorEffect="non-scaling-stroke"
                            />
                            {/* Points */}
                            <circle cx="150" cy="380" r="4" fill="#1A142E" stroke="#9D50FF" strokeWidth="2" />
                            <circle cx="300" cy="280" r="4" fill="#1A142E" stroke="#9D50FF" strokeWidth="2" />
                            <circle cx="450" cy="250" r="4" fill="#1A142E" stroke="#9D50FF" strokeWidth="2" />
                            <circle cx="600" cy="100" r="4" fill="#1A142E" stroke="#9D50FF" strokeWidth="2" />
                        </svg>

                        {/* X Axis Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-gray-600 font-bold uppercase pl-2">
                            <span>Oct 01</span>
                            <span>Oct 08</span>
                            <span>Oct 15</span>
                            <span>Oct 22</span>
                            <span>Oct 29</span>
                        </div>
                    </div>
                </div>

                {/* Side Domain Breakdown */}
                <div className="bg-[#1A142E] rounded-3xl border border-white/5 p-8 flex flex-col h-[500px]">
                    <h3 className="font-bold text-lg text-white mb-8">Domain Breakdown</h3>

                    <div className="space-y-8 flex-1">
                        {[
                            { label: "Memory", val: 92, color: "bg-[#9D50FF]" },
                            { label: "Logic & Reasoning", val: 85, color: "bg-[#8B5CF6]" },
                            { label: "Attention", val: 78, color: "bg-[#7C3AED]" },
                            { label: "Processing Speed", val: 64, color: "bg-white/10" },
                            { label: "Language", val: 89, color: "bg-[#9D50FF]" },
                        ].map((d, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-[10px] font-bold mb-2">
                                    <span className="text-gray-400 uppercase tracking-widest">{d.label}</span>
                                    <span className="text-white">{d.val}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#151024] p-4 rounded-2xl border border-white/5 mt-auto">
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">
                            *Attention and Speed scores are slightly lower than baseline, likely due to fatigue variables detected in late-night assessments.
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
}
