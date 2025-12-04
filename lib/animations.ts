"use client";

import { Variants, Transition, TargetAndTransition } from "framer-motion";

// =============================================
// CORE ANIMATION CONFIGURATION
// =============================================
// These values match the menu animation feel - modern, minimal, smooth
// Adjust these to fine-tune the animation behavior globally

export const ANIMATION_CONFIG = {
  // Distance elements travel (in pixels)
  slideDistance: {
    enter: -40, // How far above the final position elements start
    exit: -30, // How far up elements travel when exiting
  },

  // Timing
  stagger: {
    fast: 0.06, // Quick stagger for menu items
    normal: 0.08, // Standard stagger for page content
    slow: 0.12, // Slower stagger for dramatic effect
  },

  // Spring physics for smooth, non-bouncy motion
  spring: {
    stiffness: 300,
    damping: 20,
  },

  // Easing for non-spring animations
  ease: [0.25, 0.1, 0.25, 1] as const, // Smooth ease-out-quad

  // Duration for fade-based animations
  duration: {
    fast: 0.3,
    normal: 0.5,
    slow: 0.7,
  },

  // Transition timing (for coordinated page/menu transitions)
  transition: {
    exitDuration: 0.25, // How long content takes to exit
    distractionDuration: 0.28, // Duration of distraction effect (200-350ms)
    distractionDelay: 0.15, // Delay before distraction starts after exit begins
    enterDelay: 0.32, // Delay before new content enters (after distraction)
  },
} as const;

// =============================================
// SLIDE POCKET VARIANTS
// =============================================
// The core "pocket" animation - elements slide down from above when entering,
// slide back up when exiting, as if hiding "back in their pocket"

/**
 * Creates staggered slide-from-pocket animation variants
 * Use with framer-motion's variants prop on container and children
 *
 * @param customDelay - Additional delay before animation starts
 * @param distance - Override the default slide distance
 */
export const slidePocketVariants = (
  customDelay: number = 0,
  distance: number = ANIMATION_CONFIG.slideDistance.enter
): Variants => ({
  hidden: {
    y: distance,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: ANIMATION_CONFIG.spring.stiffness,
      damping: ANIMATION_CONFIG.spring.damping,
      delay: customDelay,
    },
  },
  exit: {
    y: ANIMATION_CONFIG.slideDistance.exit,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: ANIMATION_CONFIG.spring.stiffness,
      damping: ANIMATION_CONFIG.spring.damping,
    },
  },
});

/**
 * Container variants for staggered children animations
 * Apply to parent element, children should use slidePocketChild
 *
 * @param staggerAmount - Delay between each child animation
 * @param delayChildren - Initial delay before children start animating
 */
export const slidePocketContainer = (
  staggerAmount: number = ANIMATION_CONFIG.stagger.normal,
  delayChildren: number = 0
): Variants => ({
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmount,
      delayChildren: delayChildren,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmount * 0.6, // Exit faster than enter
      staggerDirection: -1, // Reverse order on exit (last in, first out)
    },
  },
});

/**
 * Child variants for use within slidePocketContainer
 * Each child will animate in sequence based on container stagger
 */
export const slidePocketChild: Variants = {
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
    },
  },
  exit: {
    y: ANIMATION_CONFIG.slideDistance.exit,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: ANIMATION_CONFIG.spring.stiffness,
      damping: ANIMATION_CONFIG.spring.damping,
    },
  },
};

// =============================================
// PAGE TRANSITION VARIANTS
// =============================================
// Specifically designed for page-level transitions

/**
 * Page container that orchestrates staggered content animation
 */
export const pageContainer: Variants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.normal,
      delayChildren: 0.1, // Small delay for page to settle
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.fast,
      staggerDirection: -1,
      when: "afterChildren",
    },
  },
};

/**
 * Page element that slides down on enter, up on exit
 * Use for headers, hero sections, key content blocks
 */
export const pageElement: Variants = {
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
    },
  },
  exit: {
    y: ANIMATION_CONFIG.slideDistance.exit,
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.ease,
    },
  },
};

// =============================================
// LINE-BY-LINE TEXT VARIANTS
// =============================================
// For multi-line headings and text blocks

/**
 * Container for line-by-line text animation
 * Each line drops in sequentially
 *
 * @param staggerAmount - Delay between lines
 */
export const textLinesContainer = (
  staggerAmount: number = ANIMATION_CONFIG.stagger.normal
): Variants => ({
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmount,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmount * 0.5,
      staggerDirection: -1,
    },
  },
});

/**
 * Individual line variant
 * Slides down from pocket on enter, back up on exit
 */
export const textLine: Variants = {
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
    },
  },
  exit: {
    y: ANIMATION_CONFIG.slideDistance.exit,
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.ease,
    },
  },
};

// =============================================
// LOADER TEXT VARIANTS
// =============================================
// Specific animations for the page loader text

/**
 * Loader text entrance - slides down from above
 */
export const loaderTextEnter: Variants = {
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
      delay: 0.3, // Slight delay after icon appears
    },
  },
};

/**
 * Loader text exit - slides back up into pocket
 */
export const loaderTextExit: TargetAndTransition = {
  y: ANIMATION_CONFIG.slideDistance.exit,
  opacity: 0,
  transition: {
    type: "spring",
    stiffness: ANIMATION_CONFIG.spring.stiffness,
    damping: ANIMATION_CONFIG.spring.damping,
  },
};

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Creates a custom delay for individual items in a stagger sequence
 * Useful when you need to manually calculate delays
 *
 * @param index - Item index in the list
 * @param baseDelay - Initial delay before sequence starts
 * @param staggerAmount - Delay between items
 */
export const getStaggerDelay = (
  index: number,
  baseDelay: number = 0,
  staggerAmount: number = ANIMATION_CONFIG.stagger.normal
): number => {
  return baseDelay + index * staggerAmount;
};

/**
 * Creates variants with custom index-based delay
 * Use when you need more control over individual item timing
 *
 * @param index - Item index for delay calculation
 * @param baseDelay - Initial delay before animation starts
 */
export const slidePocketWithIndex = (index: number, baseDelay: number = 0): Variants => ({
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
      delay: getStaggerDelay(index, baseDelay),
    },
  },
  exit: {
    y: ANIMATION_CONFIG.slideDistance.exit,
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: ANIMATION_CONFIG.spring.stiffness,
      damping: ANIMATION_CONFIG.spring.damping,
    },
  },
});

// =============================================
// PRESETS FOR COMMON USE CASES
// =============================================

/**
 * Ready-to-use preset for hero sections
 * Container + children pattern
 */
export const heroPreset = {
  container: slidePocketContainer(ANIMATION_CONFIG.stagger.normal, 0.1),
  item: slidePocketChild,
};

/**
 * Ready-to-use preset for menu/nav items
 * Matches the original menu animation feel
 */
export const menuPreset = {
  container: slidePocketContainer(ANIMATION_CONFIG.stagger.fast, 0.1),
  item: {
    hidden: {
      y: -80,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: ANIMATION_CONFIG.spring.stiffness,
        damping: ANIMATION_CONFIG.spring.damping,
      },
    },
    exit: {
      y: -40,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: ANIMATION_CONFIG.spring.stiffness,
        damping: ANIMATION_CONFIG.spring.damping,
      },
    },
  } as Variants,
};

/**
 * Ready-to-use preset for card grids
 * Slightly slower stagger for visual impact
 */
export const cardGridPreset = {
  container: slidePocketContainer(ANIMATION_CONFIG.stagger.slow, 0.2),
  item: slidePocketChild,
};

/**
 * Ready-to-use preset for page headers/titles
 * Line-by-line text animation
 */
export const headerPreset = {
  container: textLinesContainer(ANIMATION_CONFIG.stagger.normal),
  line: textLine,
};

// =============================================
// COORDINATED TRANSITION SYSTEM
// =============================================
// For unified page/menu transitions with distraction animation

export type TransitionPhase = "idle" | "exiting" | "distraction" | "entering";
export type TransitionSource = "menu" | "navigation" | "page";

/**
 * Triggers a coordinated transition sequence
 * 1. Content exits (slides up)
 * 2. Distraction animation plays
 * 3. New content enters (slides down)
 *
 * @param source - What triggered the transition
 */
export const triggerTransition = (source: TransitionSource = "page") => {
  window.dispatchEvent(
    new CustomEvent("triggerTransition", {
      detail: { source },
    })
  );
};

/**
 * Dispatches a transition phase event for coordination
 */
export const dispatchTransitionPhase = (phase: TransitionPhase, source: TransitionSource) => {
  window.dispatchEvent(
    new CustomEvent("transitionPhase", {
      detail: { phase, source },
    })
  );
};

/**
 * Coordinated exit variants - faster exit for smooth transition
 * Use when content needs to exit before distraction animation
 */
export const coordinatedExit: Variants = {
  visible: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: ANIMATION_CONFIG.slideDistance.exit,
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.transition.exitDuration,
      ease: ANIMATION_CONFIG.ease,
    },
  },
};

/**
 * Coordinated enter variants - delayed entry after distraction
 * Use when content needs to wait for distraction animation
 */
export const coordinatedEnter = (
  delay: number = ANIMATION_CONFIG.transition.enterDelay
): Variants => ({
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
});

/**
 * Container for coordinated staggered content
 * Includes proper delays for distraction animation sequence
 */
export const coordinatedContainer = (
  staggerAmount: number = ANIMATION_CONFIG.stagger.normal,
  enterDelay: number = ANIMATION_CONFIG.transition.enterDelay
): Variants => ({
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerAmount,
      delayChildren: enterDelay,
    },
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.fast,
      staggerDirection: -1,
    },
  },
});

/**
 * Ready-to-use preset for coordinated page transitions
 */
export const coordinatedPagePreset = {
  container: coordinatedContainer(ANIMATION_CONFIG.stagger.normal),
  item: slidePocketChild,
};

/**
 * Ready-to-use preset for menu with distraction-aware timing
 */
export const coordinatedMenuPreset = {
  container: coordinatedContainer(
    ANIMATION_CONFIG.stagger.fast,
    ANIMATION_CONFIG.transition.enterDelay
  ),
  item: {
    hidden: {
      y: -80,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: ANIMATION_CONFIG.spring.stiffness,
        damping: ANIMATION_CONFIG.spring.damping,
      },
    },
    exit: {
      y: -40,
      opacity: 0,
      transition: {
        duration: ANIMATION_CONFIG.transition.exitDuration,
        ease: ANIMATION_CONFIG.ease,
      },
    },
  } as Variants,
};
