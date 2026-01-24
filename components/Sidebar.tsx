"use client"; // Line 1: Crucial for buttons to work

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  History, 
  Gamepad2, 
  LineChart, 
  Settings, 
  LogOut 
} from "lucide-react";

// This list stores your menu items
const navBar = [
  { name: "Overview", icon: <LayoutDashboard size={20} /> },
  { name: "History", icon: <History size={20} /> },
  { name: "Brain Games", icon: <Gamepad2 size={20} /> },
  { name: "Insights", icon: <LineChart size={20} /> },
];

export default function Sidebar() {
  // This 'state' remembers which button you clicked
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#1A142E] transform -translate-x-full lg:translate-x-0 transition-transform duration-2000">
      
      {/* 1. BRAND LOGO */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 bg-[#9D50FF] rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
        </div>
        <span className="font-bold text-xl tracking-wider text-white uppercase">Innvento</span>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav className="flex-1 space-y-2">
        {navBar.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveTab(item.name)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.name 
                ? "bg-[#9D50FF] text-white shadow-lg shadow-[#9D50FF]/20" 
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className={activeTab === item.name ? "text-white" : "text-gray-400 group-hover:text-[#9D50FF]"}>
              {item.icon}
            </span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* 3. BOTTOM SECTION: PROFILE */}
      <div className="space-y-6 pt-6 border-t border-white/5">
        <button className="flex items-center gap-4 px-4 py-2 text-gray-400 hover:text-white transition-colors w-full">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        
        <div className="flex items-center gap-3 px-2">
          {/* Change rounded-fill to rounded-full for a circle */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-yellow-200" />
          <div className="flex-1">
            <p className="text-sm font-bold text-white">Alex Rivera</p>
            <p className="text-xs text-gray-500">Premium Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}