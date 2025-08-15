import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import happyImage from "../../assets/pinterest-happy.jpg";
import sadImage from "../../assets/pinterest-sad.jpg";
import stressedImage from "../../assets/pinterest-stressed.jpg";
import energeticImage from "../../assets/pinterest-energetic.jpg";
import calmImage from "../../assets/pinterest-calm.jpg";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";

const moodOptions = [
  { name: "Happy", image: happyImage, color: "#FFD700" },
  { name: "Sad", image: sadImage, color: "#4682B4" },
  { name: "Stressed", image: stressedImage, color: "#8B0000" },
  { name: "Energetic", image: energeticImage, color: "#32CD32" },
  { name: "Calm", image: calmImage, color: "#9370DB" },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    fetchRecipes(mood.name);
    logMood(mood.name);
  };

  const logMood = async (mood) => {
    try {
      await axios.post(
        `${API_BASE}/api/mood/moods`,
        { mood },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
    } catch (error) {
      console.error(
        "Error logging mood:",
        error?.response?.data || error.message
      );
    }
  };

  const fetchRecipes = async (mood) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE}/api/mood/recipes/generate`,
        { mood },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setRecipes(response.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Recipe generation failed. Try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (recipeId) => {
    try {
      await axios.post(
        `${API_BASE}/api/recipes/like/${recipeId}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setRecipes((prev) =>
        prev.map((r) => (r._id === recipeId ? { ...r, isLiked: true } : r))
      );
    } catch (error) {
      console.error(
        "Error liking recipe:",
        error?.response?.data || error.message
      );
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          How are you feeling today?
        </Typography>

        {/* Buttons wrapper to fix gap */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={() => navigate("/moodrecipehistory")}
            sx={{
              minWidth: 180,
              height: 48,
              alignSelf: "flex-start",
              backgroundColor: "#004346",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#00332e",
              },
            }}
          >
            View Recipe History
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/moodgraph")}
            sx={{
              minWidth: 180,
              height: 48,
              alignSelf: "flex-start",
              backgroundColor: "#004346",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#00332e",
              },
            }}
          >
            View Mood Graph
          </Button>
        </Box>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        sx={{ marginBottom: 4, flexWrap: "wrap" }}
      >
        {moodOptions.map((mood) => (
          <Box key={mood.name} sx={{ flex: "1 1 180px", minWidth: 180 }}>
            <Button
              fullWidth
              variant={
                selectedMood?.name === mood.name ? "contained" : "outlined"
              }
              sx={{
                height: 100,
                backgroundColor:
                  selectedMood?.name === mood.name ? mood.color : "transparent",
                color: selectedMood?.name === mood.name ? "white" : mood.color,
                borderColor: mood.color,
                "&:hover": {
                  backgroundColor: `${mood.color}30`,
                  borderColor: mood.color,
                },
                display: "flex",
                flexDirection: "column",
                padding: 1,
                textTransform: "none",
                fontWeight: "600",
              }}
              onClick={() => handleMoodSelect(mood)}
            >
              <Box
                component="img"
                src={mood.image}
                alt={mood.name}
                sx={{
                  width: 48,
                  height: 48,
                  objectFit: "contain",
                  marginBottom: 1,
                  borderRadius: "50%",
                  border: `2px solid ${mood.color}`,
                  padding: 0.5,
                  backgroundColor: "#fff",
                }}
              />
              <Typography variant="body1">{mood.name}</Typography>
            </Button>
          </Box>
        ))}
      </Stack>

      {selectedMood && (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
            Recipes for your {selectedMood.name.toLowerCase()} mood:
          </Typography>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="200px"
            >
              <CircularProgress />
            </Box>
          ) : recipes.length === 0 ? (
            <Typography variant="body1" color="text.secondary">
              No recipes found for this mood.
            </Typography>
          ) : (
            <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
              {recipes.map((recipe) => (
                <Card
                  key={recipe._id}
                  sx={{
                    width: 320,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 3,
                    borderRadius: 3,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 7,
                    },
                    mb: 3,
                    padding: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: "700", color: "#004346" }}
                  >
                    {recipe.title}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: "600" }}
                  >
                    Ingredients
                  </Typography>
                  <List dense sx={{ mb: 2, padding: 0 }}>
                    {(recipe.ingredients || []).map((ingredient, index) => (
                      <ListItem
                        key={index}
                        sx={{ py: 0.5, px: 0, alignItems: "flex-start" }}
                        disableGutters
                      >
                        <ListItemIcon
                          sx={{ minWidth: 28, color: "#e53935", mt: "4px" }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={ingredient}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 1 }} />

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: "600" }}
                  >
                    Instructions
                  </Typography>
                  <Typography
                    variant="body2"
                    component="p"
                    sx={{ whiteSpace: "pre-line", lineHeight: 1.5 }}
                  >
                    {recipe.instructions}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 2,
                    }}
                  >
                    <IconButton
                      color="error"
                      onClick={() => handleLike(recipe._id)}
                      disabled={recipe.isLiked}
                      aria-label={recipe.isLiked ? "Liked" : "Like"}
                      size="large"
                      sx={{
                        "&:disabled": {
                          color: "#b71c1c",
                        },
                      }}
                    >
                      {recipe.isLiked ? (
                        <FavoriteIcon fontSize="large" />
                      ) : (
                        <FavoriteBorderIcon fontSize="large" />
                      )}
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default MoodTracker;
