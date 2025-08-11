import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  CircularProgress,
  Button,
  Chip,
  Divider,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  SentimentVerySatisfied as HappyIcon,
  SentimentVeryDissatisfied as SadIcon,
  SentimentDissatisfied as StressedIcon,
  Bolt as EnergeticIcon,
  SelfImprovement as CalmIcon,
  ArrowBack,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const moodIcons = {
  Happy: <HappyIcon color="success" fontSize="large" />,
  Sad: <SadIcon color="primary" fontSize="large" />,
  Stressed: <StressedIcon color="error" fontSize="large" />,
  Energetic: <EnergeticIcon color="warning" fontSize="large" />,
  Calm: <CalmIcon color="info" fontSize="large" />
};

const moodColors = {
  Happy: '#FFD700',
  Sad: '#4682B4',
  Stressed: '#8B0000',
  Energetic: '#32CD32',
  Calm: '#9370DB'
};

const MoodRecipeHistory = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState('');
  const [showLikedOnly, setShowLikedOnly] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        let url;
        let params = {};
        
        if (showLikedOnly) {
          url = `${API_BASE}/api/recipes/liked`;
        } else {
          url = `${API_BASE}/api/recipes/history`;
          if (selectedMood) {
            params.mood = selectedMood;
          }
        }

        const response = await axios.get(url, {
          params,
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedMood, showLikedOnly, token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      console.error("Error liking recipe:", error?.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={80} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 4, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      <Button 
        variant="contained" 
        startIcon={<ArrowBack />}
        sx={{ mb: 4 }}
        onClick={() => navigate('/moodtracker')}
      >
        Back to Mood Tracker
      </Button>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4
      }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#333',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          {showLikedOnly ? 'Your Liked Recipes' : 'Your Recipe History'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            label="Your Liked"
            icon={<FavoriteIcon />}
            clickable
            color={showLikedOnly ? 'primary' : 'default'}
            onClick={() => setShowLikedOnly(!showLikedOnly)}
            sx={{ 
              px: 2,
              '& .MuiChip-icon': { color: showLikedOnly ? '#fff' : '#f44336' }
            }}
          />

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Mood</InputLabel>
            <Select
              value={selectedMood}
              onChange={(e) => {
                setSelectedMood(e.target.value);
                setShowLikedOnly(false);
              }}
              label="Filter by Mood"
              disabled={showLikedOnly}
            >
              <MenuItem value="">All Moods</MenuItem>
              <MenuItem value="Happy">Happy</MenuItem>
              <MenuItem value="Sad">Sad</MenuItem>
              <MenuItem value="Stressed">Stressed</MenuItem>
              <MenuItem value="Energetic">Energetic</MenuItem>
              <MenuItem value="Calm">Calm</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      {recipes.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            {showLikedOnly 
              ? "You haven't liked any recipes yet!" 
              : "No recipes found. Track your mood to generate some delicious recipes!"}
          </Typography>
        </Paper>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: 'center',
          }}
        >
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
                mb: 0,
                padding: 2,
                backgroundColor: "#f9f5ff",
                flexShrink: 0,
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
              <Box component="ul" sx={{ mb: 2, pl: 2, m: 0 }}>
                {(recipe.ingredients || []).map((ingredient, index) => (
                  <Box
                    component="li"
                    key={index}
                    sx={{ display: "flex", alignItems: "center", py: 0.5 }}
                  >
                    <Box
                      component="span"
                      sx={{
                        color: "#e53935",
                        mr: 1,
                        fontSize: 18,
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography variant="body2">{ingredient}</Typography>
                  </Box>
                ))}
              </Box>

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
        </Box>
      )}
    </Box>
  );
};

export default MoodRecipeHistory;
