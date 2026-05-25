// Daily metrics for health tracking
export interface DailyMetrics {
  date: string;
  steps: number;
  calories: number;
  weight: number;
  hydration: number;
  sleepDuration?: number;
  sleepQuality?: number;
  mood?: string;
  stress?: number;
  energy?: number;
}

// Activity session types
export type ActivityType = "running" | "swimming" | "cycling" | "yoga" | "strength" | "walking" | "hiking" | "boxing" | "dance" | "pilates" | "crossfit" | "other";

export interface ActivitySession {
  id: string;
  type: ActivityType;
  duration: number;
  calories: number;
  date: string;
}

// Nutrition entry
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface NutritionEntry {
  id: string;
  meal: MealType;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

// Health score breakdown
export interface HealthScore {
  overall: number;
  grade: string;
  activity: number;
  sleep: number;
  nutrition: number;
  mental: number;
  vitals: number;
  hydration: number;
}

// User profile
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  accessToken?: string;
}

// App settings
export type Theme = "dark" | "light";
export type Language = "pt-BR" | "en";

export interface AppSettings {
  theme: Theme;
  language: Language;
}

// View types for navigation
export type View = "dashboard" | "activity" | "nutrition" | "sleep" | "mental" | "settings" | "labs" | "medications" | "ai";

export interface ViewState {
  current: View;
  params?: Record<string, unknown>;
}

// Toast notification
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}