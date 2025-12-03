"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { useTheme } from "next-themes";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Mouse position with spring physics for smooth trailing
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const isDark = resolvedTheme === "dark";

  // Different spring configs for dark (more lag) vs light (subtle lag)
  const haloSpringConfig = { damping: 15, stiffness: 120, mass: 0.8 };
  const ringSpringConfig = { damping: 20, stiffness: 180, mass: 0.5 };
  
  const outerX = useSpring(mouseX, isDark ? haloSpringConfig : ringSpringConfig);
  const outerY = useSpring(mouseY, isDark ? haloSpringConfig : ringSpringConfig);

  // Faster spring for the dot (more responsive)
  const dotSpringConfig = { damping: 25, stiffness: 500, mass: 0.1 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  // Dark mode colors (soft halo glow)
  const darkColors = {
    haloNormal: "radial-gradient(circle, rgba(66, 129, 164, 0.15) 0%, rgba(66, 129, 164, 0.05) 50%, transparent 70%)",
    haloHover: "radial-gradient(circle, rgba(66, 129, 164, 0.25) 0%, rgba(66, 129, 164, 0.08) 50%, transparent 70%)",
    shadowNormal: "0 0 20px rgba(66, 129, 164, 0.15)",
    shadowHover: "0 0 30px rgba(66, 129, 164, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)",
    dotNormal: "linear-gradient(135deg, #f0f8ff 0%, #c8e4f5 100%)",
    dotHover: "linear-gradient(135deg, #e0f0ff 0%, #4281a4 100%)",
    dotShadowNormal: "0 0 4px rgba(200, 228, 245, 0.6)",
    dotShadowHover: "0 0 8px rgba(66, 129, 164, 0.8), 0 0 12px rgba(255, 112, 166, 0.4)",
  };

  // Light mode colors (outline ring with translucent fill on hover)
  const lightColors = {
    ringColor: "rgba(61, 165, 217, 0.6)",
    ringColorHover: "rgba(61, 165, 217, 0.4)", // Lighter/thinner on hover
    fillHover: "rgba(61, 165, 217, 0.12)", // Soft translucent fill
    dotColor: "rgba(61, 165, 217, 1)",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Hide on touch devices
    if (typeof window !== "undefined" && "ontouchstart" in window) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Detect hoverable elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        target.closest("[data-cursor-hover]") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovering(!!isHoverable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleElementHover);
    document.body.addEventListener("mouseenter", handleMouseEnter);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleElementHover);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  // Don't render on touch devices or SSR
  if (typeof window !== "undefined" && "ontouchstart" in window) {
    return null;
  }

  // Wait for theme to be resolved
  if (!mounted) return null;

  return (
    <>
      {/* Hide default cursor globally */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>

      {/* Outer element - Halo (dark) or Ring (light) */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isDark && isHovering ? 1.3 : 1,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { duration: 0.2, ease: "easeOut" },
        }}
      >
        {isDark ? (
          /* Dark mode: Soft Halo Glow */
          <div
            className={`
              rounded-full transition-all duration-300 ease-out
              ${isHovering ? "w-14 h-14" : "w-12 h-12"}
            `}
            style={{
              background: isHovering ? darkColors.haloHover : darkColors.haloNormal,
              boxShadow: isHovering ? darkColors.shadowHover : darkColors.shadowNormal,
            }}
          >
            {/* Inner ring - appears on hover (white) */}
            <div
              className={`
                absolute inset-2 rounded-full border transition-all duration-200
                ${isHovering ? "opacity-100 border-white/50" : "opacity-0 border-transparent"}
              `}
            />
          </div>
        ) : (
          /* Light mode: Outline Ring with translucent fill on hover */
          <motion.div
            className="rounded-full"
            animate={{
              width: isHovering ? 64 : 48,
              height: isHovering ? 64 : 48,
              borderWidth: isHovering ? 0 : 2,
              borderColor: lightColors.ringColor,
              backgroundColor: isHovering ? lightColors.fillHover : "transparent",
            }}
            transition={{
              width: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
              borderWidth: { duration: 0.2, ease: "easeOut" },
              backgroundColor: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
            }}
            style={{
              borderStyle: "solid",
            }}
          />
        )}
      </motion.div>

      {/* Central dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isDark && isHovering ? 0.8 : 1,
        }}
        transition={{
          opacity: { duration: 0.1 },
          scale: { duration: 0.15, ease: "easeOut" },
        }}
      >
        {isDark ? (
          /* Dark mode dot */
          <div
            className={`
              rounded-full transition-all duration-150
              ${isHovering ? "w-2 h-2" : "w-1.5 h-1.5"}
            `}
            style={{
              background: isHovering ? darkColors.dotHover : darkColors.dotNormal,
              boxShadow: isHovering ? darkColors.dotShadowHover : darkColors.dotShadowNormal,
            }}
          />
        ) : (
          /* Light mode dot */
          <motion.div
            className="rounded-full"
            animate={{
              width: isHovering ? 6 : 5,
              height: isHovering ? 6 : 5,
              backgroundColor: lightColors.dotColor,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          />
        )}
      </motion.div>
    </>
  );
}
