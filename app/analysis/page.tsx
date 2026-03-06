"use client";
import React, { useEffect, useState } from 'react';
import { Brain, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Analysis() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);

    // Fake analysis progress simulation
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    // Redirect to dashboard after completion
                    setTimeout(() => router.push('/dashboard'), 1000);
                    return 100;
                }
                return prev + 1;
            });
        }, 50); // 5 seconds total

        return () => clearInterval(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-[#0F0A1F] text-white flex flex-col font-sans selection:bg-[#9D50FF] selection:text-white relative overflow-hidden items-center justify-center">

            {/* HEADER */}
            <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-8 py-6 z-20">
                <div className="flex items-center gap-3 bg-[#1A142E]/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-[#9D50FF] flex items-center justify-center shadow-[0_0_10px_#9D50FF]">
                        <Brain size={14} className="text-white" />
                    </div>
                    <span className="font-bold text-sm tracking-wide">AI Pattern Analysis</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-xs font-mono text-[#9D50FF] bg-[#9D50FF]/10 px-3 py-1 rounded-full border border-[#9D50FF]/20">
                        Session ID: DX-7702
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#E6B89C] border-2 border-white/20" />
                </div>
            </header>

            {/* CENTRAL VISUAL (PULSING BRAIN) */}
            <div className="relative mb-16">
                {/* Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-dotted border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full" />

                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#9D50FF] rounded-full filter blur-[100px] opacity-30 animate-pulse" />

                {/* Central Icon */}
                <div className="relative z-10 w-32 h-32 rounded-full bg-[#9D50FF]/10 backdrop-blur-sm flex items-center justify-center border border-[#9D50FF]/30 shadow-[0_0_50px_rgba(157,80,255,0.3)] animate-pulse">
                    <Brain size={48} className="text-white opacity-90" />
                </div>
            </div>

            {/* TEXT & LOADING */}
            <div className="text-center max-w-2xl px-6 relative z-10 mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                    Analyzing cognitive response patterns...
                </h1>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-gray-400 text-sm md:text-base">
                    <span>Identifying linguistic variances</span>
                    <span className="text-white/20">•</span>
                    <span>Mapping neural pathways</span>
                    <span className="text-white/20">•</span>
                    <span>Cross-referencing baseline data</span>
                </div>
            </div>

            {/* PROGRESS CARD */}
            <div className="w-full max-w-lg bg-[#1A142E] rounded-2xl border border-white/10 p-6 shadow-2xl relative z-10">
                <div className="flex justify-between items-end mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#9D50FF] animate-bounce" />
                        <span className="text-sm font-bold">Neural mapping in progress</span>
                    </div>
                    <span className="text-[#9D50FF] font-mono font-bold">{progress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-[#9D50FF] shadow-[0_0_15px_#9D50FF] transition-all duration-100 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center gap-3 text-gray-500 text-[10px] font-bold uppercase tracking-widest border-t border-white/5 pt-4">
                    <Database size={12} />
                    <span>Evaluating Memory Recall & Syntax...</span>
                </div>
            </div>

            {/* FOOTER NOTE */}
            <footer className="absolute bottom-8 text-center px-4 w-full">
                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                    This is a cognitive screening tool, not a medical diagnosis. Data processed via encrypted AI nodes.
                </p>
            </footer>

        </div>
    );
}
