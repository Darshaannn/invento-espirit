"use client";
import Link from 'next/link';
import { Download, Lightbulb, Rocket } from 'lucide-react';

const domainData = [
    { name: "Logic", score: 98, label: "Exceptional Speed", color: "#9D50FF" },
    { name: "Memory", score: 89, label: "High Retention", color: "#D946EF" },
    { name: "Attention", score: 92, label: "Focused Focus", color: "#00F5FF" },
    { name: "Language", score: 95, label: "Fluent Recall", color: "#8B5CF6" },
];

export default function Dashboard() {
    return (
        <div className="flex-1 p-8 lg:p-12 bg-[#0F0A1F] min-h-screen">

            <div className="lg:hidden p-4">
                <button className="text-white p-2 bg-[#1A142E] rounded-lg">
                    ☰ Menu
                </button>
            </div>

            {/* SECTION 1: HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Results Dashboard</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-gray-400 text-sm">Last scan: Oct 24, 2023</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400 text-sm">09:42 AM</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-colors">
                        <Download size={16} />
                        Export PDF
                    </button>
                    <Link
                        href="/instructions"
                        className="bg-[#9D50FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#8338ec] active:scale-95 transition-all text-sm shadow-lg shadow-[#9D50FF]/20"
                    >
                        New Session
                    </Link>
                </div>
            </div>

            {/* SECTION 2: TOP GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">

                {/* CARD A: COGNITIVE PROFILE (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-[#1A142E] border border-white/5 p-10 rounded-[2rem] relative overflow-hidden group">
                    {/* Background Gradient */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#9D50FF] rounded-full filter blur-[120px] opacity-10" />

                    <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />
                                <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase">Low Risk Status</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-6">
                                Your cognitive <br />
                                profile is <br />
                                <span className="text-cyan-400">exceptionally resilient.</span>
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                                AI analysis shows no immediate clinical risk factors. Your neural connectivity patterns match those of high-performance age groups.
                            </p>
                        </div>

                        {/* Global Index Card Inset */}
                        <div className="bg-[#251B3D]/80 backdrop-blur-sm border border-white/10 p-6 rounded-3xl w-full md:w-48 h-fit flex flex-col items-center justify-center text-center shadow-xl">
                            <p className="text-gray-400 text-xs font-bold mb-2">Global Index</p>
                            <div className="text-6xl font-bold text-white mb-2">94</div>
                            <div className="text-cyan-400 text-[10px] font-bold bg-cyan-500/10 px-2 py-1 rounded-lg">
                                +2.4% vs last month
                            </div>
                        </div>
                    </div>
                </div>

                {/* CARD B: STABILITY TREND (Chart) */}
                <div className="bg-[#151024] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h3 className="font-bold text-lg">Stability Trend</h3>
                            <p className="text-xs text-gray-500 mt-1">6-Month Outlook</p>
                        </div>
                        <span className="text-[10px] font-bold bg-[#1A4D2E] text-[#4ADE80] px-2 py-1 rounded-md border border-[#4ADE80]/20">Stable</span>
                    </div>

                    {/* Chart Placeholder CSS */}
                    <div className="relative h-40 w-full mt-auto">
                        {/* Grid Lines */}
                        <div className="absolute inset-x-0 bottom-0 border-b border-white/5" />
                        <div className="absolute inset-x-0 bottom-1/2 border-b border-white/5 dashed" />

                        {/* Sparkline Path (SVG) */}
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#9D50FF" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#9D50FF" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,80 C20,80 40,70 60,75 C80,80 100,60 120,65 C140,70 160,30 180,40 C200,50 220,90 240,80 C260,70 280,40 300,50"
                                fill="none"
                                stroke="#9D50FF"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />
                        </svg>

                        {/* X Axis Labels */}
                        <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase mt-4 tracking-wider">
                            <span>May</span>
                            <span>Jul</span>
                            <span>Sep</span>
                            <span>Oct</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: DOMAINS TITLE */}
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-xl font-bold text-white">Cognitive Domains</h2>
                <button className="text-[#9D50FF] text-xs font-bold hover:text-white transition-colors">Deep Analysis</button>
            </div>

            {/* SECTION 4: FOUR SMALL CIRCLE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {domainData.map((item) => (
                    <div key={item.name} className="bg-[#1A142E] border border-white/5 p-8 rounded-3xl flex flex-col items-center text-center transition-transform hover:-translate-y-1 duration-300">
                        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                            {/* Circle Background */}
                            <svg className="w-full h-full rotate-[-90deg]">
                                <circle cx="50%" cy="50%" r="40%" stroke="#2D2447" strokeWidth="8" fill="none" />
                                <circle
                                    cx="50%" cy="50%" r="40%"
                                    stroke={item.color}
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray="251"
                                    strokeDashoffset={251 - (251 * item.score) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="absolute text-2xl font-bold text-white">{item.score}</span>
                        </div>
                        <h3 className="text-white font-bold mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-[10px] uppercase tracking-wider">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* SECTION 5: BOTTOM ADVICE CARDS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Advice Card 1 */}
                <div className="group bg-[#1A142E] border border-[#9D50FF]/20 p-8 rounded-3xl flex gap-6 items-start relative overflow-hidden transition-colors hover:border-[#9D50FF]/40">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#9D50FF] rounded-l-3xl" />

                    <div className="w-14 h-14 rounded-full bg-[#1F1635] flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform">
                        <Lightbulb size={24} className="text-[#9D50FF]" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Morning Peak Optimization</h3>
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">Your focus scores reach peak levels between 8:00 AM and 11:00 AM. Consider scheduling complex logic tasks during this window for maximum neural efficiency.</p>
                    </div>
                </div>

                {/* Advice Card 2 */}
                <div className="group bg-[#1A142E] border border-cyan-500/20 p-8 rounded-3xl flex gap-6 items-start relative overflow-hidden transition-colors hover:border-cyan-500/40">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-cyan-500 rounded-l-3xl" />

                    <div className="w-14 h-14 rounded-full bg-[#132A38] flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform">
                        <Rocket size={24} className="text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Resilience Training</h3>
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">You have successfully maintained high memory retention for 12 consecutive weeks. We recommend increasing the difficulty of spatial games to level 8.</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
