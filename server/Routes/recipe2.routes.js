// server/Routes/recipe.routes2.js
const express = require('express');
const { likeRecipe, getLikedRecipes } = require('../Controller/recipe.controller2.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.post('/like/:recipeId', auth, likeRecipe);
router.get('/liked', auth, getLikedRecipes);

module.exports = router;
