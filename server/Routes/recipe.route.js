const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  searchRecipes,
  getUserRecipes,
  deleteRecipe,
  updateRecipe,
  getRecipeHeatmap,
} = require("../Controller/recipe.controller");
const {
  toggleLike,
  checkLikeStatus,
  getLikedRecipes,
  getLikedRecipesbyuser,
} = require("../Controller/like.controller");
router.get("/liked", getLikedRecipes); //using
router.get("/likedbyuser", getLikedRecipesbyuser); //using
router.post("/", createRecipe); //using
router.get("/", getRecipes); //using
router.get("/search", searchRecipes); //using

router.post("/user", getUserRecipes); //using
router.delete("/:id", deleteRecipe); //using
router.put("/:id", updateRecipe); //using

router.post("/:recipeId/like", toggleLike); //using
router.get("/:recipeId/like-status", checkLikeStatus); //using

router.get("/heatmap", getRecipeHeatmap);

module.exports = router;
