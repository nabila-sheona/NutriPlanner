import React from "react";
import { Box, Divider } from "@mui/material";
import HomeLandingContainer from "./HomeLandingContainer";
import DietAndMoodFAQ from "./DietAndMoodFAQ";
import FeatureCard from "./FeatureCard";
import ParallaxFood from "./ParallaxFood";
import MoodToMeal from "./MoodToMeal";
import CardBelowHome from "./CardBelowHome";

import mealPlannerImg from "./images/mealplanner.jpg";
import communityImg from "./images/community.jpg";
import recipesImg from "./images/recipes.jpg";

const features = [
  {
    image: mealPlannerImg,
    title: "AI-Powered Meal Planner",
    description:
      "Get customized meals based on your mood, dietary preferences, and health goals.",
  },
  {
    image: communityImg,
    title: "Join the Community",
    description:
      "Share recipes, like dishes, and connect with other food lovers.",
  },
  {
    image: recipesImg,
    title: "Save & Share Recipes",
    description:
      "Add recipes to your profile and inspire others with your creations.",
  },
];

export default function Home(props) {
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
      {/* Hero Section */}
      <HomeLandingContainer description={props.description} />
      <Divider sx={{ my: 6 }} />
      <CardBelowHome />
      <Divider sx={{ my: 6 }} />

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} />
        ))}
      </div>

      <Divider sx={{ my: 6 }} />

      {/* Parallax Sections */}
      <ParallaxFood
        image="/images/salad.jpg"
        title="Eat for Your Mood"
        text="Select your current mood, and we'll create meals designed to lift your spirits and keep you energized."
      />
      <Divider sx={{ my: 6 }} />
      <ParallaxFood
        image="/images/grilledfish.jpg"
        title="Health Goal Tracking"
        text="Whether you want to lose weight, gain muscle, or improve heart health, our plans adapt to you."
        reverse
      />

      <Divider sx={{ my: 6 }} />

      {/* Mood-to-Meal Interactive Demo */}
      <MoodToMeal />

      <Divider sx={{ my: 6 }} />

      {/* FAQ */}
      <DietAndMoodFAQ />
    </Box>
  );
}
