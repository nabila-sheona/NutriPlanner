import React from "react";
import { motion } from "framer-motion";
import HomeDarkCardLeftPic from "./images/misssion1.png";
import HealthyGif from "./images/healthy.gif";

const CardBelowHome = () => {
  return (
    <div
      className="relative flex flex-col md:flex-row items-center 
        bg-[#66a494] text-[#023e3c] 
        rounded-[40px_50px_20px_20px] 
        w-[85%] max-w-[1200px] mx-auto mt-12 
        p-12 md:p-16 overflow-visible shadow-inner"
    >
      {/* Left Image */}
      <motion.img
        src={HomeDarkCardLeftPic}
        alt="Playful cat"
        className="h-44 md:h-52 object-cover rounded-2xl"
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />

      {/* Middle Text */}
      <div className="flex-1 text-left px-4 md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
          className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight font-serif text-[#012f2b] drop-shadow-md"
        >
          OUR MISSION
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
          className="text-lg md:text-xl leading-relaxed font-sans text-[#024d45] tracking-wide"
        >
          We specialize in connecting the perfect diet for users that will
          spread joy and cultivate love. Our goal is to make healthy eating
          intuitive, enjoyable, and accessible for everyone.
        </motion.p>
      </div>

      {/* Right GIF */}
      <motion.img
        src={HealthyGif}
        alt="Healthy animation"
        className="h-36 md:h-44 object-cover rounded-2xl"
        animate={{ y: [0, -10, 0], scale: [1, 1.02, 1] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default CardBelowHome;
