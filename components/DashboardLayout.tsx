// components/DashboardLayout.tsx
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. memo() — prevents re-renders when parent state changes unrelated to layout.
// 2. useCallback on toggle/close — stable refs for Sidebar props.
// 3. Hamburger button only renders on mobile (lg:hidden) — no JS cost on desktop.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useState, useCallback, memo } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = memo(function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex h-screen bg-[#0A0A0A] overflow-hidden text-white/90">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Main content — offset by sidebar width on desktop */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#111111]/80 backdrop-blur-md border-b border-white/5">
          <button
            onClick={openSidebar}
            className="p-2 hover:bg-white/5 transition-colors rounded"
            aria-label="Open navigation"
          >
            <Menu size={20} className="text-white/80" />
          </button>
          <span className="font-bold text-sm tracking-wide text-white/90 tracking-widest uppercase">Invento</span>
          <div className="w-9" aria-hidden /> {/* spacer to center title */}
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
});

export default DashboardLayout;
