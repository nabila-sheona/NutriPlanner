import React, { useState } from "react";
import {
  CardContent,
  Chip,
  Typography,
  IconButton,
  Collapse,
  Paper,
  Divider,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  FitnessCenter as DumbbellIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const MealPlanCard = ({ plan, index }) => {
  const [expandedDays, setExpandedDays] = useState({});

  const toggleDayExpansion = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
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

  const mealsByDay = extractMealsPerDay(plan.planText);

  return (
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <DumbbellIcon sx={{ mr: 1 }} />
        <Typography variant="h6" component="h2" fontWeight="bold">
          Health Goal: {plan.goal}
        </Typography>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
        {plan.preferences.map((pref, i) => (
          <Chip
            key={i}
            label={pref}
            size="small"
            variant="outlined"
            color="primary"
          />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" textAlign="center" gutterBottom sx={{ mb: 2 }}>
        📅 Weekly Meal Plan
      </Typography>

      <List>
        {dayNames.map((day) => (
          <Paper key={day} elevation={2} sx={{ mb: 2 }}>
            <ListItem
              button
              onClick={() => toggleDayExpansion(day)}
              sx={{
                bgcolor: expandedDays[day]
                  ? "action.selected"
                  : "background.paper",
                color: "#004346",
              }}
            >
              <ListItemText
                primary={
                  <Typography fontWeight="bold" color="#004346">
                    {day}
                  </Typography>
                }
              />
              <IconButton edge="end" size="small">
                {expandedDays[day] ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </ListItem>

            <Collapse in={expandedDays[day]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding dense>
                {["Breakfast", "Lunch", "Dinner"].map((mealType) =>
                  mealsByDay[day]?.[mealType] ? (
                    <ListItem key={mealType} sx={{ pl: 4, py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {mealType === "Breakfast" && "🍳"}
                        {mealType === "Lunch" && "🥗"}
                        {mealType === "Dinner" && "🍽️"}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" fontWeight="bold">
                            {mealType}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2">
                            {mealsByDay[day][mealType]}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ) : null
                )}
              </List>
            </Collapse>
          </Paper>
        ))}
      </List>
    </CardContent>
  );
};

export default MealPlanCard;
