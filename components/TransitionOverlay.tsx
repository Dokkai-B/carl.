"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { ANIMATION_CONFIG } from "@/lib/animations";

// =============================================
// TRANSITION OVERLAY COMPONENT
// =============================================
// A subtle distraction animation layer that plays between
// content exits and enters, creating smooth, unified navigation

interface TransitionOverlayProps {
  children?: React.ReactNode;
}

// Transition timing configuration
export const TRANSITION_TIMING = {
  // Duration of the distraction effect (200-350ms as specified)
  distraction: 0.28,
  // Delay before new content starts sliding in
  contentDelay: 0.32,
  // How long content takes to exit before distraction starts
  exitDuration: 0.25,
} as const;

// Custom event types for transition coordination
export type TransitionPhase = "idle" | "exiting" | "distraction" | "entering";

export interface TransitionEvent {
  phase: TransitionPhase;
  source: "menu" | "navigation" | "page";
}

/**
 * Dispatches a transition event that other components can listen to
 */
export const dispatchTransitionEvent = (
  phase: TransitionPhase,
  source: TransitionEvent["source"]
) => {
  window.dispatchEvent(
    new CustomEvent("transitionPhase", {
      detail: { phase, source } as TransitionEvent,
    })
  );
};

/**
 * TransitionOverlay Component
 *
 * Renders a subtle visual effect during navigation transitions.
 * The effect includes:
 * - Gentle gradient bloom (brightness shift)
 * - Subtle scale pulse on the background
 * - Soft glass blur sweep
 *
 * This occupies user attention while content exits,
 * making the incoming content animation more readable.
 */
export const TransitionOverlay = ({ children }: TransitionOverlayProps) => {
  const [isActive, setIsActive] = useState(false);
  const [transitionSource, setTransitionSource] = useState<TransitionEvent["source"]>("page");
  const overlayControls = useAnimation();

  // Handle transition trigger
  const triggerDistraction = useCallback(
    async (source: TransitionEvent["source"]) => {
      setTransitionSource(source);
      setIsActive(true);
      dispatchTransitionEvent("distraction", source);

      // Animate the distraction effect
      await overlayControls.start({
        opacity: [0, 1, 1, 0],
        scale: [1, 1.02, 1.02, 1],
        transition: {
          duration: TRANSITION_TIMING.distraction,
          times: [0, 0.3, 0.7, 1],
          ease: "easeInOut",
        },
      });

      setIsActive(false);
      dispatchTransitionEvent("entering", source);
    },
    [overlayControls]
  );

  // Listen for transition triggers
  useEffect(() => {
    const handleTransitionTrigger = (e: CustomEvent<{ source: TransitionEvent["source"] }>) => {
      triggerDistraction(e.detail.source);
    };

    window.addEventListener("triggerTransition", handleTransitionTrigger as EventListener);
    return () => {
      window.removeEventListener("triggerTransition", handleTransitionTrigger as EventListener);
    };
  }, [triggerDistraction]);

  return (
    <>
      {/* Distraction overlay layer */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="fixed inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={overlayControls}
            exit={{ opacity: 0 }}
          >
            {/* Gradient bloom effect */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.15, 0.15, 0],
              }}
              transition={{
                duration: TRANSITION_TIMING.distraction,
                times: [0, 0.3, 0.7, 1],
              }}
              style={{
                background: `radial-gradient(
                  circle at 50% 50%,
                  var(--accent) 0%,
                  transparent 70%
                )`,
              }}
            />

            {/* Subtle brightness/contrast shift */}
            <motion.div
              className="absolute inset-0 mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.08, 0.08, 0],
              }}
              transition={{
                duration: TRANSITION_TIMING.distraction,
                times: [0, 0.3, 0.7, 1],
              }}
              style={{
                background: "white",
              }}
            />

            {/* Soft blur sweep (using backdrop-filter) */}
            <motion.div
              className="absolute inset-0"
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{
                backdropFilter: ["blur(0px)", "blur(2px)", "blur(2px)", "blur(0px)"],
              }}
              transition={{
                duration: TRANSITION_TIMING.distraction,
                times: [0, 0.3, 0.7, 1],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default TransitionOverlay;
