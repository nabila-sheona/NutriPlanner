import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
  IconButton,
  Collapse,
  Grid,
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
  CalendarToday as CalendarDaysIcon,
  Restaurant as UtensilsIcon,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

//import React, { useState } from "react";
//import {
//Dumbbell,
//  CalendarDays,
//  Utensils,
//  ChevronDown,
//  ChevronUp,
//} from "lucide-react";
// eslint-disable-next-line no-lone-blocks
{
  /*
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
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => setExpanded(!expanded);

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

  return (
    <div key={index} className="w-full">
      <div
        className="mt-5 bg-white rounded-2xl border-b border-r border-[#004346] shadow-lg p-6 mb-6 cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
        onClick={toggleExpansion}
      >
        <div className="text-[#004346] relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Dumbbell className="w-5 h-5" />
                <h2 className="text-lg font-bold">Health Goal: {plan.goal}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {plan.preferences.map((pref, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-white/20 text-[#004346] rounded-full"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>
            <button className="text-[#004346] ml-2">
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
          </div>

          {!expanded && (
            <div className="flex items-center gap-2 opacity-90">
              <CalendarDays className="w-4 h-4" />
              <p className="text-sm">Click to view your 7-day meal plan</p>
            </div>
          )}

          {expanded && (
            <div className="mt-6 bg-white/10 rounded-xl p-6">
              <h3 className="text-center text-[#004346] text-lg font-semibold mb-6">
                📅 Weekly Meal Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(extractMealsPerDay(plan.planText)).map(
                  ([day, meals]) => (
                    <div
                      key={day}
                      className="bg-white rounded-xl shadow-md p-4 h-full"
                    >
                      <h4 className="text-center text-[#004346] text-lg font-bold border-b-2 border-[#004346] pb-1 mb-4">
                        {day}
                      </h4>
                      <div className="space-y-3">
                        {["Breakfast", "Lunch", "Dinner"].map((mealType) =>
                          meals[mealType] ? (
                            <div
                              key={mealType}
                              className="bg-gray-100 border border-gray-200 rounded-lg p-3"
                            >
                              <p className="text-[#004346] font-semibold flex items-center gap-1 mb-1 text-sm">
                                {mealType === "Breakfast" && "🍳"}
                                {mealType === "Lunch" && "🥗"}
                                {mealType === "Dinner" && "🍽️"}
                                {mealType}
                              </p>
                              <p className="text-[#004346] text-sm leading-relaxed">
                                {meals[mealType]}
                              </p>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealPlanCard;
*/
}

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
