import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "pt-BR" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  "pt-BR": {
    dashboard: "Dashboard",
    activity: "Activity",
    nutrition: "Nutrition",
    sleep: "Sleep",
    mental: "Mental Wellness",
    settings: "Settings",
    labs: "Lab Results",
    medications: "Medications",
    ai: "AI Coach",
    healthScore: "Health Score",
    steps: "Steps",
    calories: "Calories",
    hydration: "Hydration",
    weight: "Weight",
    mood: "Mood",
    stress: "Stress",
    energy: "Energy",
    signOut: "Sign Out",
    logActivity: "Log Activity",
    logMeal: "Log Meal",
    logSleep: "Log Sleep",
    logMood: "Log Mood",
  },
  en: {
    dashboard: "Dashboard",
    activity: "Activity",
    nutrition: "Nutrition",
    sleep: "Sleep",
    mental: "Mental Wellness",
    settings: "Settings",
    labs: "Lab Results",
    medications: "Medications",
    ai: "AI Coach",
    healthScore: "Health Score",
    steps: "Steps",
    calories: "Calories",
    hydration: "Hydration",
    weight: "Weight",
    mood: "Mood",
    stress: "Stress",
    energy: "Energy",
    signOut: "Sign Out",
    logActivity: "Log Activity",
    logMeal: "Log Meal",
    logSleep: "Log Sleep",
    logMood: "Log Mood",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};