"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type OrbState = "default" | "projects" | "about" | null;

export function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [orbState, setOrbState] = useState<OrbState>("default");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleOrbHover = (e: CustomEvent<OrbState>) => {
      setOrbState(e.detail || "default");
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("orbHover" as keyof WindowEventMap, handleOrbHover as EventListener);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener(
        "orbHover" as keyof WindowEventMap,
        handleOrbHover as EventListener
      );
    };
  }, []);

  // Define orb positions/shapes for each state
  const orbConfigs = {
    default: {
      orb1: { x: 0, y: 0, scale: 1, opacity: 0.7 },
      orb2: { x: 0, y: 0, scale: 1, opacity: 0.7 },
      orb3: { x: 0, y: 0, scale: 1, opacity: 0.7 },
    },
    projects: {
      orb1: { x: 200, y: -100, scale: 1.5, opacity: 0.9 },
      orb2: { x: -150, y: 50, scale: 0.8, opacity: 0.5 },
      orb3: { x: 100, y: 100, scale: 1.3, opacity: 0.8 },
    },
    about: {
      orb1: { x: -100, y: 100, scale: 0.8, opacity: 0.5 },
      orb2: { x: 200, y: -50, scale: 1.4, opacity: 0.9 },
      orb3: { x: -150, y: -100, scale: 1.2, opacity: 0.8 },
    },
  };

  const currentConfig = orbConfigs[orbState || "default"];

  return (
    <>
      {/* Base gradient layer */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />

        {/* Animated gradient orbs - respond to button hover */}
        <motion.div
          className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: orbState === "default" ? [1, 1.2, 1] : currentConfig.orb1.scale,
            x: orbState === "default" ? [0, 100, 0] : currentConfig.orb1.x,
            y: orbState === "default" ? [0, 50, 0] : currentConfig.orb1.y,
            opacity: currentConfig.orb1.opacity,
          }}
          transition={{
            duration: orbState === "default" ? 8 : 0.6,
            repeat: orbState === "default" ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeOut",
          }}
        />

        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: orbState === "default" ? [1, 1.3, 1] : currentConfig.orb2.scale,
            x: orbState === "default" ? [0, -100, 0] : currentConfig.orb2.x,
            y: orbState === "default" ? [0, 100, 0] : currentConfig.orb2.y,
            opacity: currentConfig.orb2.opacity,
          }}
          transition={{
            duration: orbState === "default" ? 10 : 0.6,
            repeat: orbState === "default" ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeOut",
          }}
        />

        <motion.div
          className="absolute bottom-0 left-1/3 w-80 h-80 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            scale: orbState === "default" ? [1, 1.1, 1] : currentConfig.orb3.scale,
            x: orbState === "default" ? [0, 50, 0] : currentConfig.orb3.x,
            y: orbState === "default" ? [0, -50, 0] : currentConfig.orb3.y,
            opacity: currentConfig.orb3.opacity,
          }}
          transition={{
            duration: orbState === "default" ? 12 : 0.6,
            repeat: orbState === "default" ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeOut",
          }}
        />

        {/* Mouse follower gradient */}
        <motion.div
          className="absolute w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50 pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 30,
          }}
        />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.015] noise" />
      </div>
    </>
  );
}
