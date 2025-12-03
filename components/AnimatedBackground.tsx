"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";

type OrbState = "default" | "projects" | "about" | "returning" | null;

export function AnimatedBackground() {
  const [orbState, setOrbState] = useState<OrbState>("default");
  const [mounted, setMounted] = useState(false);
  const returnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  // Theme-aware orb colors (light mode is more subtle)
  const orbColors = {
    orb1: isDark ? "rgba(66, 129, 164, 0.4)" : "rgba(255, 112, 166, 0.15)",
    orb2: isDark ? "rgba(77, 150, 191, 0.35)" : "rgba(255, 140, 180, 0.12)",
    orb3: isDark ? "rgba(61, 165, 217, 0.3)" : "rgba(255, 112, 166, 0.1)",
  };

  useEffect(() => {
    const handleOrbHover = (e: CustomEvent<OrbState>) => {
      // Clear any pending return timeout
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
        returnTimeoutRef.current = null;
      }

      if (e.detail === null) {
        // First go to "returning" state (animates back to 0,0 smoothly)
        setOrbState("returning");
        // After the return animation completes, switch to default floating
        returnTimeoutRef.current = setTimeout(() => {
          setOrbState("default");
        }, 1000); // Wait for return animation to complete
      } else {
        setOrbState(e.detail);
      }
    };

    window.addEventListener("orbHover" as keyof WindowEventMap, handleOrbHover as EventListener);

    return () => {
      window.removeEventListener(
        "orbHover" as keyof WindowEventMap,
        handleOrbHover as EventListener
      );
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
      }
    };
  }, []);

  // Define orb positions/shapes for each state
  const orbConfigs = {
    default: {
      orb1: { x: 0, y: 0, scale: 1, opacity: 0.7 },
      orb2: { x: 0, y: 0, scale: 1, opacity: 0.7 },
      orb3: { x: 0, y: 0, scale: 1, opacity: 0.7 },
    },
    returning: {
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
          className="absolute top-0 -left-4 w-72 h-72 rounded-full filter blur-3xl transition-colors duration-500"
          style={{ backgroundColor: orbColors.orb1 }}
          animate={{
            scale: orbState === "default" ? [1, 1.2, 1] : currentConfig.orb1.scale,
            x: orbState === "default" ? [0, 100, 0] : currentConfig.orb1.x,
            y: orbState === "default" ? [0, 50, 0] : currentConfig.orb1.y,
            opacity: currentConfig.orb1.opacity,
          }}
          transition={{
            duration: orbState === "default" ? 8 : 0.8,
            repeat: orbState === "default" ? Infinity : 0,
            repeatType: "reverse",
            ease: [0.4, 0, 0.2, 1],
          }}
        />

        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 rounded-full filter blur-3xl transition-colors duration-500"
          style={{ backgroundColor: orbColors.orb2 }}
          animate={{
            scale: orbState === "default" ? [1, 1.3, 1] : currentConfig.orb2.scale,
            x: orbState === "default" ? [0, -100, 0] : currentConfig.orb2.x,
            y: orbState === "default" ? [0, 100, 0] : currentConfig.orb2.y,
            opacity: currentConfig.orb2.opacity,
          }}
          transition={{
            duration: orbState === "default" ? 10 : 0.8,
            repeat: orbState === "default" ? Infinity : 0,
            repeatType: "reverse",
            ease: [0.4, 0, 0.2, 1],
          }}
        />

        <motion.div
          className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full filter blur-3xl transition-colors duration-500"
          style={{ backgroundColor: orbColors.orb3 }}
          animate={{
            scale: orbState === "default" ? [1, 1.1, 1] : currentConfig.orb3.scale,
            x: orbState === "default" ? [0, 50, 0] : currentConfig.orb3.x,
            y: orbState === "default" ? [0, -50, 0] : currentConfig.orb3.y,
            opacity: currentConfig.orb3.opacity,
          }}
          transition={{
            duration: orbState === "default" ? 12 : 0.8,
            repeat: orbState === "default" ? Infinity : 0,
            repeatType: "reverse",
            ease: [0.4, 0, 0.2, 1],
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
