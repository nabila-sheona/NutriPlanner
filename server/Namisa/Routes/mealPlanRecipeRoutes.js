// backend/Routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/jwt.js");
const {
  saveRecipe,
  getRecipes,
  getAllMealPlanRecipes,
} = require("../Controller/mealPlanRecipeController.js");

router.post("/save", verifyToken, saveRecipe);
router.get("/myrecipes", verifyToken, getRecipes);
router.get("/all", getAllMealPlanRecipes);
module.exports = router;
