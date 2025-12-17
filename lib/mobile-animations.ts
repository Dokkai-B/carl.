"use client";

import { Variants, Transition } from "framer-motion";
import { ANIMATION_CONFIG } from "./animations";

// =============================================
// MOBILE-OPTIMIZED ANIMATION CONFIGURATIONS
// =============================================

/**
 * Reduced animation config for mobile devices
 * Shorter durations, less stagger, simpler motions
 */
export const MOBILE_ANIMATION_CONFIG = {
  slideDistance: {
    enter: -20, // Halved from desktop
    exit: -15,
  },
  stagger: {
    fast: 0.03,
    normal: 0.04,
    slow: 0.06,
  },
  spring: {
    stiffness: 400, // Faster spring
    damping: 30, // More dampening
  },
  duration: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.4,
  },
} as const;

/**
 * Tablet animation config - middle ground
 */
export const TABLET_ANIMATION_CONFIG = {
  slideDistance: {
    enter: -30,
    exit: -20,
  },
  stagger: {
    fast: 0.04,
    normal: 0.06,
    slow: 0.08,
  },
  spring: {
    stiffness: 350,
    damping: 25,
  },
  duration: {
    fast: 0.25,
    normal: 0.4,
    slow: 0.5,
  },
} as const;

/**
 * Simple fade-in variants for mobile (no slide)
 * Minimal motion, just opacity change
 */
export const mobileFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: MOBILE_ANIMATION_CONFIG.duration.normal,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: MOBILE_ANIMATION_CONFIG.duration.fast,
    },
  },
};

/**
 * Simplified slide variants for mobile
 * Shorter distance, faster duration
 */
export const mobileSlideVariants = (customDelay: number = 0): Variants => ({
  hidden: {
    y: MOBILE_ANIMATION_CONFIG.slideDistance.enter,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: MOBILE_ANIMATION_CONFIG.duration.normal,
      ease: [0.25, 0.1, 0.25, 1],
      delay: customDelay,
    },
  },
  exit: {
    y: MOBILE_ANIMATION_CONFIG.slideDistance.exit,
    opacity: 0,
    transition: {
      duration: MOBILE_ANIMATION_CONFIG.duration.fast,
    },
  },
});

/**
 * Mobile container for staggered children (reduced stagger)
 */
export const mobileContainerVariants = (
  staggerAmount: number = MOBILE_ANIMATION_CONFIG.stagger.normal
): Variants => ({
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmount,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: MOBILE_ANIMATION_CONFIG.stagger.fast,
      staggerDirection: -1,
    },
  },
});

/**
 * Disable animation variants (instant, no motion)
 * Use for heavy backgrounds or complex elements on mobile
 */
export const noAnimationVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: { opacity: 1 },
};

/**
 * Get appropriate animation config based on device tier
 */
export function getAnimationConfig(deviceTier: "mobile" | "tablet" | "desktop" | null) {
  if (deviceTier === "mobile") return MOBILE_ANIMATION_CONFIG;
  if (deviceTier === "tablet") return TABLET_ANIMATION_CONFIG;
  return ANIMATION_CONFIG;
}

/**
 * Get appropriate variants based on device tier
 */
export function getResponsiveVariants(
  deviceTier: "mobile" | "tablet" | "desktop" | null,
  type: "slide" | "fade" | "none" = "slide",
  delay: number = 0
): Variants {
  if (deviceTier === "mobile") {
    if (type === "none") return noAnimationVariants;
    if (type === "fade") return mobileFadeVariants;
    return mobileSlideVariants(delay);
  }

  // Tablet and desktop use standard animations
  if (type === "fade") {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: ANIMATION_CONFIG.duration.normal,
          delay,
        },
      },
      exit: { opacity: 0 },
    };
  }

  // Standard slide for tablet/desktop
  return {
    hidden: {
      y: ANIMATION_CONFIG.slideDistance.enter,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: ANIMATION_CONFIG.spring.stiffness,
        damping: ANIMATION_CONFIG.spring.damping,
        delay,
      },
    },
    exit: {
      y: ANIMATION_CONFIG.slideDistance.exit,
      opacity: 0,
    },
  };
}
