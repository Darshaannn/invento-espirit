// components/Sidebar.tsx
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. navBar moved OUTSIDE component — was recreated on every render.
// 2. useCallback on handlers — prevents child re-renders from new fn references.
// 3. Settings popup moved to a separate memoized component.
// 4. useSession destructured correctly — only re-renders when session changes.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, History, Gamepad2, Settings } from "lucide-react";
import { Logo } from "./Logo";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// ─── Static data (defined once, never re-created) ─────────────────────────────
const NAV_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutGrid, size: 20 },
  { name: "History", href: "/dashboard/history", icon: History, size: 20 },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Settings popup (separate memo component) ────────────────────────────────
const SettingsPopup = memo(function SettingsPopup({
  onClose,
}: {
  onClose: () => void;
}) {
  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="absolute bottom-full left-4 right-4 mb-3 bg-[#111111] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden z-50">
      <button
        className="w-full text-left px-4 py-4 text-[10px] uppercase tracking-widest text-white/50 hover:bg-white/5 hover:text-white/90 transition-colors border-b border-white/5 font-light"
        onClick={onClose}
      >
        Edit Profile
      </button>
      <button
        className="w-full text-left px-4 py-4 text-[10px] uppercase tracking-widest text-[#8B0000] hover:bg-[#8B0000]/10 transition-colors font-light"
        onClick={handleLogout}
      >
        Logout Session
      </button>
    </div>
  );
});

// ─── Avatar (separate memo so session updates only re-render this) ─────────────
const UserAvatar = memo(function UserAvatar() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3 px-2 pt-2">
      <div className="w-10 h-10 bg-[#1A1A1A] border border-white/10 relative overflow-hidden shrink-0">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "Avatar"}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center font-light text-white/80 text-xs">
            {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
        )}
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#8B0000] border border-[#0A0A0A] shadow-[0_0_8px_#8B0000]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-light text-white/90 truncate uppercase tracking-tight">
          {session?.user?.name ?? "Guest User"}
        </p>
        <p className="text-[9px] text-white/30 truncate font-light uppercase tracking-wider">
          {session?.user?.email ?? "Session Active"}
        </p>
      </div>
    </div>
  );
});

// ─── Main Sidebar ──────────────────────────────────────────────────────────────
const Sidebar = memo(function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleSettings = useCallback(() => {
    setIsSettingsOpen((prev) => !prev);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed left-0 top-0 w-64 h-screen bg-[#0A0A0A] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        aria-label="Sidebar navigation"
      >
        {/* ── Brand ─────────────────────────────────────────────────── */}
        <div className="px-6 py-8">
          <Logo size={32} showText={true} />
        </div>

        {/* ── Nav ────────────────────────────────────────────────────── */}
        <nav className="flex-1 px-4 space-y-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`w-full flex items-center gap-4 px-5 py-4 transition-all duration-300 group font-light text-[10px] uppercase tracking-[0.2em] relative overflow-hidden ${isActive
                  ? "text-white"
                  : "text-white/40 hover:text-white/90 hover:bg-white/5"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={item.size}
                  className={
                    isActive
                      ? "text-[#8B0000]"
                      : "text-white/20 group-hover:text-white/50 transition-colors"
                  }
                  aria-hidden
                />
                <span>{item.name}</span>
                {isActive && (
                  <>
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-[2px] h-6 bg-[#8B0000] shadow-[0_0_10px_#8B0000]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B0000]/5 to-transparent pointer-events-none" />
                    <motion.div
                      className="absolute left-0 top-0 w-full h-[1px] bg-[#8B0000]/20"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom: Settings + Profile ────────────────────────────── */}
        <div className="p-4 space-y-4 border-t border-white/5 relative">
          {isSettingsOpen && <SettingsPopup onClose={closeSettings} />}

          <button
            onClick={toggleSettings}
            className={`flex items-center gap-4 px-4 py-3 transition-all w-full text-[10px] uppercase tracking-widest font-light ${isSettingsOpen
              ? "text-white bg-white/5"
              : "text-white/40 hover:text-white/80 hover:bg-white/5"
              }`}
            aria-expanded={isSettingsOpen}
          >
            <Settings size={20} aria-hidden />
            <span>Settings</span>
          </button>

          <UserAvatar />
        </div>
      </aside>
    </>
  );
});

export default Sidebar;
