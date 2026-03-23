"use client";
import Link from 'next/link';
import { Settings, User, Clock, Volume2, Eye, ArrowRight, VolumeX, Activity, AlertTriangle } from 'lucide-react';

export default function Instructions() {
    return (
        <div className="min-h-screen bg-[#F5F1EE] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#8B0000] selection:text-white">

            {/* HEADER */}
            <header className="flex justify-between items-center px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#8B0000] flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rotate-12" />
                    </div>
                    <span className="font-light text-xl tracking-wider uppercase tracking-[0.2em] text-[#1A1A1A]">Invento.</span>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 bg-black/5 hover:bg-black/10 transition-colors">
                        <Settings size={20} className="text-[#1A1A1A]/40" />
                    </button>
                    <button className="p-2 bg-black/5 hover:bg-black/10 transition-colors">
                        <User size={20} className="text-[#1A1A1A]/40" />
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT CENTERED */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-white border border-[#1A1A1A]/5 p-12 shadow-xl relative overflow-hidden">

                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <div>
                            <h1 className="text-4xl font-light mb-2 tracking-tighter text-[#1A1A1A]">Cognitive Screening Protocol</h1>
                            <p className="text-[#1A1A1A]/50 font-medium italic">Clinical-grade behavioral assessment and mental baseline mapping.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#8B0000]/5 px-4 py-2 text-xs font-light tracking-wide text-[#8B0000] border border-[#8B0000]/10">
                            <Clock size={14} /> ~5 MINS
                        </div>
                    </div>

                    {/* DETAILS CARD */}
                    <div className="bg-[#F5F1EE] border border-[#1A1A1A]/5 p-8 mb-10 relative z-10">
                        <h3 className="text-[10px] font-light uppercase tracking-[0.4em] text-[#1A1A1A]/40 mb-6">Assessment Blueprint</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-3xl font-light tracking-tighter text-[#1A1A1A]">25</p>
                                <p className="text-[9px] font-light text-[#1A1A1A]/40 uppercase tracking-widest">Questions</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-light tracking-tighter text-[#1A1A1A]">4</p>
                                <p className="text-[9px] font-light text-[#1A1A1A]/40 uppercase tracking-widest">Core Domains</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-[#1A1A1A]/5 grid grid-cols-2 gap-y-4">
                            {['Memory', 'Attention', 'Executive Function', 'Orientation'].map((domain) => (
                                <div key={domain} className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#8B0000]" />
                                    <span className="text-xs font-light text-[#1A1A1A]/60">{domain}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI ANALYSIS INFO */}
                    <div className="mb-10 space-y-4 relative z-10">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#1A1A1A]/5 border border-[#1A1A1A]/10 flex items-center justify-center shrink-0">
                                <Activity size={20} className="text-[#8B0000]" />
                            </div>
                            <div>
                                <h4 className="font-light text-lg leading-none mb-1 text-[#1A1A1A]">Diagnostic Analysis.</h4>
                                <p className="text-[#1A1A1A]/50 text-sm leading-relaxed italic">Our system analyzes accuracy, response latency, and decision-making patterns to evaluate cognitive consistency.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link href="/screening" className="w-full group bg-[#1A1A1A] p-6 flex items-center justify-center gap-4 font-light uppercase tracking-widest text-sm text-white shadow-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Start Screening Assessment <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    {/* DISCLAIMER */}
                    <div className="mt-8 p-6 border border-amber-500/10 flex gap-4 items-start relative z-10">
                        <AlertTriangle size={20} className="text-amber-500 shrink-0" />
                        <p className="text-[11px] leading-relaxed text-gray-500 font-medium italic">
                            <strong className="text-amber-500/80 uppercase tracking-widest mr-2">Disclaimer:</strong>
                            This screening tool is not a medical diagnosis. It is designed for baseline awareness only. Please consult a healthcare professional for clinical advice.
                        </p>
                    </div>

                </div>
            </main>

            {/* FOOTER */}
            <footer className="py-6 text-center text-[10px] text-[#1A1A1A]/30 uppercase tracking-widest font-light">
                © 2026 Invento Espirit. Clinical Diagnostic Protocol V2.5
            </footer>

        </div>
    );
}

