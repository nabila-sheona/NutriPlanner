// backend/Model/Recipe.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecipeSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    time: { type: String },
    calories: { type: String },
    mealType: { type: String }, // Breakfast / Lunch / Dinner
    ingredients: { type: [String], default: [] },
    instructions: { type: [String], default: [] },
    macros: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("mealPlanRecipe", RecipeSchema);
