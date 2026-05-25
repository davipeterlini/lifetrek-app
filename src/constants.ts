export const APP_NAME = "LifeTrek";
export const APP_VERSION = "0.1.0";

export const ACTIVITY_TYPES = [
  { id: "running", label: "Running", icon: "activity" },
  { id: "swimming", label: "Swimming", icon: "waves" },
  { id: "cycling", label: "Cycling", icon: "bike" },
  { id: "yoga", label: "Yoga", icon: "heart" },
  { id: "strength", label: "Strength", icon: "dumbbell" },
  { id: "walking", label: "Walking", icon: "footprints" },
  { id: "hiking", label: "Hiking", icon: "mountain" },
  { id: "boxing", label: "Boxing", icon: "boxing" },
  { id: "dance", label: "Dance", icon: "music" },
  { id: "pilates", label: "Pilates", icon: "stretch" },
  { id: "crossfit", label: "CrossFit", icon: "flame" },
  { id: "other", label: "Other", icon: "circle" },
] as const;

export const MOOD_OPTIONS = [
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "calm", label: "Calm", emoji: "😌" },
  { id: "energetic", label: "Energetic", emoji: "⚡" },
  { id: "grateful", label: "Grateful", emoji: "🙏" },
  { id: "relaxed", label: "Relaxed", emoji: "😎" },
] as const;

export const MEAL_OPTIONS = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
  { id: "snack", label: "Snack" },
] as const;

export const HEALTH_CATEGORIES = [
  { id: "activity", label: "Activity", weight: 0.20, color: "#10B981" },
  { id: "sleep", label: "Sleep", weight: 0.20, color: "#6366F1" },
  { id: "nutrition", label: "Nutrition", weight: 0.15, color: "#F59E0B" },
  { id: "mental", label: "Mental", weight: 0.15, color: "#EC4899" },
  { id: "vitals", label: "Vitals", weight: 0.15, color: "#EF4444" },
  { id: "hydration", label: "Hydration", weight: 0.15, color: "#06B6D4" },
] as const;

export const GRADE_THRESHOLDS = [
  { grade: "A+", min: 95 },
  { grade: "A", min: 90 },
  { grade: "A-", min: 85 },
  { grade: "B+", min: 80 },
  { grade: "B", min: 75 },
  { grade: "B-", min: 70 },
  { grade: "C+", min: 65 },
  { grade: "C", min: 60 },
  { grade: "C-", min: 55 },
  { grade: "D", min: 50 },
  { grade: "F", min: 0 },
] as const;