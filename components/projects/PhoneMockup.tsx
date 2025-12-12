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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.6, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative cursor-pointer group"
      style={{
        perspective: "1200px",
        zIndex: position === "center" ? (isHovered ? 50 : 20) : isHovered ? 40 : 10,
        transform:
          position === "left"
            ? "translateX(24px)"
            : position === "right"
            ? "translateX(-24px)"
            : "translateX(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
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
          opacity: isHovered ? 0.85 : 0.55,
          transition:
            "transform 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Phone container */}
      <motion.div
        className={
          position === "center"
            ? "relative overflow-hidden rounded-[28px] w-80"
            : "relative overflow-hidden rounded-[28px] w-72"
        }
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
          scale: isHovered ? 1.04 : 1.0,
        }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
          {/* Screen */}
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              boxShadow: "inset 0 0 20px rgba(0,0,0,0.08), inset 0 0 12px rgba(0,0,0,0.05)",
            }}
          >
            {/* Rim light */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[24px]"
              style={{
                border: "1px solid transparent",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.02))",
                maskImage: "linear-gradient(#000,#000)",
                WebkitMaskImage: "linear-gradient(#000,#000)",
              }}
            />
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              style={{ borderRadius: "20px" }}
              sizes="320px"
              priority={index === 0}
            />

            {/* Hover overlay: glass blur with gradient and text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${projectColors.primary}33 70%, ${projectColors.primary}66 100%)`,
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <span className="text-[#1a2735] text-sm font-semibold">Click to Expand</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
