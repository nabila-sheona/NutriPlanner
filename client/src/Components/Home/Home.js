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
import NutriPlanFAQ from "./NutriPlanFAQ";
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
import calmMeal from "./images/calmmeal.JPG";
import recipeshome from "./images/recipeshome.jpeg";
import fruitbowl from "./images/fruitbowl.jpeg";
// Background decoration images
import applePng from "./images/apple.png";
import saladLeafPng from "./images/saladleaf.png";
import spoonForkPng from "./images/spoonfork.png";
const md = [
  { mood: "Happy", color: "bg-yellow-400", icon: "😊" },
  { mood: "Tired", color: "bg-indigo-500", icon: "😴" },
  { mood: "Stressed", color: "bg-red-400", icon: "😌" },
  { mood: "Energetic", color: "bg-green-500", icon: "🤩" },
  { mood: "Calm", color: "bg-blue-400", icon: "🌿" }, // new mood
];

const moods = [
  { mood: "Happy", color: "bg-yellow-400", icon: "😊", meal: happyMeal },
  { mood: "Tired", color: "bg-indigo-500", icon: "😴", meal: tiredMeal },
  { mood: "Stressed", color: "bg-red-400", icon: "😌", meal: stressedMeal },
  {
    mood: "Energetic",
    color: "bg-green-500",
    icon: "🤩",
    meal: adventurousMeal,
  },
  { mood: "Calm", color: "bg-blue-400", icon: "🌿", meal: calmMeal },
];

const features = [
  {
    image: mealPlannerImg,
    title: "AI-Powered Meal Planner",
    description:
      "Get customized meals based on your mood, dietary preferences, and health goals.",
    path: "/mealplanner", // updated path
  },
  {
    image: communityImg,
    title: "Join the Community",
    description:
      "Share recipes, like dishes, and connect with other food lovers.",
    path: "/community", // updated path
  },
  {
    image: recipesImg,
    title: "Save & Share Recipes",
    description:
      "Add recipes to your profile and inspire others with your creations.",
    path: "/myrecipes", // updated path
  },
];

const ft = [
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
  // put this near top of Home component
  const [selectedMood, setSelectedMood] = useState(moods[0]);

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
      {/* Card Below Hero   */}
      <CardBelowHome />
      <Divider sx={{ my: 6 }} />

      {/* Parallax Sections */}
      <ParallaxFood
        image={fruitbowl} // any image you want
        title="Explore New Recipes"
        text="Discover thousands of recipes shared by our community and save your favorites for easy access."
        delay={0.2} // small delay for smooth entrance
        reverse
      />

      <ParallaxFood
        image={saladImg}
        title="Eat for Your Mood"
        text="Select your current mood, and we'll create meals designed to lift your spirits and keep you energized."
        delay={0.1} // first image enters immediately
      />

      <ParallaxFood
        image={grilledFishImg}
        title="Health Goal Tracking"
        text="Whether you want to lose weight, gain muscle, or improve heart health, our plans adapt to you."
        reverse
        delay={0.1} // second image comes slightly later
      />
      <Divider sx={{ my: 6 }} />

      {/* Your Personal Recipe Collection Section */}
      <Box
        sx={{
          maxWidth: "1200px", // 👈 limits width
          mx: "auto", // 👈 centers horizontally
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
          gap: 6,
          my: 6,
        }}
      >
        {/* Left side (text + button) */}
        <Box>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            View and Upload your recipes
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
              color: "#333",
            }}
          >
            Save all your favorite recipes in one place! Whether it's family
            traditions, restaurant recreations, or your own creations, build
            your digital cookbook and access it anytime. Edit, organize, and
            even share your culinary masterpieces.
          </p>

          {/* CTA button */}
          <button
            onClick={() => navigate("/myrecipes")}
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
            View My Recipes
          </button>
        </Box>

        {/* Right side (image) */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <motion.img
            src={recipeshome}
            alt="Recipe Collection"
            className="rounded-2xl shadow-lg"
            style={{ width: "100%", maxWidth: "400px" }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          />
        </Box>
      </Box>
      <Divider sx={{ my: 6 }} />

      {/* Have a Specific Plan Section */}
      <Box
        sx={{
          maxWidth: "1200px", // 👈 ensures same width constraint
          mx: "auto", // 👈 keeps it centered like others
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
          gap: 6,
          my: 6,
        }}
      >
        {/* Left side (image) */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            order: { xs: 2, md: 1 },
          }}
        >
          <motion.img
            src={mealPlannerImg}
            alt="Meal Plan"
            className="rounded-2xl shadow-lg"
            style={{ width: "100%", maxWidth: "400px" }}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          />
        </Box>

        {/* Right side (text + button) */}
        <Box sx={{ order: { xs: 1, md: 2 } }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Have a specific plan in mind?
          </h2>

          <p
            style={{
              fontSize: "1.1rem",
              marginBottom: "1.5rem",
              color: "#333",
            }}
          >
            Whether you're following keto, vegan, or just want balanced
            nutrition, our AI-powered meal planner creates customized weekly
            plans tailored to your dietary needs and preferences. Get started in
            seconds!
          </p>

          {/* CTA button */}
          <button
            onClick={() => navigate("/mealplanner")}
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
            Generate Meal Plan
          </button>
        </Box>
      </Box>
      <Divider sx={{ my: 6 }} />

      {/* How Are You Feeling Today Section */}
      <Box
        sx={{
          maxWidth: "1200px", // 👈 limits width
          mx: "auto", // 👈 centers horizontally
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "center",
          gap: 6,
          my: 6,
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
                onClick={() => setSelectedMood(m)} // change selected mood
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
            Find Recipe
          </button>
        </Box>

        {/* Right side (animated image) */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <motion.img
            key={selectedMood.mood} // ensures smooth transition when image changes
            src={selectedMood.meal}
            alt={`${selectedMood.mood} Meal`}
            className="rounded-2xl shadow-lg"
            style={{ width: "100%", maxWidth: "400px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          />
        </Box>
      </Box>

      <Divider sx={{ my: 6 }} />

      <NutriPlanFAQ />
      <Divider sx={{ my: 6 }} />
      {/* Feature Cards */}

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <FeatureCard {...f} onClick={() => handleCardClick(f.path)} />
            </motion.div>
          ))}
        </div>
      </div>
      <Divider sx={{ my: 6 }} />
    </Box>
  );
}
