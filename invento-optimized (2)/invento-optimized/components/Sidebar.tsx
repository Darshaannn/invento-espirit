// components/Sidebar.tsx
// ─── Optimizations ────────────────────────────────────────────────────────────
// 1. navBar moved OUTSIDE component — was recreated on every render.
// 2. useCallback on handlers — prevents child re-renders from new fn references.
// 3. Settings popup moved to a separate memoized component.
// 4. useSession destructured correctly — only re-renders when session changes.
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useState, useCallback, memo } from "react";
import { LayoutGrid, History, Gamepad2, Settings, Brain } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// ─── Static data (defined once, never re-created) ─────────────────────────────
const NAV_ITEMS = [
  { name: "Overview",    href: "/dashboard",         icon: LayoutGrid, size: 20 },
  { name: "History",     href: "/dashboard/history", icon: History,    size: 20 },
  { name: "Brain Games", href: "/dashboard/games",   icon: Gamepad2,   size: 20 },
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
    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-[#1A1A1A]/10 shadow-2xl overflow-hidden z-50">
      <button
        className="w-full text-left px-4 py-3 text-sm text-[#1A1A1A]/70 hover:bg-[#F5F1EE] hover:text-[#1A1A1A] transition-colors border-b border-[#1A1A1A]/5 font-medium"
        onClick={onClose}
      >
        Edit Profile
      </button>
      <button
        className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors font-medium"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
});

// ─── Avatar (separate memo so session updates only re-render this) ─────────────
const UserAvatar = memo(function UserAvatar() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-3 px-2 pt-2">
      <div className="w-10 h-10 bg-[#FFE4C4] border-2 border-[#F5F1EE] relative overflow-hidden shrink-0">
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "Avatar"}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="w-full h-full bg-[#FFE4C4] flex items-center justify-center font-bold text-[#1A1A1A] text-sm">
            {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
        )}
        {/* Online indicator */}
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[#1A1A1A] truncate">
          {session?.user?.name ?? "Guest User"}
        </p>
        <p className="text-[10px] text-[#1A1A1A]/40 truncate">
          {session?.user?.email ?? "Login to save data"}
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
        className={`fixed left-0 top-0 w-64 h-screen bg-white border-r border-[#1A1A1A]/5 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar navigation"
      >
        {/* ── Brand ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-8 h-8 bg-[#8B0000] flex items-center justify-center shadow-lg shadow-[#8B0000]/10">
            <Brain size={18} className="text-white" aria-hidden />
          </div>
          <h1 className="font-bold text-sm tracking-wide text-[#1A1A1A]">Invento</h1>
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
                className={`w-full flex items-center gap-4 px-4 py-3.5 transition-colors duration-150 group font-medium text-sm ${
                  isActive
                    ? "bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20"
                    : "text-[#1A1A1A]/60 hover:bg-[#F5F1EE] hover:text-[#1A1A1A]"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  size={item.size}
                  className={
                    isActive
                      ? "text-white"
                      : "text-[#1A1A1A]/40 group-hover:text-[#8B0000] transition-colors"
                  }
                  aria-hidden
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ── Bottom: Settings + Profile ────────────────────────────── */}
        <div className="p-4 space-y-4 border-t border-[#1A1A1A]/5 relative">
          {isSettingsOpen && <SettingsPopup onClose={closeSettings} />}

          <button
            onClick={toggleSettings}
            className={`flex items-center gap-4 px-4 py-2 transition-colors w-full text-sm font-medium ${
              isSettingsOpen
                ? "text-[#1A1A1A] bg-[#F5F1EE]"
                : "text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F5F1EE]"
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
