"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { ANIMATION_CONFIG } from "@/lib/animations";

import {
  FaHtml5,
  FaCss3,
  FaJs,
  FaReact,
  FaNodeJs,
  FaFigma,
  FaJava,
  FaPython,
  FaPhp,
  FaWindows,
  FaAndroid,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCode,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiTailwindcss,
  SiFirebase,
  SiMysql,
  SiCplusplus,
  SiCsharp,
  SiCanva,
  SiExpo,
} from "react-icons/si";

// =============================================
// TYPE DEFINITIONS
// =============================================
interface InfoItem {
  fieldName: string;
  fieldValue: string;
}

interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
}

interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
}

interface SkillItem {
  icon: React.ReactNode;
  name: string;
  category: "frontend" | "backend" | "design" | "tools" | "languages";
}

type SectionId = "about" | "experience" | "education" | "skills";

interface Particle {
  id: number;
  baseX: number;
  baseY: number;
  size: number;
  delay: number;
  duration: number;
}

interface BlobConfig {
  clipPath: string;
  color: string;
  secondaryColor: string;
  scale: number;
}

interface ParticlePattern {
  positions: { x: number; y: number }[];
}

// =============================================
// BACKGROUND CONFIGURATION
// =============================================
interface EnhancedBlobConfig extends BlobConfig {
  translateX: string;
  translateY: string;
  hueRotate: number;
}

const BLOB_CONFIGS: Record<SectionId, EnhancedBlobConfig> = {
  about: {
    clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
    color: "rgba(56, 189, 248, 0.32)", // Brighter cyan blue
    secondaryColor: "rgba(99, 179, 237, 0.22)",
    scale: 1,
    translateX: "0%",
    translateY: "0%",
    hueRotate: 0,
  },
  experience: {
    clipPath: "polygon(40% 0%, 60% 0%, 75% 15%, 80% 50%, 75% 85%, 60% 100%, 40% 100%, 25% 85%, 20% 50%, 25% 15%)",
    color: "rgba(20, 184, 166, 0.35)", // Saturated teal / deep blue
    secondaryColor: "rgba(45, 156, 180, 0.24)",
    scale: 1.12,
    translateX: "-15%",
    translateY: "10%",
    hueRotate: 10,
  },
  education: {
    clipPath: "polygon(50% 0%, 80% 15%, 100% 50%, 80% 85%, 50% 100%, 20% 85%, 0% 50%, 20% 15%)",
    color: "rgba(99, 102, 241, 0.33)", // Blue with violet tint
    secondaryColor: "rgba(139, 92, 246, 0.22)",
    scale: 1.08,
    translateX: "0%",
    translateY: "-20%",
    hueRotate: -8,
  },
  skills: {
    clipPath: "polygon(50% 0%, 65% 10%, 100% 20%, 85% 50%, 100% 80%, 65% 90%, 50% 100%, 35% 90%, 0% 80%, 15% 50%, 0% 20%, 35% 10%)",
    color: "rgba(45, 212, 191, 0.30)", // Blue-green / teal
    secondaryColor: "rgba(56, 189, 248, 0.20)",
    scale: 1.15,
    translateX: "12%",
    translateY: "5%",
    hueRotate: 12,
  },
};

const PARTICLE_PATTERNS: Record<SectionId, ParticlePattern> = {
  about: {
    positions: [
      { x: 50, y: 50 }, { x: 35, y: 35 }, { x: 65, y: 35 }, { x: 35, y: 65 }, { x: 65, y: 65 },
      { x: 50, y: 30 }, { x: 50, y: 70 }, { x: 30, y: 50 }, { x: 70, y: 50 },
      { x: 42, y: 42 }, { x: 58, y: 42 }, { x: 42, y: 58 }, { x: 58, y: 58 },
    ],
  },
  experience: {
    positions: [
      { x: 20, y: 20 }, { x: 30, y: 30 }, { x: 40, y: 40 }, { x: 50, y: 50 },
      { x: 60, y: 60 }, { x: 70, y: 70 }, { x: 80, y: 80 },
      { x: 25, y: 28 }, { x: 35, y: 38 }, { x: 45, y: 48 }, { x: 55, y: 58 },
      { x: 65, y: 68 }, { x: 75, y: 78 },
    ],
  },
  education: {
    positions: [
      { x: 50, y: 25 }, { x: 65, y: 35 }, { x: 70, y: 50 }, { x: 65, y: 65 }, { x: 50, y: 75 },
      { x: 35, y: 65 }, { x: 30, y: 50 }, { x: 35, y: 35 },
      { x: 50, y: 40 }, { x: 58, y: 50 }, { x: 50, y: 60 }, { x: 42, y: 50 },
      { x: 50, y: 50 },
    ],
  },
  skills: {
    positions: [
      { x: 50, y: 50 }, { x: 50, y: 25 }, { x: 72, y: 37 }, { x: 72, y: 63 },
      { x: 50, y: 75 }, { x: 28, y: 63 }, { x: 28, y: 37 },
      { x: 50, y: 15 }, { x: 80, y: 30 }, { x: 80, y: 70 }, { x: 50, y: 85 },
      { x: 20, y: 70 }, { x: 20, y: 30 },
    ],
  },
};

// =============================================
// DATA
// =============================================
const about = {
  title: "About Me",
  info: [
    { fieldName: "Name", fieldValue: "Carl Patrick Adrian Aguas" },
    { fieldName: "Phone", fieldValue: "(+63) 920 802 3514" },
    { fieldName: "Experience", fieldValue: "1+ Year" },
    { fieldName: "Nationality", fieldValue: "Filipino" },
    { fieldName: "Email", fieldValue: "cpacaguas@mymail.mapua.edu.ph" },
    { fieldName: "Freelance", fieldValue: "Available" },
    { fieldName: "Languages", fieldValue: "English, Filipino" },
  ],
};

const experience = {
  title: "Experience",
  items: [
    {
      company: "Women's Club",
      position: "Full-Stack Developer",
      duration: "April 2024 - May 2024",
    },
    { company: "JZ Perfumery", position: "Freelance Graphic Designer", duration: "2021-2023" },
    {
      company: "Classic Watch MNL",
      position: "Freelance Logo Designer",
      duration: "February 2022",
    },
    {
      company: "Lufong",
      position: "Freelance Graphic Designer",
      duration: "December 2021 - January 2022",
    },
    { company: "Rocket Fuel", position: "Freelance Logo Designer", duration: "June 2021" },
    { company: "Next", position: "Freelance Video Editor", duration: "February 2020 - March 2020" },
  ],
};

const education = {
  title: "Education",
  items: [
    {
      institution: "Mapúa University",
      degree: "Bachelor of Science in Computer Science",
      duration: "2021 - Present",
    },
    {
      institution: "Centro Escolar University",
      degree: "Senior Highschool (STEM strand)",
      duration: "2019 - 2021",
    },
    {
      institution: "College of San Benildo-Rizal",
      degree: "Grade 7 to Grade 10",
      duration: "2015 - 2019",
    },
  ],
};

const skills = {
  title: "Skills",
  skillList: [
    { icon: <FaHtml5 />, name: "HTML5", category: "frontend" as const },
    { icon: <FaCss3 />, name: "CSS3", category: "frontend" as const },
    { icon: <FaJs />, name: "JavaScript", category: "frontend" as const },
    { icon: <FaReact />, name: "React.js", category: "frontend" as const },
    { icon: <SiNextdotjs />, name: "Next.js", category: "frontend" as const },
    { icon: <SiTailwindcss />, name: "Tailwind CSS", category: "frontend" as const },
    { icon: <FaNodeJs />, name: "Node.js", category: "backend" as const },
    { icon: <FaFigma />, name: "Figma", category: "design" as const },
    { icon: <FaWindows />, name: "Windows", category: "tools" as const },
    { icon: <FaJava />, name: "Java", category: "languages" as const },
    { icon: <FaPython />, name: "Python", category: "languages" as const },
    { icon: <FaPhp />, name: "PHP", category: "backend" as const },
    { icon: <FaAndroid />, name: "Android Studio", category: "tools" as const },
    { icon: <SiFirebase />, name: "Firebase", category: "backend" as const },
    { icon: <SiMysql />, name: "MySQL", category: "backend" as const },
    { icon: <SiCplusplus />, name: "C++", category: "languages" as const },
    { icon: <SiCsharp />, name: "C#", category: "languages" as const },
    { icon: <SiCanva />, name: "Canva", category: "design" as const },
    { icon: <SiExpo />, name: "Expo", category: "tools" as const },
  ],
};

const sections = [
  { id: "about", label: "About", icon: FaUser },
  { id: "experience", label: "Experience", icon: FaBriefcase },
  { id: "education", label: "Education", icon: FaGraduationCap },
  { id: "skills", label: "Skills", icon: FaCode },
];

// =============================================
// MORPHING GRADIENT BLOB COMPONENT
// =============================================
const MorphingBlob = ({ activeSection, isDark }: { activeSection: SectionId; isDark: boolean }) => {
  const config = BLOB_CONFIGS[activeSection];
  
  // Light mode uses pink theme with good visibility
  const lightConfig: Record<SectionId, { color: string; secondaryColor: string }> = {
    about: { color: "rgba(251, 113, 133, 0.28)", secondaryColor: "rgba(244, 114, 182, 0.18)" },
    experience: { color: "rgba(236, 72, 153, 0.30)", secondaryColor: "rgba(219, 39, 119, 0.20)" },
    education: { color: "rgba(192, 132, 252, 0.28)", secondaryColor: "rgba(251, 113, 133, 0.18)" },
    skills: { color: "rgba(251, 146, 160, 0.26)", secondaryColor: "rgba(196, 181, 253, 0.18)" },
  };

  const colors = isDark 
    ? { color: config.color, secondaryColor: config.secondaryColor }
    : lightConfig[activeSection];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary morphing blob - more visible with reduced blur */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[650px] h-[650px] xl:w-[850px] xl:h-[850px]"
        initial={false}
        animate={{
          clipPath: config.clipPath,
          scale: config.scale,
          x: `calc(-50% + ${config.translateX})`,
          y: `calc(-50% + ${config.translateY})`,
          filter: `blur(35px) hue-rotate(${config.hueRotate}deg)`,
        }}
        transition={{
          clipPath: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
          scale: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
          x: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
          y: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
          filter: { duration: 1, ease: "easeInOut" },
        }}
        style={{
          background: `radial-gradient(ellipse at center, ${colors.color} 0%, ${colors.color.replace(/[\d.]+\)$/, '0.15)')} 50%, transparent 75%)`,
          mixBlendMode: isDark ? "screen" : "multiply",
        }}
      />

      {/* Secondary accent blob - enhanced visibility */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-[450px] h-[450px] xl:w-[550px] xl:h-[550px]"
        initial={false}
        animate={{
          clipPath: config.clipPath,
          scale: config.scale * 0.85,
          rotate: [0, 8, -8, 0],
          x: config.translateX,
        }}
        transition={{
          clipPath: { duration: 1, ease: [0.4, 0, 0.2, 1] },
          scale: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
          x: { duration: 0.9, ease: [0.4, 0, 0.2, 1] },
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
        }}
        style={{
          background: `radial-gradient(ellipse at center, ${colors.secondaryColor} 0%, transparent 70%)`,
          filter: "blur(40px)",
          mixBlendMode: isDark ? "screen" : "soft-light",
        }}
      />

      {/* Core glow - breathing animation with better visibility */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] xl:w-[600px] xl:h-[600px] rounded-full"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          x: "-50%",
          y: "-50%",
          background: `radial-gradient(circle at center, ${colors.color} 0%, transparent 65%)`,
          filter: "blur(45px)",
          mixBlendMode: isDark ? "screen" : "soft-light",
        }}
      />
    </div>
  );
};

// =============================================
// PARTICLE CONSTELLATION COMPONENT
// =============================================
const ParticleConstellation = ({
  activeSection,
  isDark,
  mousePosition,
}: {
  activeSection: SectionId;
  isDark: boolean;
  mousePosition: { x: number; y: number };
}) => {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 13 }, (_, i) => ({
        id: i,
        baseX: 50,
        baseY: 50,
        size: 4 + Math.random() * 4, // Larger particles (4-8px instead of 2-5px)
        delay: i * 0.1,
        duration: 2.5 + Math.random() * 2,
      })),
    []
  );

  const pattern = PARTICLE_PATTERNS[activeSection];
  // Higher opacity and better contrast
  const accentColor = isDark ? "rgba(99, 179, 237, 0.55)" : "rgba(244, 114, 182, 0.5)";
  const glowColor = isDark ? "rgba(56, 189, 248, 0.45)" : "rgba(236, 72, 153, 0.4)";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => {
        const targetPos = pattern.positions[index] || { x: 50, y: 50 };
        // Parallax offset based on mouse position
        const parallaxX = (mousePosition.x - 50) * 0.02 * (index % 3 + 1);
        const parallaxY = (mousePosition.y - 50) * 0.02 * (index % 3 + 1);

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            initial={false}
            animate={{
              left: `${targetPos.x + parallaxX}%`,
              top: `${targetPos.y + parallaxY}%`,
              scale: [1, 1.3, 1],
              opacity: [0.45, 0.65, 0.45],
            }}
            transition={{
              left: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: particle.delay * 0.5 },
              top: { duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: particle.delay * 0.5 },
              scale: { duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay },
              opacity: { duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: particle.delay },
            }}
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: accentColor,
              boxShadow: `0 0 ${particle.size * 3}px ${glowColor}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Connection lines between particles */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isDark ? "rgba(99, 179, 237, 0.25)" : "rgba(244, 114, 182, 0.2)"} />
            <stop offset="100%" stopColor={isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(236, 72, 153, 0.05)"} />
          </linearGradient>
        </defs>
        {pattern.positions.slice(0, -1).map((pos, i) => {
          const nextPos = pattern.positions[i + 1];
          if (!nextPos) return null;
          const parallaxX1 = (mousePosition.x - 50) * 0.02 * (i % 3 + 1);
          const parallaxY1 = (mousePosition.y - 50) * 0.02 * (i % 3 + 1);
          const parallaxX2 = (mousePosition.x - 50) * 0.02 * ((i + 1) % 3 + 1);
          const parallaxY2 = (mousePosition.y - 50) * 0.02 * ((i + 1) % 3 + 1);

          return (
            <motion.line
              key={`line-${i}`}
              x1={`${pos.x + parallaxX1}%`}
              y1={`${pos.y + parallaxY1}%`}
              x2={`${nextPos.x + parallaxX2}%`}
              y2={`${nextPos.y + parallaxY2}%`}
              stroke="url(#lineGradient)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 0.7, delay: i * 0.04 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// =============================================
// DYNAMIC BACKGROUND COMPONENT
// =============================================
const DynamicBackground = ({
  activeSection,
  isDark,
  backgroundY,
}: {
  activeSection: string;
  isDark: boolean;
  backgroundY: any;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  // Track mouse position for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ y: backgroundY }}>
      {/* Morphing gradient blob layer */}
      <MorphingBlob activeSection={activeSection as SectionId} isDark={isDark} />

      {/* Particle constellation layer */}
      <ParticleConstellation
        activeSection={activeSection as SectionId}
        isDark={isDark}
        mousePosition={mousePosition}
      />

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </motion.div>
  );
};

// =============================================
// FLOATING TAB NAV COMPONENT
// =============================================
const FloatingTabNav = ({ activeSection }: { activeSection: string }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Desktop Navigation - Left Side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-6">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <motion.button
              key={section.id}
              onClick={() => handleClick(section.id)}
              initial={{ opacity: 0, x: -30 }}
              animate={{
                opacity: 1,
                x: 0,
                y: [0, -2, 0],
              }}
              transition={{
                opacity: { delay: 0.3 + index * 0.1, duration: 0.4 },
                x: { delay: 0.3 + index * 0.1, duration: 0.4 },
                y: {
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.3,
                },
              }}
              whileHover={{
                scale: 1.05,
                rotate: isActive ? 0 : 2,
              }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
              style={{ perspective: 1000 }}
            >
              {/* Glass card */}
              <div
                className="relative px-5 py-4 rounded-[22px] flex items-center gap-3 transition-all duration-300"
                style={{
                  backgroundColor: isDark
                    ? isActive
                      ? "rgba(66, 129, 164, 0.25)"
                      : "rgba(20, 30, 40, 0.6)"
                    : isActive
                    ? "rgba(255, 112, 166, 0.2)"
                    : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: `1.5px solid ${
                    isActive
                      ? isDark
                        ? "rgba(66, 129, 164, 0.5)"
                        : "rgba(255, 112, 166, 0.4)"
                      : "rgba(255, 255, 255, 0.1)"
                  }`,
                  boxShadow: isActive
                    ? isDark
                      ? "0 0 30px rgba(66, 129, 164, 0.35), inset 0 1px 2px rgba(255,255,255,0.1)"
                      : "0 0 30px rgba(255, 112, 166, 0.3), inset 0 1px 2px rgba(255,255,255,0.5)"
                    : isDark
                    ? "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 2px rgba(255,255,255,0.05)"
                    : "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255,255,255,0.5)",
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-[22px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </div>

                <Icon
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-foreground/60 group-hover:text-foreground/80"
                  }`}
                />
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "text-foreground/60 group-hover:text-foreground/80"
                  }`}
                >
                  {section.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile Navigation - Top Horizontal */}
      <div className="fixed top-20 left-0 right-0 z-40 xl:hidden px-4">
        <div className="flex justify-center gap-3 flex-wrap">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <motion.button
                key={section.id}
                onClick={() => handleClick(section.id)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-2xl flex items-center gap-2 transition-all duration-300"
                style={{
                  backgroundColor: isDark
                    ? isActive
                      ? "rgba(66, 129, 164, 0.25)"
                      : "rgba(20, 30, 40, 0.7)"
                    : isActive
                    ? "rgba(255, 112, 166, 0.2)"
                    : "rgba(255, 255, 255, 0.6)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${
                    isActive
                      ? isDark
                        ? "rgba(66, 129, 164, 0.4)"
                        : "rgba(255, 112, 166, 0.35)"
                      : "rgba(255, 255, 255, 0.1)"
                  }`,
                  boxShadow: isActive
                    ? isDark
                      ? "0 0 20px rgba(66, 129, 164, 0.3)"
                      : "0 0 20px rgba(255, 112, 166, 0.25)"
                    : "0 4px 16px rgba(0, 0, 0, 0.15)",
                }}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-[var(--accent)]" : "text-foreground/60"}`}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-[var(--accent)]" : "text-foreground/60"
                  }`}
                >
                  {section.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </>
  );
};

// =============================================
// GLASS CARD COMPONENT (Homepage Style)
// =============================================
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hover3D?: boolean;
}

const GlassCard = ({ children, className = "", delay = 0, hover3D = true }: GlassCardProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        type: "spring",
        stiffness: ANIMATION_CONFIG.spring.stiffness,
        damping: ANIMATION_CONFIG.spring.damping,
        delay,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={hover3D ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
      className={`relative group ${className}`}
    >
      {/* Blur background */}
      <div
        className="absolute inset-0 rounded-[24px]"
        style={{
          backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.4)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      />

      {/* Border and shadow */}
      <div
        className="absolute inset-0 rounded-[24px] transition-shadow duration-300"
        style={{
          border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
          boxShadow: isDark
            ? "inset 0 2px 4px rgba(255,255,255,0.05), 0 20px 40px rgba(0, 0, 0, 0.35)"
            : "inset 0 2px 4px rgba(255,255,255,0.6), 0 20px 40px rgba(0, 0, 0, 0.08)",
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: isDark
            ? "0 0 40px rgba(66, 129, 164, 0.2), inset 0 0 30px rgba(66, 129, 164, 0.05)"
            : "0 0 40px rgba(255, 112, 166, 0.15), inset 0 0 30px rgba(255, 112, 166, 0.05)",
        }}
      />

      {/* Shine sweep */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Content */}
      <div className="relative p-6" style={hover3D ? { transform: "translateZ(20px)" } : {}}>
        {children}
      </div>
    </motion.div>
  );
};

// =============================================
// INFO GLASS CARD COMPONENT
// =============================================
const InfoGlassCard = ({ item, index }: { item: InfoItem; index: number }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.05,
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative group"
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          backgroundColor: isDark ? "rgba(20, 30, 40, 0.4)" : "rgba(255, 255, 255, 0.35)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
          boxShadow: isDark
            ? "inset 0 1px 2px rgba(255,255,255,0.03), 0 8px 24px rgba(0, 0, 0, 0.2)"
            : "inset 0 1px 2px rgba(255,255,255,0.5), 0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: isDark
            ? "0 0 25px rgba(66, 129, 164, 0.15)"
            : "0 0 25px rgba(255, 112, 166, 0.12)",
        }}
      />

      {/* Content */}
      <div className="relative px-5 py-4 flex items-center justify-between gap-4">
        <span className="text-sm text-foreground/50 font-medium">{item.fieldName}</span>
        <span className="text-sm text-foreground font-semibold text-right">{item.fieldValue}</span>
      </div>
    </motion.div>
  );
};

// =============================================
// TIMELINE CARD COMPONENT (Cleaner 2025 Style)
// =============================================
interface TimelineCardProps {
  duration: string;
  title: string;
  subtitle: string;
  index: number;
  isLast: boolean;
}

const TimelineCard = ({ duration, title, subtitle, index, isLast }: TimelineCardProps) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-50px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.08,
      }}
      className="relative pl-8 pb-6"
    >
      {/* Minimal timeline line */}
      {!isLast && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="absolute left-[5px] top-5 bottom-0 w-[2px] origin-top"
          style={{
            background: `linear-gradient(to bottom, ${
              isDark ? "rgba(66, 129, 164, 0.5)" : "rgba(255, 112, 166, 0.4)"
            }, transparent)`,
          }}
        />
      )}

      {/* Minimal timeline dot */}
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: index * 0.1 + 0.15, type: "spring", stiffness: 400, damping: 20 }}
        className="absolute left-0 top-2 w-3 h-3 rounded-full"
        style={{
          backgroundColor: isDark ? "rgba(66, 129, 164, 0.8)" : "rgba(255, 112, 166, 0.7)",
          boxShadow: isDark
            ? "0 0 12px rgba(66, 129, 164, 0.5)"
            : "0 0 12px rgba(255, 112, 166, 0.4)",
        }}
      />

      {/* Glass card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ y: -4 }}
        className="relative group cursor-pointer"
      >
        {/* Blur background */}
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            backgroundColor: isDark ? "rgba(20, 30, 40, 0.45)" : "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        />

        {/* Border */}
        <div
          className="absolute inset-0 rounded-[20px] transition-all duration-300"
          style={{
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`,
            boxShadow: isDark
              ? "inset 0 1px 2px rgba(255,255,255,0.04), 0 12px 32px rgba(0, 0, 0, 0.25)"
              : "inset 0 1px 2px rgba(255,255,255,0.5), 0 12px 32px rgba(0, 0, 0, 0.06)",
          }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: isDark
              ? "0 0 35px rgba(66, 129, 164, 0.18)"
              : "0 0 35px rgba(255, 112, 166, 0.12)",
          }}
        />

        {/* Shine sweep */}
        <div className="absolute inset-0 rounded-[20px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-800" />
        </div>

        {/* Content */}
        <div className="relative p-5" style={{ transform: "translateZ(15px)" }}>
          <span
            className="text-xs font-semibold tracking-wider uppercase"
            style={{ color: isDark ? "rgba(66, 129, 164, 0.9)" : "rgba(255, 112, 166, 0.85)" }}
          >
            {duration}
          </span>
          <h3 className="text-lg font-bold mt-1.5 text-foreground">{title}</h3>
          <p className="text-sm text-foreground/50 mt-1 flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: isDark ? "rgba(66, 129, 164, 0.7)" : "rgba(255, 112, 166, 0.6)",
              }}
            />
            {subtitle}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// =============================================
// SKILL TILE COMPONENT (Homepage Glass Style)
// =============================================
const SkillTile = ({ skill, index }: { skill: SkillItem; index: number }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-30px" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  // 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 400,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 400,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const categoryColors: Record<
    SkillItem["category"],
    { bg: string; border: string; glow: string }
  > = {
    frontend: {
      bg: isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.12)",
      border: isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.25)",
      glow: "rgba(59, 130, 246, 0.25)",
    },
    backend: {
      bg: isDark ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0.12)",
      border: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)",
      glow: "rgba(34, 197, 94, 0.25)",
    },
    design: {
      bg: isDark ? "rgba(236, 72, 153, 0.15)" : "rgba(236, 72, 153, 0.12)",
      border: isDark ? "rgba(236, 72, 153, 0.3)" : "rgba(236, 72, 153, 0.25)",
      glow: "rgba(236, 72, 153, 0.25)",
    },
    tools: {
      bg: isDark ? "rgba(249, 115, 22, 0.15)" : "rgba(249, 115, 22, 0.12)",
      border: isDark ? "rgba(249, 115, 22, 0.3)" : "rgba(249, 115, 22, 0.25)",
      glow: "rgba(249, 115, 22, 0.25)",
    },
    languages: {
      bg: isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.12)",
      border: isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.25)",
      glow: "rgba(139, 92, 246, 0.25)",
    },
  };

  const colors = categoryColors[skill.category];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.03,
      }}
      className="relative"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.95 }}
        className="relative cursor-pointer group"
      >
        {/* Glass background with category tint */}
        <div
          className="absolute inset-0 rounded-[18px]"
          style={{
            backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        />

        {/* Category color overlay */}
        <div className="absolute inset-0 rounded-[18px]" style={{ backgroundColor: colors.bg }} />

        {/* Border - minimal shadow for cleaner look */}
        <div
          className="absolute inset-0 rounded-[18px] transition-all duration-300"
          style={{
            border: `1px solid ${colors.border}`,
            boxShadow: isDark
              ? "inset 0 1px 1px rgba(255,255,255,0.03)"
              : "inset 0 1px 1px rgba(255,255,255,0.4)",
          }}
        />

        {/* Hover glow - subtle */}
        <div
          className="absolute inset-0 rounded-[18px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: isDark ? `0 0 20px ${colors.glow}` : `0 0 15px ${colors.glow.replace('0.25', '0.15')}` }}
        />

        {/* Shine sweep */}
        <div className="absolute inset-0 rounded-[18px] overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Content */}
        <div
          className="relative h-[110px] xl:h-[120px] flex flex-col justify-center items-center gap-2 p-3"
          style={{ transform: "translateZ(25px)" }}
        >
          <div className="text-3xl xl:text-4xl text-foreground group-hover:text-[var(--accent)] transition-colors duration-300">
            {skill.icon}
          </div>
          <span className="text-[10px] font-medium text-foreground/50 group-hover:text-foreground/70 transition-colors duration-300 text-center">
            {skill.name}
          </span>
        </div>
      </motion.div>

      {/* Tooltip popup (glass style) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div
              className="px-4 py-2.5 rounded-xl whitespace-nowrap"
              style={{
                backgroundColor: isDark ? "rgba(20, 30, 40, 0.95)" : "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)"}`,
                boxShadow: isDark
                  ? "0 12px 32px rgba(0, 0, 0, 0.4)"
                  : "0 12px 32px rgba(0, 0, 0, 0.12)",
              }}
            >
              <p className="text-sm font-semibold text-foreground">{skill.name}</p>
              <p className="text-xs text-foreground/50 capitalize">{skill.category}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// =============================================
// SECTION TITLE COMPONENT
// =============================================
const SectionTitle = ({ title }: { title: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.h2
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="text-3xl xl:text-4xl font-bold mb-8 gradient-text"
    >
      {title}
    </motion.h2>
  );
};

// =============================================
// MAIN RESUME COMPONENT
// =============================================
const Resume = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  // Track scroll position for active section
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map((s) => document.getElementById(s.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll progress for background
  const { scrollYProgress } = useScroll({ target: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Dynamic adaptive background */}
      <DynamicBackground activeSection={activeSection} isDark={isDark} backgroundY={backgroundY} />

      {/* Floating Tab Navigation */}
      <FloatingTabNav activeSection={activeSection} />

      {/* Main content */}
      <div className="relative z-10 pt-32 xl:pt-24 pb-16">
        <div className="container mx-auto px-4 xl:px-8 xl:pl-52 xl:pr-12">
          {/* ============================================
             ABOUT SECTION
             ============================================ */}
          <section id="about" className="mb-28 scroll-mt-32">
            <SectionTitle title={about.title} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8">
              {/* Main profile card (Homepage bubble style) */}
              <GlassCard delay={0.1}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(66, 129, 164, 0.2)"
                      : "rgba(255, 112, 166, 0.15)",
                    border: `2px solid ${
                      isDark ? "rgba(66, 129, 164, 0.4)" : "rgba(255, 112, 166, 0.35)"
                    }`,
                    boxShadow: isDark
                      ? "inset 0 2px 4px rgba(66, 129, 164, 0.2)"
                      : "inset 0 2px 4px rgba(255, 112, 166, 0.15)",
                  }}
                >
                  <FaUser className="w-7 h-7 text-[var(--accent)]" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Profile</h3>
                <p className="text-foreground/60 leading-relaxed text-sm">
                  Aspiring developer passionate about creating innovative digital solutions. Strong
                  in front-end and back-end development. Available for freelance work.
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {["Full-Stack", "UI/UX", "Freelance"].map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: isDark
                          ? "rgba(66, 129, 164, 0.2)"
                          : "rgba(255, 112, 166, 0.12)",
                        color: isDark ? "rgba(150, 200, 230, 0.9)" : "rgba(200, 80, 130, 0.9)",
                        border: `1px solid ${
                          isDark ? "rgba(66, 129, 164, 0.35)" : "rgba(255, 112, 166, 0.3)"
                        }`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassCard>

              {/* Info cards grid */}
              <div className="grid grid-cols-1 gap-3">
                {about.info.map((item, index) => (
                  <InfoGlassCard key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* ============================================
             EXPERIENCE SECTION
             ============================================ */}
          <section id="experience" className="mb-28 scroll-mt-32">
            <SectionTitle title={experience.title} />

            <div className="max-w-2xl">
              {experience.items.map((item, index) => (
                <TimelineCard
                  key={index}
                  duration={item.duration}
                  title={item.position}
                  subtitle={item.company}
                  index={index}
                  isLast={index === experience.items.length - 1}
                />
              ))}
            </div>
          </section>

          {/* ============================================
             EDUCATION SECTION
             ============================================ */}
          <section id="education" className="mb-28 scroll-mt-32">
            <SectionTitle title={education.title} />

            <div className="max-w-2xl">
              {education.items.map((item, index) => (
                <TimelineCard
                  key={index}
                  duration={item.duration}
                  title={item.degree}
                  subtitle={item.institution}
                  index={index}
                  isLast={index === education.items.length - 1}
                />
              ))}
            </div>
          </section>

          {/* ============================================
             SKILLS SECTION
             ============================================ */}
          <section id="skills" className="scroll-mt-32 pb-8">
            <SectionTitle title={skills.title} />

            {/* Skills grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 xl:gap-4">
              {skills.skillList.map((skill, index) => (
                <SkillTile key={index} skill={skill} index={index} />
              ))}
            </div>

            {/* Skills legend */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-5 justify-center"
            >
              {[
                { label: "Frontend", color: "rgba(59, 130, 246, 0.5)" },
                { label: "Backend", color: "rgba(34, 197, 94, 0.5)" },
                { label: "Design", color: "rgba(236, 72, 153, 0.5)" },
                { label: "Tools", color: "rgba(249, 115, 22, 0.5)" },
                { label: "Languages", color: "rgba(139, 92, 246, 0.5)" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-foreground/50">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Resume;
