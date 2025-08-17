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
  IconButton,
  Container,
  CssBaseline
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

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
      const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query + " recipe")}&type=video&maxResults=12&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`;
      
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
      
      setVideos(res.data.items);
      setDebugInfo({
        status: res.status,
        config: res.config,
        dataCount: res.data.items.length
      });

    } catch (error) {
      let errorMessage = 'Failed to search videos';
      if (error.response) {
        errorMessage += ` (Status: ${error.response.status})`;
        setDebugInfo({
          status: error.response.status,
          data: error.response.data,
          config: error.config,
          headers: error.response.headers
        });
      } else if (error.request) {
        errorMessage += " (No response from server)";
      } else {
        errorMessage += ` (${error.message})`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #ffebee, #ffffff)',
        py: 6
      }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            animation: 'fadeIn 1s ease-in'
          }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 'bold',
                color: '#d32f2f',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              Recipe Explorer
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: '#5f5f5f',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              Discover delicious recipes from YouTube's best creators
            </Typography>
          </Box>

          {/* Search Section */}
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: 6,
              borderRadius: '16px',
              backgroundColor: 'white',
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2
            }}>
              <TextField
                fullWidth
                label="Search recipes..."
                variant="outlined"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '& fieldset': {
                      borderColor: '#d32f2f',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d32f2f',
                    },
                  },
                }}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#d32f2f', mr: 1 }} />
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  backgroundColor: '#d32f2f',
                  '&:hover': {
                    backgroundColor: '#b71c1c',
                  },
                  minWidth: '120px'
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
              </Button>
            </Box>
          </Paper>

          {/* Error Display */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '12px',
                maxWidth: '700px',
                mx: 'auto'
              }}
              action={
                <Button 
                  size="small" 
                  onClick={() => setShowDebug(!showDebug)}
                  sx={{ color: 'white' }}
                >
                  {showDebug ? 'Hide' : 'Details'}
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Debug Information */}
          <Collapse in={showDebug}>
            <Paper sx={{ 
              p: 3, 
              mb: 4, 
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              maxWidth: '700px',
              mx: 'auto'
            }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" sx={{ color: '#d32f2f' }}>Debug Information</Typography>
                <IconButton size="small" onClick={() => setShowDebug(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <pre style={{ 
                overflowX: 'auto', 
                fontSize: '0.8rem',
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '8px'
              }}>
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </Paper>
          </Collapse>

          {/* Results Section */}
          {videos.length > 0 && (
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#d32f2f',
                  fontWeight: 'bold',
                  mb: 3
                }}
              >
                Found {videos.length} Recipe Videos
              </Typography>
            </Box>
          )}

          <Grid container spacing={4}>
            {videos.map(video => (
              <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)'
                  }
                }}>
                  <CardMedia
                    component="iframe"
                    height="200"
                    src={`https://www.youtube.com/embed/${video.id.videoId}?autoplay=0`}
                    title={video.snippet.title}
                    allowFullScreen
                    sx={{ border: 'none' }}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1,
                    backgroundColor: 'white'
                  }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#333',
                        mb: 1
                      }}
                    >
                      {video.snippet.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#d32f2f',
                        fontWeight: '500'
                      }}
                    >
                      {video.snippet.channelTitle}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {videos.length === 0 && !loading && (
            <Box sx={{ 
              textAlign: 'center', 
              mt: 10,
              opacity: 0.7
            }}>
              <SearchIcon sx={{ fontSize: '60px', color: '#d32f2f', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#5f5f5f' }}>
                Search for recipes to get started
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default YouTubeRecipeSearch;