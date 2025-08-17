import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import YouTubeRecipeSearch from './YouTubeRecipeSearch';

const YouTubeAuthWrapper = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <YouTubeRecipeSearch />
    </GoogleOAuthProvider>
  );
};

export default YouTubeAuthWrapper;