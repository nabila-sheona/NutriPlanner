import React, { useState } from "react";
import axios from "axios";
import { ChefHat, Calendar, Target, Check } from "lucide-react";
import { useEffect } from "react";

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
  const [recipe, setRecipe] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  const GEMINI_API_KEY = "AIzaSyAe5jVx78jgIf7TEhdciw0bOj4rNqFsw2Q";
  const GEMINI_ENDPOINT =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const togglePreference = (option) => {
    setPreferences((prev) =>
      prev.includes(option)
        ? prev.filter((p) => p !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    console.log("API Key:", process.env.REACT_APP_API_KEY_GEMINI);
  }, []);

  const generateRecipe = async () => {
    setLoadingRecipe(true);

    const basePrompt = `
Generate a COMPLETE healthy recipe in the following format.
Keep it under 300 words per message, but if you can't finish, I will ask you to continue.
Always include ALL sections exactly in this order and do not stop mid-sentence.

Format:
Title: [Recipe Name]
Time: [Time in minutes]
Calories: [Calories]
Type: [Breakfast/Lunch/Dinner]

Ingredients:
- Item - quantity in grams or cups

Instructions:
1. Step 1
2. Step 2
3. Step 3

Macros:
Calories: xxx | Protein: xxg | Carbs: xxg | Fat: xxg | Fiber: xxg | Sodium: xxmg
`;

    let fullText = "";
    let continuePrompt = basePrompt;
    let attempt = 0;
    const maxAttempts = 5;

    try {
      while (attempt < maxAttempts) {
        attempt++;

        const response = await axios.post(
          `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: continuePrompt }] }],
            generationConfig: {
              maxOutputTokens: 1024, // gives more space per turn
              temperature: 0.7,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const aiChunk =
          response.data.candidates[0].content.parts[0].text.trim();
        fullText += (fullText ? "\n" : "") + aiChunk;

        // If the chunk already contains "Macros:" we’re done
        if (aiChunk.toLowerCase().includes("macros:")) {
          break;
        }

        // If not, ask Gemini to continue EXACTLY where it left off
        continuePrompt = `Continue the previous recipe from where it stopped. Do not repeat anything. Here is what you wrote so far:\n${fullText}`;
      }

      setRecipe(fullText);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setRecipe("Oops! Couldn't fetch recipe. Blame the AI chef. 🤖🍳");
    } finally {
      setLoadingRecipe(false);
    }
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

  const saveMealPlanToProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:4000/mealplans/save",
        {
          planText: plan,
          goal,
          preferences,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Meal plan saved to profile!");
    } catch (error) {
      console.error("Error saving meal plan:", error);
      alert("Failed to save meal plan.");
    }
  };

  const saveRecipeToProfile = async () => {
    const token = localStorage.getItem("token");
    const recipeData = parseRecipeText(recipe); // Already exists in your code
    try {
      await axios.post(
        "http://localhost:4000/mealplanrecipes/save",
        recipeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Recipe saved to profile!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe.");
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

  const parseRecipeText = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let title = "";
    let time = "";
    let calories = "";
    let mealType = "";
    let ingredients = [];
    let instructions = [];
    let macros = "";

    let section = "";

    for (const line of lines) {
      if (line.startsWith("Title:")) {
        title = line.replace("Title:", "").trim();
      } else if (line.startsWith("Time:")) {
        time = line.replace("Time:", "").trim();
      } else if (line.startsWith("Calories:") && !macros) {
        calories = line.replace("Calories:", "").trim();
      } else if (line.startsWith("Type:")) {
        mealType = line.replace("Type:", "").trim();
      } else if (
        line === "Ingredients:" ||
        line === "Instructions:" ||
        line.startsWith("Macros:")
      ) {
        section = line.toLowerCase();
      } else {
        if (section === "ingredients:") {
          // Ingredient lines usually start with "- "
          if (line.startsWith("- ")) {
            ingredients.push(line.replace("- ", "").trim());
          }
        } else if (section === "instructions:") {
          // Instructions lines usually start with a number + dot (e.g., "1. Step")
          if (/^\d+\./.test(line)) {
            instructions.push(line.replace(/^\d+\.\s*/, ""));
          }
        } else if (section.startsWith("macros:")) {
          macros = line.trim();
        }
      }
    }

    return {
      title,
      time,
      calories,
      mealType,
      ingredients,
      instructions,
      macros,
    };
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
        <div className="text-center mt-4">
          <button
            onClick={generateRecipe}
            disabled={loadingRecipe}
            className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200"
          >
            <ChefHat className="w-5 h-5" />
            {loadingRecipe
              ? "Whipping Up Your Recipe..."
              : "Generate AI Recipe"}
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
        {recipe &&
          !loadingRecipe &&
          (() => {
            const {
              title,
              time,
              calories,
              mealType,
              ingredients,
              instructions,
              macros,
            } = parseRecipeText(recipe);

            return (
              <div className="bg-white mt-10 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
                <div className="bg-[#004346] px-6 py-4 flex items-center gap-3">
                  <ChefHat className="w-6 h-6 text-white" />
                  <h2 className="text-xl font-semibold text-white">
                    {title || "Recipe"}
                  </h2>
                  <button
                    onClick={saveRecipeToProfile}
                    className="mt-4 inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all"
                  >
                    Save Recipe to Profile
                  </button>
                </div>
                <div className="p-6 text-gray-800">
                  {/* Summary */}
                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                    {time && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{time}</span>
                      </div>
                    )}
                    {calories && (
                      <div className="flex items-center gap-1">
                        <span>🔥</span>
                        <span>{calories} cal</span>
                      </div>
                    )}
                    {mealType && (
                      <div className="flex items-center gap-1">
                        <span>🍽️</span>
                        <span>{mealType}</span>
                      </div>
                    )}
                  </div>

                  {/* Ingredients */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#004346] mb-2">
                      Ingredients
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#004346] mb-2">
                      Instructions
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      {instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Macros */}
                  {macros && (
                    <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
                      <strong>Macros:</strong> {macros}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

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
                <button
                  onClick={saveMealPlanToProfile}
                  className="mt-4 inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition-all"
                >
                  Save to Profile
                </button>
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
