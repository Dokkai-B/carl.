"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeTransition() {
  const { resolvedTheme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousTheme = useRef(resolvedTheme);

  useEffect(() => {
    // Detect theme change
    if (previousTheme.current !== resolvedTheme && previousTheme.current !== undefined) {
      setIsTransitioning(true);
      
      // Remove overlay after animation
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 400);

      return () => clearTimeout(timer);
    }
    previousTheme.current = resolvedTheme;
  }, [resolvedTheme]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[9997] pointer-events-none"
          style={{
            backgroundColor: resolvedTheme === "dark" ? "#1a2734" : "#f3f2f9",
          }}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}
    </AnimatePresence>
  );
}
