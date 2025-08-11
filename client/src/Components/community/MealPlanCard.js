import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  RestaurantMenu as MealIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  LocalFireDepartment as CaloriesIcon,
  FitnessCenter as MacrosIcon,
} from "@mui/icons-material";

const MealPlanCard = ({ open, onClose, recipe }) => {
  if (!recipe) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            {recipe.title}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <MealIcon color="#336666" />
                Meal Type
              </Typography>
              <Chip
                label={recipe.mealType}
                color="#336666"
                variant="outlined"
                size="medium"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <TimeIcon color="#669999" />
                Preparation Time
              </Typography>
              <Chip
                label={recipe.time}
                color="secondary"
                size="medium"
                sx={{ fontSize: "1rem", backgroundColor: "#004346" }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <CaloriesIcon color="#669999" />
                Calories
              </Typography>
              <Chip
                label={recipe.calories}
                size="medium"
                sx={{ fontSize: "1rem" }}
              />
            </Box>

            {recipe.macros && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <MacrosIcon color="primary" />
                  Macros
                </Typography>
                <Typography>{recipe.macros}</Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              {recipe.ingredients?.length > 0 ? (
                <List dense sx={{ maxHeight: 200, overflow: "auto" }}>
                  {recipe.ingredients.map((ingredient, idx) => (
                    <ListItem key={idx} divider>
                      <ListItemText primary={ingredient} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No ingredients listed
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              {recipe.instructions?.length > 0 ? (
                <List dense sx={{ maxHeight: 200, overflow: "auto" }}>
                  {recipe.instructions.map((step, idx) => (
                    <ListItem key={idx} divider>
                      <ListItemText
                        primary={`Step ${idx + 1}`}
                        secondary={step}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No instructions provided
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealPlanCard;
