import React, { useEffect } from "react";
import { Box, Divider, Typography } from "@mui/material";
import HomeLandingContainer from "./HomeLandingContainer";
import CardBelowHome from "./CardBelowHome";
import DietAndMoodFAQ from "./DietAndMoodFAQ";

const Home = (props) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        color: "#004346",
        minHeight: "100vh",
        px: 3,
        py: 2,
      }}
    >
      {/* Home Landing Section */}

      <HomeLandingContainer description={props.description} />
      <Divider sx={{ my: 3 }} />

      <Divider sx={{ my: 3 }} />
      <CardBelowHome />
      <Divider sx={{ my: 3 }} />

      <Divider sx={{ my: 3 }} />

      <DietAndMoodFAQ />
    </Box>
  );
};

export default Home;
