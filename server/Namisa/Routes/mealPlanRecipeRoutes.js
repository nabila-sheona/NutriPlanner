// backend/Routes/mealPlanRecipeRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/jwt.js");
const mealPlanRecipeController = require("../Controller/mealPlanRecipeController.js");

router.post("/save", verifyToken, mealPlanRecipeController.saveRecipe);
router.get("/myrecipes", verifyToken, mealPlanRecipeController.getRecipes);
router.get("/all", mealPlanRecipeController.getAllMealPlanRecipes);

// Likes for meal plan recipes
router.post(
  "/:recipeId/like",
  mealPlanRecipeController.toggleMealPlanLike
);
router.get(
  "/liked",
  mealPlanRecipeController.getLikedMealPlanRecipes
);
router.get(
  "/likedbyuser",
  mealPlanRecipeController.getLikedMealPlanRecipesByUser
);

module.exports = router;
