const MealPlan = require("../Model/MealPlan.js");

// Save a new meal plan
const saveMealPlan = async (req, res) => {
  try {
    const userId = req.userId;
    const { planText, goal, preferences } = req.body;

    if (!planText || !goal) {
      return res
        .status(400)
        .json({ error: "Plan text and goal are required." });
    }

    const mealPlan = new MealPlan({
      userId,
      planText,
      goal,
      preferences,
    });

    await mealPlan.save();

    res
      .status(201)
      .json({ message: "Meal plan saved successfully!", mealPlan });
  } catch (err) {
    console.error("Error saving meal plan:", err);
    res.status(500).json({ error: "Failed to save meal plan." });
  }
};

// Get meal plans for logged-in user
const getMealPlans = async (req, res) => {
  try {
    const userId = req.userId;
    const plans = await MealPlan.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json(plans);
  } catch (err) {
    console.error("Error fetching meal plans:", err);
    res.status(500).json({ error: "Failed to fetch meal plans." });
  }
};

module.exports = {
  saveMealPlan,
  getMealPlans,
};
