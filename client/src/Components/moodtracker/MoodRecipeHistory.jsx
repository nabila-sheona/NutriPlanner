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
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
  Favorite as LikedIcon
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
            icon={<LikedIcon />}
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
        <Grid container spacing={4}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Avatar sx={{ 
                      bgcolor: moodColors[recipe.mood], 
                      width: 40, 
                      height: 40 
                    }}>
                      {moodIcons[recipe.mood]}
                    </Avatar>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ fontWeight: 'bold' }}
                    >
                      {recipe.title}
                      {recipe.isLiked && (
                        <LikedIcon 
                          color="error" 
                          fontSize="small" 
                          sx={{ ml: 1, verticalAlign: 'middle' }} 
                        />
                      )}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    Created: {formatDate(recipe.createdAt)}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    Ingredients:
                  </Typography>
                  <ul style={{ paddingLeft: 20, marginTop: 0 }}>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>
                        <Typography variant="body2">{ingredient}</Typography>
                      </li>
                    ))}
                  </ul>
                  
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ fontWeight: 'bold', mt: 2 }}
                  >
                    Instructions:
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {recipe.instructions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MoodRecipeHistory;