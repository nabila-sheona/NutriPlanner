import React, { useState } from "react";
import { motion } from "framer-motion";

const moods = [
  { name: "Happy", emoji: "😊", meal: "/images/happymeal.jpg" },
  { name: "Tired", emoji: "😴", meal: "/images/tiredmeal.jpg" },
  { name: "Stressed", emoji: "😌", meal: "/images/stressedmeal.jpg" },
  { name: "Adventurous", emoji: "🤩", meal: "/images/adventurousmeal.jpg" },
];

export default function MoodToMeal() {
  const [selected, setSelected] = useState(moods[0]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4">
        {moods.map((m) => (
          <motion.button
            key={m.name}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(m)}
            className="px-4 py-2 bg-[#004346] text-white rounded-full"
          >
            {m.emoji} {m.name}
          </motion.button>
        ))}
      </div>

      <motion.div
        key={selected.name}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <img
          src={selected.meal}
          alt={selected.name}
          className="rounded-xl shadow-lg w-full"
        />
      </motion.div>
    </div>
  );
}
