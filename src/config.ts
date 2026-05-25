const API_URL = import.meta.env.VITE_API_URL || "";

export const config = {
  api: {
    baseUrl: API_URL,
    endpoints: {
      activities: `${API_URL}/api/activities`,
      nutrition: `${API_URL}/api/nutrition`,
      sleep: `${API_URL}/api/sleep`,
      healthScore: `${API_URL}/api/health-score`,
      userProfile: `${API_URL}/api/user/profile`,
    },
  },
  features: {
    aiEnabled: true,
    labUploadEnabled: true,
    medicationReminders: true,
    familyAccounts: false,
  },
  limits: {
    maxActivityHistory: 365,
    maxNutritionHistory: 30,
    maxSleepHistory: 90,
  },
};