export const generateRecipes = async (mood) => {
  try {
    const key = process.env.REACT_APP_GEMINI_API_KEY;
    if (!key) throw new Error("API key missing. Check your environment variables.");

    const prompt = `Generate 3 recipes for someone feeling ${mood}. Try to generate innovative and unique recipes every time you generate recipes for even the same mood. Don't repeat recipe for same mood again and again.
      Return ONLY a JSON array in this exact format:
      [{
        "title": "Recipe Name",
        "ingredients": ["ingredient1", "ingredient2"],
        "instructions": "Step-by-step instructions"
      }]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Gemini API request failed");
    }

    const data = await response.json();
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) throw new Error("No valid response from Gemini");

    const jsonStart = textResponse.indexOf('[');
    const jsonEnd = textResponse.lastIndexOf(']') + 1;
    const jsonString = textResponse.slice(jsonStart, jsonEnd);
    const recipes = JSON.parse(jsonString);

    if (!Array.isArray(recipes)) throw new Error("Response was not an array");
    return recipes;

  } catch (error) {
    console.error("Client-side Gemini Error:", error.message);
    throw new Error("Recipe generation failed. Please try again later.");
  }
};