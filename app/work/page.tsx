"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

// =============================================
// PROJECT DATA
// =============================================
const projects = [
  {
    id: 1,
    title: "Blue Ward",
    subtitle: "Full-Stack Application",
    description:
      "A real-time emergency assistance platform designed for critical situations requiring immediate remote support. Enables secure live communication between responders and users through bidirectional messaging, geolocation tracking, and remote media capture.",
    thumbnail: "/Temp Projects Thumbnail/Blue Ward.png",
    tech: ["React", "Flutter", "Node.js", "Socket.IO", "AWS S3", "Docker"],
    year: "2025",
    type: "Web",
    live: "#",
    github: "#",
    slug: "blueward",
    orbColors: { primary: "#96c8ec", secondary: "#419cb9" },
  },
  {
    id: 2,
    title: "Earthshaker",
    subtitle: "Mobile Application",
    description:
      "A real-time earthquake alert system delivering sub-second push notifications across the Philippines using USGS data, Flutter, and a Node.js cloud backend.",
    thumbnail: "/Temp Projects Thumbnail/Earthshaker.png",
    tech: ["Flutter", "Node.js", "Express", "Render", "Firebase FCM", "USGS API"],
    year: "2025",
    type: "Mobile",
    live: "#",
    github: "#",
    orbColors: { primary: "#c7c6c6", secondary: "#aa352c" },
  },
  {
    id: 3,
    title: "Heart to Art",
    subtitle: "Mobile Application",
    description:
      "A platform connecting artists with clients, featuring commission management and real-time messaging.",
    thumbnail: "/Temp Projects Thumbnail/Heart to Art.png",
    tech: ["React Native", "Expo", "Firebase"],
    year: "2024",
    type: "Mobile",
    live: "/assets/research/HearttoArt.pdf",
    github: "https://github.com/vladasblood/SE_HeartToArt",
    orbColors: { primary: "#b20018", secondary: "#d8d8d8" },
  },
  {
    id: 4,
    title: "LostPaws",
    subtitle: "Full-Stack Web Application",
    description:
      "A community platform helping reunite lost pets with owners and facilitating pet adoptions.",
    thumbnail: "/Temp Projects Thumbnail/LostPaws.png",
    tech: ["PHP", "MySQL", "JavaScript"],
    year: "2024",
    type: "Web",
    live: "/assets/research/LostPaws.pdf",
    github: "https://github.com/vladasblood/LostPaws",
    orbColors: { primary: "#18b24f", secondary: "#ffffff" },
  },
  {
    id: 5,
    title: "Moonii",
    subtitle: "Mobile Application",
    description:
      "A mobile audio storytelling app enabling secure cloud-stored recordings, waveform visualization, playlist management, and synchronized multi-view playback.",
    thumbnail: "/Temp Projects Thumbnail/Moonii.png",
    tech: ["Flutter", "Node.js", "AWS S3", "Audio Processing", "Waveform UI"],
    year: "2025",
    type: "Mobile",
    live: "#",
    github: "#",
    slug: "moonii",
    orbColors: { primary: "#a77bbe", secondary: "#607ac2" },
  },
  {
    id: 6,
    title: "SaveEat",
    subtitle: "Mobile Application",
    description:
      "A nutrition tracking app that combines dietary planning with budget management for healthier choices.",
    thumbnail: "/Temp Projects Thumbnail/SaveEat.png",
    tech: ["React Native", "Firebase", "Expo"],
    year: "2024",
    type: "Mobile",
    live: "/assets/research/SaveEat.pdf",
    github: "https://github.com/Dokkai-B/saveeat",
    orbColors: { primary: "#fd8f4c", secondary: "#eef0ed" },
  },
  {
    id: 7,
    title: "Translate",
    subtitle: "Cross-Platform Application",
    description:
      "A cross-platform bedtime story audio player with basic scaffolding for playback, file import, multi-platform UI, and early architecture for a future VS Code extension.",
    thumbnail: "/Temp Projects Thumbnail/translate.png",
    tech: ["Flutter", "React Native", "Dart", "Expo", "just_audio"],
    year: "2025",
    type: "Mobile",
    live: "#",
    github: "#",
    orbColors: { primary: "#169b78", secondary: "#ef6129" },
  },
  {
    id: 8,
    title: "Womens CLUB",
    subtitle: "Full-Stack Web Application",
    description:
      "A web platform streamlining member, event, and donation management for community organizations.",
    thumbnail: "/Temp Projects Thumbnail/WomensCLUB.png",
    tech: ["React", "Chakra UI", "Firebase", "Vercel"],
    year: "2024",
    type: "Web",
    live: "https://womensclub.vercel.app/",
    github: "https://github.com/Dokkai-B/womens-club",
    slug: "womens-club",
    orbColors: { primary: "#232289", secondary: "#ffffff" },
  },
  {
    id: 9,
    title: "Yellow Ward",
    subtitle: "Full-Stack Web Application",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.",
    thumbnail: "/Temp Projects Thumbnail/Yellow Ward.png",
    tech: ["Vue.js", "Express", "PostgreSQL"],
    year: "2025",
    type: "Web",
    live: "#",
    github: "#",
    orbColors: { primary: "#ffd600", secondary: "#5a585b" },
  },
];

// =============================================
// ORB CONFIGURATION
// =============================================
interface OrbConfig {
  id: number;
  size: number;
  initialX: number;
  initialY: number;
  floatDuration: number;
  floatDelay: number;
}

const defaultOrbs: OrbConfig[] = [
  { id: 1, size: 280, initialX: 55, initialY: 25, floatDuration: 8, floatDelay: 0 },
  { id: 2, size: 200, initialX: 70, initialY: 55, floatDuration: 10, floatDelay: 0.5 },
  { id: 3, size: 160, initialX: 45, initialY: 70, floatDuration: 7, floatDelay: 1 },
  { id: 4, size: 120, initialX: 80, initialY: 35, floatDuration: 9, floatDelay: 1.5 },
  { id: 5, size: 100, initialX: 60, initialY: 85, floatDuration: 11, floatDelay: 0.8 },
];

// =============================================
// FLOATING ORB COMPONENT
// =============================================
const FloatingOrb = ({
  orb,
  hoveredProject,
  isDark,
}: {
  orb: OrbConfig;
  hoveredProject: (typeof projects)[0] | null;
  isDark: boolean;
}) => {
  // Default colors based on theme
  const defaultColor = isDark ? "rgba(66, 129, 164, 0.4)" : "rgba(61, 165, 217, 0.25)";

  // Get project-specific color or default
  const orbColor = hoveredProject
    ? `${hoveredProject.orbColors.primary}${isDark ? "66" : "44"}` // Add alpha
    : defaultColor;

  // Calculate position shift when project is hovered
  const getTargetPosition = () => {
    if (!hoveredProject) {
      return { x: orb.initialX, y: orb.initialY };
    }
    // Shift orbs to create a dynamic pattern based on project
    const projectIndex = projects.findIndex((p) => p.id === hoveredProject.id);
    const offset = ((projectIndex * 15) % 30) - 10;
    return {
      x: orb.initialX + (orb.id % 2 === 0 ? offset : -offset),
      y: orb.initialY + (orb.id % 3 === 0 ? offset / 2 : -offset / 2),
    };
  };

  const targetPos = getTargetPosition();

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: orb.size,
        height: orb.size,
        filter: `blur(${orb.size * 0.4}px)`,
        left: `${orb.initialX}%`,
        top: `${orb.initialY}%`,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        left: `${targetPos.x}%`,
        top: `${targetPos.y}%`,
        backgroundColor: orbColor,
        scale: hoveredProject ? 1.15 : 1,
      }}
      transition={{
        left: { type: "spring", stiffness: 80, damping: 25 },
        top: { type: "spring", stiffness: 80, damping: 25 },
        backgroundColor: { duration: 0.6, ease: "easeOut" },
        scale: { type: "spring", stiffness: 150, damping: 18 },
      }}
    >
      {/* Inner floating animation layer */}
      <motion.div
        className="w-full h-full rounded-full"
        animate={{
          y: [0, -25, 0, 18, 0],
          x: [0, 12, 0, -10, 0],
        }}
        transition={{
          duration: orb.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: orb.floatDelay,
        }}
        style={{ backgroundColor: orbColor }}
      />
    </motion.div>
  );
};

// =============================================
// BACKGROUND PREVIEW COMPONENT
// =============================================
const BackgroundPreview = ({
  hoveredProject,
  isDark,
}: {
  hoveredProject: (typeof projects)[0] | null;
  isDark: boolean;
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Orbs layer - always visible */}
      <div className="absolute inset-0">
        {defaultOrbs.map((orb) => (
          <FloatingOrb key={orb.id} orb={orb} hoveredProject={hoveredProject} isDark={isDark} />
        ))}
      </div>

      {/* Project thumbnail preview - fades in on hover */}
      <AnimatePresence mode="wait">
        {hoveredProject && (
          <motion.div
            key={hoveredProject.id}
            layoutId={`project-hero-${hoveredProject.id}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Blurred background image - increased visibility */}
            <div className="absolute inset-0">
              <Image
                src={hoveredProject.thumbnail}
                alt={hoveredProject.title}
                fill
                className="object-cover"
                style={{
                  filter: "blur(6px) saturate(1.2)",
                  opacity: isDark ? 0.45 : 0.55,
                  transform: "scale(1.05)",
                }}
                priority
              />
            </div>

            {/* Dark overlay for light mode - enhances visibility */}
            {!isDark && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.15)",
                }}
              />
            )}

            {/* Gradient overlay for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: isDark
                  ? `linear-gradient(135deg, rgba(26, 39, 52, 0.75) 0%, rgba(26, 39, 52, 0.45) 50%, rgba(26, 39, 52, 0.70) 100%)`
                  : `linear-gradient(135deg, rgba(243, 242, 249, 0.80) 0%, rgba(243, 242, 249, 0.50) 50%, rgba(243, 242, 249, 0.75) 100%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle grid texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(66, 129, 164, 0.04) 1px, transparent 1px),
               linear-gradient(90deg, rgba(66, 129, 164, 0.04) 1px, transparent 1px)`
            : `linear-gradient(rgba(61, 165, 217, 0.05) 1px, transparent 1px),
               linear-gradient(90deg, rgba(61, 165, 217, 0.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
};

// =============================================
// PROJECT LIST ITEM COMPONENT
// =============================================
const ProjectListItem = ({
  project,
  index,
  isHovered,
  onHover,
  onLeave,
  isDark,
}: {
  project: (typeof projects)[0];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  isDark: boolean;
}) => {
  const projectSlug = project.slug || project.title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link href={`/work/${projectSlug}`} className="block">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 22,
          delay: 0.1 + index * 0.05,
        }}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="group cursor-pointer relative"
      >
        {/* Hover background glow - uses project orb color */}
        <motion.div
          className="absolute -inset-x-4 -inset-y-1 rounded-xl pointer-events-none"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${project.orbColors.primary}15 0%, ${project.orbColors.primary}05 100%)`
              : "transparent",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative py-4 md:py-5">
          {/* Title row */}
          <div className="flex items-center gap-3">
            {/* Arrow indicator - only visible on hover, uses project color */}
            <motion.span
              className="text-lg md:text-xl"
              style={{ color: isHovered ? project.orbColors.primary : "var(--accent)" }}
              initial={{ opacity: 0, x: -10, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                x: isHovered ? 0 : -10,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              →
            </motion.span>

            {/* Project title */}
            <motion.h2
              className="text-xl md:text-2xl lg:text-3xl font-light tracking-tight"
              style={{
                color: isHovered
                  ? project.orbColors.primary
                  : isDark
                  ? "rgba(255,255,255,0.65)"
                  : "rgba(0,0,0,0.6)",
              }}
              animate={{
                x: isHovered ? 4 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              {project.title}
            </motion.h2>

            {/* Type indicator on the right - uses project orb color on hover */}
            <motion.span
              className="text-[10px] font-semibold uppercase tracking-widest ml-auto"
              style={{
                color: isHovered
                  ? project.orbColors.primary
                  : isDark
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(0,0,0,0.25)",
              }}
              animate={{
                opacity: isHovered ? 1 : 0.7,
                scale: isHovered ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {project.year}
            </motion.span>
          </div>

          {/* Animated underline - thicker, expands from left with project color gradient */}
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: isHovered ? "2px" : "1px",
              background: isHovered
                ? `linear-gradient(90deg, ${project.orbColors.primary} 0%, ${project.orbColors.primary}40 100%)`
                : isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
              transformOrigin: "left",
              boxShadow: isHovered ? `0 0 8px ${project.orbColors.primary}50` : "none",
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0.15 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
      </motion.div>
    </Link>
  );
};

// =============================================
// METADATA CARD COMPONENT
// =============================================
const MetadataCard = ({
  project,
  isDark,
}: {
  project: (typeof projects)[0] | null;
  isDark: boolean;
}) => {
  // Consistent glass background style
  const glassStyle = {
    backgroundColor: isDark ? "rgba(30, 45, 60, 0.5)" : "rgba(255, 255, 255, 0.45)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
    boxShadow: isDark
      ? "0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255,255,255,0.08)"
      : "0 16px 48px rgba(0, 0, 0, 0.12), inset 0 1px 1px rgba(255,255,255,0.9)",
  };

  return (
    <AnimatePresence mode="wait">
      {project && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-lg p-8 rounded-3xl"
          style={glassStyle}
        >
          {/* Subtitle / Type */}
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-3"
            style={{ color: "var(--accent)" }}
          >
            {project.subtitle}
          </p>

          {/* Description */}
          <p
            className="text-base mb-6 leading-relaxed"
            style={{
              color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
            }}
          >
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  backgroundColor: isDark ? "rgba(66, 129, 164, 0.15)" : "rgba(61, 165, 217, 0.1)",
                  color: isDark ? "rgba(150, 200, 230, 0.9)" : "rgba(50, 120, 170, 0.9)",
                  border: `1px solid ${
                    isDark ? "rgba(66, 129, 164, 0.25)" : "rgba(61, 165, 217, 0.2)"
                  }`,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =============================================
// MAIN WORK PAGE COMPONENT
// =============================================
const Work = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<(typeof projects)[0] | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const contentControls = useAnimation();
  const isExitingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  // Hover intent handler with delay
  const handleHoverStart = useCallback((project: (typeof projects)[0]) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredProject(project);
    }, 120); // 120ms hover intent delay
  }, []);

  const handleHoverEnd = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setHoveredProject(null);
  }, []);

  // Menu state listener for animations
  useEffect(() => {
    const handleMenuState = (e: CustomEvent<{ isOpen: boolean }>) => {
      setMenuOpen(e.detail.isOpen);
      if (e.detail.isOpen) {
        isExitingRef.current = true;
        contentControls.start({ opacity: 0, y: -20 });
      } else {
        isExitingRef.current = false;
        setTimeout(() => {
          if (!isExitingRef.current) {
            contentControls.start({ opacity: 1, y: 0 });
          }
        }, 300);
      }
    };

    window.addEventListener("menuStateChange", handleMenuState as EventListener);
    return () => window.removeEventListener("menuStateChange", handleMenuState as EventListener);
  }, [contentControls]);

  // Initial animation
  useEffect(() => {
    if (!menuOpen && !isExitingRef.current) {
      contentControls.start({ opacity: 1, y: 0 });
    }
  }, [menuOpen, contentControls]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Hide footer and prevent body scroll on this page */}
      <style jsx global>{`
        footer {
          display: none !important;
        }
        body {
          overflow: hidden !important;
        }
        html {
          overflow: hidden !important;
        }
        /* Hide scrollbar but keep functionality for project list */
        .scrollable-list {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .scrollable-list::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Dynamic background with orbs and preview */}
      <BackgroundPreview hoveredProject={hoveredProject} isDark={isDark} />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={contentControls}
        transition={{ duration: 0.5 }}
        className="relative z-10 h-full flex flex-col container mx-auto px-6 md:px-8 pt-24 md:pt-28 pb-8"
      >
        {/* Header - compact */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8 md:mb-10 flex-shrink-0"
        >
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                Featured <span className="gradient-text">Projects</span>
              </h1>
              <p
                className="text-sm md:text-base max-w-lg leading-relaxed"
                style={{
                  color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
                }}
              >
                A curated selection of work spanning web and mobile development.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Two-column layout - fills remaining space */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 flex-1 min-h-0">
          {/* Left: Scrollable project list */}
          <div className="relative min-h-0 flex flex-col">
            {/* Scrollable container with hidden scrollbar */}
            <div className="scrollable-list flex-1 overflow-y-auto pr-2">
              <div className="space-y-1">
                {projects.map((project, index) => (
                  <ProjectListItem
                    key={project.id}
                    project={project}
                    index={index}
                    isHovered={hoveredProject?.id === project.id}
                    onHover={() => handleHoverStart(project)}
                    onLeave={handleHoverEnd}
                    isDark={isDark}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Metadata card (desktop) - centered vertically relative to list */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="sticky top-1/3 -translate-y-1/2 h-fit">
              <MetadataCard project={hoveredProject} isDark={isDark} />
            </div>
          </div>
        </div>

        {/* Mobile: Metadata card at bottom */}
        <div className="lg:hidden mt-6 flex-shrink-0">
          <MetadataCard project={hoveredProject} isDark={isDark} />
        </div>

        {/* Empty state - subtle hint */}
        {!hoveredProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="hidden lg:block absolute bottom-8 right-8"
          >
            <div
              className="flex items-center gap-2 text-xs"
              style={{
                color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)",
              }}
            >
              <span>Hover to preview</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default Work;
