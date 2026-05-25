import React from "react";
import { useAuth } from "@/contexts/AuthContext";

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="h-14 bg-gray-800 border-b border-gray-700 flex items-center px-6 justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          LifeTrek
        </h1>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-gray-600"
            />
          )}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-gray-400">{user.email}</span>
          </div>
          <button
            onClick={signOut}
            className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center gap-1"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};