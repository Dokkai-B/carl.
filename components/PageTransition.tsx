"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTransition } from "./TransitionContext";
import { useEffect } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

// Container variant with staggered children
const containerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms stagger
      delayChildren: 0.1, // 100ms delay after mount
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      duration: 0.3,
    },
  },
};

// Item variant for child elements
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const pathname = usePathname();
  const { menuOpen, setMenuOpen, startTransition, endTransition } = useTransition();

  // Close menu when pathname changes
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [pathname]);

  // Don't render page content when menu is open
  if (menuOpen) {
    return null;
  }

  return (
    <motion.div
      key={pathname}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      onAnimationStart={() => startTransition()}
      onAnimationComplete={() => endTransition()}
      style={{ width: "100%", minHeight: "100vh" }}
    >
      <motion.div variants={itemVariants}>{children}</motion.div>
    </motion.div>
  );
};

export default PageTransition;
