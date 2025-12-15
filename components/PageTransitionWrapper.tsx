"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface PageTransitionWrapperProps {
  children: ReactNode;
}

export const PageTransitionWrapper = ({ children }: PageTransitionWrapperProps) => {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered children container
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.06 
}: { 
  children: ReactNode; 
  staggerDelay?: number;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        exit: {
          transition: {
            staggerChildren: staggerDelay,
            staggerDirection: -1,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered item
export const StaggerItem = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
            type: "spring",
            stiffness: 100,
            damping: 20,
          }
        },
        exit: { 
          opacity: 0, 
          y: -16,
          transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
          }
        },
      }}
    >
      {children}
    </motion.div>
  );
};
