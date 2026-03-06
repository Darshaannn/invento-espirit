"use client";
import Link from 'next/link';
import { Settings, User, Clock, Volume2, Eye, ArrowRight, VolumeX } from 'lucide-react';

export default function Instructions() {
    return (
        <div className="min-h-screen bg-[#0F0A1F] text-white flex flex-col font-sans selection:bg-[#9D50FF] selection:text-white">

            {/* HEADER */}
            <header className="flex justify-between items-center px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#9D50FF] flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-sm rotate-12" />
                    </div>
                    <span className="font-bold text-xl tracking-wider">INVENTO ESPIRIT</span>
                </div>
                <div className="flex gap-4">
                    <button className="p-2 rounded-full bg-[#1A142E] hover:bg-white/10 transition-colors">
                        <Settings size={20} className="text-gray-400" />
                    </button>
                    <button className="p-2 rounded-full bg-[#1A142E] hover:bg-white/10 transition-colors">
                        <User size={20} className="text-gray-400" />
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT CENTERED */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-[#0F0A1F] rounded-[2rem] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    {/* Glow Effect */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9D50FF] rounded-full filter blur-[120px] opacity-5 pointer-events-none" />


                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Screening Instructions</h1>
                            <p className="text-gray-400">Let&apos;s prepare your environment for the best results.</p>
                        </div>
                        <div className="flex items-center gap-2 bg-[#2D2447] px-4 py-2 rounded-full text-xs font-bold tracking-wide text-[#E0B0FF] border border-[#9D50FF]/20">
                            <Clock size={14} /> 10 MINS
                        </div>
                    </div>

                    {/* ACTIVE SESSION CARD */}
                    <div className="relative rounded-2xl overflow-hidden mb-12 border border-white/10 group">
                        {/* Background Image Placeholder */}
                        <div className="h-32 bg-gradient-to-r from-[#2a1b55] to-[#452b7a] relative">
                            <div className="absolute inset-0 bg-[#000000]/20" />
                            {/* Abstract nebulas */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-overlay filter blur-[60px] opacity-20" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-overlay filter blur-[60px] opacity-20" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#130D26] to-transparent pt-12 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Session</p>
                                <h3 className="text-lg font-bold">Cognitive Wellness Baseline Assessment</h3>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-[#9D50FF] flex items-center justify-center text-[10px] font-bold">AI</div>
                        </div>
                    </div>

                    {/* STEPS */}
                    <div className="space-y-8 relative z-10 pl-4 mb-12">
                        {/* Connecting Line */}
                        <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#9D50FF] via-[#9D50FF]/50 to-transparent opacity-30" />

                        {/* Step 1 */}
                        <div className="flex gap-6 relative">
                            <div className="w-10 h-10 rounded-full bg-[#2a1f45] border border-[#9D50FF]/30 flex items-center justify-center shrink-0 z-10">
                                <VolumeX size={18} className="text-[#9D50FF]" />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-lg mb-1">Find a Quiet Space</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">Background noise can interfere with the audio processing. A private room is ideal.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="flex gap-6 relative">
                            <div className="w-10 h-10 rounded-full bg-[#2a1f45] border border-[#9D50FF]/30 flex items-center justify-center shrink-0 z-10">
                                <Volume2 size={18} className="text-[#9D50FF]" />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-lg mb-1">Check Your Audio</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">Ensure your speakers or headphones are active and volume is set to a comfortable level.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="flex gap-6 relative">
                            <div className="w-10 h-10 rounded-full bg-[#2a1f45] border border-[#9D50FF]/30 flex items-center justify-center shrink-0 z-10">
                                <Eye size={18} className="text-[#9D50FF]" />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-lg mb-1">Full Attention Required</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">The screening takes 10 focused minutes. Please do not switch tabs or exit the browser.</p>
                            </div>
                        </div>
                    </div>

                    {/* STATUS CHECKS */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#151024] rounded-xl p-4 flex flex-col gap-2 border border-white/5">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Microphone</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-bold">Ready</span>
                            </div>
                        </div>
                        <div className="bg-[#151024] rounded-xl p-4 flex flex-col gap-2 border border-white/5">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Connection</p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm font-bold">Stable</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link href="/assessment" className="w-full group bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] p-4 rounded-full flex items-center justify-center gap-2 font-bold text-lg shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Start Test <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="text-center text-xs text-gray-500 mt-4">By clicking start, you agree to our assessment terms.</p>

                </div>
            </main>

            {/* FOOTER */}
            <footer className="py-6 text-center text-[10px] text-gray-600 uppercase tracking-widest font-medium">
                © 2024 Invento Espirit. Designed for early wellness awareness.
            </footer>

        </div>
    );
}
