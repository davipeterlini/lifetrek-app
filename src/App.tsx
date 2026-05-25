import React, { useState, lazy, Suspense } from "react";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { LoginScreen } from "./components/auth/LoginScreen";
import { useAuth } from "./contexts/AuthContext";
import {
  HomeView,
  ActivityView,
  NutritionView,
  SleepView,
  MentalView,
  SettingsView,
} from "./components/views";
import type { View } from "./types";

const LabsView = lazy(() =>
  import("./components/views/LabsView").then((m) => ({ default: m.LabsView }))
);
const MedicationsView = lazy(() =>
  import("./components/views/MedicationsView").then((m) => ({ default: m.MedicationsView }))
);
const AIView = lazy(() =>
  import("./components/views/AIView").then((m) => ({ default: m.AIView }))
);

const App: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<View>("dashboard");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <HomeView />;
      case "activity":
        return <ActivityView />;
      case "nutrition":
        return <NutritionView />;
      case "sleep":
        return <SleepView />;
      case "mental":
        return <MentalView />;
      case "labs":
        return (
          <Suspense fallback={<div className="animate-pulse text-gray-400">Loading...</div>}>
            <LabsView />
          </Suspense>
        );
      case "medications":
        return (
          <Suspense fallback={<div className="animate-pulse text-gray-400">Loading...</div>}>
            <MedicationsView />
          </Suspense>
        );
      case "ai":
        return (
          <Suspense fallback={<div className="animate-pulse text-gray-400">Loading...</div>}>
            <AIView />
          </Suspense>
        );
      case "settings":
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;