"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ANIMATION_CONFIG, triggerTransition } from "@/lib/animations";

// Page transition variants that complement the slide-pocket content animations
const pageTransitionVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.ease,
      // Delay to allow distraction animation to complete
      delay: ANIMATION_CONFIG.transition.distractionDuration,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.transition.exitDuration,
      ease: ANIMATION_CONFIG.ease,
    },
  },
};

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  // Trigger distraction animation on route change
  useEffect(() => {
    if (previousPath.current !== pathname) {
      // Route changed - trigger the coordinated transition
      triggerTransition("navigation");
      previousPath.current = pathname;
    }
  }, [pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
