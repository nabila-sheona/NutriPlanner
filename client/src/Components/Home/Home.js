import React from "react";
import { Box, Divider } from "@mui/material";
import HomeLandingContainer from "./HomeLandingContainer";
import CardBelowHome from "./CardBelowHome";
import DietAndMoodFAQ from "./DietAndMoodFAQ";
import { motion } from "framer-motion";

const SectionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true, amount: 0.2 }}
  >
    {children}
  </motion.div>
);

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

      <SectionWrapper>
        <CardBelowHome />
      </SectionWrapper>
      <Divider sx={{ my: 3 }} />

      <SectionWrapper>
        <DietAndMoodFAQ />
      </SectionWrapper>
    </Box>
  );
};

export default Home;
