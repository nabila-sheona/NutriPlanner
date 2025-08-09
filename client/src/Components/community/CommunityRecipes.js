import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  Snackbar,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  TextField,
} from "@mui/material";
import { Favorite, FavoriteBorder, Add, Search } from "@mui/icons-material";
import AddRecipeDialog from "./AddRecipeDialog";
import ViewRecipeDialog from "./ViewRecipeDialog";
import MealPlanCard from "./MealPlanCard";

const CommunityRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [allRecipes, setAllRecipes] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openMealPlanDialog, setOpenMealPlanDialog] = useState(false);
  const [openRecipeDialog, setOpenRecipeDialog] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [likedRecipes, setLikedRecipes] = useState(new Set());
  const [recipeType, setRecipeType] = useState("all");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [username] = useState(currentUser?.username || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch regular recipes
        const recipesResponse = await fetch("http://localhost:4000/recipes");
        if (!recipesResponse.ok) throw new Error("Failed to fetch recipes");
        const recipesData = await recipesResponse.json();

        // Try fetching meal plan recipes
        let mealPlanData = [];
        try {
          const mealPlanResponse = await fetch(
            "http://localhost:4000/mealplanrecipes/all"
          );
          if (mealPlanResponse.ok) {
            mealPlanData = await mealPlanResponse.json();
          }
        } catch (mealPlanErr) {
          console.log("Meal plan endpoint not available yet");
        }

        // Combine both types of recipes
        const combinedRecipes = [
          ...recipesData.map((recipe) => ({
            ...recipe,
            isMealPlan: false,
            instructions: Array.isArray(recipe.instructions)
              ? recipe.instructions
              : typeof recipe.instructions === "string"
              ? recipe.instructions
                  .split("\n")
                  .filter((step) => step.trim() !== "")
              : [],
          })),
          ...mealPlanData.map((mp) => ({
            ...mp,
            isMealPlan: true,
            instructions: Array.isArray(mp.instructions)
              ? mp.instructions
              : typeof mp.instructions === "string"
              ? mp.instructions.split("\n").filter((step) => step.trim() !== "")
              : [],
          })),
        ];

        setRecipes(combinedRecipes);
        setAllRecipes(combinedRecipes);

        // Fetch liked recipes if user is logged in
        if (currentUser?.username) {
          const [likedRegularRes, likedMealPlanRes] = await Promise.all([
            fetch(
              `http://localhost:4000/recipes/liked?username=${currentUser.username}`
            ),
            fetch(
              `http://localhost:4000/mealplanrecipes/liked?username=${currentUser.username}`
            ),
          ]);

          const regularJson = likedRegularRes.ok
            ? await likedRegularRes.json()
            : { likedRecipes: [] };
          const mealPlanJson = likedMealPlanRes.ok
            ? await likedMealPlanRes.json()
            : { likedRecipes: [] };

          const unionIds = new Set([
            ...(regularJson.likedRecipes || []),
            ...(mealPlanJson.likedRecipes || []),
          ]);
          setLikedRecipes(unionIds);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setSnackbarMessage("Failed to load recipes");
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [currentUser?.username]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setRecipes(allRecipes);
      return;
    }

    const searchRecipes = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/recipes/search?q=${encodeURIComponent(
            searchTerm
          )}`
        );
        if (!response.ok) throw new Error("Failed to search recipes");
        const data = await response.json();
        setRecipes(data.recipes || data);
      } catch (err) {
        console.error("Search failed:", err);
        setSnackbarMessage(
          err.message || "Search failed. Showing all recipes."
        );
        setSnackbarOpen(true);
        setRecipes(allRecipes);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchRecipes();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, allRecipes]);

  const handleLike = async (recipeId) => {
    if (!currentUser || !currentUser.username) {
      setSnackbarMessage("Please login to like recipes");
      setSnackbarOpen(true);
      return;
    }

    try {
      const targetRecipe = recipes.find((r) => r._id === recipeId);
      const isMealPlan = targetRecipe?.isMealPlan;
      const endpoint = isMealPlan
        ? `http://localhost:4000/mealplanrecipes/${recipeId}/like`
        : `http://localhost:4000/recipes/${recipeId}/like`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser.username,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newLikedRecipes = new Set(likedRecipes);
        if (data.liked) {
          newLikedRecipes.add(recipeId);
        } else {
          newLikedRecipes.delete(recipeId);
        }
        setLikedRecipes(newLikedRecipes);

        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe._id === recipeId
              ? { ...recipe, likeCount: data.likeCount }
              : recipe
          )
        );
      }
    } catch (err) {
      console.error("Like failed:", err);
      setSnackbarMessage("Failed to update like");
      setSnackbarOpen(true);
    }
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Proper dialog handlers for each type
  const handleOpenRecipeView = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenRecipeDialog(true);
  };

  const handleCloseRecipeDialog = () => {
    setOpenRecipeDialog(false);
    setSelectedRecipe(null);
  };

  const handleOpenMealPlanView = (recipe) => {
    setSelectedRecipe(recipe);
    setOpenMealPlanDialog(true);
  };

  const handleCloseMealPlanDialog = () => {
    setOpenMealPlanDialog(false);
    setSelectedRecipe(null);
  };
  const handleSubmit = async (recipeData) => {
    try {
      const response = await fetch("http://localhost:4000/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add recipe");
      }

      const data = await response.json();
      setRecipes([data, ...recipes]);
      setAllRecipes([data, ...allRecipes]);
      setSnackbarMessage("Recipe added successfully!");
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to add recipe:", err);
      setSnackbarMessage(err.message || "Failed to add recipe.");
      setSnackbarOpen(true);
    }
  };
  const categoryMapping = {
    breakfast: ["breakfast"],
    lunch: ["lunch"],
    dinner: ["dinner"],
    snack: ["snack"],
    dessert: ["dessert"],
  };
  const filteredRecipes = recipes.filter((recipe) => {
    if (filter === "all") return true;
    // Get the current recipe's category or mealType
    const recipeCategory = (
      recipe.category ||
      recipe.mealType ||
      ""
    ).toLowerCase();

    // Check if it matches the filter or any of its mapped values
    return categoryMapping[filter]
      ? categoryMapping[filter].includes(recipeCategory)
      : recipeCategory === filter;
  });

  const showFallback = searchTerm.trim() !== "" && filteredRecipes.length === 0;
  const displayedRecipes = showFallback
    ? allRecipes.slice(0, 3)
    : filteredRecipes.filter((recipe) => {
        if (recipeType === "all") return true;
        if (recipeType === "regular") return !recipe.isMealPlan;
        if (recipeType === "mealplan") return recipe.isMealPlan;
        return true;
      });

  return (
    <Container>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Community Recipes
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpenDialog}
          sx={{ backgroundColor: "#004346" }}
        >
          Quick Add Recipe
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Recipe Type</InputLabel>
          <Select
            value={recipeType}
            onChange={(e) => setRecipeType(e.target.value)}
            label="Recipe Type"
          >
            <MenuItem value="all">All Recipes</MenuItem>
            <MenuItem value="regular">Regular Recipes</MenuItem>
            <MenuItem value="mealplan">Meal Plan Recipes</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            label="Category"
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="breakfast">Breakfast</MenuItem>
            <MenuItem value="lunch">Lunch</MenuItem>
            <MenuItem value="dinner">Dinner</MenuItem>
            <MenuItem value="dessert">Dessert</MenuItem>
            <MenuItem value="snack">Snack</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by title, ingredients, or tags..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />,
          }}
          sx={{ flexGrow: 1, maxWidth: 500 }}
        />
      </Box>

      {showFallback && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          No recipes found matching "{searchTerm}". Here are some suggestions:
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        {displayedRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe._id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {recipe.title}
                  </Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary">
                  by {recipe.authorUsername || "Unknown"}
                </Typography>
                {recipe.category && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Category: {recipe.category}
                  </Typography>
                )}
                {recipe.mealType && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Category: {recipe.mealType}
                  </Typography>
                )}
                <Box
                  sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}
                >
                  {recipe.tags?.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ backgroundColor: "#33c9dc", color: "#ffffff" }}
                    />
                  ))}
                </Box>
              </CardContent>
              <CardActions sx={{ mt: "auto", justifyContent: "space-between" }}>
                <Box>
                  {recipe.isMealPlan ? (
                    <Button
                      onClick={() => handleOpenMealPlanView(recipe)}
                      sx={{ color: "#004346" }}
                    >
                      View Recipe
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleOpenRecipeView(recipe)}
                      sx={{ color: "#004346" }}
                    >
                      View Recipe
                    </Button>
                  )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    onClick={() => handleLike(recipe._id)}
                    color={likedRecipes.has(recipe._id) ? "error" : "default"}
                    aria-label={
                      likedRecipes.has(recipe._id)
                        ? "Unlike recipe"
                        : "Like recipe"
                    }
                  >
                    {likedRecipes.has(recipe._id) ? (
                      <Favorite />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                  <Typography variant="body2">
                    {recipe.likeCount || 0}
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <AddRecipeDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
        username={username}
      />

      {selectedRecipe && selectedRecipe.isMealPlan ? (
        <MealPlanCard
          open={openMealPlanDialog}
          onClose={handleCloseMealPlanDialog}
          recipe={selectedRecipe}
        />
      ) : (
        <ViewRecipeDialog
          open={openRecipeDialog}
          onClose={handleCloseRecipeDialog}
          recipe={selectedRecipe}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CommunityRecipes;
