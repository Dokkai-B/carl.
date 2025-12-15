"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTransition } from "./TransitionContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const links = [
  { name: "Home", path: "/" },
  { name: "About Me", path: "/resume" },
  { name: "Work", path: "/work" },
  { name: "Contacts", path: "/contact" },
];

// Menu overlay background
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn", delay: 0.2 },
  },
};

// Menu container - slides from top pocket
const menuContainerVariants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      delay: 0.1,
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
    transition: {
      duration: 0.3,
      ease: "easeIn",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Menu item - slides vertically from pocket
const menuItemVariants = {
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

export const MenuTransition = () => {
  const { menuOpen, setMenuOpen } = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLinkClick = (path: string) => {
    if (path === pathname) {
      setMenuOpen(false);
      return;
    }

    setIsNavigating(true);
    // Wait for menu exit animation before navigating
    setTimeout(() => {
      setMenuOpen(false);
      router.push(path);
      setIsNavigating(false);
    }, 500); // Total exit duration
  };

  if (!menuOpen) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Background overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          variants={overlayVariants}
          onClick={() => !isNavigating && setMenuOpen(false)}
        />

        {/* Menu content */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-8 p-12"
          variants={menuContainerVariants}
        >
          {/* Logo */}
          <motion.div variants={menuItemVariants} className="mb-8">
            <h1 className="text-4xl font-bold">
              Carl<span className="text-accent">.</span>
            </h1>
          </motion.div>

          {/* Menu items */}
          <nav className="flex flex-col items-center gap-6">
            {links.map((link, index) => (
              <motion.div key={index} variants={menuItemVariants}>
                <button
                  onClick={() => handleLinkClick(link.path)}
                  disabled={isNavigating}
                  className={`text-3xl md:text-4xl font-semibold transition-colors duration-200 ${
                    link.path === pathname
                      ? "text-accent"
                      : "text-white hover:text-accent"
                  } ${isNavigating ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {link.name}
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Close hint */}
          <motion.div variants={menuItemVariants} className="mt-8">
            <p className="text-sm text-white/50">Press ESC or click outside to close</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
