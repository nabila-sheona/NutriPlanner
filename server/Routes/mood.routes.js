// server/Routes/mood.routes.js
const express = require('express');
const { logMood, getMoodHistory, generateMoodRecipes } = require('../Controller/mood.controller.js');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/moods', auth, logMood);
router.get('/history', auth, getMoodHistory);
router.post('/recipes/generate', auth, generateMoodRecipes);

router.get('/moods/graph', auth, (req, res, next) => {
  console.log('[MoodRoutes] /moods/graph route called');
  getMoodGraphData(req, res, next);
});

module.exports = router;
