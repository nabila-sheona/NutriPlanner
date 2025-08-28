import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import Chatbot from "./Components/Chatbot/Chatbot.jsx";
import MoodTracker from "./Components/moodtracker/MoodTracker";
import MoodRecipeHistory from "./Components/moodtracker/MoodRecipeHistory";
import MoodGraph from "./Components/moodtracker/MoodGraph.jsx";
import YouTubeRecipeSearch from "./Components/moodtracker/YouTubeRecipeSearch.jsx";

// Import Auth Context
import { AuthContext, AuthProvider } from "./context/AuthContext";
import "./App.css";

// Layout component with conditional chatbot rendering
const Layout = ({ children }) => {
  const { user } = useContext(AuthContext);

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

      {/* Only show chatbot if user is logged in */}
      {user && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1500,
          }}
        >
          <Chatbot />
        </Box>
      )}

      <Footer title="NutriPlanner" />
    </Box>
  );
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route component (redirect to home if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return !user ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
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
      </Router>
    </AuthProvider>
  );
};

export default App;
