"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { Project } from "@/data/projects";

// =============================================
// FULLSCREEN MODAL VIEWER
// =============================================
interface FullscreenModalViewerProps {
  images: Array<{ name: string; image: string }>;
  initialIndex: number;
  onClose: () => void;
  isDark: boolean;
  projectColors: Project["colors"];
}

export const FullscreenModalViewer = ({
  images,
  initialIndex,
  onClose,
  isDark,
  projectColors,
}: FullscreenModalViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowRight" && !isZoomed) goNext();
      if (e.key === "ArrowLeft" && !isZoomed) goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  const colors = isDark ? projectColors : projectColors.light;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))",
          backdropFilter: "blur(8px)",
        }}
        onClick={onClose}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute top-8 right-8 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all"
          style={{
            background: `${colors.primary}20`,
            border: `1px solid ${colors.primary}40`,
          }}
          whileHover={{
            background: `${colors.primary}30`,
            scale: 1.1,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-5 h-5 text-white" />
        </motion.button>

        {/* Image Container */}
        <motion.div
          className="relative w-full max-w-2xl aspect-square"
          layout
          transition={{
            layout: { duration: 0.3 },
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                opacity: { duration: 0.25 },
                scale: { type: "spring", stiffness: 140, damping: 28 },
              }}
              className="relative w-full h-full rounded-[32px] overflow-hidden cursor-pointer"
              onClick={handleImageClick}
              style={{
                backgroundColor: "rgba(18, 18, 22, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <Image
                src={images[currentIndex].image}
                alt={`${images[currentIndex].name}`}
                fill
                className="object-cover"
                style={{
                  borderRadius: "32px",
                }}
                sizes="600px"
                priority={currentIndex === initialIndex}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Progress Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-12 left-0 right-0 flex justify-center items-center gap-1.5"
        >
          {images.map((_, index) => (
            <motion.div
              key={index}
              className="h-1 rounded-full cursor-pointer"
              style={{
                width: index === currentIndex ? "32px" : "8px",
                backgroundColor:
                  index === currentIndex ? colors.primary : "rgba(255, 255, 255, 0.25)",
                boxShadow: index === currentIndex ? `0 0 14px ${colors.primary}70` : "none",
                transition: "all 0.3s ease",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsZoomed(false);
              }}
              whileHover={{
                scale: 1.2,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                transition: { duration: 0.05 },
              }}
            />
          ))}
        </motion.div>

        {/* Image Name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-20 left-0 right-0 text-center text-white/60 text-sm font-medium"
        >
          {images[currentIndex].name}
        </motion.p>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `${colors.primary}20`,
                border: `1px solid ${colors.primary}40`,
              }}
              whileHover={{
                background: `${colors.primary}30`,
                scale: 1.1,
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: `${colors.primary}20`,
                border: `1px solid ${colors.primary}40`,
              }}
              whileHover={{
                background: `${colors.primary}30`,
                scale: 1.1,
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};
