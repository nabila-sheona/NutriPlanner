import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Box,
  Divider,
  Snackbar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Edit, Delete, Favorite, Add, Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [mode, setMode] = useState("view"); // 'view', 'create', or 'edit'
  const navigate = useNavigate();

  const [recipeForm, setRecipeForm] = useState({
    title: "",
    category: "",
    ingredients: [""],
    instructions: "",
    tags: "",
  });

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // Fetch user's recipes
  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        if (!currentUser?.username) {
          navigate("/login");
          return;
        }

        const response = await fetch(`http://localhost:4000/recipes/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: currentUser.username,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch recipes");
        const data = await response.json();
        setRecipes(data);
      } catch (err) {
        console.error("Failed to fetch recipes:", err);
        setSnackbarMessage("Failed to load your recipes");
        setSnackbarOpen(true);
      }
    };

    fetchMyRecipes();
  }, [currentUser?.username, navigate]); // Only depend on these values

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeForm({ ...recipeForm, [name]: value });
  };

  // Handle ingredient changes
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipeForm.ingredients];
    newIngredients[index] = value;
    setRecipeForm({ ...recipeForm, ingredients: newIngredients });
  };

  // Add new ingredient field
  const addIngredientField = () => {
    setRecipeForm({
      ...recipeForm,
      ingredients: [...recipeForm.ingredients, ""],
    });
  };

  // Remove ingredient field
  const removeIngredientField = (index) => {
    const newIngredients = [...recipeForm.ingredients];
    newIngredients.splice(index, 1);
    setRecipeForm({ ...recipeForm, ingredients: newIngredients });
  };

  // Handle recipe selection for editing
  const handleEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setMode("edit");
    setRecipeForm({
      title: recipe.title,
      category: recipe.category,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      tags: recipe.tags.join(", "),
    });
  };

  // Handle new recipe creation
  const handleCreateNew = () => {
    setSelectedRecipe(null);
    setMode("create");
    setRecipeForm({
      title: "",
      category: "",
      ingredients: [""],
      instructions: "",
      tags: "",
    });
  };

  // Handle recipe deletion
  const handleDelete = async (recipeId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/recipes/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: currentUser.username,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete recipe");

      setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
      setSnackbarMessage("Recipe deleted successfully");
      setSnackbarOpen(true);

      if (selectedRecipe?._id === recipeId) {
        setSelectedRecipe(null);
        setMode("view");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setSnackbarMessage("Failed to delete recipe");
      setSnackbarOpen(true);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const tagsArray = recipeForm.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      // Prepare the base recipe data
      const recipeData = {
        title: recipeForm.title,
        category: recipeForm.category,
        ingredients: recipeForm.ingredients.filter((ing) => ing.trim() !== ""),
        instructions: recipeForm.instructions,
        tags: tagsArray,
      };

      // Add the username field differently for create vs update
      if (mode === "create") {
        recipeData.authorUsername = currentUser.username; // For POST requests
      } else {
        recipeData.username = currentUser.username; // For PUT requests
      }

      const method = mode === "create" ? "POST" : "PUT";
      const url =
        mode === "create"
          ? "http://localhost:4000/recipes"
          : `http://localhost:4000/recipes/${selectedRecipe._id}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(recipeData),
      });

      if (!response.ok) throw new Error(`Failed to ${mode} recipe`);

      const data = await response.json();

      // Update state differently based on mode
      if (mode === "create") {
        setRecipes([data, ...recipes]); // Add new recipe to beginning
      } else {
        setRecipes(
          recipes.map((recipe) => (recipe._id === data._id ? data : recipe))
        ); // Update existing recipe
        setSelectedRecipe(data);
      }

      // Reset to view mode and show success message
      setMode("view");
      setSnackbarMessage(
        `Recipe ${mode === "create" ? "created" : "updated"} successfully`
      );
      setSnackbarOpen(true);
    } catch (err) {
      console.error(`${mode} failed:`, err);
      setSnackbarMessage(`Failed to ${mode} recipe`);
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Left Side - Recipe List */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h5">My Recipes</Typography>

              {mode !== "view" && selectedRecipe && (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                      setSelectedRecipe(null);
                      handleCreateNew();
                    }}
                    sx={{ backgroundColor: "#004346", mb: 2 }}
                  >
                    New Recipe
                  </Button>
                </Box>
              )}
            </Box>

            {recipes.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                You haven't uploaded any recipes yet.
              </Typography>
            ) : (
              <Box sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                {recipes.map((recipe) => (
                  <Card
                    key={recipe._id}
                    sx={{
                      mb: 2,
                      cursor: "pointer",
                      backgroundColor:
                        selectedRecipe?._id === recipe._id
                          ? "#f5f5f5"
                          : "inherit",
                    }}
                    onClick={() => handleEdit(recipe)}
                  >
                    <CardContent>
                      <Typography variant="h6">{recipe.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {recipe.category}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mt: 1,
                        }}
                      >
                        {recipe.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(recipe);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Delete />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(recipe._id);
                        }}
                        color="error"
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Side - Edit/Create Area */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={3}
            sx={{ p: 3, height: "100%", minHeight: "500px" }}
          >
            {mode === "view" ? (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {recipes.length === 0
                    ? "Create your first recipe!"
                    : "Select a recipe to edit or create a new one"}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleCreateNew}
                  sx={{ backgroundColor: "#004346" }}
                >
                  Create New Recipe
                </Button>
              </Box>
            ) : (
              <>
                <Typography variant="h5" sx={{ mb: 3 }}>
                  {mode === "create" ? "Create New Recipe" : "Edit Recipe"}
                </Typography>

                <TextField
                  fullWidth
                  label="Recipe Title"
                  name="title"
                  value={recipeForm.title}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={recipeForm.category}
                    onChange={handleInputChange}
                    label="Category"
                  >
                    <MenuItem value="breakfast">Breakfast</MenuItem>
                    <MenuItem value="lunch">Lunch</MenuItem>
                    <MenuItem value="dinner">Dinner</MenuItem>
                    <MenuItem value="dessert">Dessert</MenuItem>
                    <MenuItem value="snack">Snack</MenuItem>
                  </Select>
                </FormControl>

                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Ingredients
                </Typography>
                {recipeForm.ingredients.map((ingredient, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "center", mb: 1 }}
                  >
                    <TextField
                      fullWidth
                      value={ingredient}
                      onChange={(e) =>
                        handleIngredientChange(index, e.target.value)
                      }
                      sx={{ mr: 1 }}
                    />
                    {recipeForm.ingredients.length > 1 && (
                      <IconButton onClick={() => removeIngredientField(index)}>
                        <Close />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  onClick={addIngredientField}
                  startIcon={<Add />}
                  sx={{ mb: 3, color: "#004346" }}
                >
                  Add Ingredient
                </Button>

                <TextField
                  fullWidth
                  label="Instructions"
                  name="instructions"
                  multiline
                  rows={6}
                  value={recipeForm.instructions}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Tags (comma separated)"
                  name="tags"
                  value={recipeForm.tags}
                  onChange={handleInputChange}
                  sx={{ mb: 3 }}
                />

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setMode("view")}
                    sx={{ color: "#004346" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ backgroundColor: "#004346" }}
                  >
                    {mode === "create" ? "Create Recipe" : "Save Changes"}
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default MyRecipes;
