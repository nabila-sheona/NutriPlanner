const chatWithAI = async (req, res) => {
  const { message, context, messages: chatHistory } = req.body; // messages = full conversation

  let pageData = {};

  try {
    // Fetch relevant page data
    if (context.includes("mealplan")) {
      const weeklyPlan = await MealPlan.find().limit(7);
      const recipes = await Recipe.find().limit(20);
      pageData = {
        weeklyPlan: weeklyPlan.length
          ? weeklyPlan
          : [
              { day: "Monday", recipe: "Grilled Chicken Salad" },
              { day: "Tuesday", recipe: "Veggie Stir-fry" },
              { day: "Wednesday", recipe: "Oatmeal with Fruits" },
              { day: "Thursday", recipe: "Quinoa Salad" },
              { day: "Friday", recipe: "Baked Salmon with Veggies" },
              { day: "Saturday", recipe: "Veggie Wrap" },
              { day: "Sunday", recipe: "Chicken Stir-fry" },
            ],
        recipes: recipes.length
          ? recipes
          : [
              { name: "Grilled Chicken Salad", calories: 350 },
              { name: "Veggie Stir-fry", calories: 250 },
              { name: "Oatmeal with Fruits", calories: 200 },
              { name: "Quinoa Salad", calories: 300 },
              { name: "Baked Salmon with Veggies", calories: 400 },
            ],
      };
    } else if (
      context.includes("moodtracker") ||
      context.includes("community")
    ) {
      const recipes = await Recipe.find().limit(20);
      pageData = {
        recipes: recipes.length
          ? recipes
          : [
              { name: "Veggie Stir-fry", calories: 250 },
              { name: "Grilled Chicken Salad", calories: 350 },
              { name: "Pasta Primavera", calories: 400 },
            ],
      };
    }

    // Build full conversation string
    const conversationText = chatHistory
      .map((m) => `${m.sender === "user" ? "User" : "AI"}: ${m.message}`)
      .join("\n");

    // Build prompt for Gemini
    const prompt = `
You are NutriPlan Assistant, a friendly and concise nutrition guide.
Respond only to the user's latest message based on the chat history below.
If relevant user data is provided, use it to personalize advice.
Rules:
- Always greet or acknowledge if user greets.
- Keep replies short and plain text (1-3 sentences). NO MARKDOWN OR BOLD TEXT OR BULLETS!! 
- Stay strictly on-topic: answer only what the user asked.
- Ask a short follow-up question only if needed.
- Use a friendly, motivating tone.

Page data (if any): ${JSON.stringify(pageData, null, 2)}

Chat history:
${conversationText}

User: ${message}
AI:
`;

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
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

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
