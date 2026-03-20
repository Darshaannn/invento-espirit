"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const Logo = ({ size = 32, showText = false, className = "" }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div
                className="relative flex items-center justify-center shrink-0"
                style={{ width: size, height: size }}
            >
                {/* Glow effect background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 blur-md rounded-full" />

                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full relative z-10"
                >
                    {/* Bulb base */}
                    <path d="M40 75h20v5H40zM42 82h16v3H42zM45 87h10v2H45z" fill="#71717A" />

                    {/* Lightbulb glass outline */}
                    <path
                        d="M50 15c-16.5 0-30 13.5-30 30 0 10.3 5.2 19.3 13 24.7V75h34V69.7c7.8-5.4 13-14.4 13-24.7 0-16.5-13.5-30-30-30z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        opacity="0.2"
                    />

                    {/* Brain Side (Left) */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        d="M50 20c-13.8 0-25 11.2-25 25 0 8.6 4.3 16.1 10.9 20.6V70h14.1V20z"
                        stroke="#A855F7"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                    />
                    <path d="M35 35c2 0 4 2 4 4s-2 4-4 4M30 45c2 0 4 2 4 4s-2 4-4 4" stroke="#A855F7" strokeWidth="1.5" opacity="0.6" />

                    {/* Circuit Side (Right) */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                        d="M50 20c13.8 0 25 11.2 25 25 0 8.6-4.3 16.1-10.9 20.6V70H50V20z"
                        stroke="#06B6D4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                    />
                    {/* Nodes */}
                    <circle cx="65" cy="35" r="2.5" fill="#06B6D4" />
                    <circle cx="70" cy="50" r="2.5" fill="#06B6D4" />
                    <circle cx="60" cy="60" r="2.5" fill="#06B6D4" />
                    <path d="M50 35h15M50 50h20M50 60h10" stroke="#06B6D4" strokeWidth="1.5" opacity="0.6" />

                    {/* Lightning Bolt / Arrow */}
                    <motion.path
                        initial={{ pathLength: 0, scale: 0.8, opacity: 0 }}
                        animate={{ pathLength: 1, scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                        d="M35 55l15-20h-5l15-15"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="drop-shadow-[0_0_12px_rgba(255,255,255,1)]"
                    />
                </svg>
            </div>

            {showText && (
                <div className="flex flex-col">
                    <span className="font-black text-2xl tracking-tighter uppercase text-white leading-none">Invento</span>
                    <span className="text-[7px] font-black tracking-[0.3em] uppercase text-white/40 leading-none mt-1">Invento Esprit <span className="text-purple-500">Gen-Z</span></span>
                </div>
            )}
        </div>
    );
};
