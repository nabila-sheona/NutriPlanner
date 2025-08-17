// server/routes/recipe.routes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const recipeController = require('../Controller/recipe.controller2');

console.log('Initializing recipe routes...');

router.get('/history', 
  (req, res, next) => {
    console.log('\n[DEBUG] /history route hit');
    console.log('Request headers:', req.headers);
    next();
  },
  auth,
  recipeController.getRecipeHistory
);

router.post('/like/:recipeId', auth, recipeController.likeRecipe);
router.get('/liked', auth, recipeController.getLikedRecipes);

module.exports = router;