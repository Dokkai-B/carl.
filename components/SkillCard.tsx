"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { useRef } from "react";

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
          transformStyle: "preserve-3d",
        }}
        className="group relative w-64 cursor-pointer"
      >
        {/* Card Content */}
        <div
          className="
            relative p-6 rounded-xl
            bg-card/40 backdrop-blur-sm
            border border-border/30
            transition-all duration-500 ease-out
            group-hover:bg-card/20 group-hover:backdrop-blur-md
            group-hover:border-border/50 group-hover:shadow-lg
            group-hover:shadow-primary/5
          "
        >
          {/* Subtle gradient overlay on hover */}
          <div
            className="
              absolute inset-0 rounded-xl opacity-0 
              bg-gradient-to-br from-primary/5 via-transparent to-accent/5
              group-hover:opacity-100 transition-opacity duration-500
              pointer-events-none
            "
          />

          {/* Icon Container */}
          <div
            className="
              relative w-12 h-12 mb-4 rounded-lg
              bg-gradient-to-br from-primary/10 to-accent/10
              border border-border/20
              flex items-center justify-center
              transition-all duration-500
              group-hover:scale-110 group-hover:border-primary/30
              group-hover:shadow-md group-hover:shadow-primary/10
            "
            style={{ transform: "translateZ(20px)" }}
          >
            <Icon
              className="w-6 h-6 text-[var(--accent)] transition-colors duration-300 group-hover:text-[var(--accent-hover)]"
              strokeWidth={1.5}
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
            style={{ transform: "translateZ(15px)" }}
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
            style={{ transform: "translateZ(10px)" }}
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
