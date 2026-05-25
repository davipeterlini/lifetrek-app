import React, { useState } from "react";
import { UtensilsCrossed, Plus, Flame } from "lucide-react";
import { useHealthData } from "@/contexts/HealthDataContext";
import { MEAL_OPTIONS } from "@/constants";
import type { MealType } from "@/types";

export const NutritionView: React.FC = () => {
  const { nutritionEntries, addNutritionEntry } = useHealthData();
  const [showForm, setShowForm] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("breakfast");
  const [foods, setFoods] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNutritionEntry({
      id: Date.now().toString(),
      meal: selectedMeal,
      foods: foods.split(",").map((f) => f.trim()).filter(Boolean),
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
    setFoods("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

  const recentEntries = nutritionEntries.slice(-10).reverse();
  const totalCalories = nutritionEntries.reduce((sum, e) => sum + e.calories, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Nutrition Tracking
          </h1>
          <p className="text-gray-400 text-sm mt-1">Log your meals and track macros</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium hover:scale-[1.02] transition-transform"
        >
          <Plus size={18} />
          Log Meal
        </button>
      </div>

      {/* Daily Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Today's Calories</p>
          <p className="text-2xl font-bold text-amber-400">{totalCalories}</p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Protein</p>
          <p className="text-2xl font-bold text-red-400">
            {nutritionEntries.reduce((sum, e) => sum + e.protein, 0)}g
          </p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Carbs</p>
          <p className="text-2xl font-bold text-amber-400">
            {nutritionEntries.reduce((sum, e) => sum + e.carbs, 0)}g
          </p>
        </div>
        <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-4 text-center">
          <p className="text-gray-400 text-sm mb-1">Fat</p>
          <p className="text-2xl font-bold text-blue-400">
            {nutritionEntries.reduce((sum, e) => sum + e.fat, 0)}g
          </p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Meal Type</label>
            <div className="grid grid-cols-4 gap-2">
              {MEAL_OPTIONS.map((meal) => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => setSelectedMeal(meal.id as MealType)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedMeal === meal.id
                      ? "bg-amber-600/20 border-amber-500 text-amber-400"
                      : "bg-white/[0.03] border-white/[0.05] text-gray-400 hover:bg-white/[0.06]"
                  }`}
                >
                  {meal.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Foods (comma-separated)</label>
            <input
              type="text"
              value={foods}
              onChange={(e) => setFoods(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-amber-500 focus:outline-none"
              placeholder="Chicken breast, rice, broccoli"
              required
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Calories</label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-amber-500 focus:outline-none"
                placeholder="500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Protein (g)</label>
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-amber-500 focus:outline-none"
                placeholder="30"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Carbs (g)</label>
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-amber-500 focus:outline-none"
                placeholder="50"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Fat (g)</label>
              <input
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-amber-500 focus:outline-none"
                placeholder="15"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium hover:scale-[1.02] transition-transform"
            >
              Save Meal
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

      {/* Recent Meals */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Meals</h3>
        {recentEntries.length > 0 ? (
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/[0.03] border border-white/[0.05]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <UtensilsCrossed size={18} />
                  </div>
                  <div>
                    <p className="text-white font-medium capitalize">{entry.meal}</p>
                    <p className="text-gray-500 text-sm">{entry.foods.join(", ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Flame size={14} />
                    {entry.calories} cal
                  </div>
                  <div className="text-gray-500">
                    P: {entry.protein}g | C: {entry.carbs}g | F: {entry.fat}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <UtensilsCrossed size={32} className="mx-auto mb-2 opacity-50" />
            <p>No meals logged yet</p>
          </div>
        )}
      </div>
    </div>
  );
};