import React from "react";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const SettingsView: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const settingsGroups = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", description: "Manage your personal information" },
        { icon: Shield, label: "Privacy", description: "Control your data and privacy settings" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: Bell, label: "Notifications", description: "Configure alerts and reminders" },
        { icon: Palette, label: "Appearance", description: "Customize the app look and feel" },
        { icon: Globe, label: "Language", description: `Current: ${language}` },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {settingsGroups.map((group) => (
        <div key={group.title} className="space-y-4">
          <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {group.title}
          </h3>
          <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] divide divide-white/[0.05]">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors first:rounded-t-xl last:rounded-b-xl"
                  onClick={() => {
                    if (item.label === "Language") {
                      setLanguage(language === "en" ? "pt-BR" : "en");
                    }
                  }}
                >
                  <div className="p-2 rounded-lg bg-gray-700/50">
                    <Icon size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-gray-500 text-sm">{item.description}</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* App Info */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
            <SettingsIcon size={24} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">LifeTrek</p>
            <p className="text-gray-500 text-sm">Version 0.1.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};