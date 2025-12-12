"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, ReactNode } from "react";
import { OrbConfig } from "./OrbBackground";

export interface GlassSectionProps {
  children: ReactNode;
  className?: string;
  /** Allow orbs to overlap/bleed into this section for glass effect */
  allowOrbOverlap?: boolean;
  /** Where to render orbs: 'none', 'inside', or 'behind' */
  orbSlot?: "none" | "inside" | "behind";
  /** Orb configurations for this section */
  orbs?: OrbConfig[];
  /** Colors for orbs */
  primaryColor?: string;
  secondaryColor?: string;
  lightPrimaryColor?: string;
  lightSecondaryColor?: string;
  /** Custom background style */
  backgroundStyle?: React.CSSProperties;
  /** Custom border style */
  borderStyle?: React.CSSProperties;
}

const defaultSectionOrbs: OrbConfig[] = [
  { size: 240, x: 64, y: 10, duration: 18, colorIndex: 0 },
  { size: 180, x: 22, y: 72, duration: 20, colorIndex: 1 },
];

export function GlassSection({
  children,
  className = "",
  allowOrbOverlap = false,
  orbSlot = "none",
  orbs = defaultSectionOrbs,
  primaryColor,
  secondaryColor,
  lightPrimaryColor,
  lightSecondaryColor,
  backgroundStyle,
  borderStyle,
}: GlassSectionProps) {
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

  if (!mounted) return <div className={className}>{children}</div>;

  const colors =
    primaryColor && secondaryColor
      ? [
          isDark ? primaryColor : lightPrimaryColor || primaryColor,
          isDark ? secondaryColor : lightSecondaryColor || secondaryColor,
        ]
      : null;

  const renderOrbs = () => {
    if (!colors || orbSlot === "none" || !allowOrbOverlap) return null;

    return orbs.map((orb, i) => {
      const color = colors[orb.colorIndex];
      const opacity = isDark ? 0.5 - i * 0.04 : 0.4 - i * 0.03;

      return (
        <motion.div
          key={i}
          className="absolute rounded-full will-change-transform pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${color}AA, ${color}60 30%, ${color}20 50%, transparent 75%)`,
            opacity,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            filter: `blur(${isDark ? 45 : 35}px)`,
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
    });
  };

  return (
    <div className={`relative overflow-visible p-8 md:p-12 rounded-3xl group ${className}`}>
      {/* Blur background */}
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          ...backgroundStyle,
        }}
      />

      {/* Border and shadow */}
      <div
        className="absolute inset-0 rounded-3xl transition-shadow duration-300"
        style={{
          border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isDark
            ? "inset 0 2px 4px rgba(255,255,255,0.05), 0 20px 40px rgba(0, 0, 0, 0.35)"
            : "inset 0 2px 4px rgba(255,255,255,0.6), 0 20px 40px rgba(0, 0, 0, 0.08)",
          ...borderStyle,
        }}
      />

      {/* Orbs inside - visible through backdrop blur for glass effect */}
      {orbSlot === "inside" && (
        <div className="absolute inset-0 -z-10 overflow-visible pointer-events-none">
          {renderOrbs()}
        </div>
      )}

      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
