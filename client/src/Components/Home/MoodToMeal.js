import React, { useState } from "react";
import { motion } from "framer-motion";

export default function MoodToMeal({ moods }) {
  const [selected, setSelected] = useState(moods[0]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-wrap gap-4 justify-center">
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
        className="w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-lg"
      >
        <img
          src={selected.meal}
          alt={selected.name}
          className="w-32 h-32 object-cover rounded-lg"
        />
      </motion.div>
    </div>
  );
}
