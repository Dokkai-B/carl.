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

  // Spring config for the halo (trails behind) - MORE LAG/DELAY
  const springConfig = { damping: 15, stiffness: 120, mass: 0.8 };
  const haloX = useSpring(mouseX, springConfig);
  const haloY = useSpring(mouseY, springConfig);

  // Faster spring for the dot (more responsive) - KEEPS CURRENT SPEED
  const dotSpringConfig = { damping: 25, stiffness: 500, mass: 0.1 };
  const dotX = useSpring(mouseX, dotSpringConfig);
  const dotY = useSpring(mouseY, dotSpringConfig);

  // Theme-based colors
  const isDark = resolvedTheme === "dark";
  
  // Dark theme: blue accent (#4281a4)
  // Light theme: pink accent (#ff70a6)
  const colors = {
    haloNormal: isDark
      ? "radial-gradient(circle, rgba(66, 129, 164, 0.15) 0%, rgba(66, 129, 164, 0.05) 50%, transparent 70%)"
      : "radial-gradient(circle, rgba(255, 112, 166, 0.15) 0%, rgba(255, 112, 166, 0.05) 50%, transparent 70%)",
    haloHover: isDark
      ? "radial-gradient(circle, rgba(66, 129, 164, 0.25) 0%, rgba(66, 129, 164, 0.08) 50%, transparent 70%)"
      : "radial-gradient(circle, rgba(255, 112, 166, 0.25) 0%, rgba(255, 112, 166, 0.08) 50%, transparent 70%)",
    shadowNormal: isDark
      ? "0 0 20px rgba(66, 129, 164, 0.15)"
      : "0 0 20px rgba(255, 112, 166, 0.15)",
    shadowHover: isDark
      ? "0 0 30px rgba(66, 129, 164, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)"
      : "0 0 30px rgba(255, 112, 166, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)",
    dotNormal: isDark
      ? "linear-gradient(135deg, #f0f8ff 0%, #c8e4f5 100%)"
      : "#3da5d9",
    dotHover: isDark
      ? "linear-gradient(135deg, #e0f0ff 0%, #4281a4 100%)"
      : "linear-gradient(135deg, #3da5d9 0%, #ff70a6 100%)",
    dotShadowNormal: isDark
      ? "0 0 4px rgba(200, 228, 245, 0.6)"
      : "0 0 4px rgba(61, 165, 217, 0.5)",
    dotShadowHover: isDark
      ? "0 0 8px rgba(66, 129, 164, 0.8), 0 0 12px rgba(255, 112, 166, 0.4)"
      : "0 0 8px rgba(255, 112, 166, 0.8), 0 0 12px rgba(61, 165, 217, 0.4)",
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

      {/* Soft Halo - trails behind */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: haloX,
          y: haloY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.3 : 1,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { duration: 0.2, ease: "easeOut" },
        }}
      >
        {/* Outer glow */}
        <div
          className={`
            rounded-full transition-all duration-200 ease-out
            ${isHovering ? "w-14 h-14" : "w-12 h-12"}
          `}
          style={{
            background: isHovering ? colors.haloHover : colors.haloNormal,
            boxShadow: isHovering ? colors.shadowHover : colors.shadowNormal,
          }}
        >
          {/* Inner ring - appears on hover */}
          <div
            className={`
              absolute inset-2 rounded-full border transition-all duration-200
              ${
                isHovering
                  ? "opacity-100 border-[var(--accent)]/40"
                  : "opacity-0 border-transparent"
              }
            `}
          />
        </div>
      </motion.div>

      {/* Central dot - more responsive */}
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
          scale: isHovering ? 0.8 : 1,
        }}
        transition={{
          opacity: { duration: 0.1 },
          scale: { duration: 0.15, ease: "easeOut" },
        }}
      >
        <div
          className={`
            rounded-full transition-all duration-150
            ${isHovering ? "w-2 h-2" : "w-1.5 h-1.5"}
          `}
          style={{
            background: isHovering ? colors.dotHover : colors.dotNormal,
            boxShadow: isHovering ? colors.dotShadowHover : colors.dotShadowNormal,
          }}
        />
      </motion.div>
    </>
  );
}
