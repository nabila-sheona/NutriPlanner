import React, { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

export default function ParallaxFood({ image, title, text, reverse }) {
  const [styles, api] = useSpring(() => ({
    rotateZ: 0,
    opacity: 1,
    scale: 1,
  }));

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      api.start({
        rotateZ: scrollPos / 20, // slow spin
        opacity: Math.max(1 - scrollPos / 500, 0.8),
        scale: Math.max(1 - scrollPos / 1200, 0.85),
        config: { tension: 60, friction: 20 },
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [api]);

  return (
    <div
      className={`flex flex-col ${
        reverse ? "md:flex-row-reverse" : "md:flex-row"
      } items-center gap-10`}
    >
      <animated.div style={styles} className="flex-1 flex justify-center">
        <img src={image} alt={title} className="rounded-xl max-w-md w-full" />
      </animated.div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-[#004346] mb-4">{title}</h2>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}
