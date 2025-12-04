"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LucideIcon, X, Globe, Smartphone, Monitor, Layers, Shield } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

// Skill data with all content
const skillsData = [
  {
    id: "web",
    icon: Globe,
    title: "Web Development",
    description:
      "Building fast, modern websites using React and Next.js. Clean interfaces, strong accessibility, and solid performance.",
    bullets: ["Responsive UI", "Modern tooling", "Performance focused"],
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile Development",
    description:
      "Cross platform mobile apps with React Native. Smooth user experience and native device features.",
    bullets: ["iOS and Android", "Modern navigation", "Optimized performance"],
  },
  {
    id: "desktop",
    icon: Monitor,
    title: "Desktop Development",
    description:
      "Cross platform desktop apps using Electron or Tauri. Lightweight builds with system level integration.",
    bullets: ["OS features", "Local storage", "Reliable performance"],
  },
  {
    id: "fullstack",
    icon: Layers,
    title: "Full-Stack Development",
    description: "End to end development from frontend to backend and deployments.",
    bullets: ["APIs and servers", "Databases", "Cloud workflows"],
  },
  {
    id: "security",
    icon: Shield,
    title: "Cybersecurity",
    description: "Secure development practices baked into every project.",
    bullets: ["Safe coding habits", "Authentication", "Preventing common vulnerabilities"],
  },
];

// Node positions in the cluster (relative percentages)
const nodePositions = [
  { x: 15, y: 20 }, // Web - top left
  { x: 70, y: 10 }, // Mobile - top right
  { x: 5, y: 60 }, // Desktop - middle left
  { x: 55, y: 50 }, // Full-Stack - center right
  { x: 35, y: 85 }, // Cybersecurity - bottom center
];

// Float animation offsets for each node
const floatOffsets = [
  { x: 8, y: -10, duration: 6 },
  { x: -6, y: 8, duration: 7 },
  { x: 10, y: 6, duration: 8 },
  { x: -8, y: -8, duration: 6.5 },
  { x: 6, y: 10, duration: 7.5 },
];

interface SkillNodeProps {
  skill: (typeof skillsData)[0];
  position: { x: number; y: number };
  floatOffset: { x: number; y: number; duration: number };
  isExpanded: boolean;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  onClick: () => void;
  reducedMotion: boolean;
  index: number;
}

function SkillNode({
  skill,
  position,
  floatOffset,
  isExpanded,
  isHovered,
  onHover,
  onClick,
  reducedMotion,
  index,
}: SkillNodeProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const Icon = skill.icon;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  // Float animation
  const floatAnimation = reducedMotion
    ? {}
    : {
        x: [0, floatOffset.x, 0],
        y: [0, floatOffset.y, 0],
      };

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={floatAnimation}
      transition={
        reducedMotion
          ? {}
          : {
              duration: floatOffset.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }
      }
    >
      <motion.button
        onClick={onClick}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        className={`
          relative w-16 h-16 rounded-2xl cursor-pointer
          flex items-center justify-center
          transition-all duration-300 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
          ${isExpanded ? "opacity-0 pointer-events-none" : ""}
        `}
        style={{
          backgroundColor: isDark ? "rgba(20, 30, 40, 0.6)" : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1.5px solid ${
            isHovered
              ? isDark
                ? "rgba(66, 129, 164, 0.6)"
                : "rgba(255, 112, 166, 0.5)"
              : isDark
              ? "rgba(255, 255, 255, 0.15)"
              : "rgba(0, 0, 0, 0.1)"
          }`,
          boxShadow: isHovered
            ? isDark
              ? "0 0 30px rgba(66, 129, 164, 0.3), inset 0 1px 2px rgba(255,255,255,0.1)"
              : "0 0 30px rgba(255, 112, 166, 0.25), inset 0 1px 2px rgba(255,255,255,0.5)"
            : isDark
            ? "0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255,255,255,0.05)"
            : "0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255,255,255,0.5)",
        }}
        whileHover={reducedMotion ? {} : { scale: 1.15 }}
        whileTap={reducedMotion ? {} : { scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.8 : 1 }}
        transition={{ duration: 0.3, delay: reducedMotion ? 0 : index * 0.1 }}
      >
        <Icon
          className={`w-7 h-7 transition-colors duration-300 ${
            isHovered ? "text-[var(--accent)]" : "text-foreground/70"
          }`}
          strokeWidth={1.8}
        />

        {/* Hover label */}
        <AnimatePresence>
          {isHovered && !isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <span
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{
                  backgroundColor: isDark ? "rgba(20, 30, 40, 0.9)" : "rgba(255, 255, 255, 0.95)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {skill.title}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

interface SkillBubbleProps {
  skill: (typeof skillsData)[0];
  onClose: () => void;
  reducedMotion: boolean;
}

function SkillBubble({ skill, onClose, reducedMotion }: SkillBubbleProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const Icon = skill.icon;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  // Mouse position for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for tilt
  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

  // Handle mouse move for 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bubbleRef.current || reducedMotion) return;
    const rect = bubbleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  // Reset tilt on mouse leave
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="relative max-w-sm w-full mx-4 pointer-events-auto"
        style={{ perspective: 1000 }}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 10 }}
        transition={
          reducedMotion ? { duration: 0.15 } : { type: "spring", stiffness: 400, damping: 25 }
        }
      >
        {/* 3D Tilt wrapper */}
        <motion.div
          ref={bubbleRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX: reducedMotion ? 0 : rotateX,
            rotateY: reducedMotion ? 0 : rotateY,
            transformStyle: "preserve-3d",
          }}
          className="group"
        >
          {/* Glass bubble */}
          <div className="relative">
            {/* Blur layer - separate for true glass effect */}
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            />

            {/* Card content container */}
            <div
              className="relative p-6 rounded-2xl transition-shadow duration-300 group-hover:shadow-2xl"
              style={{
                border: `2px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: isDark
                  ? "inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.15), 0 25px 50px rgba(0, 0, 0, 0.4)"
                  : "inset 0 2px 4px rgba(255,255,255,0.6), inset 0 -2px 4px rgba(0,0,0,0.04), 0 25px 50px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  backgroundColor: isDark
                    ? "rgba(66, 129, 164, 0.08)"
                    : "rgba(255, 112, 166, 0.06)",
                }}
              />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
                transition-all duration-200 hover:scale-110
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{
                  backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
                  transform: "translateZ(20px)",
                }}
                aria-label="Close"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Icon with 3D pop */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundColor: isDark ? "rgba(66, 129, 164, 0.2)" : "rgba(255, 112, 166, 0.15)",
                  border: `2px solid ${
                    isDark ? "rgba(66, 129, 164, 0.5)" : "rgba(255, 112, 166, 0.4)"
                  }`,
                  boxShadow: isDark
                    ? "inset 0 2px 4px rgba(66, 129, 164, 0.25), inset 0 -2px 4px rgba(0,0,0,0.2)"
                    : "inset 0 2px 4px rgba(255, 112, 166, 0.2), inset 0 -2px 4px rgba(0,0,0,0.05)",
                  transform: "translateZ(30px)",
                }}
              >
                <Icon className="w-7 h-7 text-[var(--accent)]" strokeWidth={2} />
              </div>

              {/* Title with 3D depth */}
              <h3
                className="text-lg font-semibold text-foreground mb-2 transition-colors duration-300 group-hover:text-foreground"
                style={{ transform: "translateZ(25px)" }}
              >
                {skill.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm text-muted-foreground/90 leading-relaxed mb-4 transition-colors duration-300 group-hover:text-muted-foreground"
                style={{ transform: "translateZ(20px)" }}
              >
                {skill.description}
              </p>

              {/* Bullets with 3D depth */}
              <div className="flex flex-wrap gap-2" style={{ transform: "translateZ(15px)" }}>
                {skill.bullets.map((bullet, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: isDark
                        ? "rgba(66, 129, 164, 0.2)"
                        : "rgba(255, 112, 166, 0.12)",
                      color: isDark ? "rgba(150, 200, 230, 0.95)" : "rgba(200, 80, 130, 0.95)",
                      border: `1px solid ${
                        isDark ? "rgba(66, 129, 164, 0.4)" : "rgba(255, 112, 166, 0.3)"
                      }`,
                    }}
                  >
                    {bullet}
                  </span>
                ))}
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-[1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${
                    isDark ? "rgba(66, 129, 164, 0.5)" : "rgba(255, 112, 166, 0.4)"
                  }, transparent)`,
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function SkillNodes() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const autoCollapseRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Auto-collapse timer
  useEffect(() => {
    if (expandedId && !reducedMotion) {
      // Clear existing timer
      if (autoCollapseRef.current) {
        clearTimeout(autoCollapseRef.current);
      }

      // Set new timer for 8-10 seconds
      autoCollapseRef.current = setTimeout(() => {
        setExpandedId(null);
      }, 9000);
    }

    return () => {
      if (autoCollapseRef.current) {
        clearTimeout(autoCollapseRef.current);
      }
    };
  }, [expandedId, reducedMotion]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedId) {
        setExpandedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedId]);

  // Handle click outside
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setExpandedId(null);
    }
  }, []);

  const handleNodeClick = (id: string) => {
    // Reset auto-collapse timer on interaction
    if (autoCollapseRef.current) {
      clearTimeout(autoCollapseRef.current);
    }
    setExpandedId(expandedId === id ? null : id);
  };

  const expandedSkill = skillsData.find((s) => s.id === expandedId);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px]"
      onClick={handleBackdropClick}
    >
      {/* Skill nodes */}
      {skillsData.map((skill, index) => (
        <SkillNode
          key={skill.id}
          skill={skill}
          position={nodePositions[index]}
          floatOffset={floatOffsets[index]}
          isExpanded={expandedId === skill.id}
          isHovered={hoveredId === skill.id}
          onHover={(hovered) => setHoveredId(hovered ? skill.id : null)}
          onClick={() => handleNodeClick(skill.id)}
          reducedMotion={reducedMotion}
          index={index}
        />
      ))}

      {/* Expanded bubble */}
      <AnimatePresence>
        {expandedSkill && (
          <SkillBubble
            skill={expandedSkill}
            onClose={() => setExpandedId(null)}
            reducedMotion={reducedMotion}
          />
        )}
      </AnimatePresence>

      {/* Dim overlay when bubble is open */}
      <AnimatePresence>
        {expandedId && (
          <motion.div
            className="absolute inset-0 bg-background/40 -z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile version - simplified grid
export function SkillNodesMobile() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <div className="space-y-6">
      {/* Node grid */}
      <div className="flex flex-wrap justify-center gap-4">
        {skillsData.map((skill) => {
          const Icon = skill.icon;
          const isExpanded = expandedId === skill.id;

          return (
            <motion.button
              key={skill.id}
              onClick={() => setExpandedId(isExpanded ? null : skill.id)}
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center
                transition-all duration-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
              `}
              style={{
                backgroundColor: isDark ? "rgba(20, 30, 40, 0.6)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(12px)",
                border: `1.5px solid ${
                  isExpanded
                    ? isDark
                      ? "rgba(66, 129, 164, 0.6)"
                      : "rgba(255, 112, 166, 0.5)"
                    : isDark
                    ? "rgba(255, 255, 255, 0.15)"
                    : "rgba(0, 0, 0, 0.1)"
                }`,
                boxShadow: isExpanded
                  ? isDark
                    ? "0 0 20px rgba(66, 129, 164, 0.3)"
                    : "0 0 20px rgba(255, 112, 166, 0.25)"
                  : "0 4px 12px rgba(0,0,0,0.15)",
              }}
              whileTap={reducedMotion ? {} : { scale: 0.95 }}
            >
              <Icon
                className={`w-7 h-7 ${isExpanded ? "text-[var(--accent)]" : "text-foreground/70"}`}
                strokeWidth={1.8}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Expanded content panel */}
      <AnimatePresence mode="wait">
        {expandedId && (
          <motion.div
            key={expandedId}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: isDark ? "rgba(20, 30, 40, 0.8)" : "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px)",
              border: `1.5px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
            }}
          >
            {(() => {
              const skill = skillsData.find((s) => s.id === expandedId);
              if (!skill) return null;
              const Icon = skill.icon;

              return (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(66, 129, 164, 0.2)"
                          : "rgba(255, 112, 166, 0.15)",
                      }}
                    >
                      <Icon className="w-5 h-5 text-[var(--accent)]" strokeWidth={1.8} />
                    </div>
                    <h3 className="font-semibold text-foreground">{skill.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {skill.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skill.bullets.map((bullet, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: isDark
                            ? "rgba(66, 129, 164, 0.15)"
                            : "rgba(255, 112, 166, 0.1)",
                          color: isDark ? "rgba(150, 200, 230, 0.9)" : "rgba(200, 80, 130, 0.9)",
                        }}
                      >
                        {bullet}
                      </span>
                    ))}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
