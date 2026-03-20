"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

export function HeroStatic() {
    return (
        <div className="flex flex-col items-center gap-8">
            <div className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 bg-[#8B0000]/5 border border-[#8B0000]/20">
                <span className="text-[#8B0000] font-bold uppercase tracking-[0.2em] text-[10px]">
                    Medical Intelligence V2.5
                </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-[#1A1A1A]">
                AI Cognitive Screening for{" "}
                <br className="hidden md:block" />
                Early Dementia Detection.
            </h1>
            <p className="text-lg md:text-2xl text-[#1A1A1A]/60 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                A 5-minute AI powered cognitive assessment that evaluates memory,
                attention, executive function and orientation to identify early signs
                of cognitive decline.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
                <Link
                    href="/screening"
                    className="bg-[#1A1A1A] text-white hover:bg-black w-full md:w-auto text-lg px-12 py-5 font-bold flex items-center justify-center gap-3 shadow-xl transition-colors"
                >
                    Start Screening
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
                <Link
                    href="#how-it-works"
                    className="px-12 py-5 border border-[#1A1A1A]/10 text-[#1A1A1A] font-bold hover:bg-[#1A1A1A]/5 transition-colors w-full md:w-auto text-center"
                >
                    Learn How It Works
                </Link>
            </div>
        </div>
    );
}

export const HeroAnimationsWrapper = dynamic(() => import("./HeroAnimations"), {
    ssr: false,
    loading: () => <HeroStatic />,
});

export const FAQAccordionWrapper = dynamic(() => import("./FAQAccordion"), {
    ssr: false,
});
