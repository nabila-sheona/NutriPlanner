import React, { useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";

export default function BackgroundParallax({
  image,
  speed = 0.5,
  size = "300px",
  top = "10%",
  left = "10%",
  opacity = 0.08,
  zIndex = -1,
}) {
  const [styles, api] = useSpring(() => ({
    y: 0,
    config: { tension: 50, friction: 20 },
  }));

  useEffect(() => {
    const handleScroll = () => {
      api.start({ y: window.scrollY * speed });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [api, speed]);

  return (
    <animated.img
      src={image}
      alt=""
      style={{
        ...styles,
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        objectFit: "contain",
        opacity,
        pointerEvents: "none",
        zIndex,
      }}
    />
  );
}
