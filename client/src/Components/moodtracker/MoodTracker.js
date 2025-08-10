import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress, 
  Stack 
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const moodOptions = [
  { name: 'Happy', emoji: '😊', color: '#FFD700' },
  { name: 'Sad', emoji: '😢', color: '#4682B4' },
  { name: 'Stressed', emoji: '😫', color: '#8B0000' },
  { name: 'Energetic', emoji: '⚡', color: '#32CD32' },
  { name: 'Calm', emoji: '🧘', color: '#9370DB' },
];

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');

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
      console.error('Error logging mood:', error?.response?.data || error.message);
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
      alert(error.response?.data?.message || "Recipe generation failed. Try again later.");
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
      console.error('Error liking recipe:', error?.response?.data || error.message);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3
      }}>
        <Typography variant="h4" gutterBottom>How are you feeling today?</Typography>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => navigate('/moodrecipehistory')}
          sx={{ 
            minWidth: 180,
            height: 48,
            alignSelf: 'flex-start'
          }}
        >
          View Recipe History
        </Button>
      </Box>

      <Stack direction="row" spacing={2} sx={{ marginBottom: 4, flexWrap: 'wrap' }}>
        {moodOptions.map((mood) => (
          <Box key={mood.name} sx={{ flex: '1 1 180px', minWidth: 180 }}>
            <Button
              fullWidth
              variant={selectedMood?.name === mood.name ? 'contained' : 'outlined'}
              sx={{
                height: 100,
                backgroundColor: selectedMood?.name === mood.name ? mood.color : 'transparent',
                color: selectedMood?.name === mood.name ? 'white' : mood.color,
                borderColor: mood.color,
                '&:hover': {
                  backgroundColor: `${mood.color}20`,
                  borderColor: mood.color,
                },
              }}
              onClick={() => handleMoodSelect(mood)}
            >
              <Box>
                <Typography variant="h3">{mood.emoji}</Typography>
                <Typography variant="body1">{mood.name}</Typography>
              </Box>
            </Button>
          </Box>
        ))}
      </Stack>

      {selectedMood && (
        <>
          <Typography variant="h5" gutterBottom>
            Recipes for your {selectedMood.name.toLowerCase()} mood:
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
            </Box>
          ) : (
            <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
              {recipes.map((recipe) => (
                <Box key={recipe._id} sx={{ flex: '1 1 300px', minWidth: 300, marginBottom: 3 }}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {recipe.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Ingredients:</strong>
                      </Typography>
                      <ul>
                        {(recipe.ingredients || []).map((ingredient, index) => (
                          <li key={index}>
                            <Typography variant="body2">{ingredient}</Typography>
                          </li>
                        ))}
                      </ul>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Instructions:</strong>
                      </Typography>
                      <Typography variant="body2" component="p" sx={{ whiteSpace: 'pre-line' }}>
                        {recipe.instructions}
                      </Typography>
                    </CardContent>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
                      <Button
                        variant={recipe.isLiked ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => handleLike(recipe._id)}
                        disabled={recipe.isLiked}
                        sx={{
                          backgroundColor: recipe.isLiked ? '#4CAF50' : 'inherit',
                          '&:hover': {
                            backgroundColor: recipe.isLiked ? '#388E3C' : 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        {recipe.isLiked ? 'Liked' : 'Like'}
                      </Button>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default MoodTracker;