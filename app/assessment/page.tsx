"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Settings, Brain, Clock, ArrowLeft } from 'lucide-react';

export default function Assessment() {
    const [selectedOption, setSelectedOption] = useState<string | null>("C");

    return (
        <div className="min-h-screen bg-[#0F0A1F] text-white flex flex-col font-sans selection:bg-[#9D50FF] selection:text-white relative overflow-hidden">

            {/* Background radial gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2a1b55] rounded-full filter blur-[150px] opacity-20 pointer-events-none" />

            {/* HEADER */}
            <header className="flex justify-between items-center px-8 py-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#9D50FF] flex items-center justify-center">
                        <Brain size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-wide">Invento Espirit Assessment</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-[#1A142E] px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-sm font-medium hover:border-[#9D50FF]/50 transition-colors cursor-default">
                        <Clock size={14} className="text-[#9D50FF]" />
                        00 : 30
                    </div>
                    <button className="p-2 rounded-full bg-[#1A142E] hover:bg-white/10 transition-colors border border-white/5">
                        <Settings size={18} className="text-gray-400" />
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT CENTERED */}
            <main className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-4xl bg-[#130D26]/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 md:p-14 shadow-2xl relative">

                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-[#9D50FF] text-xs font-bold uppercase tracking-widest mb-1">Question 4 of 20</h2>
                            <p className="text-gray-400 text-sm">Pattern Recognition</p>
                        </div>
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-[#1A142E]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                                <path className="text-[#9D50FF]" strokeDasharray="20, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            </svg>
                            <span className="absolute text-[9px] font-bold">20%</span>
                        </div>
                    </div>

                    {/* Question Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 leading-tight">
                        Which of the following shapes was shown <br /> in the previous slide?
                    </h1>

                    {/* Image Placeholder */}
                    <div className="w-full h-64 md:h-80 bg-[#FFE4C4] rounded-3xl mb-12 flex items-center justify-center overflow-hidden shadow-inner relative group cursor-pointer">
                        {/* This would be the actual image. Using a placeholder pattern */}
                        <div className="absolute w-32 h-32 bg-[#E6B89C] rounded-full top-1/4 left-1/3 shadow-xl" />
                        <div className="absolute w-40 h-24 bg-[#8B9582] rounded-[2rem] bottom-1/4 right-1/3 shadow-xl transform rotate-3" />
                        <div className="absolute w-28 h-12 bg-[#F0F4F8] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg rotate-12" />
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {[
                            { id: 'A', text: 'Rotating Hexagon' },
                            { id: 'B', text: 'Pulsating Sphere' },
                            { id: 'C', text: 'Converging Vectors' },
                            { id: 'D', text: 'Fractal Grid' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSelectedOption(opt.id)}
                                className={`p-4 rounded-full border-2 text-left font-medium transition-all duration-200 flex items-center ${selectedOption === opt.id
                                    ? 'bg-[#5B21B6]/20 border-[#9D50FF] shadow-[0_0_20px_rgba(157,80,255,0.3)]'
                                    : 'bg-[#1A142E] border-white/5 hover:bg-[#251B3D] text-gray-300'
                                    }`}
                            >
                                <span className={`w-6 inline-block text-right mr-4 text-xs font-bold ${selectedOption === opt.id ? 'text-[#9D50FF]' : 'text-gray-500'
                                    }`}>{opt.id}</span>
                                {opt.text}
                            </button>
                        ))}
                    </div>

                    {/* Footer Navigation */}
                    <div className="flex justify-between items-center border-t border-white/5 pt-8">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-full">
                            <ArrowLeft size={16} /> Previous
                        </button>

                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-white transition-colors text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-full">
                                Skip Question
                            </button>
                            <Link href="/analysis" className="bg-[#9D50FF] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-[#9D50FF]/25 hover:bg-[#8338ec] hover:scale-105 active:scale-95 transition-all">
                                Confirm Answer
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            {/* FOOTER HINT */}
            <footer className="py-8 text-center relative z-10">
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                    Try to recall the motion and color of the center object from the previous 5-second exposure.
                </p>

                {/* Carousel Dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9D50FF]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
            </footer>

        </div>
    );
}
