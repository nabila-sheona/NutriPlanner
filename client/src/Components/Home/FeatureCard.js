import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ image, title, description, onClick }) => {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer flex flex-col"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <motion.img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[#004346] mb-2">{title}</h3>
        <p className="text-gray-600 text-sm flex-1">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
