import React, { useState } from "react";
import { Activity, Plus, Clock, Flame } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";
import { ACTIVITY_TYPES, MOOD_OPTIONS } from "@/constants";
import type { ActivityType } from "@/types";

export const ActivityView: React.FC = () => {
  const { activitySessions, addActivitySession } = useHealthData();
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<ActivityType>("running");
  const [duration, setDuration] = useState("");
  const [calories, setCalories] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addActivitySession({
      id: Date.now().toString(),
      type: selectedType,
      duration: Number(duration),
      calories: Number(calories),
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    setDuration("");
    setCalories("");
  };

  const recentActivities = activitySessions.slice(-10).reverse();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Activity Tracking
          </h1>
          <p className="text-gray-400 text-sm mt-1">Log your workouts and physical activities</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:scale-[1.02] transition-transform"
        >
          <Plus size={18} />
          Log Activity
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Activity Type</label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id as ActivityType)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedType === type.id
                      ? "bg-teal-600/20 border-teal-500 text-teal-400"
                      : "bg-white/[0.03] border-white/[0.05] text-gray-400 hover:bg-white/[0.06]"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-teal-500 focus:outline-none"
                placeholder="30"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Calories Burned</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-teal-500 focus:outline-none"
                placeholder="200"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-medium hover:scale-[1.02] transition-transform"
            >
              Save Activity
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

      {/* Recent Activities */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((session) => {
              const typeInfo = ACTIVITY_TYPES.find((t) => t.id === session.type);
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Activity size={18} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{typeInfo?.label || session.type}</p>
                      <p className="text-gray-500 text-sm">{session.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock size={14} />
                      {session.duration} min
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Flame size={14} />
                      {session.calories} cal
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Activity size={32} className="mx-auto mb-2 opacity-50" />
            <p>No activities logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
};