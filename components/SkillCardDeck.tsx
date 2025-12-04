"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import SkillCard from "./SkillCard";
import { LucideIcon } from "lucide-react";

interface Skill {
  icon: LucideIcon;
  title: string;
  description: string;
  keyPoints: string[];
}

interface SkillCardDeckProps {
  skills: Skill[];
  autoplayInterval?: number; // ms between auto-advances
  idleTimeout?: number; // ms to pause after user interaction
}

// Position configs for background cards in the cluster
// These create a loose overlapping spread
const backgroundPositions = [
  { x: -60, y: -40, rotate: -8, scale: 0.92 },
  { x: 80, y: -30, rotate: 6, scale: 0.9 },
  { x: -40, y: 60, rotate: -4, scale: 0.88 },
  { x: 70, y: 50, rotate: 5, scale: 0.86 },
];

// Featured card position (center, larger, no rotation)
const featuredPosition = { x: 0, y: 0, rotate: 0, scale: 1.02 };

export default function SkillCardDeck({
  skills,
  autoplayInterval = 6000,
  idleTimeout = 12000,
}: SkillCardDeckProps) {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Auto-advance to next card
  const advanceToNext = useCallback(() => {
    setFeaturedIndex((prev) => (prev + 1) % skills.length);
  }, [skills.length]);

  // Handle user selecting a card
  const selectCard = useCallback(
    (index: number) => {
      if (index === featuredIndex) return;

      setFeaturedIndex(index);
      setIsPaused(true);

      // Clear existing pause timeout
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }

      // Resume autoplay after idle timeout
      pauseTimeoutRef.current = setTimeout(() => {
        setIsPaused(false);
      }, idleTimeout);
    },
    [featuredIndex, idleTimeout]
  );

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectCard(index);
      }
    },
    [selectCard]
  );

  // Autoplay loop
  useEffect(() => {
    if (prefersReducedMotion || isPaused) {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
      return;
    }

    autoplayRef.current = setTimeout(advanceToNext, autoplayInterval);

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current);
      }
    };
  }, [featuredIndex, isPaused, prefersReducedMotion, autoplayInterval, advanceToNext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, []);

  // Get position for a card based on its index relative to featured
  const getCardPosition = (cardIndex: number) => {
    if (cardIndex === featuredIndex) {
      return featuredPosition;
    }

    // Distribute background cards among available positions
    let bgIndex = 0;
    for (let i = 0; i < skills.length; i++) {
      if (i === featuredIndex) continue;
      if (i === cardIndex) break;
      bgIndex++;
    }

    return backgroundPositions[bgIndex % backgroundPositions.length];
  };

  // Get z-index for layering
  const getZIndex = (cardIndex: number) => {
    if (cardIndex === featuredIndex) return 50;
    // Background cards get lower z-index
    return 10 + cardIndex;
  };

  // Reduced motion: show simple grid
  if (prefersReducedMotion) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {skills.map((skill, index) => (
          <div key={skill.title} className={index === featuredIndex ? "ring-2 ring-primary" : ""}>
            <SkillCard
              icon={skill.icon}
              title={skill.title}
              description={skill.description}
              keyPoints={skill.keyPoints}
              floatDirection="up"
              floatDuration={0}
              delay={0}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative h-[450px] w-[380px]">
      {/* Card indicators */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-60">
        {skills.map((_, index) => (
          <button
            key={index}
            onClick={() => selectCard(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === featuredIndex
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Show ${skills[index].title} card`}
          />
        ))}
      </div>

      {/* Cards */}
      <AnimatePresence mode="sync">
        {skills.map((skill, index) => {
          const position = getCardPosition(index);
          const isFeatured = index === featuredIndex;

          return (
            <motion.div
              key={skill.title}
              initial={false}
              animate={{
                x: position.x,
                y: position.y,
                rotate: position.rotate,
                scale: position.scale,
                opacity: isFeatured ? 1 : 0.7,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
              }}
              style={{
                zIndex: getZIndex(index),
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-110px", // Half of approximate card height
                marginLeft: "-128px", // Half of card width (w-64 = 256px)
              }}
              className={`cursor-pointer ${!isFeatured ? "hover:opacity-90" : ""}`}
              onClick={() => !isFeatured && selectCard(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              tabIndex={0}
              role="button"
              aria-pressed={isFeatured}
              aria-label={`${skill.title}${isFeatured ? " (currently shown)" : " - click to view"}`}
            >
              {/* Dim overlay for background cards */}
              <div
                className={`absolute inset-0 rounded-xl bg-black/20 pointer-events-none transition-opacity duration-300 ${
                  isFeatured ? "opacity-0" : "opacity-100"
                }`}
                style={{ zIndex: 1 }}
              />

              <SkillCard
                icon={skill.icon}
                title={skill.title}
                description={skill.description}
                keyPoints={skill.keyPoints}
                floatDirection={isFeatured ? "up" : "down"}
                floatDuration={isFeatured ? 6 : 0}
                delay={0}
              />

              {/* Featured glow effect */}
              {isFeatured && (
                <div
                  className="absolute -inset-2 rounded-2xl bg-primary/10 blur-xl -z-10 animate-pulse"
                  style={{ animationDuration: "3s" }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
