import React from "react";
import { motion } from "framer-motion";

export default function FeatureCard({ image, title, description, onClick }) {
  return (
    <motion.div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-md cursor-pointer flex flex-col"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 12px 30px rgba(0,0,0,0.15)",
      }}
    >
      {/* Image Section */}
      <motion.img
        src={image}
        alt={title}
        className="w-full h-52 object-cover"
        initial={{ scale: 1.1 }}
        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-[#004346] mb-2">{title}</h3>
        <p className="text-gray-600 flex-grow">{description}</p>
      </div>
    </motion.div>
  );
}
