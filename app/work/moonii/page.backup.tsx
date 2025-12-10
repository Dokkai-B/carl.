"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// =============================================
// CSS VARIABLES & CONFIGURATION
// =============================================
/**
 * IMPORTANT: Adjust --mockup-radius to match the rounded corners in your exported PNG files.
 * - Default: 28px works for most iOS-style mockups
 * - If corners look misaligned, increase/decrease until they visually match
 * - Test in both light and dark mode
 *
 * To move assets to a safer path (recommended):
 * 1. Move files from "public/Temp Projects UI/Moonii" to "public/assets/moonii"
 * 2. Update basePublicPath below to "/assets/moonii"
 * 3. This avoids issues with spaces in folder names
 *
 * SHARED ELEMENT TRANSITION:
 * The hero thumbnail uses layoutId="project-hero-5" to create a morphing transition
 * from the /work overview page. Make sure the overview page uses the same layoutId.
 */

// =============================================
// PROJECT DATA
// =============================================
interface ProjectData {
  id: number;
  title: string;
  category: string;
  year: string;
  role: string;
  summary: string;
  heroImage: string;
  gallery: Array<{ name: string; image: string }>;
  links: { prototype: string; github: string };
  features: string[];
  techStack: string[];
  orbColors: { primary: string; secondary: string };
  prevProject: { name: string; slug: string };
  nextProject: { name: string; slug: string };
  basePublicPath: string;
}

const projectData: ProjectData = {
  id: 5,
  title: "Moonii",
  category: "Mobile Application",
  year: "2025",
  role: "Full-Stack Mobile Developer",
  summary:
    "A cross-platform mobile application for recording, storing, and playing personalized bedtime stories. It enables parents to capture audio narrations that are securely uploaded to the cloud and accessed by family members through a modern, synchronized audio player interface.",
  heroImage: "/Temp Projects Thumbnail/Moonii.png",
  basePublicPath: "/Temp Projects UI/Moonii",
  links: {
    prototype: "#",
    github: "#",
  },
  features: [
    "Record personalized audio stories with mobile-native microphone access",
    "Upload and store audio files securely using AWS S3 with pre-signed URLs",
    "High-quality AAC-LC encoded M4A audio format for optimized playback",
    "Modern audio player with waveform visualization and timeline controls",
    "Playlist management and multi-view synchronized playback state",
    "Error handling for failed uploads, network issues, and corrupted audio",
  ],
  techStack: [
    "Flutter",
    "Node.js",
    "AWS S3",
    "Audio Processing",
    "Waveform UI",
    "Express",
    "Dart",
    "just_audio",
  ],
  gallery: [
    { name: "Home", image: "/Temp Projects UI/Moonii/Phone Screenshots/1.png" },
    { name: "Story List", image: "/Temp Projects UI/Moonii/Phone Screenshots/2.png" },
    { name: "Recording", image: "/Temp Projects UI/Moonii/Phone Screenshots/3.png" },
    { name: "Recording Process", image: "/Temp Projects UI/Moonii/Phone Screenshots/4.png" },
    { name: "Upload", image: "/Temp Projects UI/Moonii/Phone Screenshots/5.png" },
  ],
  orbColors: {
    primary: "#607ac2",
    secondary: "#a77bbe",
    light: {
      primary: "#d4a5d0",
      secondary: "#b8a3d4",
    },
  },
  prevProject: { name: "LostPaws", slug: "lostpaws" },
  nextProject: { name: "SaveEat", slug: "saveeat" },
};

// =============================================
// PARALLAX CONTEXT
// =============================================
interface ParallaxContextValue {
  mouseX: number;
  mouseY: number;
  isReduced: boolean;
}

const ParallaxContext = createContext<ParallaxContextValue>({
  mouseX: 0,
  mouseY: 0,
  isReduced: false,
});

// =============================================
// ORB BACKGROUND COMPONENT
// =============================================
/**
 * OrbBackground - Renders 3 animated gradient orbs in the background
 * @param {boolean} reduced - Disables animations if true (prefers-reduced-motion)
 */
interface OrbBackgroundProps {
  reduced?: boolean;
  isDark: boolean;
}

const OrbBackground = ({ reduced = false, isDark }: OrbBackgroundProps) => {
  const { mouseX, mouseY } = useContext(ParallaxContext);

  if (reduced) return null;

  const orbs = [
    {
      id: 1,
      size: 400,
      initialX: 15,
      initialY: 20,
      color: projectData.orbColors.primary,
      opacity: 0.12,
      duration: 20,
    },
    {
      id: 2,
      size: 350,
      initialX: 75,
      initialY: 60,
      color: projectData.orbColors.secondary,
      opacity: 0.1,
      duration: 25,
    },
    {
      id: 3,
      size: 300,
      initialX: 50,
      initialY: 80,
      color: projectData.orbColors.primary,
      opacity: 0.08,
      duration: 18,
    },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full filter blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color}40, transparent)`,
            opacity: orb.opacity,
            left: `${orb.initialX}%`,
            top: `${orb.initialY}%`,
          }}
          animate={{
            x: mouseX * (orb.id * 0.5),
            y: mouseY * (orb.id * 0.5),
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
          }}
        />
      ))}
    </div>
  );
};

// =============================================
// FRAMELESS DEVICE MOCKUP COMPONENT
// =============================================
/**
 * FramelessDeviceMockup - Individual device mockup with parallax and hover effects
 * Animation constants:
 * - Hover lift: translateY(-6px) + scale(1.02)
 * - Primary parallax: ±10px translate
 * - Secondary parallax: ±18px translate, ±3deg rotate
 * - Transition: 180ms ease-out
 */
interface FramelessDeviceMockupProps {
  src: string;
  alt: string;
  size: "primary" | "secondary";
  index: number;
  mockupRadius?: string;
  reduced?: boolean;
  onClick?: () => void;
}

const FramelessDeviceMockup = ({
  src,
  alt,
  size,
  index,
  mockupRadius = "28px",
  reduced = false,
  onClick,
}: FramelessDeviceMockupProps) => {
  const { mouseX, mouseY } = useContext(ParallaxContext);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax calculation
  // Primary (center): ±10px translate, no rotate
  // Secondary (sides): ±18px translate, ±3deg rotate
  const isPrimary = size === "primary";
  const translateRange = isPrimary ? 10 : 18;
  const rotateRange = isPrimary ? 0 : 3;

  const parallaxX = reduced
    ? 0
    : mouseX * translateRange * (index === 0 ? -1 : index === 2 ? 1 : 0.5);
  const parallaxY = reduced ? 0 : mouseY * translateRange * 0.5;
  const rotateY = reduced ? 0 : mouseX * rotateRange * (index === 0 ? -1 : index === 2 ? 1 : 0);

  return (
    <motion.div
      className="relative cursor-pointer"
      style={
        {
          "--mockup-radius": mockupRadius,
        } as React.CSSProperties
      }
      animate={{
        x: parallaxX,
        y: isHovered && !reduced ? -6 + parallaxY : parallaxY,
        rotateY: rotateY,
        scale: isHovered && !reduced ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: reduced ? 0 : 0.18,
      }}
      onMouseEnter={() => !reduced && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={reduced ? {} : { scale: 0.98 }}
    >
      {/* Glass container with rounded corners */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: `var(--mockup-radius, ${mockupRadius})`,
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: isHovered
            ? `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px ${projectData.orbColors.primary}40`
            : "0 12px 40px rgba(0, 0, 0, 0.3)",
          transition: "box-shadow 180ms ease-out",
        }}
      >
        {/* Image with aspect ratio container */}
        <div
          className={`relative ${isPrimary ? "w-72 lg:w-80" : "w-56 lg:w-64"}`}
          style={{ aspectRatio: "9/19" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={
              isPrimary ? "(max-width: 1024px) 288px, 320px" : "(max-width: 1024px) 224px, 256px"
            }
            className="object-cover"
            style={{
              borderRadius: `var(--mockup-radius, ${mockupRadius})`,
            }}
            priority={isPrimary}
          />
        </div>
      </div>
    </motion.div>
  );
};

// =============================================
// FLOATING STAGE COMPONENT
// =============================================
/**
 * FloatingStage - Main 3-mockup floating stage with parallax
 * Entry animation: spring with stiffness 110, damping 18, mass 0.9
 * Desktop: 3-up layout (left secondary, center primary, right secondary)
 * Mobile: Single centered primary mockup
 */
interface FloatingStageProps {
  images: Array<{ name: string; image: string }>;
  mockupRadius?: string;
  reduced?: boolean;
  onOpen?: (index: number) => void;
}

const FloatingStage = ({
  images,
  mockupRadius = "28px",
  reduced = false,
  onOpen,
}: FloatingStageProps) => {
  // Use first 3 images for the stage, or duplicate if less than 3
  const stageImages =
    images.length >= 3 ? images.slice(0, 3) : [...images, ...images, ...images].slice(0, 3);

  return (
    <div className="relative w-full flex justify-center items-center py-12 lg:py-16">
      {/* Desktop: 3-up layout */}
      <div className="hidden lg:flex items-center justify-center gap-8 perspective-1000">
        {/* Left secondary */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotateY: -15 }}
          animate={{ opacity: 1, x: 0, rotateY: -8 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9, delay: 0.2 }}
          style={{ zIndex: 1 }}
        >
          <FramelessDeviceMockup
            src={stageImages[0].image}
            alt={`${projectData.title} — ${stageImages[0].name}`}
            size="secondary"
            index={0}
            mockupRadius={mockupRadius}
            reduced={reduced}
            onClick={() => onOpen?.(0)}
          />
        </motion.div>

        {/* Center primary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9, delay: 0.1 }}
          style={{ zIndex: 2 }}
        >
          <FramelessDeviceMockup
            src={stageImages[1].image}
            alt={`${projectData.title} — ${stageImages[1].name}`}
            size="primary"
            index={1}
            mockupRadius={mockupRadius}
            reduced={reduced}
            onClick={() => onOpen?.(1)}
          />
        </motion.div>

        {/* Right secondary */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateY: 15 }}
          animate={{ opacity: 1, x: 0, rotateY: 8 }}
          transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9, delay: 0.2 }}
          style={{ zIndex: 1 }}
        >
          <FramelessDeviceMockup
            src={stageImages[2].image}
            alt={`${projectData.title} — ${stageImages[2].name}`}
            size="secondary"
            index={2}
            mockupRadius={mockupRadius}
            reduced={reduced}
            onClick={() => onOpen?.(2)}
          />
        </motion.div>
      </div>

      {/* Mobile: Single centered mockup with swipe */}
      <div className="lg:hidden flex justify-center">
        <FramelessDeviceMockup
          src={stageImages[1].image}
          alt={`${projectData.title} — ${stageImages[1].name}`}
          size="primary"
          index={1}
          mockupRadius={mockupRadius}
          reduced={reduced}
          onClick={() => onOpen?.(1)}
        />
      </div>
    </div>
  );
};

// =============================================
// FULLSCREEN MODAL VIEWER
// =============================================
/**
 * FullscreenModalViewer - Premium cinematic image carousel
 * Features:
 * - Blurred backdrop with glass morphism
 * - Modal-specific orbs for depth and ambiance
 * - Cinematic entrance animation (scale + fade)
 * - Subtle glow behind device for depth
 * - Parallax mouse tracking (±4px)
 * - Progress bar indicator
 * - Zoom on click
 * - Swipe support on mobile
 * - Keyboard: Esc to close, Arrow Left/Right to navigate
 */
interface FullscreenModalViewerProps {
  images: Array<{ name: string; image: string }>;
  initialIndex: number;
  onClose: () => void;
}

const FullscreenModalViewer = ({ images, initialIndex, onClose }: FullscreenModalViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [arrowPressed, setArrowPressed] = useState<"left" | "right" | null>(null);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
    setArrowPressed("right");
    setTimeout(() => setArrowPressed(null), 200);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
    setArrowPressed("left");
    setTimeout(() => setArrowPressed(null), 200);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
      if (e.key === "ArrowRight" && !isZoomed) goNext();
      if (e.key === "ArrowLeft" && !isZoomed) goPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isZoomed]);

  // Subtle parallax mouse tracking (±4px)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8; // ±4px range
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      goNext();
    }
    if (touchStart - touchEnd < -75) {
      goPrev();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Darkened backdrop overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      />

      {/* Modal-specific orbs layer (behind device) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Main orb behind center phone - primary depth cue */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 600,
            height: 600,
            background: `radial-gradient(circle, ${projectData.orbColors.secondary}, transparent 70%)`,
            filter: "blur(120px)",
            opacity: 0.25,
            left: "50%",
            top: "55%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            x: { type: "spring", stiffness: 40, damping: 25 },
            y: { type: "spring", stiffness: 40, damping: 25 },
            opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Side accent orb - color accent */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 500,
            height: 500,
            background: `radial-gradient(circle, ${projectData.orbColors.primary}, transparent 70%)`,
            filter: "blur(140px)",
            opacity: 0.18,
            left: "10%",
            top: "45%",
          }}
          animate={{
            x: mousePosition.x * -1.5,
            y: mousePosition.y * -1.5,
            opacity: [0.15, 0.22, 0.15],
          }}
          transition={{
            x: { type: "spring", stiffness: 35, damping: 30 },
            y: { type: "spring", stiffness: 35, damping: 30 },
            opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Top atmospheric glow - very faint */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 450,
            height: 450,
            background: `radial-gradient(circle, ${projectData.orbColors.primary}, transparent 70%)`,
            filter: "blur(150px)",
            opacity: 0.15,
            right: "15%",
            top: "20%",
          }}
          animate={{
            x: mousePosition.x * 1.2,
            y: mousePosition.y * 1.2,
            opacity: [0.12, 0.18, 0.12],
          }}
          transition={{
            x: { type: "spring", stiffness: 30, damping: 35 },
            y: { type: "spring", stiffness: 30, damping: 35 },
            opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Close button - glass morphism */}
      <motion.button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 p-2.5 rounded-full transition-all duration-200"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
        whileHover={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 24px ${projectData.orbColors.primary}30, 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Close viewer"
      >
        <X className="w-5 h-5 text-white/90" />
      </motion.button>

      {/* Left Navigation - Ghost glass style */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        className="absolute left-8 z-20 p-4 rounded-full transition-all duration-200"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow:
            arrowPressed === "left"
              ? `0 0 32px ${projectData.orbColors.primary}50, 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)`
              : "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        animate={{
          scale: arrowPressed === "left" ? 0.95 : 1,
        }}
        whileHover={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 28px ${projectData.orbColors.primary}40, 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-white/90" />
      </motion.button>

      {/* Right Navigation - Ghost glass style */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        className="absolute right-8 z-20 p-4 rounded-full transition-all duration-200"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow:
            arrowPressed === "right"
              ? `0 0 32px ${projectData.orbColors.primary}50, 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.15)`
              : "0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          top: "50%",
          transform: "translateY(-50%)",
        }}
        animate={{
          scale: arrowPressed === "right" ? 0.95 : 1,
        }}
        whileHover={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 28px ${projectData.orbColors.primary}40, 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-white/90" />
      </motion.button>

      {/* Main content area with subtle parallax (±4px) */}
      <motion.div
        className="relative"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 25,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced glow behind device - more visible */}
        <motion.div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${projectData.orbColors.primary}40, ${projectData.orbColors.secondary}30, transparent)`,
            filter: "blur(140px)",
            opacity: 0.2,
            transform: "scale(1.4)",
          }}
          animate={{
            opacity: [0.18, 0.22, 0.18],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Device container with cinematic entrance - scale 0.94 → 1.0 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 20,
            duration: 0.45,
          }}
          className="relative"
          style={{
            width: "min(400px, 90vw)",
            aspectRatio: "9/19",
          }}
        >
          {/* Image viewer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.8 : 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                opacity: { duration: 0.25 },
                scale: { type: "spring", stiffness: 150, damping: 25 },
              }}
              className="relative w-full h-full rounded-[32px] overflow-hidden cursor-pointer"
              onClick={handleImageClick}
              style={{
                backgroundColor: "rgba(18, 18, 22, 0.4)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                // Thinner, softer shadow - airy and floating
                boxShadow: "0 12px 36px rgba(0, 0, 0, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.04)",
              }}
            >
              <Image
                src={images[currentIndex].image}
                alt={`${projectData.title} — ${images[currentIndex].name}`}
                fill
                className="object-cover"
                style={{
                  borderRadius: "32px",
                }}
                sizes="400px"
                priority={currentIndex === initialIndex}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Progress bar indicator - minimal segments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-16 left-0 right-0 flex justify-center items-center gap-1.5"
        >
          {images.map((_, index) => (
            <motion.div
              key={index}
              className="h-1 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: index === currentIndex ? "32px" : "8px",
                backgroundColor:
                  index === currentIndex
                    ? projectData.orbColors.primary
                    : "rgba(255, 255, 255, 0.2)",
                boxShadow:
                  index === currentIndex ? `0 0 12px ${projectData.orbColors.primary}60` : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsZoomed(false);
              }}
              whileHover={{ scale: 1.2, backgroundColor: "rgba(255, 255, 255, 0.4)" }}
            />
          ))}
        </motion.div>

        {/* Image name label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-28 left-0 right-0 text-center text-white/50 text-sm font-medium"
        >
          {images[currentIndex].name}
        </motion.p>

        {/* Zoom hint - subtle */}
        {!isZoomed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-36 left-0 right-0 text-center text-white/30 text-xs"
          >
            Click to zoom • Use ← → keys
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

// =============================================
// MAIN PROJECT DETAIL PAGE
// =============================================
/**
 * TEST PLAN CHECKLIST:
 * [ ] LCP: Hero image loads with priority, <2.5s
 * [ ] CLS: No layout shift during animations, use aspect ratios
 * [ ] Keyboard nav: Arrow keys work in modal, Esc closes modal
 * [ ] Reduced motion: Test with prefers-reduced-motion, all animations disabled
 * [ ] Accessibility: All images have alt text, focus states visible
 * [ ] Shared element: Thumbnail morphs from /work page (check layoutId match)
 * [ ] Responsive: Test mobile (stack), tablet (2-up), desktop (3-up)
 */
export default function MooniiProject() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isReduced, setIsReduced] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.96]);

  useEffect(() => {
    setMounted(true);

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReduced(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsReduced(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (isReduced) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isReduced]);

  const isDark = !mounted || resolvedTheme === "dark";

  const handleOpenModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  return (
    <ParallaxContext.Provider
      value={{ mouseX: mousePosition.x, mouseY: mousePosition.y, isReduced }}
    >
      <div ref={containerRef} className="min-h-screen relative">
        {/* Orb Background */}
        <OrbBackground reduced={isReduced} isDark={isDark} />

        {/* Main Content */}
        <div className="container mx-auto px-6 md:px-8 py-24 md:py-32">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={isReduced ? { duration: 0 } : { duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm group"
              style={{
                color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
              }}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span className="group-hover:underline">Back to Projects</span>
            </Link>
          </motion.div>

          {/* Hero Section with Shared Element Transition */}
          <motion.div
            layoutId={`project-hero-${projectData.id}`}
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={
              isReduced
                ? { duration: 0 }
                : { type: "spring", stiffness: 110, damping: 18, mass: 0.9 }
            }
            style={{ scale: heroScale }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                backgroundColor: isDark ? "rgba(30, 45, 60, 0.4)" : "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}`,
                boxShadow: isDark
                  ? "0 24px 64px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255,255,255,0.1)"
                  : "0 24px 64px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255,255,255,1)",
              }}
            >
              <div className="relative w-full aspect-video">
                <Image
                  src={projectData.heroImage}
                  alt={projectData.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>

          {/* Title & Metadata - Stagger delay 0.04s */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isReduced ? { duration: 0 } : { duration: 0.6, delay: 0.04 }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{projectData.title}</h1>

            <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
              <span
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: projectData.orbColors.primary }}
              >
                {projectData.category}
              </span>
              <span style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>•</span>
              <span style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>
                {projectData.year}
              </span>
              <span style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>•</span>
              <span style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)" }}>
                {projectData.role}
              </span>
            </div>

            <p
              className="text-lg md:text-xl mb-8 leading-relaxed max-w-3xl mx-auto"
              style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
            >
              {projectData.summary}
            </p>

            {/* Links */}
            <div className="flex items-center justify-center gap-6">
              <a
                href={projectData.links.prototype}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 group"
                style={{
                  backgroundColor: isDark
                    ? `${projectData.orbColors.primary}20`
                    : `${projectData.orbColors.primary}15`,
                  color: projectData.orbColors.primary,
                  border: `1px solid ${
                    isDark
                      ? `${projectData.orbColors.primary}30`
                      : `${projectData.orbColors.primary}25`
                  }`,
                }}
              >
                <ExternalLink className="w-4 h-4 transition-transform group-hover:rotate-12" />
                View Prototype
              </a>
              <a
                href={projectData.links.github}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 group"
                style={{
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                  border: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
                  }`,
                }}
              >
                <Github className="w-4 h-4 transition-transform group-hover:scale-110" />
                Source Code
              </a>
            </div>
          </motion.div>

          {/* Floating Stage - Stagger delay 0.08s */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isReduced ? { duration: 0 } : { duration: 0.6, delay: 0.08 }}
          >
            <FloatingStage
              images={projectData.gallery}
              mockupRadius="28px"
              reduced={isReduced}
              onOpen={handleOpenModal}
            />
          </motion.div>

          {/* Content Grid - Stagger delay 0.12s */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isReduced ? { duration: 0 } : { duration: 0.6, delay: 0.12 }}
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          >
            {/* Key Features */}
            <div className="lg:col-span-2">
              <div
                className="p-8 rounded-3xl h-full"
                style={{
                  backgroundColor: isDark ? "rgba(30, 45, 60, 0.5)" : "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
                  }`,
                  boxShadow: isDark
                    ? "0 16px 48px rgba(0, 0, 0, 0.4)"
                    : "0 16px 48px rgba(0, 0, 0, 0.12)",
                }}
              >
                <h2 className="text-2xl font-bold mb-6">Key Features</h2>
                <ul className="space-y-3">
                  {projectData.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={
                        isReduced ? { duration: 0 } : { duration: 0.4, delay: 0.16 + i * 0.04 }
                      }
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: projectData.orbColors.primary }}
                      />
                      <span
                        style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.75)" }}
                      >
                        {feature}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="lg:col-span-1">
              <div
                className="p-8 rounded-3xl h-full"
                style={{
                  backgroundColor: isDark ? "rgba(30, 45, 60, 0.5)" : "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"
                  }`,
                  boxShadow: isDark
                    ? "0 16px 48px rgba(0, 0, 0, 0.4)"
                    : "0 16px 48px rgba(0, 0, 0, 0.12)",
                }}
              >
                <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {projectData.techStack.map((tech, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={
                        isReduced ? { duration: 0 } : { duration: 0.3, delay: 0.2 + i * 0.04 }
                      }
                      whileHover={isReduced ? {} : { scale: 1.05, y: -2 }}
                      className="px-4 py-2 rounded-full text-sm font-medium cursor-default"
                      style={{
                        backgroundColor: isDark
                          ? `${projectData.orbColors.primary}15`
                          : `${projectData.orbColors.primary}10`,
                        color: projectData.orbColors.primary,
                        border: `1px solid ${
                          isDark
                            ? `${projectData.orbColors.primary}25`
                            : `${projectData.orbColors.primary}20`
                        }`,
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isReduced ? { duration: 0 } : { duration: 0.6, delay: 0.16 }}
            className="flex items-center justify-between max-w-4xl mx-auto pt-12 border-t"
            style={{
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
            }}
          >
            <Link
              href={`/work/${projectData.prevProject.slug}`}
              className="group flex items-center gap-3"
              style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider opacity-60">Previous</p>
                <p className="font-medium group-hover:underline">{projectData.prevProject.name}</p>
              </div>
            </Link>

            <Link
              href={`/work/${projectData.nextProject.slug}`}
              className="group flex items-center gap-3"
              style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}
            >
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider opacity-60">Next</p>
                <p className="font-medium group-hover:underline">{projectData.nextProject.name}</p>
              </div>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Fullscreen Modal Viewer */}
        <AnimatePresence>
          {modalOpen && (
            <FullscreenModalViewer
              images={projectData.gallery}
              initialIndex={modalIndex}
              onClose={() => setModalOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </ParallaxContext.Provider>
  );
}
