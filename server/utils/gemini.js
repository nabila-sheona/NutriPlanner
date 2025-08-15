const axios = require('axios');

const generateRecipes = async (mood) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY is missing in environment variables');

    const prompt = `Generate 3 recipes for someone feeling ${mood}. Try to generate innovative and unique recipes every time you generate recipes for even the same mood. Don't repeat recipes.
      Return ONLY a JSON array in this exact format:
      [{
        "title": "Recipe Name",
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": "Step-by-step instructions"
      }]`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 20000
      }
    );

    const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("Gemini didn't return valid content");

    const jsonStart = textResponse.indexOf('[');
    const jsonEnd = textResponse.lastIndexOf(']') + 1;
    const jsonString = textResponse.slice(jsonStart, jsonEnd);
    const recipes = JSON.parse(jsonString);

    if (!Array.isArray(recipes)) throw new Error("Response was not an array");
    return recipes.map(recipe => ({
      title: recipe.title || "Untitled Recipe",
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: recipe.instructions || ""
    }));

  } catch (error) {
    console.error("Gemini API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error("Failed to generate recipes. Please try again.");
  }
};

module.exports = { generateRecipes };