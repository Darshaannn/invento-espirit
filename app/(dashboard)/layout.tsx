"use client";
import React, { useState } from "react";
import {
    LayoutGrid,
    History,
    Gamepad2,
    LineChart,
    Settings,
    Brain
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navBar = [
    { name: "Overview", icon: <LayoutGrid size={20} /> },
    { name: "History", icon: <History size={20} /> },
    { name: "Brain Games", icon: <Gamepad2 size={20} /> },
    { name: "Insights", icon: <LineChart size={20} /> },
];

function Sidebar() {
    const pathname = usePathname();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const getLink = (name: string) => {
        switch (name) {
            case "Overview": return "/dashboard";
            case "History": return "/dashboard/history";
            case "Brain Games": return "/dashboard/games";
            case "Insights": return "/dashboard/insights";
            default: return "/dashboard";
        }
    };

    return (
        <aside className="fixed left-0 top-0 w-64 h-screen bg-[#0F0A1F] border-r border-white/5 flex flex-col z-50">

            {/* 1. BRAND LOGO */}
            <div className="flex items-center gap-3 px-6 py-8">
                <div className="w-8 h-8 rounded-full bg-[#9D50FF] flex items-center justify-center shadow-lg shadow-[#9D50FF]/25">
                    <Brain size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="font-bold text-sm tracking-wide text-white">Invento Espirit</h1>
                    <p className="text-[10px] text-gray-500 font-medium">Gen-Z Research Tool</p>
                </div>
            </div>

            {/* 2. NAVIGATION LINKS */}
            <nav className="flex-1 px-4 space-y-2">
                {navBar.map((item) => {
                    const href = getLink(item.name);
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={item.name}
                            href={href}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium text-sm ${isActive
                                ? "bg-[#9D50FF] text-white shadow-lg shadow-[#9D50FF]/20"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <span className={isActive ? "text-white" : "text-gray-400 group-hover:text-[#9D50FF] transition-colors"}>
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* 3. BOTTOM SECTION: SETTINGS & PROFILE */}
            <div className="p-4 space-y-4 border-t border-white/5 relative">

                {/* SETTINGS POPUP */}
                {isSettingsOpen && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#1A142E] border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                        <button
                            className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 font-medium"
                            onClick={() => setIsSettingsOpen(false)}
                        >
                            Edit Profile
                        </button>
                        <button
                            className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors font-medium"
                            onClick={() => setIsSettingsOpen(false)}
                        >
                            Logout
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`flex items-center gap-4 px-4 py-2 hover:text-white transition-colors w-full text-sm font-medium hover:bg-white/5 rounded-xl ${isSettingsOpen ? 'text-white bg-white/5' : 'text-gray-400'}`}
                >
                    <Settings size={20} />
                    <span>Settings</span>
                </button>

                <div className="flex items-center gap-3 px-2 pt-2">
                    <div className="w-10 h-10 rounded-full bg-[#FFE4C4] border-2 border-[#1A142E] relative">
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0F0A1F] rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Alex Rivera</p>
                        <p className="text-[10px] text-gray-500 truncate">Premium Member</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex bg-[#0F0A1F] min-h-screen text-white font-sans selection:bg-[#9D50FF] selection:text-white">
            <Sidebar />
            <main className="flex-1 lg:ml-64 w-full">
                {children}
            </main>
        </div>
    );
}
