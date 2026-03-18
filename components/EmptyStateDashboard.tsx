"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
    ShieldCheck, Activity, Users, 
    ArrowRight, Sparkles, Building2 
} from 'lucide-react';

const clinicalPartners = [
    "Mayo Clinic Neuro",
    "Johns Hopkins Health",
    "Cleveland Clinic",
    "Mass General",
    "UCSF Medical Center"
];

const EmptyStateDashboard = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-12 bg-[#0F0A1F] min-h-[80vh] relative overflow-hidden">
            <div className="ambient-bg opacity-30" />

            {/* HERO SECTION */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl w-full text-center relative z-10"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
                    <Sparkles size={16} className="text-indigo-400" />
                    <span className="text-xs font-black text-indigo-400 tracking-widest uppercase">System Ready</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8">
                    Your Cognitive <br /> 
                    <span className="gradient-text italic">Journey Starts Here.</span>
                </h1>

                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                    Personalized AI-driven neurological baselining. Join over <span className="text-white font-bold">12,400+ patients</span> who trust our clinical sync for early detection.
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-20">
                    <Link 
                        href="/instructions"
                        className="yobe-btn-premium text-xl px-12 py-8 group w-full md:w-auto"
                    >
                        Initialize First Scan <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                    
                    <div className="flex items-center gap-3 text-white/40 font-bold uppercase tracking-widest text-[10px] bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
                        <ShieldCheck className="text-indigo-500" size={18} />
                        HIPAA Compliant Data Layer
                    </div>
                </div>

                {/* TRUST SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="glass-1 p-8 rounded-[32px] border-white/5 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                            <Users className="text-indigo-400" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-1">12.4k+</h4>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Active Users</p>
                    </div>
                    <div className="glass-1 p-8 rounded-[32px] border-white/5 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                            <Activity className="text-cyan-400" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-1">98.2%</h4>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Analysis Accuracy</p>
                    </div>
                    <div className="glass-1 p-8 rounded-[32px] border-white/5 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center mx-auto mb-4">
                            <Building2 className="text-pink-400" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-1">50+</h4>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Clinical Partners</p>
                    </div>
                </div>

                {/* PARTNERS MARQUEE-ISH */}
                <div className="border-t border-white/5 pt-12">
                    <p className="text-white/20 font-black uppercase tracking-[0.5em] text-[9px] mb-8">Trusted by Leading Medical Institutions</p>
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                        {clinicalPartners.map(partner => (
                            <span key={partner} className="text-white font-bold text-lg tracking-tighter flex items-center gap-2 italic">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {partner}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* MOCKUP PREVIEW BACKGROUND */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] glass-2 rounded-full border border-white/5 rotate-12 opacity-20 pointer-events-none hidden xl:block" />
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] glass-2 rounded-full border border-white/5 -rotate-12 opacity-10 pointer-events-none hidden xl:block" />
        </div>
    );
};

export default EmptyStateDashboard;
