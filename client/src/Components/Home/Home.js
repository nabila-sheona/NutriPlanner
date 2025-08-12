import React from "react";
import { Box, Divider } from "@mui/material";
import HomeLandingContainer from "./HomeLandingContainer";
import DietAndMoodFAQ from "./DietAndMoodFAQ";
import FeatureCard from "./FeatureCard";
import ParallaxFood from "./ParallaxFood";
import MoodToMeal from "./MoodToMeal";
import CardBelowHome from "./CardBelowHome";
import BackgroundParallax from "./BackgroundParallax";

// === Images ===
import mealPlannerImg from "./images/mealplanner.jpg";
import communityImg from "./images/community.jpg";
import recipesImg from "./images/recipes.jpg";
import saladImg from "./images/salad.png";
import grilledFishImg from "./images/grilledfish.png";
import happyMeal from "./images/happymeal.jpg";
import tiredMeal from "./images/tiredmeal.jpg";
import stressedMeal from "./images/stressedmeal.jpg";
import adventurousMeal from "./images/adventurousmeal.jpg";

// Background decoration images
import applePng from "./images/apple.png";
import saladLeafPng from "./images/saladleaf.png";
import spoonForkPng from "./images/spoonfork.png";

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
        position: "relative",
        overflow: "hidden", // so parallax backgrounds don’t break layout
      }}
    >
      {/* Background Decorations */}
      <BackgroundParallax
        image={applePng}
        speed={0.2}
        size="180px"
        top="15%"
        left="5%"
        opacity={0.05}
      />
      <BackgroundParallax
        image={saladLeafPng}
        speed={0.4}
        size="220px"
        top="55%"
        left="80%"
        opacity={0.07}
      />
      <BackgroundParallax
        image={spoonForkPng}
        speed={0.3}
        size="150px"
        top="120%"
        left="15%"
        opacity={0.06}
      />

      {/* Hero Section */}
      <HomeLandingContainer description={props.description} />
      <Divider sx={{ my: 6 }} />

      {/* Card Below Hero */}
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
        image={saladImg}
        title="Eat for Your Mood"
        text="Select your current mood, and we'll create meals designed to lift your spirits and keep you energized."
      />
      <Divider sx={{ my: 6 }} />
      <ParallaxFood
        image={grilledFishImg}
        title="Health Goal Tracking"
        text="Whether you want to lose weight, gain muscle, or improve heart health, our plans adapt to you."
        reverse
      />

      <Divider sx={{ my: 6 }} />

      {/* Mood-to-Meal Interactive Demo */}
      <MoodToMeal
        moods={[
          { name: "Happy", emoji: "😊", meal: happyMeal },
          { name: "Tired", emoji: "😴", meal: tiredMeal },
          { name: "Stressed", emoji: "😌", meal: stressedMeal },
          { name: "Adventurous", emoji: "🤩", meal: adventurousMeal },
        ]}
      />

      <Divider sx={{ my: 6 }} />

      {/* FAQ */}
      <DietAndMoodFAQ />
    </Box>
  );
}
