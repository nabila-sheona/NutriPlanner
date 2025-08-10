import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const MealPlanRecipeCard = ({ recipe }) => {
  const [expanded, setExpanded] = useState(false);

  const mealtypetagcolor = {
    Breakfast: "bg-yellow-200 text-yellow-800",
    Lunch: "bg-green-200 text-green-800",
    Dinner: "bg-blue-200 text-blue-800",
  };

  const hasType = (type) => recipe.mealType.includes(type);

  return (
    <div className="mb-5 rounded-lg border border-gray-300 shadow-sm bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-thin text-gray-900">{recipe.title}</h3>
        <div className="flex space-x-2">
          {hasType("Breakfast") && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${mealtypetagcolor["Breakfast"]}`}
            >
              Breakfast
            </span>
          )}
          {hasType("Lunch") && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${mealtypetagcolor["Lunch"]}`}
            >
              Lunch
            </span>
          )}
          {hasType("Dinner") && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${mealtypetagcolor["Dinner"]}`}
            >
              Dinner
            </span>
          )}
        </div>
      </div>

      <div
        className="flex items-center px-4 py-2 space-x-2 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <button
          aria-expanded={expanded}
          aria-label="show more"
          className="focus:outline-none"
        >
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-700" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-700" />
          )}
        </button>
        <span className="text-gray-700 text-base">
          {expanded ? "Hide Recipe" : "Show Recipe"}
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-2 text-gray-800">
          <h4 className="text-md font-semibold mb-2">Ingredients:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
          <h4 className="text-md font-semibold mt-4 mb-1">Instructions:</h4>
          <p className="text-sm">{recipe.instructions}</p>
        </div>
      )}
    </div>
  );
};

export default MealPlanRecipeCard;
