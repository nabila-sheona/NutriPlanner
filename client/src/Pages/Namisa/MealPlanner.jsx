import React, { useState } from "react";
import axios from "axios";
import { ChefHat, Calendar, Target, Check } from "lucide-react";

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Keto",
  "Low Sodium",
  "Diabetic-Friendly",
];

const healthGoals = [
  "Weight Loss",
  "Muscle Building",
  "Weight Maintenance",
  "General Health",
];

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function MealPlanner() {
  const [preferences, setPreferences] = useState([]);
  const [goal, setGoal] = useState(healthGoals[0]);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = "";
  const GEMINI_ENDPOINT =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const togglePreference = (option) => {
    setPreferences((prev) =>
      prev.includes(option)
        ? prev.filter((p) => p !== option)
        : [...prev, option]
    );
  };

  const generatePlan = async () => {
    setLoading(true);

    const prompt = `
      Create a personalized 7-day meal plan with breakfast, lunch, and dinner for each day.
      Dietary Preferences: ${
        preferences.length > 0 ? preferences.join(", ") : "None"
      }
      Health Goal: ${goal}
      Format it like:
      Monday:
        Breakfast: ...
        Lunch: ...
        Dinner: ...
      Keep it concise, clear, and skip health tips or intro text.
    `;

    const requestData = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const response = await axios.post(
        `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiText = response.data.candidates[0].content.parts[0].text;
      setPlan(aiText);
    } catch (error) {
      console.error("Error generating meal plan:", error);
      setPlan("Oops! Couldn't fetch a plan. Maybe Gemini got hangry? 🤖🍽️");
    } finally {
      setLoading(false);
    }
  };

  const extractMealsPerDay = (text) => {
    const mealMap = {};
    let currentDay = null;

    const lines = text
      .split(/\*\*|\n/)
      .map((l) => l.trim())
      .filter((l) => l);

    for (let line of lines) {
      for (let day of dayNames) {
        if (line.toLowerCase().startsWith(day.toLowerCase())) {
          currentDay = day;
          mealMap[day] = {};
          break;
        }
      }

      if (!currentDay) continue;

      const mealMatch = line.match(/(?:Breakfast|Lunch|Dinner):\**\s*(.+)/i);
      if (mealMatch) {
        const mealType = line.match(/Breakfast|Lunch|Dinner/i)[0];
        mealMap[currentDay][mealType] = mealMatch[1];
      }
    }

    return mealMap;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <ChefHat className="w-8 h-8 text-[#004346]" />
            <h1 className="text-4xl font-bold text-[#004346]">NutriPlan</h1>
          </div>
          <p className="text-center text-gray-600 text-lg">
            Your personalized weekly meal planning companion
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Configuration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Dietary Preferences Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-[#004346] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Dietary Preferences
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dietaryOptions.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      preferences.includes(opt)
                        ? "border-[#004346] bg-[#004346]/5"
                        : "border-gray-200 hover:border-[#004346]/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={preferences.includes(opt)}
                      onChange={() => togglePreference(opt)}
                      className="w-5 h-5 accent-[#004346] rounded"
                    />
                    <span
                      className={`font-medium ${
                        preferences.includes(opt)
                          ? "text-[#004346]"
                          : "text-gray-700"
                      }`}
                    >
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Health Goals Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-[#004346] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Health Goals
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {healthGoals.map((g) => (
                  <label
                    key={g}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      goal === g
                        ? "border-[#004346] bg-[#004346]/5"
                        : "border-gray-200 hover:border-[#004346]/30"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={goal === g}
                      onChange={() => setGoal(g)}
                      className="w-5 h-5 accent-[#004346]"
                    />
                    <span
                      className={`font-medium ${
                        goal === g ? "text-[#004346]" : "text-gray-700"
                      }`}
                    >
                      {g}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={generatePlan}
            disabled={loading}
            className="inline-flex items-center gap-3 bg-[#004346] hover:bg-[#003139] disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200"
          >
            <ChefHat className="w-5 h-5" />
            {loading ? "Crafting Your Plan..." : "Generate Meal Plan"}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#004346]"></div>
            <p className="mt-4 text-gray-600">
              Creating your personalized meal plan...
            </p>
          </div>
        )}

        {/* Meal Plan Results */}
        {plan && !loading && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-[#004346] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Your Weekly Meal Plan
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(extractMealsPerDay(plan)).map(
                  ([day, meals]) => (
                    <div
                      key={day}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
                    >
                      <h3 className="text-xl font-bold text-[#004346] mb-4 pb-2 border-b-2 border-[#004346]/20">
                        {day}
                      </h3>
                      <div className="space-y-3">
                        {["Breakfast", "Lunch", "Dinner"].map((mealType) =>
                          meals[mealType] ? (
                            <div
                              key={mealType}
                              className="bg-white rounded-lg p-3 border border-gray-100"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-sm font-semibold text-[#004346] bg-[#004346]/10 px-2 py-1 rounded-full whitespace-nowrap">
                                  {mealType}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-2 text-sm leading-relaxed">
                                {meals[mealType]}
                              </p>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
