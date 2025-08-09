// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Grid,
//   Chip,
//   IconButton,
//   Collapse,
//   Divider,
// } from "@mui/material";
// import {
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   FitnessCenter as FitnessCenterIcon,
//   CalendarToday as CalendarTodayIcon,
//   RestaurantMenu as RestaurantMenuIcon,
// } from "@mui/icons-material";

// const dayNames = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// const MealPlanCard = ({ plan, index }) => {
//   const [expanded, setExpanded] = useState(false);
//   const toggleExpansion = () => setExpanded(!expanded);

//   const extractMealsPerDay = (text) => {
//     const mealMap = {};
//     let currentDay = null;
//     const lines = text
//       .split(/\*\*|\n/)
//       .map((l) => l.trim())
//       .filter((l) => l);

//     for (let line of lines) {
//       for (let day of dayNames) {
//         if (line.toLowerCase().startsWith(day.toLowerCase())) {
//           currentDay = day;
//           mealMap[day] = {};
//           break;
//         }
//       }
//       if (!currentDay) continue;
//       const mealMatch = line.match(/(?:Breakfast|Lunch|Dinner):\**\s*(.+)/i);
//       if (mealMatch) {
//         const mealType = line.match(/Breakfast|Lunch|Dinner/i)[0];
//         mealMap[currentDay][mealType] = mealMatch[1];
//       }
//     }

//     return mealMap;
//   };

//   return (
//     <Grid item xs={12} key={index}>
//       <Card
//         sx={{
//           background: "#fff",
//           borderRadius: 4,
//           boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
//           transition: "all 0.3s ease-in-out",
//           cursor: "pointer",
//           "&:hover": {
//             transform: "translateY(-4px)",
//             boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
//           },
//         }}
//         onClick={toggleExpansion}
//       >
//         <CardContent sx={{ color: "#004346", position: "relative" }}>
//           {/* Header Section */}
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-start",
//               mb: 2,
//             }}
//           >
//             <Box sx={{ flex: 1 }}>
//               <Box
//                 sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
//               >
//                 <FitnessCenterIcon
//                   sx={{ fontSize: "1.5rem", color: "#004346" }}
//                 />
//                 <Typography variant="h6" fontWeight="bold">
//                   Health Goal: {plan.goal}
//                 </Typography>
//               </Box>

//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
//                 {plan.preferences.map((pref, i) => (
//                   <Chip
//                     key={i}
//                     label={pref}
//                     size="small"
//                     sx={{
//                       backgroundColor: "#e6f2f1",
//                       color: "#004346",
//                       fontWeight: "medium",
//                       "& .MuiChip-label": { fontSize: "0.75rem" },
//                     }}
//                   />
//                 ))}
//               </Box>
//             </Box>

//             <IconButton sx={{ color: "#004346", ml: 2 }}>
//               {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//             </IconButton>
//           </Box>

//           {/* Quick Preview */}
//           {!expanded && (
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 opacity: 0.8,
//               }}
//             >
//               <CalendarTodayIcon
//                 sx={{ fontSize: "1.2rem", color: "#004346" }}
//               />
//               <Typography variant="body2">
//                 Click to view your 7-day meal plan
//               </Typography>
//             </Box>
//           )}

//           {/* Expanded Meal Plan */}
//           <Collapse in={expanded}>
//             <Divider sx={{ my: 2, backgroundColor: "#e0e0e0" }} />
//             <Box
//               sx={{
//                 backgroundColor: "#f9f9f9",
//                 borderRadius: 3,
//                 p: 3,
//                 mt: 2,
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 sx={{ mb: 3, textAlign: "center", color: "#004346" }}
//               >
//                 📅 Weekly Meal Plan
//               </Typography>

//               <Grid container spacing={2}>
//                 {Object.entries(extractMealsPerDay(plan.planText)).map(
//                   ([day, meals]) => (
//                     <Grid item xs={12} md={6} lg={4} key={day}>
//                       <Card
//                         sx={{
//                           backgroundColor: "#ffffff",
//                           borderRadius: 3,
//                           p: 2,
//                           height: "100%",
//                           boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
//                           border: "1px solid #dee2e6",
//                         }}
//                       >
//                         <Typography
//                           variant="h6"
//                           sx={{
//                             color: "#004346",
//                             fontWeight: "bold",
//                             mb: 2,
//                             pb: 1,
//                             borderBottom: "2px solid #004346",
//                             textAlign: "center",
//                           }}
//                         >
//                           {day}
//                         </Typography>

//                         <Box>
//                           {["Breakfast", "Lunch", "Dinner"].map((mealType) =>
//                             meals[mealType] ? (
//                               <Box
//                                 key={mealType}
//                                 sx={{
//                                   mb: 2,
//                                   p: 2,
//                                   backgroundColor: "#f1f3f5",
//                                   borderRadius: 2,
//                                   border: "1px solid #dee2e6",
//                                 }}
//                               >
//                                 <Typography
//                                   variant="subtitle2"
//                                   sx={{
//                                     color: "#004346",
//                                     fontWeight: "bold",
//                                     mb: 1,
//                                     display: "flex",
//                                     alignItems: "center",
//                                     gap: 0.5,
//                                   }}
//                                 >
//                                   {mealType === "Breakfast" && "🍳"}
//                                   {mealType === "Lunch" && "🥗"}
//                                   {mealType === "Dinner" && "🍽️"}
//                                   {mealType}
//                                 </Typography>
//                                 <Typography
//                                   variant="body2"
//                                   sx={{
//                                     color: "#333",
//                                     lineHeight: 1.5,
//                                     fontSize: "0.9rem",
//                                   }}
//                                 >
//                                   {meals[mealType]}
//                                 </Typography>
//                               </Box>
//                             ) : null
//                           )}
//                         </Box>
//                       </Card>
//                     </Grid>
//                   )
//                 )}
//               </Grid>
//             </Box>
//           </Collapse>
//         </CardContent>
//       </Card>
//     </Grid>
//   );
// };

// export default MealPlanCard;

import React, { useState } from "react";
import {
  Dumbbell,
  CalendarDays,
  Utensils,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

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
