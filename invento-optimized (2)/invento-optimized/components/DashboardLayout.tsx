// components/DashboardLayout.tsx
"use client";
import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";

const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  ssr: false,
  loading: () => <div className="w-64 h-screen bg-white border-r border-[#1A1A1A]/5 hidden lg:block" />,
});

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar  = useCallback(() => setSidebarOpen(true),  []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen bg-[#F5F1EE]">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <header className="lg:hidden flex items-center gap-4 px-6 py-4 bg-white border-b border-[#1A1A1A]/5 sticky top-0 z-30">
          <button onClick={openSidebar} className="p-2 hover:bg-[#F5F1EE] rounded transition-colors" aria-label="Open navigation">
            <Menu size={20} className="text-[#1A1A1A]" />
          </button>
          <span className="font-bold text-sm text-[#1A1A1A]">Invento</span>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
