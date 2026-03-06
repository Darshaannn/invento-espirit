"use client";
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-[#0F0A1F] min-h-screen text-white font-sans selection:bg-[#9D50FF] selection:text-white">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 lg:ml-64 w-full">
                {/* Mobile Header Toggle */}
                <div className="lg:hidden p-4 sticky top-0 z-30 bg-[#0F0A1F]/80 backdrop-blur-md">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-[#1A142E] rounded-lg text-white border border-white/10"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {children}
            </main>
        </div>
    );
}
