import React from "react";
import {
  CardContent,
  Chip,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const MealTypeChip = styled(Chip)(({ theme, mealtype }) => ({
  backgroundColor:
    mealtype === "Breakfast"
      ? theme.palette.warning.light
      : mealtype === "Lunch"
        ? theme.palette.success.light
        : theme.palette.info.light,
  color:
    mealtype === "Breakfast"
      ? theme.palette.warning.dark
      : mealtype === "Lunch"
        ? theme.palette.success.dark
        : theme.palette.info.dark,
  marginRight: theme.spacing(0.5),
  fontWeight: 500,
}));

const MealPlanRecipeCard = ({ recipe }) => {
  const hasType = (type) => recipe.mealType.includes(type);

  return (
    <CardContent>
      {" "}
      <Box>
        {hasType("Breakfast") && (
          <MealTypeChip label="Breakfast" mealtype="Breakfast" size="small" />
        )}
        {hasType("Lunch") && (
          <MealTypeChip label="Lunch" mealtype="Lunch" size="small" />
        )}
        {hasType("Dinner") && (
          <MealTypeChip label="Dinner" mealtype="Dinner" size="small" />
        )}
      </Box>
      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
        Ingredients:
      </Typography>
      <List dense>
        {recipe.ingredients.map((ing, i) => (
          <ListItem key={i} sx={{ py: 0, pl: 2 }}>
            <ListItemText
              primary={
                <Typography variant="body2" component="span">
                  • {ing}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      <Typography
        variant="subtitle1"
        fontWeight="600"
        gutterBottom
        sx={{ mt: 2 }}
      >
        Instructions:
      </Typography>
      <Typography variant="body2" paragraph>
        {recipe.instructions}
      </Typography>
    </CardContent>
  );
};

export default MealPlanRecipeCard;
