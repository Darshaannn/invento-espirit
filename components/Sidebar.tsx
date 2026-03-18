"use client";
import React, { useState } from "react";
import {
  LayoutGrid,
  History,
  Gamepad2,
  Settings,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navBar = [
  { name: "Overview", href: "/dashboard", icon: <LayoutGrid size={20} /> },
  { name: "History", href: "/dashboard/history", icon: <History size={20} /> },
  { name: "Brain Games", href: "/dashboard/games", icon: <Gamepad2 size={20} /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

import { useSession, signOut } from "next-auth/react";

import Image from "next/image";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-0 w-64 h-screen bg-white border-r border-[#1A1A1A]/5 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* 1. BRAND LOGO */}
        <div className="flex items-center gap-3 px-6 py-8">
          <div className="w-8 h-8 bg-[#8B0000] flex items-center justify-center shadow-lg shadow-[#8B0000]/10">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-[#1A1A1A]">Invento Espirit</h1>
            <p className="text-[10px] text-[#1A1A1A]/40 font-medium">Gen-Z Research Tool</p>
          </div>
        </div>

        {/* 2. NAVIGATION LINKS */}
        <nav className="flex-1 px-4 space-y-2">
          {navBar.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose} // Close sidebar on mobile link click
                className={`w-full flex items-center gap-4 px-4 py-3.5 transition-all duration-200 group font-medium text-sm ${isActive
                  ? "bg-[#8B0000] text-white shadow-lg shadow-[#8B0000]/20"
                  : "text-[#1A1A1A]/60 hover:bg-[#F5F1EE] hover:text-[#1A1A1A]"
                  }`}
              >
                <span className={isActive ? "text-white" : "text-[#1A1A1A]/40 group-hover:text-[#8B0000] transition-colors"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* 3. BOTTOM SECTION: SETTINGS & PROFILE */}
        <div className="p-4 space-y-4 border-t border-[#1A1A1A]/5 relative">
          {/* SETTINGS POPUP */}
          {isSettingsOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-[#1A1A1A]/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
              <button
                className="w-full text-left px-4 py-3 text-sm text-[#1A1A1A]/70 hover:bg-[#F5F1EE] hover:text-[#1A1A1A] transition-colors border-b border-[#1A1A1A]/5 font-medium"
                onClick={() => setIsSettingsOpen(false)}
              >
                Edit Profile
              </button>
              <button
                className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-500/10 transition-colors font-medium"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </button>
            </div>
          )}

          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`flex items-center gap-4 px-4 py-2 transition-colors w-full text-sm font-medium ${isSettingsOpen ? 'text-[#1A1A1A] bg-[#F5F1EE]' : 'text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#F5F1EE]'}`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>

          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 bg-[#FFE4C4] border-2 border-[#F5F1EE] relative overflow-hidden">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-[#FFE4C4] flex items-center justify-center font-bold text-[#1A1A1A]">
                  {session?.user?.name?.charAt(0) || 'U'}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1A1A1A] truncate">{session?.user?.name || 'Guest User'}</p>
              <p className="text-[10px] text-[#1A1A1A]/40 truncate">{session?.user?.email || 'Login to save data'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}