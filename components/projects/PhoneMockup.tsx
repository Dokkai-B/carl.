"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import { Project } from "@/data/projects";

interface PhoneMockupProps {
  src: string;
  alt: string;
  index: number;
  onClick: () => void;
  isDark: boolean;
  position?: "left" | "center" | "right";
  projectColors: Project["colors"];
}

export const PhoneMockup = ({
  src,
  alt,
  index,
  onClick,
  isDark,
  position = "center",
  projectColors,
}: PhoneMockupProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const getPositionStyles = () => {
    switch (position) {
      case "left":
        return {
          scale: isHovered ? 1.08 : 1.05,
          rotateY: isHovered ? 0 : 12,
          x: isHovered ? 0 : 20,
          y: isHovered ? -12 : 0,
        };
      case "right":
        return {
          scale: isHovered ? 1.08 : 1.05,
          rotateY: isHovered ? 0 : -12,
          x: isHovered ? 0 : -20,
          y: isHovered ? -12 : 0,
        };
      case "center":
      default:
        return {
          scale: isHovered ? 1.1 : 1.08,
          rotateY: 0,
          x: 0,
          y: isHovered ? -12 : 0,
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0, ...getPositionStyles() } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.4,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      className="relative cursor-pointer group"
      style={{
        perspective: "1200px",
        zIndex: position === "center" ? (isHovered ? 50 : 20) : isHovered ? 40 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: position === "center" ? 1.06 : 1.0 }}
    >
      {/* Floating shadow */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          filter: "blur(24px)",
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4), transparent 65%)"
            : "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.15), transparent 65%)",
          transform: `translateY(${isHovered ? "10px" : "16px"}) scale(0.9)`,
          opacity: isHovered ? 0.8 : 0.6,
          transition: "transform 400ms ease-out, opacity 400ms ease-out",
        }}
      />

      {/* Phone container */}
      <motion.div
        className="relative overflow-hidden rounded-[28px] w-80"
        animate={{
          rotateY:
            position === "left"
              ? isHovered
                ? 0
                : 12
              : position === "right"
              ? isHovered
                ? 0
                : -12
              : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        style={{
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.6)"}`,
          boxShadow: isHovered
            ? `0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px ${projectColors.primary}40`
            : "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        }}
      >
        {/* Phone Frame */}
        <div className="relative overflow-hidden rounded-[26px] bg-black/95 aspect-[9/19.5]">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-32 h-6 bg-black rounded-b-2xl" />

          {/* Screen */}
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              style={{
                borderRadius: "20px",
              }}
              sizes="320px"
              priority={index === 0}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
