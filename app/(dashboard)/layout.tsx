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
        <div className="flex bg-[#F5F1EE] min-h-screen text-[#1A1A1A] font-sans selection:bg-[#8B0000] selection:text-white">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <main className="flex-1 lg:ml-64 w-full">
                {/* Mobile Header Toggle */}
                <div className="lg:hidden p-4 sticky top-0 z-30 bg-[#F5F1EE]/80 backdrop-blur-md border-b border-[#1A1A1A]/5">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 bg-white text-[#1A1A1A] border border-[#1A1A1A]/10 shadow-sm"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {children}
            </main>
        </div>
    );
}
