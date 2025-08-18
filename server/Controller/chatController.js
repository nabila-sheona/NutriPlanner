const chatWithAI = async (req, res) => {
  const { message, context } = req.body;

  let pageData = {};

  try {
    if (context.includes("mealplan")) {
      // Fetch weekly meal plan and recipes from DB
      const weeklyPlan = await MealPlan.find().limit(7);
      const recipes = await Recipe.find().limit(20);
      pageData = { weeklyPlan, recipes };
    } else if (
      context.includes("moodtracker") ||
      context.includes("community")
    ) {
      const recipes = await Recipe.find().limit(20);
      pageData = { recipes };
    } else if (context.includes("profile")) {
      // Optionally fetch user-related data from DB if needed
      pageData = {};
    }

    // Build AI instruction with dynamic data
    let contextInstruction = "";
    if (context.includes("mealplan")) {
      contextInstruction =
        "The user is on the Meal Plan page. Suggest healthy weekly meal plans using the following data:\n" +
        JSON.stringify(pageData, null, 2);
    } else if (context.includes("moodtracker")) {
      contextInstruction =
        "The user is on the Mood Tracker page. Suggest recipes based on their mood using this data:\n" +
        JSON.stringify(pageData, null, 2);
    } else if (context.includes("community")) {
      contextInstruction =
        "The user is browsing Community Recipes. Recommend trending or popular recipes using this data:\n" +
        JSON.stringify(pageData, null, 2);
    } else {
      contextInstruction =
        "The user is exploring the app. Assist with recipes, meal planning, or nutrition using this data:\n" +
        JSON.stringify(pageData, null, 2);
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${contextInstruction}\n\nUser: ${message}\nAI: Only respond to relevant questions. Do not answer adult or irrelevant questions.`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extract text properly from Gemini API
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      "🤔 Sorry, I couldn't understand that.";

    // Optional: suggested buttons
    let suggestions = [];
    if (pageData?.recipes) {
      suggestions = pageData.recipes.slice(0, 3).map((r) => r.name);
    }

    res.json({ reply, suggestions });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res
      .status(500)
      .json({ reply: "⚠️ Error connecting to AI.", suggestions: [] });
  }
};

module.exports = { chatWithAI };
