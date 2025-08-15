const Recipe = require('../Model/recipe2.model.js');

const likeRecipe = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    if (recipe.likes.some((id) => id.toString() === userId.toString())) {
      return res.status(400).json({ message: 'Recipe already liked' });
    }

    recipe.likes.push(userId);
    await recipe.save();

    return res.status(200).json({
      message: 'Recipe liked successfully',
      isLiked: true
    });
  } catch (error) {
    console.error('likeRecipe error:', error);
    return res.status(500).json({ message: 'Error liking recipe', error: error.message });
  }
};

const getLikedRecipes = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const recipes = await Recipe.find({ likes: userId });
    return res.status(200).json(recipes);
  } catch (error) {
    console.error('getLikedRecipes error:', error);
    return res.status(500).json({ message: 'Error fetching liked recipes', error: error.message });
  }
};


const getRecipeHistory = async (req, res) => {
  try {
    console.log('getRecipeHistory called');
    const userId = req.user?.id;
    if (!userId) {
      console.log('No user ID - unauthorized');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { mood } = req.query;
    console.log(`Fetching recipes for user ${userId}, mood: ${mood || 'all'}`);

    const query = { generatedBy: userId };
    if (mood) query.mood = mood;

    console.log('Query:', query);
    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    console.log(`Found ${recipes.length} recipes`);

    res.status(200).json(recipes);
  } catch (error) {
    console.error('Error in getRecipeHistory:', error);
    res.status(500).json({ 
      message: 'Error fetching recipe history',
      error: error.message 
    });
  }
};


module.exports = {
  likeRecipe,
  getLikedRecipes,
  getRecipeHistory
};
