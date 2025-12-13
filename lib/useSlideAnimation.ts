"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Variants, AnimationControls, useAnimation } from "framer-motion";
import {
  ANIMATION_CONFIG,
  slidePocketContainer,
  slidePocketChild,
  textLinesContainer,
  textLine,
  getStaggerDelay,
  TransitionPhase,
  TransitionSource,
  coordinatedContainer,
  triggerTransition,
} from "./animations";

// =============================================
// HOOK: useSlideAnimation
// =============================================
// A convenience hook for managing slide pocket animations
// with loader-aware timing

interface UseSlideAnimationOptions {
  /** Whether to wait for the loader to complete on initial load */
  waitForLoader?: boolean;
  /** Custom delay before animation starts */
  delay?: number;
  /** Stagger amount between children */
  stagger?: number;
}

interface UseSlideAnimationReturn {
  /** Whether animation should be triggered */
  isReady: boolean;
  /** Animation controls for manual control */
  controls: AnimationControls;
  /** Container variants for parent element */
  containerVariants: Variants;
  /** Child variants for animated children */
  childVariants: Variants;
  /** Trigger enter animation */
  animateIn: () => Promise<void>;
  /** Trigger exit animation */
  animateOut: () => Promise<void>;
}

/**
 * Hook for managing slide pocket animations with loader awareness
 *
 * @example
 * ```tsx
 * const { isReady, containerVariants, childVariants } = useSlideAnimation();
 *
 * return (
 *   <motion.div
 *     variants={containerVariants}
 *     initial="hidden"
 *     animate={isReady ? "visible" : "hidden"}
 *   >
 *     <motion.h1 variants={childVariants}>Line 1</motion.h1>
 *     <motion.h2 variants={childVariants}>Line 2</motion.h2>
 *   </motion.div>
 * );
 * ```
 */
export function useSlideAnimation(options: UseSlideAnimationOptions = {}): UseSlideAnimationReturn {
  const { waitForLoader = true, delay = 0, stagger = ANIMATION_CONFIG.stagger.normal } = options;

  const [isReady, setIsReady] = useState(false);
  const controls = useAnimation();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      controls.stop();
    };
  }, [controls]);

  useEffect(() => {
    // Check if this is initial load or navigation
    const isInitialLoad = !sessionStorage.getItem("hasVisited");

    if (waitForLoader && isInitialLoad) {
      // Wait for loader to complete before animating
      const handleLoaderComplete = () => {
        setTimeout(() => setIsReady(true), delay * 1000);
      };

      window.addEventListener("loaderComplete", handleLoaderComplete);

      // Also check if loader already completed
      if (document.readyState === "complete") {
        // Give a small delay in case the loader event was already fired
        const timeout = setTimeout(() => {
          setIsReady(true);
        }, 100);

        return () => {
          clearTimeout(timeout);
          window.removeEventListener("loaderComplete", handleLoaderComplete);
        };
      }

      return () => window.removeEventListener("loaderComplete", handleLoaderComplete);
    } else {
      // Navigation from another page - animate immediately (with optional delay)
      const timeout = setTimeout(() => setIsReady(true), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [waitForLoader, delay]);

  const animateIn = useCallback(async () => {
    if (isMountedRef.current) {
      await controls.start("visible");
    }
  }, [controls]);

  const animateOut = useCallback(async () => {
    if (isMountedRef.current) {
      await controls.start("exit");
    }
  }, [controls]);

  return {
    isReady,
    controls,
    containerVariants: slidePocketContainer(stagger, delay),
    childVariants: slidePocketChild,
    animateIn,
    animateOut,
  };
}

// =============================================
// HOOK: useTextLineAnimation
// =============================================
// Specifically for multi-line text blocks

interface UseTextLineAnimationOptions {
  /** Whether to wait for the loader to complete on initial load */
  waitForLoader?: boolean;
  /** Custom delay before animation starts */
  delay?: number;
  /** Stagger amount between lines */
  stagger?: number;
}

/**
 * Hook for animating multi-line text blocks
 * Each line drops in sequentially from above
 *
 * @example
 * ```tsx
 * const { isReady, containerVariants, lineVariants } = useTextLineAnimation();
 *
 * return (
 *   <motion.div
 *     variants={containerVariants}
 *     initial="hidden"
 *     animate={isReady ? "visible" : "hidden"}
 *   >
 *     <motion.span variants={lineVariants}>Hey, I'm</motion.span>
 *     <motion.span variants={lineVariants}>Carl Patrick</motion.span>
 *   </motion.div>
 * );
 * ```
 */
export function useTextLineAnimation(options: UseTextLineAnimationOptions = {}) {
  const { waitForLoader = true, delay = 0, stagger = ANIMATION_CONFIG.stagger.normal } = options;

  const [isReady, setIsReady] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const isInitialLoad = !sessionStorage.getItem("hasVisited");

    if (waitForLoader && isInitialLoad) {
      const handleLoaderComplete = () => {
        setTimeout(() => setIsReady(true), delay * 1000);
      };

      window.addEventListener("loaderComplete", handleLoaderComplete);
      return () => window.removeEventListener("loaderComplete", handleLoaderComplete);
    } else {
      const timeout = setTimeout(() => setIsReady(true), delay * 1000);
      return () => clearTimeout(timeout);
    }
  }, [waitForLoader, delay]);

  return {
    isReady,
    controls,
    containerVariants: textLinesContainer(stagger),
    lineVariants: textLine,
  };
}

// =============================================
// HOOK: useLoaderTextAnimation
// =============================================
// For loader text with enter/exit pocket animation

interface UseLoaderTextAnimationReturn {
  /** Current animation state: 'entering' | 'idle' | 'exiting' | 'done' */
  state: "entering" | "idle" | "exiting" | "done";
  /** Animation controls */
  controls: AnimationControls;
  /** Trigger exit animation (call when loading is complete) */
  triggerExit: () => Promise<void>;
}

/**
 * Hook for loader text animation
 * Handles the enter (slide down), idle, and exit (slide up) states
 *
 * @example
 * ```tsx
 * const { state, controls, triggerExit } = useLoaderTextAnimation();
 *
 * useEffect(() => {
 *   if (loadingComplete) triggerExit();
 * }, [loadingComplete]);
 *
 * return (
 *   <motion.p
 *     initial={{ y: -40, opacity: 0 }}
 *     animate={controls}
 *   >
 *     Loading...
 *   </motion.p>
 * );
 * ```
 */
export function useLoaderTextAnimation(): UseLoaderTextAnimationReturn {
  const [state, setState] = useState<"entering" | "idle" | "exiting" | "done">("entering");
  const controls = useAnimation();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      controls.stop();
    };
  }, [controls]);

  useEffect(() => {
    // Animate in on mount
    const animateIn = async () => {
      if (isMountedRef.current) {
        await controls.start({
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: ANIMATION_CONFIG.spring.stiffness,
          damping: ANIMATION_CONFIG.spring.damping,
          delay: 0.3,
        },
      });
      setState("idle");
    };

    animateIn();
  }, [controls]);

  const triggerExit = useCallback(async () => {
    if (isMountedRef.current) {
      setState("exiting");
      await controls.start({
        y: ANIMATION_CONFIG.slideDistance.exit,
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: ANIMATION_CONFIG.spring.stiffness,
          damping: ANIMATION_CONFIG.spring.damping,
        },
      });
      setState("done");
    }
  }, [controls]);

  return {
    state,
    controls,
    triggerExit,
  };
}

// =============================================
// HOOK: useCoordinatedTransition
// =============================================
// For unified page/menu transitions with distraction animation

interface UseCoordinatedTransitionOptions {
  /** Whether to wait for loader on initial load */
  waitForLoader?: boolean;
  /** Stagger amount for children */
  stagger?: number;
  /** Whether this component responds to menu state */
  respondToMenu?: boolean;
}

interface UseCoordinatedTransitionReturn {
  /** Current transition phase */
  phase: TransitionPhase;
  /** Animation controls */
  controls: AnimationControls;
  /** Container variants with coordinated timing */
  containerVariants: Variants;
  /** Child variants */
  childVariants: Variants;
  /** Trigger a coordinated exit (will dispatch distraction event) */
  triggerCoordinatedExit: (source?: TransitionSource) => Promise<void>;
  /** Whether content should be visible */
  isVisible: boolean;
  /** Whether menu is currently open */
  isMenuOpen: boolean;
}

/**
 * Hook for managing coordinated transitions with distraction animation
 *
 * Flow:
 * 1. Content exits (slides up with stagger)
 * 2. After exit completes, dispatches triggerTransition event
 * 3. TransitionOverlay plays distraction animation
 * 4. After distraction, new content enters (slides down with stagger)
 *
 * @example
 * ```tsx
 * const { controls, containerVariants, childVariants, isMenuOpen } = useCoordinatedTransition();
 *
 * return (
 *   <motion.div
 *     variants={containerVariants}
 *     initial="hidden"
 *     animate={controls}
 *   >
 *     <motion.div variants={childVariants}>Content</motion.div>
 *   </motion.div>
 * );
 * ```
 */
export function useCoordinatedTransition(
  options: UseCoordinatedTransitionOptions = {}
): UseCoordinatedTransitionReturn {
  const {
    waitForLoader = true,
    stagger = ANIMATION_CONFIG.stagger.normal,
    respondToMenu = true,
  } = options;

  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const controls = useAnimation();
  const isExitingRef = useRef(false);
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      controls.stop();
    };
  }, [controls]);

  // Wait for loader to complete
  useEffect(() => {
    const handleLoaderComplete = () => {
      setLoaderComplete(true);
    };

    window.addEventListener("loaderComplete", handleLoaderComplete);

    // Fallback timeout
    const fallbackTimer = setTimeout(() => {
      if (!loaderComplete) {
        setLoaderComplete(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("loaderComplete", handleLoaderComplete);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Handle menu state changes
  useEffect(() => {
    if (!respondToMenu) return;

    const handleMenuState = async (e: CustomEvent<{ isOpen: boolean }>) => {
      const { isOpen } = e.detail;
      setIsMenuOpen(isOpen);

      if (isOpen) {
        // Menu opening - exit content with coordinated transition
        isExitingRef.current = true;
        setPhase("exiting");
        if (isMountedRef.current) {
          await controls.start("exit");
        }

        // Trigger distraction animation after exit completes
        triggerTransition("menu");
        setPhase("distraction");
        setIsVisible(false);
      } else {
        // Menu closing - wait for distraction, then enter
        // The distraction is triggered by the menu close
        triggerTransition("menu");

        // Listen for entering phase
        const handleEntering = (e: CustomEvent<{ phase: TransitionPhase }>) => {
          if (e.detail.phase === "entering") {
            setPhase("entering");
            isExitingRef.current = false;

            // Delay content entry to sync with distraction end
            setTimeout(async () => {
              if (isMountedRef.current) {
                await controls.start("visible");
                setIsVisible(true);
                setPhase("idle");
              }
            }, ANIMATION_CONFIG.transition.enterDelay * 1000);

            window.removeEventListener("transitionPhase", handleEntering as EventListener);
          }
        };

        window.addEventListener("transitionPhase", handleEntering as EventListener);
      }
    };

    window.addEventListener("menuStateChange", handleMenuState as EventListener);
    return () => window.removeEventListener("menuStateChange", handleMenuState as EventListener);
  }, [respondToMenu, controls]);

  // Initial animation after loader
  useEffect(() => {
    if (loaderComplete && !isMenuOpen && !isExitingRef.current && isMountedRef.current) {
      setPhase("entering");
      controls.start("visible").then(() => {
        if (isMountedRef.current) {
          setIsVisible(true);
          setPhase("idle");
        }
      });
    }
  }, [loaderComplete, isMenuOpen, controls]);

  // Coordinated exit function
  const triggerCoordinatedExit = useCallback(
    async (source: TransitionSource = "page") => {
      if (isMountedRef.current) {
        isExitingRef.current = true;
        setPhase("exiting");
        await controls.start("exit");

        // Trigger distraction animation
        triggerTransition(source);
        setPhase("distraction");
        setIsVisible(false);
      }
    },
    [controls]
  );

  return {
    phase,
    controls,
    containerVariants: coordinatedContainer(stagger),
    childVariants: slidePocketChild,
    triggerCoordinatedExit,
    isVisible,
    isMenuOpen,
  };
}

export default useSlideAnimation;
