"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FaUser, FaBriefcase, FaGraduationCap, FaCode } from "react-icons/fa";
import { Menu } from "lucide-react";
import { useHasHover } from "@/lib/device-detect";

const sections = [
  { id: "about", label: "About", icon: FaUser },
  { id: "experience", label: "Experience", icon: FaBriefcase },
  { id: "education", label: "Education", icon: FaGraduationCap },
  { id: "skills", label: "Skills", icon: FaCode },
];

export default function ResumeFAB() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasHover = useHasHover();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only show on resume page
  if (pathname !== "/resume") return null;

  const isDark = !mounted || resolvedTheme === "dark";

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setShowMenu(false);
  };

  return (
    <>
      {/* FAB Button - Glassmorphic Design */}
      <motion.button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden group"
        whileTap={{ scale: 0.95 }}
        whileHover={hasHover ? { scale: 1.05 } : {}}
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          zIndex: 10000,
        }}
      >
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(66, 129, 164, 0.25) 0%, rgba(37, 99, 235, 0.25) 100%)"
              : "linear-gradient(135deg, rgba(255, 112, 166, 0.25) 0%, rgba(236, 72, 153, 0.25) 100%)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />

        {/* Border gradient */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            padding: "2px",
            background: isDark
              ? "linear-gradient(135deg, rgba(66, 129, 164, 0.5), rgba(37, 99, 235, 0.5))"
              : "linear-gradient(135deg, rgba(255, 112, 166, 0.5), rgba(236, 72, 153, 0.5))",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            boxShadow: isDark
              ? "0 0 30px rgba(66, 129, 164, 0.6), 0 0 60px rgba(37, 99, 235, 0.4)"
              : "0 0 30px rgba(255, 112, 166, 0.6), 0 0 60px rgba(236, 72, 153, 0.4)",
          }}
        />

        {/* Icon */}
        <motion.div
          className="relative z-10"
          animate={{ rotate: showMenu ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {showMenu ? (
            <span
              className="text-2xl font-light"
              style={{
                color: isDark ? "rgba(66, 129, 164, 1)" : "rgba(255, 112, 166, 1)",
              }}
            >
              ×
            </span>
          ) : (
            <Menu
              className="w-6 h-6"
              style={{
                color: isDark ? "rgba(66, 129, 164, 1)" : "rgba(255, 112, 166, 1)",
              }}
            />
          )}
        </motion.div>
      </motion.button>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              className="xl:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 9998,
              }}
            />

            {/* Side Menu - Glassmorphic */}
            <motion.div
              className="xl:hidden flex flex-col items-center justify-center gap-6 py-8"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                bottom: 0,
                width: "90px",
                zIndex: 9999,
                background: isDark
                  ? "linear-gradient(to left, rgba(10, 15, 20, 0.98) 0%, rgba(10, 15, 20, 0.95) 100%)"
                  : "linear-gradient(to left, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                borderLeft: `1px solid ${isDark ? "rgba(66, 129, 164, 0.2)" : "rgba(255, 112, 166, 0.2)"}`,
                boxShadow: isDark
                  ? "-8px 0 32px rgba(0, 0, 0, 0.5)"
                  : "-8px 0 32px rgba(0, 0, 0, 0.1)",
              }}
            >
              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => handleClick(section.id)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 rounded-xl flex items-center justify-center relative group"
                    style={{
                      background: isDark
                        ? "linear-gradient(135deg, rgba(66, 129, 164, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)"
                        : "linear-gradient(135deg, rgba(255, 112, 166, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)",
                      border: `1px solid ${isDark ? "rgba(66, 129, 164, 0.3)" : "rgba(255, 112, 166, 0.3)"}`,
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{
                        color: isDark ? "rgba(66, 129, 164, 0.9)" : "rgba(255, 112, 166, 0.9)",
                      }}
                    />

                    {/* Tooltip */}
                    <motion.span
                      initial={{ opacity: 0, x: 10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="absolute right-full mr-4 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap pointer-events-none"
                      style={{
                        background: isDark
                          ? "linear-gradient(135deg, rgba(20, 30, 40, 0.98) 0%, rgba(10, 15, 20, 0.98) 100%)"
                          : "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)",
                        border: `1px solid ${isDark ? "rgba(66, 129, 164, 0.3)" : "rgba(255, 112, 166, 0.3)"}`,
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: isDark
                          ? "0 8px 24px rgba(0, 0, 0, 0.4)"
                          : "0 8px 24px rgba(0, 0, 0, 0.1)",
                        color: isDark ? "rgba(66, 129, 164, 1)" : "rgba(255, 112, 166, 1)",
                      }}
                    >
                      {section.label}
                    </motion.span>
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
