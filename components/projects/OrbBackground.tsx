"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface OrbConfig {
  size: number;
  x: number; // percentage
  y: number; // percentage
  duration: number;
  colorIndex: 0 | 1; // 0 for primary, 1 for secondary
}

export interface OrbBackgroundProps {
  orbs?: OrbConfig[];
  primaryColor: string;
  secondaryColor: string;
  lightPrimaryColor?: string;
  lightSecondaryColor?: string;
  className?: string;
  zIndex?: number;
}

const defaultOrbs: OrbConfig[] = [
  { size: 400, x: 15, y: 20, duration: 22, colorIndex: 0 },
  { size: 350, x: 75, y: 60, duration: 26, colorIndex: 1 },
  { size: 320, x: 50, y: 80, duration: 20, colorIndex: 0 },
];

export function OrbBackground({
  orbs = defaultOrbs,
  primaryColor,
  secondaryColor,
  lightPrimaryColor,
  lightSecondaryColor,
  className = "",
  zIndex = -10,
}: OrbBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  if (!mounted) return null;

  const colors = [
    isDark ? primaryColor : lightPrimaryColor || primaryColor,
    isDark ? secondaryColor : lightSecondaryColor || secondaryColor,
  ];

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}
      style={
        {
          zIndex,
          "--orb-color-primary": primaryColor,
          "--orb-color-accent": secondaryColor,
          "--orb-opacity": isDark ? "0.25" : "0.18",
          "--orb-blur": isDark ? "80px" : "70px",
        } as React.CSSProperties
      }
    >
      {orbs.map((orb, i) => {
        const color = colors[orb.colorIndex];
        const opacity = isDark ? 0.25 - i * 0.02 : 0.18 - i * 0.015;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full will-change-transform"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle, ${color}80, ${color}30 40%, transparent 70%)`,
              opacity,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              filter: `blur(var(--orb-blur, ${isDark ? 80 : 70}px))`,
              transform: "translate(-50%, -50%)",
            }}
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scale: [1, 1.08, 1],
                  }
            }
            transition={
              prefersReducedMotion
                ? {}
                : {
                    scale: {
                      duration: orb.duration,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          />
        );
      })}
    </div>
  );
}
