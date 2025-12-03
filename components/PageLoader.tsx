"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // =============================================
    // ⏱️ LOADING SPEED - Adjust these values
    // =============================================
    const INTERVAL_MS = 50; // How often progress updates (lower = faster)
    const FAST_INCREMENT = 8; // Speed when progress < 80%
    const SLOW_INCREMENT = 2; // Speed when progress >= 80%
    const MIN_DISPLAY_TIME = 2500; // Minimum time loader shows (milliseconds)
    // =============================================

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment =
          prev < 80 ? Math.random() * FAST_INCREMENT + 2 : Math.random() * SLOW_INCREMENT + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, INTERVAL_MS);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, MIN_DISPLAY_TIME);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // =============================================
  // 📐 SIZE & SPACING - Adjust these values (in pixels)
  // =============================================
  const ICON_WIDTH = 250; // Icon width in pixels (96, 128, 160, 192)
  const ICON_HEIGHT = 250; // Icon height in pixels
  const GAP_ICON_TO_TEXT = -100; // Gap below icon in pixels (use negative to pull closer: -10, -20, -30)
  const TEXT_SIZE = 20; // Text size in pixels (16, 18, 20, 24)
  const TEXT_TRACKING = "0.2em"; // Letter spacing: "0.1em", "0.2em", "0.3em"
  // =============================================

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--background)",
          }}
        >
          {/* Floating Alibata Icon - Progress fills from bottom to top */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: [0, -8, 0],
              scale: 1,
            }}
            transition={{
              opacity: { duration: 0.6 },
              scale: { duration: 0.6 },
              y: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            style={{
              position: "relative",
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
            }}
          >
            {/* Background icon (unfilled - shows through) */}
            <Image
              src="/loader/1.png"
              alt="Loading"
              fill
              className="object-contain opacity-20"
              priority
            />

            {/* Foreground icon - fills based on progress (bottom to top) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                transition: "all 150ms ease-out",
                clipPath: `inset(${100 - progress}% 0 0 0)`,
              }}
            >
              <Image
                src="/loader/2.png"
                alt="Loading progress"
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Kamusta! Text - matches hero text style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ marginTop: GAP_ICON_TO_TEXT }}
          >
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <p
                className="text-xl text-muted-foreground font-primary"
                style={{ letterSpacing: TEXT_TRACKING }}
              >
                Kamusta!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
