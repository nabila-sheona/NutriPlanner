const Recipe = require("../Model/recipe.model");
const User = require("../Model/user.model");
const createError = require("../utils/createError");

const createRecipe = async (req, res, next) => {
  try {
    const { authorUsername } = req.body;

    if (!authorUsername) {
      return next(createError(400, "Author username is required"));
    }

    const newRecipe = new Recipe({
      ...req.body,
      authorUsername,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (err) {
    next(err);
  }
};

// Get all recipes
const getRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

// Get single recipe
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return next(createError(404, "Recipe not found!"));
    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

const searchRecipes = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query parameter 'q' is required",
      });
    }

    // Use MongoDB text search if you've created text indexes
    // OR use regex search as fallback
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { ingredients: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      recipes,
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({
      success: false,
      message: "Search operation failed",
      error: err.message,
    });
  }
};

// Update getUserRecipes to use username from query
const getUserRecipes = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return next(createError(400, "Username is required"));
    }

    const recipes = await Recipe.find({ authorUsername: username }).sort({
      createdAt: -1,
    });

    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

// Update deleteRecipe to use username from body
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return next(createError(404, "Recipe not found!"));

    const { username } = req.body;
    if (!username) return next(createError(401, "Username is required"));

    if (username !== recipe.authorUsername) {
      return next(createError(403, "You can delete only your recipes!"));
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json("Recipe has been deleted!");
  } catch (err) {
    next(err);
  }
};

// Update updateRecipe to use username from body
const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return next(createError(404, "Recipe not found!"));
    }

    const { username } = req.body;
    if (!username) {
      return next(createError(401, "Username is required"));
    }

    if (username !== recipe.authorUsername) {
      return next(createError(403, "You can update only your recipes!"));
    }

    // Make sure to exclude fields that shouldn't be updated
    const { _id, authorUsername, ...updateData } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      updateData, // Only update allowed fields
      { new: true, runValidators: true } // Add runValidators
    );

    if (!updatedRecipe) {
      return next(createError(500, "Failed to update recipe"));
    }

    res.status(200).json(updatedRecipe);
  } catch (err) {
    next(err);
  }
};

const getRecipeHeatmap = async (req, res, next) => {
  try {
    const { username } = req.query; // Changed from req.body to req.query

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const uploads = await Recipe.aggregate([
      { $match: { authorUsername: username } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json(uploads);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  getUserRecipes,
  deleteRecipe,
  searchRecipes,
  getRecipeHeatmap,
};
