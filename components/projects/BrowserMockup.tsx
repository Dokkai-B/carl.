"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

interface BrowserMockupProps {
  src: string;
  alt: string;
  onClick: () => void;
  variant: "hero" | "satellite";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  isDark: boolean;
  primaryColor: string;
  secondaryColor: string;
  showChrome?: boolean;
  rotationIdle?: number;
  depthScale?: number;
  idleOpacity?: number;
}

export const BrowserMockup = ({
  src,
  alt,
  onClick,
  variant,
  position,
  isDark,
  primaryColor,
  secondaryColor,
  showChrome = false,
  rotationIdle = 0,
  depthScale = 1,
  idleOpacity = 1,
}: BrowserMockupProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate satellite positioning and rotation
  const getSatelliteStyles = () => {
    if (variant !== "satellite" || !position) return {};

    const positions = {
      "top-left": {
        top: "8%",
        left: "2%",
        rotate: -2,
      },
      "top-right": {
        top: "8%",
        right: "2%",
        rotate: 2,
      },
      "bottom-left": {
        bottom: "8%",
        left: "2%",
        rotate: -2.5,
      },
      "bottom-right": {
        bottom: "8%",
        right: "2%",
        rotate: 2.5,
      },
    };

    return positions[position];
  };

  const satelliteStyles = getSatelliteStyles();

  return (
    <motion.div
      className="relative cursor-pointer w-full"
      style={{
        perspective: "1200px",
        zIndex: isHovered && variant === "satellite" ? 15 : variant === "hero" ? 20 : 5,
      }}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: variant === "hero" ? 0.1 : 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Floating shadow - depth based */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          filter: `blur(${variant === "satellite" ? "18px" : "24px"})`,
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4), transparent 65%)"
            : "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.15), transparent 65%)",
          transform: `translateY(${
            isHovered ? "8px" : variant === "satellite" ? "20px" : "16px"
          }) scale(0.9)`,
          opacity: isHovered ? 0.85 : variant === "satellite" ? 0.4 : 0.55,
          transition:
            "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      {/* Browser Container - orbital depth system */}
      <motion.div
        className="relative overflow-hidden rounded-[28px] w-full"
        animate={{
          scale: isHovered ? 1.04 : variant === "satellite" ? depthScale : 1.0,
          rotate: isHovered ? 0 : rotationIdle,
          y: isHovered && variant === "satellite" ? -12 : 0,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.6)"}`,
          boxShadow: isHovered
            ? `0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px ${primaryColor}40, 0 0 20px ${primaryColor}20`
            : variant === "hero"
              ? `0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05), 0 0 15px ${primaryColor}10`
              : `0 15px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.03)`,
          opacity: isHovered ? 1 : variant === "satellite" ? idleOpacity : 1,
        }}
      >
        {/* Browser Content */}
        <div className="relative aspect-video overflow-hidden rounded-[26px]">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes={variant === "hero" ? "800px" : "300px"}
            style={{ borderRadius: "20px" }}
          />

          {/* Hover Overlay - matching mobile design */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${primaryColor}33 70%, ${primaryColor}66 100%)`,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <span className="text-white text-sm font-semibold">Click to Expand</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
