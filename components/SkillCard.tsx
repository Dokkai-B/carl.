"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useRef } from "react";
import { useTheme } from "next-themes";

interface SkillCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  floatDirection?: "up" | "down";
  floatDuration?: number;
  className?: string;
}

export default function SkillCard({
  icon: Icon,
  title,
  description,
  delay = 0,
  floatDirection = "up",
  floatDuration = 6,
  className = "",
}: SkillCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Theme-aware hover colors
  const hoverBgColor = isDark
    ? "rgba(66, 129, 164, 0.15)" // Blue tint for dark mode
    : "rgba(255, 112, 166, 0.12)"; // Pink tint for light mode

  // Theme-aware border and icon stroke
  const cardBorderWidth = "1.2px";
  const iconStrokeWidth = isDark ? 2.25 : 2;

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for tilt
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);

  // Handle mouse move for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  // Reset tilt on mouse leave
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const floatAnimation = {
    y: floatDirection === "up" ? [0, -15, 0] : [0, 15, 0],
  };

  return (
    <motion.div
      animate={floatAnimation}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={className}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
        }}
        className="group relative w-64 cursor-pointer"
      >
        {/* Blur layer - separate from 3D transform */}
        <div
          className="absolute inset-0 rounded-xl"
          style={{
            backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />

        {/* Card Content - Frosted Glass */}
        <div
          className="
            relative p-6 rounded-xl
            transition-all duration-500 ease-out
            group-hover:shadow-lg
            group-hover:shadow-primary/5
          "
          style={{
            borderWidth: "2px",
            borderStyle: "solid",
            borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
            boxShadow: isDark
              ? "inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.15)"
              : "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.04)",
          }}
        >
          {/* Colored glass overlay on hover */}
          <div
            className="
              absolute inset-0 rounded-xl opacity-0 
              group-hover:opacity-100 transition-opacity duration-500
              pointer-events-none
            "
            style={{
              backgroundColor: hoverBgColor,
            }}
          />

          {/* Icon Module Container */}
          <div
            className="
              relative w-14 h-14 mb-4 rounded-xl
              flex items-center justify-center
              transition-all duration-500
              group-hover:scale-105
            "
            style={{
              backgroundColor: isDark ? "rgba(66, 129, 164, 0.15)" : "rgba(255, 112, 166, 0.12)",
              borderWidth: "2px",
              borderStyle: "solid",
              borderColor: isDark ? "rgba(66, 129, 164, 0.4)" : "rgba(255, 112, 166, 0.35)",
              boxShadow: isDark
                ? "inset 0 2px 4px rgba(66, 129, 164, 0.2), inset 0 -2px 3px rgba(0,0,0,0.15)"
                : "inset 0 2px 4px rgba(255, 112, 166, 0.18), inset 0 -2px 3px rgba(0,0,0,0.05)",
            }}
          >
            <Icon
              className="w-6 h-6 text-[var(--accent)] transition-colors duration-300 group-hover:text-[var(--accent-hover)]"
              strokeWidth={iconStrokeWidth}
            />
          </div>

          {/* Title */}
          <h3
            className="
              font-semibold text-base mb-2 
              text-foreground/90
              transition-colors duration-300
              group-hover:text-foreground
            "
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="
              text-sm text-muted-foreground/80 leading-relaxed
              transition-colors duration-300
              group-hover:text-muted-foreground
            "
          >
            {description}
          </p>

          {/* Bottom accent line */}
          <div
            className="
              absolute bottom-0 left-6 right-6 h-[1px]
              bg-gradient-to-r from-transparent via-primary/20 to-transparent
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            "
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
