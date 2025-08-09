const express = require("express");
const router = express.Router();
const {
  createRecipe,
  getRecipes,
  searchRecipes,
  getUserRecipes,
  deleteRecipe,
  updateRecipe,
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

router.post("/user", getUserRecipes);
router.delete("/:id", deleteRecipe);
router.put("/:id", updateRecipe);

router.post("/:recipeId/like", toggleLike); //using
router.get("/:recipeId/like-status", checkLikeStatus); //using
// Add this line
module.exports = router;
