import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({
  image,
  title,
  description,
  onClick,
  delay = 0,
}) {
  return (
    <motion.div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer flex flex-col max-w-sm mx-auto" // wider than before
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }} // slower animation
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 15px 35px rgba(0,0,0,0.15)",
      }}
    >
      {/* Image Section */}
      <motion.img
        src={image}
        alt={title}
        className="w-full h-56 object-cover"
        initial={{ scale: 1.08 }}
        whileHover={{ scale: 1.12 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#004346] mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow text-base">{description}</p>
      </div>
    </motion.div>
  );
}
