import React, { useState, useMemo, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import food from "./images/food.png";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { RamenDining, PeopleAlt } from "@mui/icons-material";

const moods = [
  { mood: "Happy", color: "bg-yellow-400", icon: "😊" },
  { mood: "Tired", color: "bg-indigo-500", icon: "😴" },
  { mood: "Stressed", color: "bg-red-400", icon: "😌" },
  { mood: "Adventurous", color: "bg-green-500", icon: "🤩" },
];

export default function HomeLandingContainer({ description }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spinFadeScale, api] = useSpring(() => ({
    rotateZ: 0,
    opacity: 1,
    scale: 1,
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;

      api.start({
        rotateZ: scrollPos / 10, // slow rotation
        opacity: Math.max(1 - scrollPos / 400, 0), // fade out by 400px scroll
        scale: Math.max(1 - scrollPos / 1000, 0.7), // shrink to 70% size
        config: { tension: 60, friction: 20 },
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [api]);

  const { scrollY } = useScroll();
  const yImage = useTransform(scrollY, [0, 300], [0, 50]); // background layer
  const yText = useTransform(scrollY, [0, 300], [0, -30]); // foreground layer

  const userName = useMemo(() => {
    if (!currentUser) return "";
    if (currentUser.username) return currentUser.username.split(" ")[0];
    if (currentUser.email) return currentUser.email.split("@")[0];
    return "";
  }, [currentUser]);

  const goTo = (path) => {
    if (currentUser) {
      navigate(path);
      window.scrollTo(0, 0);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row items-center bg-white shadow-lg rounded-xl p-6 md:p-10 gap-10 max-w-7xl mx-auto">
      {/* Left Text */}
      <motion.div style={{ y: yText }} className="flex-1">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
          className="text-3xl md:text-5xl font-bold text-[#004346] leading-tight mb-4"
        >
          {userName
            ? `Hi ${userName},`
            : "Your Health is Always Our Top Priority"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 80 }}
          className="text-gray-600 mb-6 text-lg"
        >
          {description ||
            "Plan meals, explore recipes, connect with our community, and discover mood-based meals tailored for you."}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delayChildren: 0.4, staggerChildren: 0.15 },
            },
          }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center justify-center gap-2 bg-[#004346] text-white px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-[#006064] transition-all"
            onClick={() => goTo("/mealplanner")}
          >
            <RamenDining /> Start My Meal Plan
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.08, y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center justify-center gap-2 border-2 border-[#004346] text-[#004346] px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-[#e0f7fa] transition-all"
            onClick={() => goTo("/community")}
          >
            <PeopleAlt /> Join Community
          </motion.button>
        </motion.div>

        {/* Mood Selector Pills */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { delayChildren: 0.8, staggerChildren: 0.1 },
            },
          }}
          className="mt-6"
        >
          <p className="font-semibold mb-2">How are you feeling today?</p>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <motion.div
                key={m.mood}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.1 }}
                className={`${m.color} text-white px-4 py-2 rounded-full cursor-pointer`}
              >
                {m.icon} {m.mood}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right Image */}
      <animated.div
        style={spinFadeScale}
        className="flex-1 flex justify-center"
      >
        <img
          src={food}
          alt="NutriPlanner"
          className="rounded-xl max-w-md w-full"
        />
      </animated.div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Please log in to continue
            </h2>
            <button
              onClick={() => navigate("/login")}
              className="bg-[#004346] text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-[#006064] transform hover:scale-105 transition-all w-full"
            >
              Go to Login
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-3 text-gray-500 hover:underline text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
