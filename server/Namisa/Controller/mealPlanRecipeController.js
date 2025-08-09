// backend/Controller/recipeController.js
const Recipe = require("../Model/MealPlanRecipe.js");

// Save a new recipe
const saveRecipe = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      title,
      time,
      calories,
      mealType,
      ingredients,
      instructions,
      macros,
    } = req.body;

    if (!title || !ingredients.length || !instructions.length) {
      return res
        .status(400)
        .json({ error: "Title, ingredients, and instructions are required." });
    }

    const recipe = new Recipe({
      userId,
      title,
      time,
      calories,
      mealType,
      ingredients,
      instructions,
      macros,
    });

    await recipe.save();
    res.status(201).json({ message: "Recipe saved successfully!", recipe });
  } catch (err) {
    console.error("Error saving recipe:", err);
    res.status(500).json({ error: "Failed to save recipe." });
  }
};

// Get recipes for logged-in user
const getRecipes = async (req, res) => {
  try {
    const userId = req.userId;
    const recipes = await Recipe.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
};

module.exports = { saveRecipe, getRecipes };
