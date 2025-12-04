"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import {
  menuPreset,
  slidePocketChild,
  ANIMATION_CONFIG,
  coordinatedMenuPreset,
  triggerTransition,
} from "@/lib/animations";

const links = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Resume", path: "/resume" },
  { name: "Projects", path: "/work" },
  { name: "Contacts", path: "/contact" },
];

// Animated grid/cross menu button - 3x3 dots like hamburger menu
const MenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 rounded-xl bg-[var(--muted)] hover:bg-[var(--accent)] 
                 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50"
      aria-label="Toggle menu"
    >
      <div className="w-[18px] h-[18px] relative">
        {/* 3x3 grid of dots (9 dots total) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const topPos = row === 0 ? "0%" : row === 1 ? "50%" : "100%";
          const leftPos = col === 0 ? "0%" : col === 1 ? "50%" : "100%";

          return (
            <span
              key={i}
              className={`absolute w-1 h-1 rounded-full bg-current transition-all duration-300
                ${
                  isOpen
                    ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0"
                    : "-translate-x-1/2 -translate-y-1/2"
                }`}
              style={!isOpen ? { top: topPos, left: leftPos } : undefined}
            />
          );
        })}

        {/* Cross lines that appear when open */}
        <span
          className={`absolute top-1/2 left-1/2 w-5 h-0.5 rounded-full bg-current transition-all duration-300
            ${
              isOpen
                ? "-translate-x-1/2 -translate-y-1/2 rotate-45 scale-100"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0 scale-0"
            }`}
        />
        <span
          className={`absolute top-1/2 left-1/2 w-5 h-0.5 rounded-full bg-current transition-all duration-300
            ${
              isOpen
                ? "-translate-x-1/2 -translate-y-1/2 -rotate-45 scale-100"
                : "-translate-x-1/2 -translate-y-1/2 rotate-0 scale-0"
            }`}
        />
      </div>
    </button>
  );
};

// Animated text component - each word drops in using shared animation
const DropInText = ({
  text,
  isActive,
  delay = 0,
  href,
  onClick,
}: {
  text: string;
  isActive: boolean;
  delay?: number;
  href: string;
  onClick: () => void;
}) => {
  return (
    <Link href={href} onClick={onClick} className="block">
      <motion.div
        className={`text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-300 py-1
          ${isActive ? "text-accent" : "text-foreground hover:text-accent"}`}
        variants={coordinatedMenuPreset.item}
        whileHover={{ x: 15 }}
      >
        <span className="inline-flex items-center gap-2">
          {text}
          {/* Active indicator dot */}
          {isActive && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-2 h-2 rounded-full bg-accent"
            />
          )}
        </span>
      </motion.div>
    </Link>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animationReady, setAnimationReady] = useState(false);
  const [menuAnimationReady, setMenuAnimationReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const isNavigatingRef = useRef(false);

  const headerPadding = useTransform(scrollY, [0, 100], ["1.5rem", "0.75rem"]);
  const logoSize = useTransform(scrollY, [0, 100], ["2rem", "1.5rem"]);

  useEffect(() => {
    setMounted(true);

    // Always wait for loader to complete before animating header
    const handleLoaderComplete = () => {
      setAnimationReady(true);
    };
    window.addEventListener("loaderComplete", handleLoaderComplete);

    // Fallback in case loader already completed
    const fallbackTimer = setTimeout(() => {
      setAnimationReady(true);
    }, 5000);

    return () => {
      window.removeEventListener("loaderComplete", handleLoaderComplete);
      clearTimeout(fallbackTimer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false;
    }
    setIsMenuOpen(false);
    setMenuAnimationReady(false);
  }, [pathname]);

  // Prevent body scroll when menu is open and handle coordinated transitions
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      // Dispatch event to hide page content (triggers exit animation)
      window.dispatchEvent(new CustomEvent("menuStateChange", { detail: { isOpen: true } }));

      // After page content exits, trigger distraction and then allow menu animation
      const distractionDelay = ANIMATION_CONFIG.transition.exitDuration * 1000;
      setTimeout(() => {
        triggerTransition("menu");
      }, distractionDelay);

      // After distraction completes, allow menu items to animate in
      const menuReadyDelay =
        (ANIMATION_CONFIG.transition.exitDuration +
          ANIMATION_CONFIG.transition.distractionDuration) *
        1000;
      setTimeout(() => {
        setMenuAnimationReady(true);
      }, menuReadyDelay);
    } else {
      document.body.style.overflow = "unset";
      setMenuAnimationReady(false);
      // Dispatch event to show page content
      window.dispatchEvent(new CustomEvent("menuStateChange", { detail: { isOpen: false } }));
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Handle navigation from menu with coordinated transition
  const handleNavigation = (href: string) => {
    if (href === pathname) {
      // Same page - just close menu
      setIsMenuOpen(false);
      return;
    }

    isNavigatingRef.current = true;
    setIsMenuOpen(false);

    // Navigation will happen via the Link component
    // The page change will trigger the coordinated transition
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled && !isMenuOpen ? "glass-strong border-b border-border/50" : "bg-transparent"
        }`}
        style={{ paddingTop: headerPadding, paddingBottom: headerPadding }}
      >
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
          <Link href="/" className="z-50">
            <motion.h1
              className="font-bold"
              style={{ fontSize: logoSize }}
              initial={mounted ? { opacity: 0, y: -8 } : false}
              animate={animationReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.span
                className={`transition-colors duration-300 ${
                  isMenuOpen ? "text-foreground" : "gradient-text"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Carl
              </motion.span>
              <span className="text-accent">.</span>
            </motion.h1>
          </Link>

          {/* Right side controls */}
          <motion.div
            className="flex items-center gap-3 z-50"
            initial={mounted ? { opacity: 0, y: -8 } : false}
            animate={animationReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ThemeToggle />
            <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
          </motion.div>
        </div>
      </motion.header>

      {/* Fullscreen Navigation Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-[var(--background)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-accent/5 blur-3xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              />
              <motion.div
                className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-accent/5 blur-3xl"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </div>

            {/* Navigation Content - centered container, left-aligned text */}
            <nav className="relative h-full flex flex-col items-center justify-center">
              <motion.div
                className="space-y-2 md:space-y-3 text-left"
                variants={coordinatedMenuPreset.container}
                initial="hidden"
                animate={menuAnimationReady ? "visible" : "hidden"}
                exit="exit"
              >
                {links.map((link, index) => (
                  <DropInText
                    key={link.path}
                    text={link.name}
                    href={link.path}
                    isActive={link.path === pathname}
                    delay={0}
                    onClick={() => handleNavigation(link.path)}
                  />
                ))}
              </motion.div>

              {/* Bottom section */}
              <motion.div
                className="absolute bottom-8 left-8 right-8"
                variants={slidePocketChild}
                initial="hidden"
                animate={menuAnimationReady ? "visible" : "hidden"}
                exit="exit"
              >
                <div className="flex flex-col items-center gap-4 pt-8 border-t border-border/30">
                  <p className="text-muted-foreground text-sm">Available for freelance work</p>
                  <Link
                    href="/contact"
                    onClick={() => handleNavigation("/contact")}
                    className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors"
                  >
                    <span className="text-sm font-medium">Let's work together</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
