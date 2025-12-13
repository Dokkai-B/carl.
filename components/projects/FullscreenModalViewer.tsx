"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
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
  const [showZoomHint, setShowZoomHint] = useState(true);

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
    setShowZoomHint(false);
  };

  // Hide zoom hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowZoomHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) goNext();
    if (isRightSwipe) goPrev();

    setTouchStart(0);
    setTouchEnd(0);
  };

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
          background: isDark
            ? "linear-gradient(to bottom, rgba(0, 0, 0, 0.95), rgba(0, 0, 0, 0.9))"
            : "linear-gradient(to bottom, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.75))",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
        onClick={onClose}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Cleaner design */}
        <motion.button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-8 md:right-8 z-20 w-11 h-11 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            backdropFilter: "blur(8px)",
          }}
          whileHover={{
            background: "rgba(255, 255, 255, 0.15)",
            scale: 1.08,
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close viewer"
        >
          <X className="w-5 h-5 text-white" strokeWidth={2} />
        </motion.button>

        {/* Image Container */}
        <motion.div
          className="relative w-full max-w-5xl"
          style={{
            aspectRatio: "16/9",
          }}
          layout
          transition={{
            layout: { duration: 0.3 },
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="relative w-full h-full rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer group"
              onClick={handleImageClick}
              style={{
                backgroundColor: "rgba(18, 18, 22, 0.4)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px ${colors.primary}15`,
              }}
            >
              <Image
                src={images[currentIndex].image}
                alt={images[currentIndex].name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 1280px"
                priority={currentIndex === initialIndex}
                quality={95}
              />

              {/* Click to Zoom Hint */}
              <AnimatePresence>
                {showZoomHint && !isZoomed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full flex items-center gap-2"
                    style={{
                      background: "rgba(0, 0, 0, 0.7)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <ZoomIn className="w-4 h-4 text-white/80" />
                    <span className="text-sm text-white/80 font-medium">Click to zoom</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Zoom overlay when zoomed */}
              <AnimatePresence>
                {isZoomed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center"
                    onClick={handleImageClick}
                  >
                    <Image
                      src={images[currentIndex].image}
                      alt={images[currentIndex].name}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      quality={100}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Pagination Dots - Animated horizontal lines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-8 md:mt-12 flex justify-center items-center gap-2"
        >
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsZoomed(false);
              }}
              className="rounded-full cursor-pointer"
              style={{
                height: "3px",
                backgroundColor:
                  index === currentIndex
                    ? colors.primary
                    : "rgba(255, 255, 255, 0.2)",
                boxShadow:
                  index === currentIndex
                    ? `0 0 20px ${colors.primary}80, 0 0 40px ${colors.primary}40`
                    : "none",
              }}
              initial={false}
              animate={{
                width: index === currentIndex ? "40px" : "8px",
                opacity: index === currentIndex ? 1 : 0.4,
              }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{
                opacity: 1,
                backgroundColor:
                  index === currentIndex
                    ? colors.primary
                    : "rgba(255, 255, 255, 0.5)",
                scale: 1.1,
              }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </motion.div>

        {/* Image Name - Below pagination */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 text-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={currentIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-white/70 text-sm md:text-base font-medium tracking-wide"
            >
              {images[currentIndex].name}
            </motion.p>
          </AnimatePresence>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/40 text-xs mt-1"
          >
            {currentIndex + 1} / {images.length}
          </motion.p>
        </motion.div>

        {/* Navigation Arrows - Clean circular buttons */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              whileHover={{
                background: `${colors.primary}25`,
                borderColor: `${colors.primary}40`,
                scale: 1.08,
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
            </motion.button>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
              whileHover={{
                background: `${colors.primary}25`,
                borderColor: `${colors.primary}40`,
                scale: 1.08,
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2} />
            </motion.button>
          </>
        )}

        {/* Keyboard hints - subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-6 text-white/30 text-xs"
        >
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">←</kbd>
            <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">→</kbd>
            <span>Navigate</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10">ESC</kbd>
            <span>Close</span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
