import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";

const AddRecipeDialog = ({ open, onClose, onSubmit, username }) => {
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    category: "",
    ingredients: [""],
    instructions: "",
    tags: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({ ...newRecipe, [name]: value });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients[index] = value;
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const addIngredientField = () => {
    setNewRecipe({ ...newRecipe, ingredients: [...newRecipe.ingredients, ""] });
  };

  const removeIngredientField = (index) => {
    const newIngredients = [...newRecipe.ingredients];
    newIngredients.splice(index, 1);
    setNewRecipe({ ...newRecipe, ingredients: newIngredients });
  };

  const handleSubmit = () => {
    const tagsArray = newRecipe.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);

    const recipeData = {
      title: newRecipe.title,
      category: newRecipe.category,
      ingredients: newRecipe.ingredients.filter((ing) => ing.trim() !== ""),
      instructions: newRecipe.instructions,
      tags: tagsArray,
      authorUsername: username,
    };

    onSubmit(recipeData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add New Recipe</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="title"
          label="Recipe Title"
          fullWidth
          value={newRecipe.title}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newRecipe.category}
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
        {newRecipe.ingredients.map((ingredient, index) => (
          <Box
            key={index}
            sx={{ display: "flex", alignItems: "center", mb: 1 }}
          >
            <TextField
              fullWidth
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
              sx={{ mr: 1 }}
            />
            {newRecipe.ingredients.length > 1 && (
              <IconButton onClick={() => removeIngredientField(index)}>
                <Close />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          onClick={addIngredientField}
          startIcon={<Add />}
          sx={{ mb: 2, color: "#004346" }}
        >
          Add Ingredient
        </Button>
        <TextField
          margin="dense"
          name="instructions"
          label="Instructions"
          fullWidth
          multiline
          rows={4}
          value={newRecipe.instructions}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          name="tags"
          label="Tags (comma separated)"
          fullWidth
          value={newRecipe.tags}
          onChange={handleInputChange}
          sx={{ mb: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#004346" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#004346" }}
        >
          Upload Recipe
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddRecipeDialog;
