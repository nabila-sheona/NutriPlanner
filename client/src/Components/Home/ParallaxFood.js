import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";

export default function ParallaxFood({
  image,
  title,
  text,
  reverse,
  delay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-50px" });

  const [styles, api] = useSpring(() => ({
    rotateZ: 0,
    opacity: 1,
    scale: 1,
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      api.start({
        rotateZ: reverse ? -scrollPos / 12 : scrollPos / 12,
        opacity: Math.max(1 - scrollPos / 500, 0.85),
        scale: Math.max(1 - scrollPos / 1200, 0.85),
        config: { tension: 60, friction: 20 },
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [api, reverse]);

  const initialX = reverse ? 200 : -200;

  return (
    <div
      ref={ref}
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-6 w-[85%] max-w-[1100px] mx-auto my-0`}
    >
      {/* Image */}
      <motion.div
        initial={{ x: initialX, opacity: 0 }}
        animate={{ x: inView ? 0 : initialX, opacity: inView ? 1 : 0 }}
        transition={{
          x: { type: "spring", stiffness: 50, damping: 18, delay },
          opacity: { duration: 1.2, delay },
        }}
        className="flex-1 flex justify-center"
      >
        <animated.img
          src={image}
          alt={title}
          style={styles}
          className="rounded-xl max-w-sm md:max-w-md w-full object-cover"
        />
      </motion.div>

      {/* Text */}
      <div className="flex-1 text-left px-2 md:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
            delay: delay + 0.2,
          }}
          className="text-3xl md:text-4xl font-extrabold text-[#023e3c] mb-3 tracking-tight font-serif drop-shadow-md"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
            delay: delay + 0.3,
          }}
          className="text-lg md:text-xl leading-relaxed text-[#04534d] font-sans tracking-wide"
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
}
