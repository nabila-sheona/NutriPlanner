// backend/Controller/mealPlanRecipeController.js
const Recipe = require("../Model/MealPlanRecipe.js");
const User = require("../../Model/user.model.js");
const createError = require("../../utils/createError.js");

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
    const populated = await Recipe.findById(recipe._id)
      .populate("userId", "username")
      .lean();
    res.status(201).json({
      message: "Recipe saved successfully!",
      recipe: { ...populated, authorUsername: populated.userId?.username },
    });
  } catch (err) {
    console.error("Error saving recipe:", err);
    res.status(500).json({ error: "Failed to save recipe." });
  }
};

// Get recipes for logged-in user
const getRecipes = async (req, res) => {
  try {
    const userId = req.userId;
    const recipes = await Recipe.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "username")
      .lean();

    const formatted = recipes.map((r) => ({
      ...r,
      authorUsername: r.userId?.username,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching recipes:", err);
    res.status(500).json({ error: "Failed to fetch recipes." });
  }
};
const getAllMealPlanRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .populate("userId", "username")
      .lean();

    const formatted = recipes.map((r) => ({
      ...r,
      authorUsername: r.userId?.username,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Error fetching meal plan recipes:", err);
    res.status(500).json({ error: "Failed to fetch meal plan recipes." });
  }
};
module.exports = { saveRecipe, getRecipes, getAllMealPlanRecipes };

// Like/unlike a meal plan recipe
const toggleMealPlanLike = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { username } = req.body;

    if (!username) return next(createError(400, "Username is required"));

    const user = await User.findOne({ username });
    if (!user) return next(createError(404, "User not found"));

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return next(createError(404, "Meal plan recipe not found"));

    const hasLiked = recipe.likedBy.some(
      (uid) => uid.toString() === user._id.toString()
    );

    if (hasLiked) {
      recipe.likedBy = recipe.likedBy.filter(
        (uid) => uid.toString() !== user._id.toString()
      );
      recipe.likeCount = Math.max(0, (recipe.likeCount || 0) - 1);
      await recipe.save();

      await User.findByIdAndUpdate(user._id, {
        $pull: { likedMealPlanRecipes: recipe._id },
      });

      return res.status(200).json({
        success: true,
        liked: false,
        likeCount: recipe.likeCount,
      });
    } else {
      recipe.likedBy.push(user._id);
      recipe.likeCount = (recipe.likeCount || 0) + 1;
      await recipe.save();

      await User.findByIdAndUpdate(user._id, {
        $addToSet: { likedMealPlanRecipes: recipe._id },
      });

      return res.status(200).json({
        success: true,
        liked: true,
        likeCount: recipe.likeCount,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Get liked meal plan recipes IDs for user
const getLikedMealPlanRecipes = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) return next(createError(400, "Username is required"));

    const user = await User.findOne({ username })
      .populate("likedMealPlanRecipes")
      .lean();

    if (!user) return next(createError(404, "User not found"));

    res.status(200).json({
      success: true,
      likedRecipes: (user.likedMealPlanRecipes || []).map((r) =>
        r._id.toString()
      ),
    });
  } catch (err) {
    next(err);
  }
};

// Get liked meal plan recipes full docs for profile tab
const getLikedMealPlanRecipesByUser = async (req, res, next) => {
  try {
    const { username } = req.query;
    if (!username) return next(createError(400, "Username is required"));

    const user = await User.findOne({ username })
      .populate("likedMealPlanRecipes")
      .lean();
    if (!user) return next(createError(404, "User not found"));

    res.status(200).json({
      success: true,
      likedRecipes: user.likedMealPlanRecipes || [],
    });
  } catch (err) {
    next(err);
  }
};
const searchMealPlanRecipes = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query parameter 'q' is required",
      });
    }

    // Perform case-insensitive search in title, ingredients, or tags
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { ingredients: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("userId", "username")
      .lean();

    const formatted = recipes.map((r) => ({
      ...r,
      authorUsername: r.userId?.username,
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      recipes: formatted,
    });
  } catch (err) {
    console.error("Meal plan search error:", err);
    res.status(500).json({
      success: false,
      message: "Search operation failed",
      error: err.message,
    });
  }
};
module.exports.searchMealPlanRecipes = searchMealPlanRecipes;
module.exports.toggleMealPlanLike = toggleMealPlanLike;
module.exports.getLikedMealPlanRecipes = getLikedMealPlanRecipes;
module.exports.getLikedMealPlanRecipesByUser = getLikedMealPlanRecipesByUser;
