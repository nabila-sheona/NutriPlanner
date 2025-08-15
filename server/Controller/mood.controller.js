// server/Controller/mood.controller.js
const Mood = require('../Model/mood.model.js');
const Recipe = require('../Model/recipe2.model.js');
const { generateRecipes } = require('../utils/gemini.js');

exports.logMood = async (req, res) => {
  try {
    const { mood } = req.body;
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const newMood = new Mood({
      userId,
      mood
    });

    await newMood.save();
    return res.status(201).json({ message: 'Mood logged successfully' });
  } catch (error) {
    console.error('logMood error:', error);
    return res.status(500).json({ message: 'Error logging mood', error: error.message });
  }
};

exports.getMoodHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const moods = await Mood.find({ userId }).sort({ date: -1 });
    return res.status(200).json(moods);
  } catch (error) {
    console.error('getMoodHistory error:', error);
    return res.status(500).json({ message: 'Error fetching mood history', error: error.message });
  }
};

exports.generateMoodRecipes = async (req, res) => {
  try {
    const { mood } = req.body;
    const userId = req.user?.id;
    if (!mood || typeof mood !== 'string') {
      return res.status(400).json({ message: 'Invalid mood' });
    }
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Generate recipes using Gemini API
    const generatedRecipes = await generateRecipes(mood);

    // Save generated recipes to database and compute isLiked for current user
    const savedRecipes = await Promise.all(
      generatedRecipes.map(async (recipe) => {
        const newRecipe = new Recipe({
          title: recipe.title,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          mood,
          generatedBy: userId // mark who generated (or store 'Gemini' if you prefer)
        });
        const saved = await newRecipe.save();
        // add isLiked flag based on current user
        const obj = saved.toObject();
        obj.isLiked = (saved.likes || []).some((id) => id.toString() === userId.toString());
        return obj;
      })
    );

    return res.status(200).json(savedRecipes);
  } catch (error) {
    console.error('generateMoodRecipes error:', error);
    // return the error message to client for debugging but consider hiding in production
    return res.status(500).json({ message: 'Error generating recipes', error: error.message });
  }
};


// Controller: MoodController.js
exports.getMoodGraphData = async (req, res, next) => {
  console.log('[MoodController] getMoodGraphData called');

  try {
    const userId = req.user?.id;
    console.log('[MoodController] req.user:', req.user);

    if (!userId) {
      console.log('[MoodController] No user ID found in request');
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log('[MoodController] Fetching moods since:', since);

    const moods = await Mood.find({
      userId,
      date: { $gte: since },
    }).sort({ date: 1 });

    console.log('[MoodController] moods fetched:', moods);

    res.status(200).json(moods);
  } catch (error) {
    console.error('[MoodController] Error fetching mood graph data:', error);
    console.error('[MoodController] Error stack:', error.stack);
    res.status(500).json({ message: 'Server error fetching mood graph data', error: error.message });
  }
};
