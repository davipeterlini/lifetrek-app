import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Activity, UtensilsCrossed, Moon, Brain, Droplets, Heart } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";
import { HEALTH_CATEGORIES } from "@/constants";

const CategoryCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  unit?: string;
}> = ({ icon, label, value, color, unit = "" }) => (
  <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-4 hover:bg-white/[0.06] transition-all duration-200 hover:scale-[1.02]">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <span className="text-gray-400 text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </span>
      {unit && <span className="text-gray-500 text-sm">{unit}</span>}
    </div>
    <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, value)}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

export const HomeView: React.FC = () => {
  const { healthScore, dailyMetrics } = useHealthData();

  const recentMetrics = dailyMetrics.slice(-7);

  const chartData = recentMetrics.map((m) => ({
    date: new Date(m.date).toLocaleDateString("en-US", { weekday: "short" }),
    steps: m.steps,
    calories: m.calories,
    hydration: m.hydration,
  }));

  return (
    <div className="space-y-6">
      {/* Health Score Hero */}
      <div className="bg-gradient-to-br from-teal-900/50 to-emerald-900/50 rounded-2xl border border-teal-500/20 p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl" />
            <div className="relative w-32 h-32 rounded-full border-4 border-teal-500/50 flex flex-col items-center justify-center bg-gray-900/50">
              <span className="text-4xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {healthScore.overall}
              </span>
              <span className="text-lg font-semibold" style={{ color: "#14B8A6" }}>
                {healthScore.grade}
              </span>
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Your Health Score
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Based on your activity, sleep, nutrition, mental wellness, vitals, and hydration over the last 7 days.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {HEALTH_CATEGORIES.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    borderColor: `${cat.color}50`,
                    color: cat.color,
                    backgroundColor: `${cat.color}10`,
                  }}
                >
                  {cat.label}: {healthScore[cat.id as keyof typeof healthScore]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <CategoryCard
          icon={<Activity size={16} />}
          label="Activity"
          value={healthScore.activity}
          color="#10B981"
          unit="%"/>
        <CategoryCard
          icon={<Moon size={16} />}
          label="Sleep"
          value={healthScore.sleep}
          color="#6366F1"
          unit="%"/>
        <CategoryCard
          icon={<UtensilsCrossed size={16} />}
          label="Nutrition"
          value={healthScore.nutrition}
          color="#F59E0B"
          unit="%"/>
        <CategoryCard
          icon={<Brain size={16} />}
          label="Mental"
          value={healthScore.mental}
          color="#EC4899"
          unit="%"/>
        <CategoryCard
          icon={<Heart size={16} />}
          label="Vitals"
          value={healthScore.vitals}
          color="#EF4444"
          unit="%"/>
        <CategoryCard
          icon={<Droplets size={16} />}
          label="Hydration"
          value={healthScore.hydration}
          color="#06B6D4"
          unit="%"/>
      </div>

      {/* Weekly Chart */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Weekly Overview
        </h3>
        <div className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#F3F4F6" }}
                />
                <Line type="monotone" dataKey="steps" stroke="#10B981" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="calories" stroke="#F59E0B" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hydration" stroke="#06B6D4" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>No data yet. Start tracking your health!</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-gray-400 text-sm">Steps</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-400 text-sm">Calories</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-gray-400 text-sm">Hydration</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Log Activity", icon: Activity, color: "#10B981" },
          { label: "Log Meal", icon: UtensilsCrossed, color: "#F59E0B" },
          { label: "Log Sleep", icon: Moon, color: "#6366F1" },
          { label: "Log Mood", icon: Brain, color: "#EC4899" },
        ].map((action) => (
          <button
            key={action.label}
            className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.05] bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            style={{ borderColor: `${action.color}20` }}
          >
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${action.color}20`, color: action.color }}>
              <action.icon size={18} />
            </div>
            <span className="text-white text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};