import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Box,
  Chip,
  Button,
} from "@mui/material";

const ViewRecipeDialog = ({ open, onClose, recipe }) => {
  if (!recipe) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{recipe.title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          by {recipe.authorUsername} | Category: {recipe.category}
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Ingredients:
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          {recipe.ingredients.map((ingredient, index) => (
            <Box component="li" key={index}>
              <Typography>{ingredient}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="h6" sx={{ mb: 1 }}>
          Instructions:
        </Typography>
        <Typography paragraph sx={{ whiteSpace: "pre-line" }}>
          {recipe.instructions}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mt: 2,
          }}
        >
          {recipe.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              variant="outlined"
              sx={{ backgroundColor: "#33c9dc", color: "#ffffff" }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: "#004346" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewRecipeDialog;
