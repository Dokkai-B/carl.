"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

type OrbState = "default" | "projects" | "about" | "returning" | null;

// Pre-generate noise frames for both themes
function generateNoiseFrames(
  width: number,
  height: number,
  frameCount: number,
  isDark: boolean
): ImageData[] {
  // Create offscreen canvas for generation
  const offscreen = document.createElement("canvas");
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext("2d", { alpha: true });
  if (!ctx) return [];

  const frames: ImageData[] = [];
  const baseColor = isDark ? { r: 66, g: 129, b: 164 } : { r: 100, g: 95, b: 110 };

  for (let f = 0; f < frameCount; f++) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random();
      const intensity = Math.pow(noise, 0.8) * 255;
      const variation = (intensity - 128) * 0.15;

      data[i] = baseColor.r + variation;
      data[i + 1] = baseColor.g + variation;
      data[i + 2] = baseColor.b + variation;
      data[i + 3] = 40 + Math.random() * 50; // 40-90 alpha for subtle grain
    }

    frames.push(imageData);
  }

  return frames;
}

export function AnimatedBackground() {
  const [orbState, setOrbState] = useState<OrbState>("default");
  const [mounted, setMounted] = useState(false);
  const returnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { resolvedTheme } = useTheme();

  // Noise canvas refs
  const noiseCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const darkFramesRef = useRef<ImageData[]>([]);
  const lightFramesRef = useRef<ImageData[]>([]);
  const frameIndexRef = useRef(0);

  useEffect(() => {
    setMounted(true);

    // Pre-generate frames for BOTH themes on mount - no delay on toggle
    // 1536 for finer grain while still performant
    const noiseSize = 1536;
    darkFramesRef.current = generateNoiseFrames(noiseSize, noiseSize, 6, true);
    lightFramesRef.current = generateNoiseFrames(noiseSize, noiseSize, 6, false);
  }, []);

  const isDark = resolvedTheme === "dark";

  // Noise animation effect
  useEffect(() => {
    if (!mounted) return;

    const canvas = noiseCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const noiseSize = 1536;
    canvas.width = noiseSize;
    canvas.height = noiseSize;

    let lastTime = 0;
    const frameInterval = 1000 / 12;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        const frames = isDark ? darkFramesRef.current : lightFramesRef.current;
        if (frames.length > 0) {
          ctx.putImageData(frames[frameIndexRef.current], 0, 0);
          frameIndexRef.current = (frameIndexRef.current + 1) % frames.length;
        }
        lastTime = currentTime;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mounted, isDark]);

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

  // Don't render theme-dependent elements until mounted to prevent flash of wrong colors
  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
      </div>
    );
  }

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

        {/* Subtle grid pattern for glass effect visibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(66, 129, 164, 0.08) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(66, 129, 164, 0.08) 1px, transparent 1px)`
              : `linear-gradient(rgba(255, 112, 166, 0.06) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255, 112, 166, 0.06) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Film grain noise - above grid/orbs, but behind content (since parent is -z-10) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.35, // Subtle paper texture
          }}
        >
          <canvas ref={noiseCanvasRef} className="w-full h-full" />
        </div>
      </div>
    </>
  );
}
