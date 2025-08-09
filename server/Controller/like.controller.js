const Like = require("../Model/like.model");
const Recipe = require("../Model/recipe.model");
const User = require("../Model/user.model");
const createError = require("../utils/createError");

const toggleLike = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { username } = req.body;

    if (!username) {
      return next(createError(400, "Username is required"));
    }

    const user = await User.findOne({ username });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const existingLike = await Like.findOne({
      user: user._id,
      recipe: recipeId,
    });

    if (existingLike) {
      // Unlike the recipe
      await Like.findByIdAndDelete(existingLike._id);

      // Update recipe like count
      await Recipe.findByIdAndUpdate(recipeId, {
        $inc: { likeCount: -1 },
      });

      // Remove from user's liked recipes
      await User.findByIdAndUpdate(user._id, {
        $pull: { likedRecipes: recipeId },
      });

      return res.status(200).json({
        success: true,
        liked: false,
        likeCount: (await Recipe.findById(recipeId)).likeCount,
      });
    } else {
      // Like the recipe
      const newLike = new Like({
        user: user._id,
        recipe: recipeId,
      });
      await newLike.save();

      // Update recipe like count
      await Recipe.findByIdAndUpdate(recipeId, {
        $inc: { likeCount: 1 },
      });

      // Add to user's liked recipes
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { likedRecipes: recipeId },
      });

      return res.status(200).json({
        success: true,
        liked: true,
        likeCount: (await Recipe.findById(recipeId)).likeCount,
      });
    }
  } catch (err) {
    next(err);
  }
};

// Check if user liked a recipe
const checkLikeStatus = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { username } = req.query; // Get username from query params

    if (!username) {
      return next(createError(400, "Username is required"));
    }

    const user = await User.findOne({ username });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    const isLiked = await Like.exists({
      user: user._id,
      recipe: recipeId,
    });

    res.status(200).json({
      success: true,
      liked: !!isLiked,
    });
  } catch (err) {
    next(err);
  }
};
const getLikedRecipes = async (req, res, next) => {
  try {
    const { username } = req.query;

    if (!username) {
      return next(createError(400, "Username is required"));
    }

    const user = await User.findOne({ username }).populate("likedRecipes");
    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      likedRecipes: user.likedRecipes.map((recipe) => recipe._id.toString()),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  toggleLike,
  checkLikeStatus,
  getLikedRecipes,
};
