import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/NavBar/Navbar";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile.jsx";
import Login from "./Pages/login/Login.jsx";
import Register from "./Pages/register/Register.jsx";
import MealPlan from "./Pages/MealPlan/MealPlanner.jsx";
import CommunityRecipes from "./Components/community/CommunityRecipes";
import MyRecipes from "./Components/community/MyRecipes";
import RecipeUploadsHeatmap from "./Components/Heatmap/RecipeUploadsHeatmap";
import Footer from "./Components/Footer/Footer";
import { Box } from "@mui/material";

import MoodTracker from "./Components/moodtracker/MoodTracker";
import MoodRecipeHistory from "./Components/moodtracker/MoodRecipeHistory";
import MoodGraph from './Components/moodtracker/MoodGraph.jsx';


import "./App.css";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar title="NutriPlanner" />

      <Box sx={{ display: "flex", flex: 1 }}>
        <Box
          component="main"
          sx={{
            flex: 1,
            padding: "1rem",
            transition: "margin-left 0.3s",
            "@media (max-width: 768px)": {
              marginLeft: "0",
            },
          }}
        >
          {children}
        </Box>
      </Box>

      <Footer title="NutriPlanner" />
    </Box>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route
          path="/mealplanner"
          element={
            <Layout>
              <MealPlan />
            </Layout>
          }
        />
        <Route
          path="/community"
          element={
            <Layout>
              <CommunityRecipes />
            </Layout>
          }
        />
        <Route
          path="/myrecipes"
          element={
            <Layout>
              <MyRecipes />
            </Layout>
          }
        />
        <Route
          path="/moodtracker"
          element={
            <Layout>
              <MoodTracker />
            </Layout>
          }
        />
        <Route
          path="/myrecipesheatmap"
          element={
            <Layout>
              <RecipeUploadsHeatmap />
            </Layout>
          }
        />
        <Route path="/moodrecipehistory" element={<MoodRecipeHistory />} />
        <Route path="/moodgraph" element={<MoodGraph />} />

      </Routes>
    </Router>
  );
};

export default App;
