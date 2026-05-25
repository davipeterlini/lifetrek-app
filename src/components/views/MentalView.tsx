import React, { useState } from "react";
import { Brain, Plus, Smile, Zap, Heart } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";
import { MOOD_OPTIONS } from "@/constants";

export const MentalView: React.FC = () => {
  const { dailyMetrics, addDailyMetrics } = useHealthData();
  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState("5");
  const [energy, setEnergy] = useState("7");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDailyMetrics({
      date: new Date().toISOString().split("T")[0],
      steps: 0,
      calories: 0,
      weight: 0,
      hydration: 0,
      mood,
      stress: Number(stress),
      energy: Number(energy),
    });
    setShowForm(false);
    setMood("");
    setStress("5");
    setEnergy("7");
  };

  const recentMental = dailyMetrics.slice(-7).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Mental Wellness
          </h1>
          <p className="text-gray-400 text-sm mt-1">Track your mood, stress, and energy levels</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium hover:scale-[1.02] transition-transform"
        >
          <Plus size={18} />
          Log Mood
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">How are you feeling?</label>
            <div className="grid grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setMood(option.id)}
                  className={`p-4 rounded-lg border text-center transition-all ${
                    mood === option.id
                      ? "bg-pink-600/20 border-pink-500 text-pink-400"
                      : "bg-white/[0.03] border-white/[0.05] text-gray-400 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="text-2xl mb-1 block">{option.emoji}</span>
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Stress Level ({stress}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Energy Level ({energy}/10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium hover:scale-[1.02] transition-transform"
            >
              Save Mood
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Mental Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 text-center">
          <Smile size={24} className="mx-auto mb-2 text-yellow-400" />
          <p className="text-gray-400 text-sm mb-1">Most Common Mood</p>
          <p className="text-2xl font-bold text-white">
            {recentMental.length > 0
              ? MOOD_OPTIONS.find((m) => m.id === recentMental[0].mood)?.emoji || "-"
              : "-"}
          </p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 text-center">
          <Zap size={24} className="mx-auto mb-2 text-amber-400" />
          <p className="text-gray-400 text-sm mb-1">Avg Energy</p>
          <p className="text-2xl font-bold text-white">
            {recentMental.length > 0
              ? Math.round(recentMental.reduce((sum, m) => sum + (m.energy || 0), 0) / recentMental.length)
              : 0}/10
          </p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 text-center">
          <Heart size={24} className="mx-auto mb-2 text-pink-400" />
          <p className="text-gray-400 text-sm mb-1">Avg Stress</p>
          <p className="text-2xl font-bold text-white">
            {recentMental.length > 0
              ? Math.round(recentMental.reduce((sum, m) => sum + (m.stress || 0), 0) / recentMental.length)
              : 0}/10
          </p>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Entries</h3>
        {recentMental.length > 0 ? (
          <div className="space-y-3">
            {recentMental.map((entry) => {
              const moodInfo = MOOD_OPTIONS.find((m) => m.id === entry.mood);
              return (
                <div
                  key={entry.date}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                      <Brain size={18} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{entry.date}</p>
                      <p className="text-gray-500 text-sm">
                        {moodInfo ? `${moodInfo.emoji} ${moodInfo.label}` : "No mood logged"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">
                      <Zap size={14} className="inline mr-1 text-amber-400" />
                      {entry.energy}/10
                    </span>
                    <span className="text-gray-400">
                      <Heart size={14} className="inline mr-1 text-pink-400" />
                      {entry.stress}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain size={32} className="mx-auto mb-2 opacity-50" />
            <p>No mental wellness entries yet</p>
          </div>
        )}
      </div>
    </div>
  );
};