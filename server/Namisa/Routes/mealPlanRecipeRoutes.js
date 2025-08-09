// backend/Routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../../middleware/jwt.js");
const {
  saveRecipe,
  getRecipes,
} = require("../Controller/mealPlanRecipeController.js");

router.post("/save", verifyToken, saveRecipe);
router.get("/myrecipes", verifyToken, getRecipes);

module.exports = router;
