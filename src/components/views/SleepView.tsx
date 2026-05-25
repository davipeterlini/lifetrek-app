import React, { useState } from "react";
import { Moon, Plus, Star, Clock } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";

export const SleepView: React.FC = () => {
  const { dailyMetrics, addDailyMetrics } = useHealthData();
  const [showForm, setShowForm] = useState(false);
  const [duration, setDuration] = useState("");
  const [quality, setQuality] = useState("75");
  const [bedtime, setBedtime] = useState("");
  const [waketime, setWaketime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDailyMetrics({
      date: new Date().toISOString().split("T")[0],
      steps: 0,
      calories: 0,
      weight: 0,
      hydration: 0,
      sleepDuration: Number(duration),
      sleepQuality: Number(quality),
    });
    setShowForm(false);
    setDuration("");
    setQuality("75");
  };

  const recentSleep = dailyMetrics.slice(-7).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Sleep Tracking
          </h1>
          <p className="text-gray-400 text-sm mt-1">Monitor your sleep patterns and quality</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-[1.02] transition-transform"
        >
          <Plus size={18} />
          Log Sleep
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Sleep Duration (hours)</label>
              <input
                type="number"
                step="0.5"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="7.5"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Sleep Quality (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="75"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Bedtime</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Wake Time</label>
              <input
                type="time"
                value={waketime}
                onChange={(e) => setWaketime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-[1.02] transition-transform"
            >
              Save Sleep
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

      {/* Sleep Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 text-center">
          <Moon size={24} className="mx-auto mb-2 text-indigo-400" />
          <p className="text-gray-400 text-sm mb-1">Avg Duration</p>
          <p className="text-2xl font-bold text-white">
            {Math.round(recentSleep.reduce((sum, m) => sum + (m.sleepDuration || 0), 0) / (recentSleep.length || 1) * 10) / 10}h
          </p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 text-center">
          <Star size={24} className="mx-auto mb-2 text-amber-400" />
          <p className="text-gray-400 text-sm mb-1">Avg Quality</p>
          <p className="text-2xl font-bold text-white">
            {Math.round(recentSleep.reduce((sum, m) => sum + (m.sleepQuality || 0), 0) / (recentSleep.length || 1))}%
          </p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 text-center">
          <Clock size={24} className="mx-auto mb-2 text-purple-400" />
          <p className="text-gray-400 text-sm mb-1">Total Sleep</p>
          <p className="text-2xl font-bold text-white">
            {Math.round(recentSleep.reduce((sum, m) => sum + (m.sleepDuration || 0), 0))}h
          </p>
        </div>
      </div>

      {/* Recent Sleep */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Sleep</h3>
        {recentSleep.length > 0 ? (
          <div className="space-y-3">
            {recentSleep.map((entry) => (
              <div
                key={entry.date}
                className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Moon size={18} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{entry.date}</p>
                    <p className="text-gray-500 text-sm">
                      {entry.sleepDuration}h sleep
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-amber-400" />
                  <span className="text-white font-medium">{entry.sleepQuality}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Moon size={32} className="mx-auto mb-2 opacity-50" />
            <p>No sleep data logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
};