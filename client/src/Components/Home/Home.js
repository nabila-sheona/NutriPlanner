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
import { motion } from "framer-motion";

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
const moods = [
  { mood: "Happy", color: "bg-yellow-400", icon: "😊" },
  { mood: "Tired", color: "bg-indigo-500", icon: "😴" },
  { mood: "Stressed", color: "bg-red-400", icon: "😌" },
  { mood: "Energetic", color: "bg-green-500", icon: "🤩" },
  { mood: "Calm", color: "bg-blue-400", icon: "🌿" }, // new mood
];

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

      {/* Card Below Hero 
      <CardBelowHome />
      <Divider sx={{ my: 6 }} />
    */}

      {/* How Are You Feeling Today Section */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, // 2 columns on medium+, 1 on mobile
          alignItems: "center",
          gap: 6,
          my: 10,
        }}
      >
        {/* Left side (text + moods + button) */}
        <Box>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            How are you feeling today?
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
              color: "#333",
            }}
          >
            No matter how you’re feeling, we want every meal to bring you
            comfort and joy. Our smart mood-based recipe feature helps you
            discover the perfect dish that matches your emotions and boosts your
            day.
          </p>

          {/* Mood chips */}
          <div className="flex flex-wrap gap-3 mb-6">
            {moods.map((m) => (
              <motion.div
                key={m.mood}
                whileHover={{ scale: 1.1 }}
                className={`${m.color} text-white px-4 py-2 rounded-full cursor-pointer shadow-md`}
              >
                {m.icon} {m.mood}
              </motion.div>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => navigate("/moodtracker")}
            style={{
              padding: "12px 24px",
              fontSize: "1rem",
              fontWeight: "600",
              backgroundColor: "#004346",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#00695c")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#004346")
            }
          >
            Find My Mood Recipe
          </button>
        </Box>

        {/* Right side (animated image) */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <motion.img
            src={happyMeal} // swap with any mood-related image
            alt="Mood Recipe"
            className="rounded-2xl shadow-lg"
            style={{ width: "100%", maxWidth: "400px" }}
            initial={{ y: 0 }}
            animate={{ y: [0, -15, 0] }} // floating effect
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </Box>
      </Box>

      {/* Feature Cards 
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }} // moderate slide
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // faster but still smooth
            >
              <FeatureCard {...f} onClick={() => navigate(f.path)} />
            </motion.div>
          ))}
        </div>
      </div>
          */}

      {/* Parallax Sections */}
      <ParallaxFood
        image={saladImg}
        title="Eat for Your Mood"
        text="Select your current mood, and we'll create meals designed to lift your spirits and keep you energized."
        delay={0} // first image enters immediately
      />
      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }} // moderate slide
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeInOut" }} // faster but still smooth
            >
              <FeatureCard {...f} onClick={() => navigate(f.path)} />
            </motion.div>
          ))}
        </div>
      </div>
      <ParallaxFood
        image={grilledFishImg}
        title="Health Goal Tracking"
        text="Whether you want to lose weight, gain muscle, or improve heart health, our plans adapt to you."
        reverse
        delay={0.5} // second image comes slightly later
      />

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
      {/* Card Below Hero */}
      <CardBelowHome />
      <Divider sx={{ my: 6 }} />
      {/* FAQ  */}
      <DietAndMoodFAQ />
    </Box>
  );
}
