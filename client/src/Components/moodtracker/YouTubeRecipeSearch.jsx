import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  CircularProgress,
  Paper,
  Chip,
  Container
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { grey, red } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';

const YouTubeRecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const categories = [
    'Desserts', 'Quick Meals', 'Vegetarian', 
    'Keto', 'Italian', 'Asian', 'Baking',
    'Healthy', 'Comfort Food', 'Vegan'
  ];

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
          part: 'snippet',
          q: `${query} recipe`,
          type: 'video',
          maxResults: 12,
          safeSearch: 'none'
        }
      });
      setVideos(res.data.items);
      setSelectedVideo(null); // Reset selected video on new search
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openVideo = (videoId) => {
    setSelectedVideo(videoId);
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => navigate("/moodtracker")}
          sx={{
            backgroundColor: "#004346",
            color: "#fff",
            '&:hover': { backgroundColor: "#00332e" }
          }}
        >
          Back to Mood Tracker
        </Button>
      </Box>

      {/* Search Header */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Paper elevation={0} sx={{
          width: '100%',
          maxWidth: 800,
          p: 2,
          borderRadius: 2,
          bgcolor: grey[50]
        }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  bgcolor: 'white'
                }
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: grey[500], mr: 1 }} />
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              sx={{
                px: 4,
                borderRadius: 1,
                bgcolor: red[600],
                '&:hover': { bgcolor: red[700] }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ mb: 2, color: grey[600] }}>
          Popular Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
          {categories.map(category => (
            <Chip 
              key={category}
              label={category}
              onClick={() => {
                setQuery(category);
                handleSearch();
              }}
              sx={{ 
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': { bgcolor: red[50] }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Video Results */}
      <Grid container spacing={3}>
        {videos.map(video => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={video.id.videoId}>
            <Card sx={{ 
              border: 'none',
              boxShadow: 'none',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardActionArea onClick={() => openVideo(video.id.videoId)}>
                <Box sx={{ 
                  position: 'relative',
                  paddingTop: '56.25%',
                  overflow: 'hidden'
                }}>
                  <Box
                    component="img"
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 64,
                    height: 64,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Box sx={{
                      width: 0,
                      height: 0,
                      borderTop: '12px solid transparent',
                      borderLeft: '24px solid' + red[600],
                      borderBottom: '12px solid transparent',
                      marginLeft: 4
                    }} />
                  </Box>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      fontWeight: 500,
                      mb: 0.5,
                      lineHeight: 1.3,
                      height: '2.6em',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {video.snippet.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ color: grey[600], display: 'block' }}
                  >
                    {video.snippet.channelTitle}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {videos.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 10, color: grey[500] }}>
          <SearchIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h6">Search for recipe videos</Typography>
          <Typography variant="body2">Try "pasta", "dessert", or "quick meals"</Typography>
        </Box>
      )}
    </Container>
  );
};

export default YouTubeRecipeSearch;
