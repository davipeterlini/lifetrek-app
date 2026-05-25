import React, { createContext, useContext, useState, useCallback } from "react";
import type { DailyMetrics, ActivitySession, NutritionEntry, HealthScore } from "@/types";
import { GRADE_THRESHOLDS } from "@/constants";

interface HealthDataContextType {
  dailyMetrics: DailyMetrics[];
  activitySessions: ActivitySession[];
  nutritionEntries: NutritionEntry[];
  healthScore: HealthScore;
  addDailyMetrics: (metrics: DailyMetrics) => void;
  addActivitySession: (session: ActivitySession) => void;
  addNutritionEntry: (entry: NutritionEntry) => void;
  updateHealthScore: () => void;
}

const HealthDataContext = createContext<HealthDataContextType | undefined>(undefined);

const calculateGrade = (score: number): string => {
  for (const threshold of GRADE_THRESHOLDS) {
    if (score >= threshold.min) return threshold.grade;
  }
  return "F";
};

const calculateHealthScore = (
  metrics: DailyMetrics[]
): HealthScore => {
  if (metrics.length === 0) {
    return {
      overall: 0,
      grade: "F",
      activity: 0,
      sleep: 0,
      nutrition: 0,
      mental: 0,
      vitals: 0,
      hydration: 0,
    };
  }

  const latest = metrics[metrics.length - 1];
  const activity = Math.min(100, (latest.steps / 10000) * 100);
  const sleep = latest.sleepQuality || 75;
  const nutrition = Math.min(100, (latest.calories / 2500) * 100);
  const mental = latest.mood ? 80 : 60;
  const vitals = latest.weight > 0 ? 85 : 70;
  const hydration = Math.min(100, (latest.hydration / 2500) * 100);

  const overall = Math.round(
    activity * 0.2 + sleep * 0.2 + nutrition * 0.15 + mental * 0.15 + vitals * 0.15 + hydration * 0.15
  );

  return {
    overall,
    grade: calculateGrade(overall),
    activity: Math.round(activity),
    sleep: Math.round(sleep),
    nutrition: Math.round(nutrition),
    mental: Math.round(mental),
    vitals: Math.round(vitals),
    hydration: Math.round(hydration),
  };
};

export const HealthDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dailyMetrics, setDailyMetrics] = useState<DailyMetrics[]>([]);
  const [activitySessions, setActivitySessions] = useState<ActivitySession[]>([]);
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [healthScore, setHealthScore] = useState<HealthScore>({
    overall: 0,
    grade: "F",
    activity: 0,
    sleep: 0,
    nutrition: 0,
    mental: 0,
    vitals: 0,
    hydration: 0,
  });

  const addDailyMetrics = useCallback((metrics: DailyMetrics) => {
    setDailyMetrics((prev) => {
      const existing = prev.findIndex((m) => m.date === metrics.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = metrics;
        return updated;
      }
      return [...prev, metrics];
    });
    setHealthScore(calculateHealthScore([...dailyMetrics, metrics]));
  }, [dailyMetrics]);

  const addActivitySession = useCallback((session: ActivitySession) => {
    setActivitySessions((prev) => [...prev, session]);
  }, []);

  const addNutritionEntry = useCallback((entry: NutritionEntry) => {
    setNutritionEntries((prev) => [...prev, entry]);
  }, []);

  const updateHealthScore = useCallback(() => {
    setHealthScore(calculateHealthScore(dailyMetrics));
  }, [dailyMetrics]);

  return (
    <HealthDataContext.Provider
      value={{
        dailyMetrics,
        activitySessions,
        nutritionEntries,
        healthScore,
        addDailyMetrics,
        addActivitySession,
        addNutritionEntry,
        updateHealthScore,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
};

export const useHealthData = () => {
  const ctx = useContext(HealthDataContext);
  if (!ctx) throw new Error("useHealthData must be used within HealthDataProvider");
  return ctx;
};