import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box } from "@mui/material";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./Components/NavBar/Navbar";
import Home from "./Components/Home/Home";
import Profile from "./Components/Profile/Profile.jsx";
import Login from "./Pages/login/Login.js";
import Register from "./Pages/register/Register.jsx";
import MealPlan from "./Pages/MealPlan/MealPlanner.jsx";
import CommunityRecipes from "./Components/community/CommunityRecipes";
import MyRecipes from "./Components/community/MyRecipes";
import RecipeUploadsHeatmap from "./Components/Heatmap/RecipeUploadsHeatmap";
import Footer from "./Components/Footer/Footer";
import Chatbot from "./Components/Chatbot/Chatbot.jsx";
import MoodTracker from "./Components/moodtracker/MoodTracker";
import MoodRecipeHistory from "./Components/moodtracker/MoodRecipeHistory";
import MoodGraph from "./Components/moodtracker/MoodGraph.jsx";
import YouTubeRecipeSearch from "./Components/moodtracker/YouTubeRecipeSearch.jsx";

import "./App.css";

// Layout component
const Layout = ({ children }) => {
  const { user } = useAuth();

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
            "@media (max-width: 768px)": { marginLeft: 0 },
          }}
        >
          {children}
        </Box>
      </Box>

      {user && (
        <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1500 }}>
          <Chatbot />
        </Box>
      )}

      <Footer title="NutriPlanner" />
    </Box>
  );
};

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Public Route
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return !user ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
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
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Layout>
                  <Login />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Layout>
                  <Register />
                </Layout>
              </PublicRoute>
            }
          />
          <Route
            path="/mealplanner"
            element={
              <ProtectedRoute>
                <Layout>
                  <MealPlan />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/community"
            element={
              <ProtectedRoute>
                <Layout>
                  <CommunityRecipes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/myrecipes"
            element={
              <ProtectedRoute>
                <Layout>
                  <MyRecipes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moodtracker"
            element={
              <ProtectedRoute>
                <Layout>
                  <MoodTracker />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/myrecipesheatmap"
            element={
              <ProtectedRoute>
                <Layout>
                  <RecipeUploadsHeatmap />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moodrecipehistory"
            element={
              <ProtectedRoute>
                <Layout>
                  <MoodRecipeHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/moodgraph"
            element={
              <ProtectedRoute>
                <Layout>
                  <MoodGraph />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/searchrecipes"
            element={
              <ProtectedRoute>
                <Layout>
                  <YouTubeRecipeSearch />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
