import React from "react";
import {
  LayoutDashboard,
  Activity,
  UtensilsCrossed,
  Moon,
  Brain,
  FlaskConical,
  Pill,
  Sparkles,
  Settings,
} from "lucide-react";
import type { View } from "@/types";

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const navItems = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "activity" as View, label: "Activity", icon: Activity },
  { id: "nutrition" as View, label: "Nutrition", icon: UtensilsCrossed },
  { id: "sleep" as View, label: "Sleep", icon: Moon },
  { id: "mental" as View, label: "Mental", icon: Brain },
  { id: "labs" as View, label: "Lab Results", icon: FlaskConical },
  { id: "medications" as View, label: "Medications", icon: Pill },
  { id: "ai" as View, label: "AI Coach", icon: Sparkles },
  { id: "settings" as View, label: "Settings", icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-16 md:w-56 bg-gray-800 border-r border-gray-700 flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-700">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <span className="font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            LifeTrek
          </span>
        </div>
      </div>
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/20"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Icon size={18} className={isActive ? "text-white" : "text-gray-500"} />
              <span className="hidden md:block font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};