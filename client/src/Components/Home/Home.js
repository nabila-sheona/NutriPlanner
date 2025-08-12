import React, { useState } from "react";
import { Box, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
    path: "/mealplanner",
  },
  {
    image: communityImg,
    title: "Join the Community",
    description:
      "Share recipes, like dishes, and connect with other food lovers.",
    path: "/community",
  },
  {
    image: recipesImg,
    title: "Save & Share Recipes",
    description:
      "Add recipes to your profile and inspire others with your creations.",
    path: "/myrecipes",
  },
];

export default function Home(props) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleCardClick = (path) => {
    if (currentUser) {
      navigate(path);
      window.scrollTo(0, 0);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "background.default",
        color: "#004346",
        minHeight: "100vh",
        px: 3,
        py: 2,
        overflow: "hidden", // so parallax backgrounds don’t break layout
      }}
    >
      {/* Background Decorations */}
      <BackgroundParallax
        image={applePng}
        speed={0.5}
        size="180px"
        top="15%"
        left="5%"
        opacity={0.3}
      />
      <BackgroundParallax
        image={saladLeafPng}
        speed={0.5}
        size="220px"
        top="55%"
        left="80%"
        opacity={0.3}
      />
      <BackgroundParallax
        image={spoonForkPng}
        speed={0.5}
        size="150px"
        top="120%"
        left="15%"
        opacity={0.3}
      />

      {/* Hero Section */}
      <HomeLandingContainer description={props.description} />
      <Divider sx={{ my: 6 }} />

      {/* Card Below Hero */}
      <CardBelowHome />
      <Divider sx={{ my: 6 }} />

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard
              key={i}
              {...f}
              delay={i * 0.3}
              onClick={() => navigate(f.path)}
            />
          ))}
        </div>
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
