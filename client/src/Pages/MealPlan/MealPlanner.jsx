import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChefHat, Calendar, Target, Check } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  styled,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const dietaryOptions = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Keto",
  "Low Sodium",
  "Diabetic-Friendly",
];

const healthGoals = [
  "Weight Loss",
  "Muscle Building",
  "Weight Maintenance",
  "General Health",
];

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Custom styled components
const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#004346",
  color: "white",
  padding: "12px 24px",
  borderRadius: "12px",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#336666",
    boxShadow: theme.shadows[4],
  },
  "&:disabled": {
    backgroundColor: theme.palette.grey[400],
  },
}));

const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#669999",
  color: "white",
  padding: "12px 24px",
  borderRadius: "12px",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#336666",
    boxShadow: theme.shadows[4],
  },
}));

const RecipeButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#FF7D33",
  color: "white",
  padding: "12px 24px",
  borderRadius: "12px",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#E66A2A",
    boxShadow: theme.shadows[4],
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "8px 16px",
  borderRadius: "8px",
  fontWeight: 600,
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#3E8E41",
    boxShadow: theme.shadows[3],
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 67, 70, 0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 24px rgba(0, 67, 70, 0.15)",
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: "#004346",
  color: "white",
  borderTopLeftRadius: "16px",
  borderTopRightRadius: "16px",
  "& .MuiCardHeader-title": {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
}));

const DayCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  backgroundColor: "#f8faf9",
  border: "1px solid #e0e0e0",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 4px 12px rgba(0, 67, 70, 0.1)",
    transform: "translateY(-2px)",
  },
}));

const MealItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: "white",
  borderRadius: "8px",
  borderLeft: `4px solid #004346`,
}));

export default function MealPlanner() {
  const [preferences, setPreferences] = useState([]);
  const [goal, setGoal] = useState(healthGoals[0]);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [loadingRecipe, setLoadingRecipe] = useState(false);

  const GEMINI_API_KEY = "AIzaSyAe5jVx78jgIf7TEhdciw0bOj4rNqFsw2Q";
  const GEMINI_ENDPOINT =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const togglePreference = (option) => {
    setPreferences((prev) =>
      prev.includes(option)
        ? prev.filter((p) => p !== option)
        : [...prev, option]
    );
  };

  useEffect(() => {
    console.log("API Key:", process.env.REACT_APP_API_KEY_GEMINI);
  }, []);

  const generateRecipe = async () => {
    setLoadingRecipe(true);

    const basePrompt = `
Generate a COMPLETE healthy recipe in the following format.
Keep it under 300 words per message, but if you can't finish, I will ask you to continue.
Always include ALL sections exactly in this order and do not stop mid-sentence.

Format:
Title: [Recipe Name]
Time: [Time in minutes]
Calories: [Calories]
Type: [Breakfast/Lunch/Dinner]

Ingredients:
- Item - quantity in grams or cups

Instructions:
1. Step 1
2. Step 2
3. Step 3

Macros:
Calories: xxx | Protein: xxg | Carbs: xxg | Fat: xxg | Fiber: xxg | Sodium: xxmg
`;

    let fullText = "";
    let continuePrompt = basePrompt;
    let attempt = 0;
    const maxAttempts = 5;

    try {
      while (attempt < maxAttempts) {
        attempt++;

        const response = await axios.post(
          `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: continuePrompt }] }],
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.7,
            },
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const aiChunk =
          response.data.candidates[0].content.parts[0].text.trim();
        fullText += (fullText ? "\n" : "") + aiChunk;

        if (aiChunk.toLowerCase().includes("macros:")) {
          break;
        }

        continuePrompt = `Continue the previous recipe from where it stopped. Do not repeat anything. Here is what you wrote so far:\n${fullText}`;
      }

      setRecipe(fullText);
    } catch (error) {
      console.error("Error generating recipe:", error);
      setRecipe("Oops! Couldn't fetch recipe. Blame the AI chef. 🤖🍳");
    } finally {
      setLoadingRecipe(false);
    }
  };

  const generatePlan = async () => {
    setLoading(true);

    const prompt = `
      Create a personalized 7-day meal plan with breakfast, lunch, and dinner for each day.
      Dietary Preferences: ${
        preferences.length > 0 ? preferences.join(", ") : "None"
      }
      Health Goal: ${goal}
      Format it like:
      Monday:
        Breakfast: ...
        Lunch: ...
        Dinner: ...
      Keep it concise, clear, and skip health tips or intro text.
    `;

    const requestData = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const response = await axios.post(
        `${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiText = response.data.candidates[0].content.parts[0].text;
      setPlan(aiText);
    } catch (error) {
      console.error("Error generating meal plan:", error);
      setPlan("Oops! Couldn't fetch a plan. Maybe Gemini got hangry? 🤖🍽️");
    } finally {
      setLoading(false);
    }
  };

  const saveMealPlanToProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:4000/mealplans/save",
        {
          planText: plan,
          goal,
          preferences,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Meal plan saved to profile!");
    } catch (error) {
      console.error("Error saving meal plan:", error);
      alert("Failed to save meal plan.");
    }
  };

  const saveRecipeToProfile = async () => {
    const token = localStorage.getItem("token");
    const recipeData = parseRecipeText(recipe);
    try {
      await axios.post(
        "http://localhost:4000/mealplanrecipes/save",
        recipeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Recipe saved to profile!");
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe.");
    }
  };

  const extractMealsPerDay = (text) => {
    const mealMap = {};
    let currentDay = null;

    const lines = text
      .split(/\*\*|\n/)
      .map((l) => l.trim())
      .filter((l) => l);

    for (let line of lines) {
      for (let day of dayNames) {
        if (line.toLowerCase().startsWith(day.toLowerCase())) {
          currentDay = day;
          mealMap[day] = {};
          break;
        }
      }

      if (!currentDay) continue;

      const mealMatch = line.match(/(?:Breakfast|Lunch|Dinner):\**\s*(.+)/i);
      if (mealMatch) {
        const mealType = line.match(/Breakfast|Lunch|Dinner/i)[0];
        mealMap[currentDay][mealType] = mealMatch[1];
      }
    }

    return mealMap;
  };

  const parseRecipeText = (text) => {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    let title = "";
    let time = "";
    let calories = "";
    let mealType = "";
    let ingredients = [];
    let instructions = [];
    let macros = "";

    let section = "";

    for (const line of lines) {
      if (line.startsWith("Title:")) {
        title = line.replace("Title:", "").trim();
      } else if (line.startsWith("Time:")) {
        time = line.replace("Time:", "").trim();
      } else if (line.startsWith("Calories:") && !macros) {
        calories = line.replace("Calories:", "").trim();
      } else if (line.startsWith("Type:")) {
        mealType = line.replace("Type:", "").trim();
      } else if (
        line === "Ingredients:" ||
        line === "Instructions:" ||
        line.startsWith("Macros:")
      ) {
        section = line.toLowerCase();
      } else {
        if (section === "ingredients:") {
          if (line.startsWith("- ")) {
            ingredients.push(line.replace("- ", "").trim());
          }
        } else if (section === "instructions:") {
          if (/^\d+\./.test(line)) {
            instructions.push(line.replace(/^\d+\.\s*/, ""));
          }
        } else if (section.startsWith("macros:")) {
          macros = line.trim();
        }
      }
    }

    return {
      title,
      time,
      calories,
      mealType,
      ingredients,
      instructions,
      macros,
    };
  };

  return (
    <Box sx={{ backgroundColor: "#f5f9f9", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0, 67, 70, 0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ maxWidth: "lg", mx: "auto", px: 3, py: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 1,
            }}
          >
            <ChefHat sx={{ width: 32, height: 32, color: "#004346" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: "#004346",
                fontSize: { xs: "2rem", sm: "2.5rem" },
              }}
            >
              NutriPlan
            </Typography>
          </Box>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: "center", color: "#669999" }}
          >
            Your personalized weekly meal planning companion
          </Typography>
        </Box>
      </Box>

      <Box sx={{ maxWidth: "lg", mx: "auto", px: 3, py: 4 }}>
        {/* Configuration Cards */}
        <Grid container spacing={4} sx={{ mb: 4 }} alignItems="stretch">
          {/* Dietary Preferences Card */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <StyledCard sx={{ flex: 1 }}>
              <StyledCardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                    <Check size={20} />
                  </Avatar>
                }
                title="Dietary Preferences"
              />
              <CardContent>
                <Grid container spacing={2}>
                  {dietaryOptions.map((opt) => (
                    <Grid item xs={12} sm={6} key={opt}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: "12px",
                          border: "1px solid",
                          borderColor: preferences.includes(opt)
                            ? "#004346"
                            : "#e0e0e0",
                          backgroundColor: preferences.includes(opt)
                            ? "rgba(0, 67, 70, 0.05)"
                            : "white",
                          cursor: "pointer",
                          transition: "all 0.3s",
                          "&:hover": {
                            borderColor: "#004346",
                          },
                        }}
                        onClick={() => togglePreference(opt)}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={preferences.includes(opt)}
                              sx={{
                                color: "#004346",
                                "&.Mui-checked": {
                                  color: "#004346",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: preferences.includes(opt)
                                  ? "#004346"
                                  : "text.secondary",
                              }}
                            >
                              {opt}
                            </Typography>
                          }
                        />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Health Goals Card */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <StyledCard sx={{ flex: 1 }}>
              <StyledCardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                    <Target size={20} />
                  </Avatar>
                }
                title="Health Goals"
              />
              <CardContent>
                <RadioGroup
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                >
                  {healthGoals.map((g) => (
                    <Paper
                      key={g}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: "12px",
                        border: "1px solid",
                        borderColor: goal === g ? "#004346" : "#e0e0e0",
                        backgroundColor:
                          goal === g ? "rgba(0, 67, 70, 0.05)" : "white",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        "&:hover": {
                          borderColor: "#004346",
                        },
                      }}
                      onClick={() => setGoal(g)}
                    >
                      <FormControlLabel
                        value={g}
                        control={
                          <Radio
                            sx={{
                              color: "#004346",
                              "&.Mui-checked": {
                                color: "#004346",
                              },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontWeight: 500,
                              color: goal === g ? "#004346" : "text.secondary",
                            }}
                          >
                            {g}
                          </Typography>
                        }
                      />
                    </Paper>
                  ))}
                </RadioGroup>
              </CardContent>
            </StyledCard>
          </Grid>
        </Grid>

        {/* Generate Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 3, mb: 4 }}>
          <PrimaryButton
            onClick={generatePlan}
            disabled={loading}
            startIcon={<ChefHat size={20} />}
          >
            {loading ? "Crafting Your Plan..." : "Generate Meal Plan"}
          </PrimaryButton>
          <RecipeButton
            onClick={generateRecipe}
            disabled={loadingRecipe}
            startIcon={<ChefHat size={20} />}
          >
            {loadingRecipe ? "Whipping Up Recipe..." : "Generate AI Recipe"}
          </RecipeButton>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 6,
            }}
          >
            <CircularProgress size={60} sx={{ color: "#004346", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#669999" }}>
              Creating your personalized meal plan...
            </Typography>
          </Box>
        )}

        {/* Recipe Results */}
        {recipe &&
          !loadingRecipe &&
          (() => {
            const {
              title,
              time,
              calories,
              mealType,
              ingredients,
              instructions,
              macros,
            } = parseRecipeText(recipe);

            return (
              <StyledCard sx={{ mt: 4, maxWidth: "800px", mx: "auto" }}>
                <StyledCardHeader
                  title={title || "Recipe"}
                  action={
                    <SaveButton
                      onClick={saveRecipeToProfile}
                      startIcon={<Check size={18} />}
                    >
                      Save Recipe
                    </SaveButton>
                  }
                />
                <CardContent>
                  {/* Summary Chips */}
                  <Box
                    sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}
                  >
                    {time && (
                      <Chip
                        icon={<Calendar size={16} />}
                        label={time}
                        sx={{ backgroundColor: "#f0f7f7", color: "#004346" }}
                      />
                    )}
                    {calories && (
                      <Chip
                        label={`${calories} calories`}
                        sx={{ backgroundColor: "#f0f7f7", color: "#004346" }}
                      />
                    )}
                    {mealType && (
                      <Chip
                        label={mealType}
                        sx={{ backgroundColor: "#f0f7f7", color: "#004346" }}
                      />
                    )}
                  </Box>

                  {/* Ingredients */}
                  <Accordion defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ color: "#004346" }}>
                        Ingredients
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {ingredients.map((ing, i) => (
                          <ListItem key={i} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  backgroundColor: "#004346",
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText primary={ing} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  {/* Instructions */}
                  <Accordion defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6" sx={{ color: "#004346" }}>
                        Instructions
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {instructions.map((step, i) => (
                          <ListItem
                            key={i}
                            sx={{ py: 1, alignItems: "flex-start" }}
                          >
                            <ListItemText
                              primary={`${i + 1}. ${step}`}
                              primaryTypographyProps={{ variant: "body1" }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  {/* Macros */}
                  {macros && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mt: 2,
                        backgroundColor: "#f8faf9",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 600, color: "#004346" }}
                      >
                        Nutritional Information
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#336666" }}>
                        {macros}
                      </Typography>
                    </Paper>
                  )}
                </CardContent>
              </StyledCard>
            );
          })()}

        {/* Meal Plan Results */}
        {plan && !loading && (
          <StyledCard sx={{ mt: 4 }}>
            <StyledCardHeader
              title="Your Weekly Meal Plan"
              avatar={
                <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
                  <Calendar size={20} />
                </Avatar>
              }
              action={
                <SaveButton
                  onClick={saveMealPlanToProfile}
                  startIcon={<Check size={18} />}
                >
                  Save Plan
                </SaveButton>
              }
            />
            <CardContent>
              <Grid container spacing={3}>
                {Object.entries(extractMealsPerDay(plan)).map(
                  ([day, meals]) => (
                    <Grid item xs={12} sm={6} md={4} key={day}>
                      <DayCard>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#004346",
                            mb: 2,
                            pb: 1,
                            borderBottom: "2px solid rgba(0, 67, 70, 0.1)",
                          }}
                        >
                          {day}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          {["Breakfast", "Lunch", "Dinner"].map((mealType) =>
                            meals[mealType] ? (
                              <MealItem key={mealType}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: "white",
                                    backgroundColor: "#669999",
                                    display: "inline-block",
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "12px",
                                    mb: 1,
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {mealType}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ color: "#336666" }}
                                >
                                  {meals[mealType]}
                                </Typography>
                              </MealItem>
                            ) : null
                          )}
                        </Box>
                      </DayCard>
                    </Grid>
                  )
                )}
              </Grid>
            </CardContent>
          </StyledCard>
        )}
      </Box>
    </Box>
  );
}
