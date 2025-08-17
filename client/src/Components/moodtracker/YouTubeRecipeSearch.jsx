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
  CardMedia,
  CircularProgress,
  Paper,
  Alert,
  Collapse,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const YouTubeRecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo(null);
    
    try {
      // Construct the API URL for debugging
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + " recipe")}&type=video&maxResults=12&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;
      
      console.log("Attempting API call to:", apiUrl); // Debug log
      
      const res = await axios.get(apiUrl, {
        params: {
          key: process.env.REACT_APP_YOUTUBE_API_KEY,
          part: 'snippet',
          q: `${query} recipe`,
          type: 'video',
          maxResults: 12,
          safeSearch: 'none'
        }
      });

      console.log("API Response:", res); // Debug log
      
      setVideos(res.data.items);
      setDebugInfo({
        status: res.status,
        config: res.config,
        dataCount: res.data.items.length
      });

    } catch (error) {
      console.error("Full error object:", error); // Debug log
      
      let errorMessage = 'Failed to search videos';
      if (error.response) {
        // Server responded with a status code outside 2xx
        console.error("Error response data:", error.response.data); // Debug log
        console.error("Error status:", error.response.status); // Debug log
        console.error("Error headers:", error.response.headers); // Debug log
        
        errorMessage += ` (Status: ${error.response.status})`;
        
        setDebugInfo({
          status: error.response.status,
          data: error.response.data,
          config: error.config,
          headers: error.response.headers
        });
      } else if (error.request) {
        // No response received
        console.error("No response received:", error.request); // Debug log
        errorMessage += " (No response from server)";
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message); // Debug log
        errorMessage += ` (${error.message})`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        YouTube Recipe Search
      </Typography>

      {/* Search Interface */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search recipes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Search'}
        </Button>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Button 
            size="small" 
            onClick={() => setShowDebug(!showDebug)}
            sx={{ ml: 2 }}
          >
            {showDebug ? 'Hide' : 'Show'} Debug Info
          </Button>
        </Alert>
      )}

      {/* Debug Information */}
      <Collapse in={showDebug}>
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Debug Information</Typography>
            <IconButton size="small" onClick={() => setShowDebug(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <pre style={{ overflowX: 'auto', fontSize: '0.8rem' }}>
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          <Typography variant="body2" sx={{ mt: 1 }}>
            API Key: {process.env.REACT_APP_YOUTUBE_API_KEY ? '****' + process.env.REACT_APP_YOUTUBE_API_KEY.slice(-4) : 'Not set'}
          </Typography>
        </Paper>
      </Collapse>

      {/* Results Display */}
      <Grid container spacing={3}>
        {videos.map(video => (
          <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
            <Card>
              <CardMedia
                component="iframe"
                height="200"
                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                title={video.snippet.title}
                allowFullScreen
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {video.snippet.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {video.snippet.channelTitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default YouTubeRecipeSearch;