"use client";

import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
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
  ArrowUp,
  Radio,
  MapPin,
  Camera,
  Shield,
  Monitor,
  Zap,
} from "lucide-react";

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
  features: Array<{ icon: any; text: string }>;
  techStack: string[];
  orbColors: {
    primary: string;
    secondary: string;
    light: { primary: string; secondary: string };
  };
  prevProject: { name: string; slug: string };
  nextProject: { name: string; slug: string };
}

const projectData: ProjectData = {
  id: 1,
  title: "Blue Ward",
  category: "Full-Stack Application • 2025",
  year: "2025",
  role: "",
  summary:
    "A real-time emergency assistance platform designed for critical situations requiring immediate remote support. It enables secure live communication between responders and users through bidirectional messaging, geolocation tracking, remote media capture, and a cloud-deployed backend spanning mobile, web, and backend services with a fully integrated real-time architecture.",
  heroImage: "/Temp Projects Thumbnail/Blue Ward.png",
  links: {
    prototype: "#",
    github: "#",
  },
  features: [
    {
      icon: Radio,
      text: "Live WebSocket-powered bidirectional messaging between mobile users and web dashboard",
    },
    {
      icon: Camera,
      text: "Remote camera and audio capture for visual and auditory context gathering",
    },
    {
      icon: MapPin,
      text: "Continuous geolocation tracking with background services and GPS updates",
    },
    { icon: Shield, text: "Cloud media storage using AWS S3 with secure pre-signed URLs" },
    {
      icon: Monitor,
      text: "Agent dashboard for monitoring active sessions, viewing media, and sending commands",
    },
    {
      icon: Zap,
      text: "JWT authentication with bcrypt hashing, Helmet.js, CORS, and rate limiting",
    },
  ],
  techStack: [
    "Node.js",
    "Express.js",
    "Socket.IO",
    "React.js",
    "Flutter",
    "AWS S3",
    "Docker",
    "Material-UI",
    "Provider",
    "JWT",
    "Render",
    "Vercel",
  ],
  gallery: [
    { name: "Status", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Status_Dark.png" },
    { name: "GPS", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/GPS_Dark.png" },
    { name: "Camera", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Camera_Dark.png" },
    { name: "Audio", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Audio_Dark.png" },
    { name: "Battery", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Battery_Dark.png" },
  ],
  orbColors: {
    primary: "#96c8ec",
    secondary: "#419cb9",
    light: {
      primary: "#96c8ec",
      secondary: "#419cb9",
    },
  },
  prevProject: { name: "Translate", slug: "translate" },
  nextProject: { name: "Earthshaker", slug: "earthshaker" },
};

// =============================================
// SCROLL PROGRESS BAR
// =============================================
const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        background: `linear-gradient(90deg, ${projectData.orbColors.primary}, ${projectData.orbColors.secondary})`,
      }}
    />
  );
};

// =============================================
// BACK TO TOP BUTTON
// =============================================
const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            backgroundColor: `${projectData.orbColors.primary}33`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${projectData.orbColors.primary}4d`,
          }}
          whileHover={{
            backgroundColor: `${projectData.orbColors.primary}4d`,
            scale: 1.1,
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// =============================================
// FULLSCREEN MODAL VIEWER - REDESIGNED
// =============================================
interface FullscreenModalViewerProps {
  images: Array<{ name: string; image: string }>;
  initialIndex: number;
  onClose: () => void;
  isDark: boolean;
}

const FullscreenModalViewer = ({
  images,
  initialIndex,
  onClose,
  isDark,
}: FullscreenModalViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 8;
      const y = (e.clientY / window.innerHeight - 0.5) * 8;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) goNext();
    if (touchStart - touchEnd < -75) goPrev();
  };

  const colors = isDark ? projectData.orbColors : projectData.orbColors.light;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      />

      {/* Modal orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 650,
            height: 650,
            background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
            filter: "blur(130px)",
            opacity: 0.28,
            left: "50%",
            top: "55%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            x: mousePosition.x * 2.5,
            y: mousePosition.y * 2.5,
            scale: [1, 1.08, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 35, damping: 28 },
            y: { type: "spring", stiffness: 35, damping: 28 },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        <motion.div
          className="absolute rounded-full"
          style={{
            width: 520,
            height: 520,
            background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
            filter: "blur(150px)",
            opacity: 0.22,
            left: "20%",
            top: "50%",
          }}
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
            scale: [1, 1.1, 1],
          }}
          transition={{
            x: { type: "spring", stiffness: 32, damping: 30 },
            y: { type: "spring", stiffness: 32, damping: 30 },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </div>

      {/* Close button */}
      <motion.button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
        whileHover={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          scale: 1.1,
        }}
        whileTap={{ scale: 0.95 }}
        aria-label="Close viewer"
      >
        <X className="w-5 h-5 text-white" />
      </motion.button>

      {/* REDESIGNED: Arrows closer to phone - horizontal hover movement only */}
      {/* Left arrow removed for cleanliness */}

      {/* Right arrow removed for cleanliness */}

      {/* Main content */}
      <motion.div
        className="relative"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 28,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced glow */}
        <motion.div
          className="absolute inset-0 rounded-[32px] pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors.primary}45, ${colors.secondary}35, transparent)`,
            filter: "blur(160px)",
            opacity: 0.25,
            transform: "scale(1.5)",
          }}
          animate={{
            opacity: [0.22, 0.28, 0.22],
            scale: [1.45, 1.55, 1.45],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Device container - reduced size and max-height for all screens */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{
            type: "spring",
            stiffness: 130,
            damping: 22,
            duration: 0.5,
          }}
          className="relative"
          style={{
            width: "min(340px, 90vw)",
            maxHeight: "80vh",
            aspectRatio: "9/19",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.8 : 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                opacity: { duration: 0.25 },
                scale: { type: "spring", stiffness: 140, damping: 28 },
              }}
              className="relative w-full h-full rounded-[32px] overflow-hidden cursor-pointer"
              onClick={handleImageClick}
              style={{
                backgroundColor: "rgba(18, 18, 22, 0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: "0 16px 48px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)",
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
                sizes="340px"
                priority={currentIndex === initialIndex}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* REDESIGNED: Progress bar closer (-bottom-8) with blue theme and instant hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-8 left-0 right-0 flex justify-center items-center gap-1.5"
        >
          {images.map((_, index) => (
            <motion.div
              key={index}
              className="h-1 rounded-full cursor-pointer"
              style={{
                width: index === currentIndex ? "32px" : "8px",
                backgroundColor:
                  index === currentIndex ? colors.primary : "rgba(255, 255, 255, 0.25)",
                boxShadow: index === currentIndex ? `0 0 14px ${colors.primary}70` : "none",
                transition: "all 0.3s ease",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setIsZoomed(false);
              }}
              whileHover={{
                scale: 1.2,
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                transition: { duration: 0.05 },
              }}
            />
          ))}
        </motion.div>

        {/* REDESIGNED: Image name closer (-bottom-16) */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute -bottom-16 left-0 right-0 text-center text-white/60 text-sm font-medium"
        >
          {images[currentIndex].name}
        </motion.p>

        {/* Zoom hint */}
        {!isZoomed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-24 left-0 right-0 text-center text-white/35 text-xs"
          >
            Click to zoom • Use ← → keys
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

// =============================================
// PHONE MOCKUP WITH HOVER OVERLAY - REDESIGNED for center-focused layout
// =============================================
interface PhoneMockupProps {
  src: string;
  alt: string;
  index: number;
  onClick: () => void;
  isDark: boolean;
  position?: "left" | "center" | "right";
}

const PhoneMockup = ({
  src,
  alt,
  index,
  onClick,
  isDark,
  position = "center",
}: PhoneMockupProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const getPositionStyles = () => {
    switch (position) {
      case "left":
        // Slight rotation with overlap toward center
        return {
          scale: isHovered ? 1.08 : 1.05,
          rotateY: isHovered ? 0 : 12,
          x: isHovered ? 0 : 20,
          y: isHovered ? -12 : 0,
        };
      case "right":
        // Slight rotation with overlap toward center
        return {
          scale: isHovered ? 1.08 : 1.05,
          rotateY: isHovered ? 0 : -12,
          x: isHovered ? 0 : -20,
          y: isHovered ? -12 : 0,
        };
      case "center":
      default:
        // Center phone: faces forward, slightly larger, highest z-index
        return {
          scale: isHovered ? 1.1 : 1.08,
          rotateY: 0,
          x: 0,
          y: isHovered ? -12 : 0,
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0, ...getPositionStyles() } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.4,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      className="relative cursor-pointer group"
      style={{
        perspective: "1200px",
        zIndex: position === "center" ? (isHovered ? 50 : 20) : isHovered ? 40 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileTap={{ scale: position === "center" ? 1.06 : 1.0 }}
    >
      {/* Floating shadow - pointer-events-none to avoid hitbox issues */}
      <div
        className="absolute inset-0 rounded-[28px] pointer-events-none"
        style={{
          filter: "blur(24px)",
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4), transparent 65%)"
            : "radial-gradient(ellipse at center, rgba(0, 0, 0, 0.15), transparent 65%)",
          transform: `translateY(${isHovered ? "10px" : "16px"}) scale(0.9)`,
          opacity: isHovered ? 0.8 : 0.6,
          transition: "transform 400ms ease-out, opacity 400ms ease-out",
        }}
      />

      {/* Phone container with transformStyle preserve-3d */}
      <motion.div
        className="relative overflow-hidden rounded-[28px]"
        animate={{
          rotateY:
            position === "left"
              ? isHovered
                ? 0
                : 12
              : position === "right"
              ? isHovered
                ? 0
                : -12
              : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeOut",
        }}
        style={{
          backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.6)"}`,
          boxShadow: isHovered
            ? isDark
              ? `0 24px 64px rgba(0, 0, 0, 0.5), 0 0 0 1px ${projectData.orbColors.primary}50, 0 0 32px ${projectData.orbColors.primary}20`
              : `0 16px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px ${projectData.orbColors.light.primary}60, 0 0 24px ${projectData.orbColors.light.primary}15`
            : isDark
            ? "0 16px 48px rgba(0, 0, 0, 0.4)"
            : "0 12px 40px rgba(0, 0, 0, 0.08)",
          transformStyle: "preserve-3d",
          transition:
            "box-shadow 400ms ease-out, background-color 400ms ease-out, border 400ms ease-out",
        }}
      >
        <div
          className={position === "center" ? "relative w-64 lg:w-72" : "relative w-52 lg:w-60"}
          style={{ aspectRatio: "9/19", transformStyle: "preserve-3d" }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 208px, 256px"
            className="object-cover rounded-[28px]"
          />

          {/* REDESIGNED: "Click to expand" overlay hint */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center rounded-[28px]"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                }}
              >
                <p className="text-white text-sm font-medium">Click to Expand</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// =============================================
// FLOATING ORB COMPONENT
// =============================================
interface OrbConfig {
  id: number;
  size: number;
  initialX: number;
  initialY: number;
  floatDuration: number;
  floatDelay: number;
}

const FloatingOrb = ({
  orb,
  orbColor,
  isDark,
}: {
  orb: OrbConfig;
  orbColor: string;
  isDark: boolean;
}) => {
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
        scale: [1, 1.1, 1, 1.05, 1],
      }}
      transition={{
        scale: {
          duration: orb.floatDuration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: orb.floatDelay,
        },
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
// MAIN PROJECT PAGE
// =============================================
export default function BlueWardProject() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef(null);
  const techStackRef = useRef(null);

  // Orb configuration for features and tech stack
  const orbConfigs: OrbConfig[] = [
    { id: 1, size: 200, initialX: -15, initialY: 20, floatDuration: 8, floatDelay: 0 },
    { id: 2, size: 150, initialX: 105, initialY: 75, floatDuration: 10, floatDelay: 0.5 },
    { id: 3, size: 120, initialX: -8, initialY: 65, floatDuration: 7, floatDelay: 1 },
    { id: 4, size: 160, initialX: 25, initialY: 72, floatDuration: 9, floatDelay: 1.2 },
  ];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 });
  const techStackInView = useInView(techStackRef, { once: true, amount: 0.3 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  const handleOpenModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      {/* Hide scrollbar for cleaner look */}
      <style jsx global>{`
        body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        body::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <ScrollProgressBar />
      <BackToTopButton />

      <div ref={containerRef} className="min-h-screen relative">
        {/* Background grid with vignette */}
        <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: isDark
                ? `linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`
                : `linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
                   linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)"
                : "radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.06) 100%)",
            }}
          />
        </div>

        {/* Background orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {[
            {
              size: 450,
              x: 12,
              y: 18,
              color: isDark ? projectData.orbColors.primary : projectData.orbColors.light.primary,
              opacity: isDark ? 0.12 : 0.08,
              duration: 22,
            },
            {
              size: 380,
              x: 78,
              y: 58,
              color: isDark
                ? projectData.orbColors.secondary
                : projectData.orbColors.light.secondary,
              opacity: isDark ? 0.1 : 0.07,
              duration: 26,
            },
            {
              size: 350,
              x: 48,
              y: 82,
              color: isDark ? projectData.orbColors.primary : projectData.orbColors.light.primary,
              opacity: isDark ? 0.08 : 0.06,
              duration: 20,
            },
          ].map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: orb.size,
                height: orb.size,
                background: `radial-gradient(circle, ${orb.color}50, transparent 70%)`,
                opacity: orb.opacity,
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                filter: `blur(${isDark ? 120 : 100}px)`,
              }}
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                scale: { duration: orb.duration, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 md:px-12 lg:px-[120px] py-24">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <Link href="/work">
            <motion.div
              className="inline-flex items-center gap-2 text-sm"
              style={{
                color: isDark ? "rgba(255,255,255,0.65)" : "rgba(31, 41, 55, 0.7)",
              }}
              whileHover="hover"
              initial="normal"
            >
              <motion.div
                variants={{
                  normal: { x: 0, color: isDark ? "rgba(255,255,255,0.65)" : "rgba(31, 41, 55, 0.7)" },
                  hover: { x: -3, color: projectData.orbColors.primary },
                }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
              <span>Back to Projects</span>
            </motion.div>
            </Link>
          </motion.div>
          {/* REDESIGNED: Two-column header layout (50% left, 50% right) */}
          <div className="grid lg:grid-cols-2 gap-16 mb-24">
            {/* LEFT COLUMN - 50% */}
            <motion.div
              layoutId={`project-hero-${projectData.id}`}
              initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="space-y-8"
            >
              {/* Title with animated gradient underline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">{projectData.title}</h1>

                {/* Animated gradient underline */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 180 }}
                  transition={{
                    delay: 0.6,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="h-0.5"
                  style={{
                    background: `linear-gradient(90deg, ${projectData.orbColors.primary}, ${projectData.orbColors.secondary})`,
                  }}
                />
              </div>

              {/* Category Pill Badge */}
              <div className="flex items-center gap-3">
                <span
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${projectData.orbColors.primary}20`,
                    color: projectData.orbColors.primary,
                    border: `1px solid ${projectData.orbColors.primary}40`,
                  }}
                >
                  {projectData.category}
                </span>
              </div>

              {/* Description */}
              <p
                className="text-lg md:text-xl leading-relaxed max-w-2xl"
                style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)" }}
              >
                {projectData.summary}
              </p>

              {/* Action buttons - matching homepage style */}
              <div className="flex items-center gap-4 pt-4">
                <motion.a
                  href={projectData.links.prototype}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 h-[52px] px-8 rounded-[14px] text-sm font-medium tracking-wide text-white transition-all duration-300"
                  style={{
                    backgroundColor: projectData.orbColors.primary,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  View Prototype
                </motion.a>

                <motion.a
                  href={projectData.links.github}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 h-[52px] px-8 rounded-[14px] text-sm font-medium tracking-wide transition-all duration-300"
                  style={{
                    backgroundColor: isDark
                      ? "rgba(255, 255, 255, 0.06)"
                      : "rgba(255, 255, 255, 0.7)",
                    backdropFilter: "blur(4px)",
                    color: projectData.orbColors.primary,
                    border: `1px solid ${projectData.orbColors.primary}50`,
                  }}
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </motion.a>
              </div>
            </motion.div>

            {/* RIGHT COLUMN - 50% - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.2,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Glowing orb background */}
              <div className="absolute inset-0 -z-10">
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${
                      isDark
                        ? projectData.orbColors.secondary
                        : projectData.orbColors.light.secondary
                    }40, transparent 70%)`,
                    filter: `blur(${isDark ? 80 : 60}px)`,
                    opacity: isDark ? 0.5 : 0.3,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>

              {/* Hero image - side by side with text */}
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  backgroundColor: isDark ? "rgba(30, 45, 60, 0.4)" : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${
                    isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"
                  }`,
                  boxShadow: isDark
                    ? "0 24px 64px rgba(0, 0, 0, 0.4)"
                    : "0 16px 48px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div className="relative w-full aspect-[585/460]">
                  <Image
                    src={projectData.heroImage}
                    alt={projectData.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
          {/* Mobile Mockups Section - REDESIGNED: 3D perspective with depth layering */}
          <div className="mb-24 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2
                className="text-3xl md:text-4xl font-bold"
                style={{
                  color: isDark ? "rgba(255,255,255,0.95)" : "rgba(31, 41, 55, 0.95)",
                }}
              >
                Mobile Views
              </h2>
              <p
                className="text-lg mt-2"
                style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(31, 41, 55, 0.7)" }}
              >
                Emergency assistance mobile controller
              </p>
            </motion.div>

            <div
              className="flex justify-center items-end gap-6"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* LEFT phone - GPS (3D tilted toward center with overlap) */}
              <PhoneMockup
                src={projectData.gallery[1].image}
                alt={`${projectData.title} — ${projectData.gallery[1].name}`}
                index={0}
                onClick={() => handleOpenModal(1)}
                isDark={isDark}
                position="left"
              />

              {/* CENTER phone - Status (larger, faces forward, highest z-index) */}
              <PhoneMockup
                src={projectData.gallery[0].image}
                alt={`${projectData.title} — ${projectData.gallery[0].name}`}
                index={1}
                onClick={() => handleOpenModal(0)}
                isDark={isDark}
                position="center"
              />

              {/* RIGHT phone - Camera (3D tilted toward center with overlap) */}
              <PhoneMockup
                src={projectData.gallery[2].image}
                alt={`${projectData.title} — ${projectData.gallery[2].name}`}
                index={2}
                onClick={() => handleOpenModal(2)}
                isDark={isDark}
                position="right"
              />
            </div>
          </div>{" "}
          {/* Features & Tech Stack Grid with Orbs */}
          <div className="relative">
            {/* Floating Orbs Background */}
            {orbConfigs.map((orb) => (
              <FloatingOrb
                key={orb.id}
                orb={orb}
                orbColor={
                  isDark
                    ? `${projectData.orbColors.primary}66`
                    : `${projectData.orbColors.light.primary}44`
                }
                isDark={isDark}
              />
            ))}
            {/* Features & Tech Stack Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24 relative z-10">
              {/* Features Card - with scroll animations and icons, glass morphism */}
              <div ref={featuresRef} className="lg:col-span-2">
              <div
                className="p-10 rounded-3xl h-full relative overflow-hidden"
                style={{
                  backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: isDark
                    ? "inset 0 2px 4px rgba(255,255,255,0.05), 0 20px 40px rgba(0, 0, 0, 0.35)"
                    : "inset 0 2px 4px rgba(255,255,255,0.6), 0 20px 40px rgba(0, 0, 0, 0.08)",
                  border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                <h2 className="text-2xl font-bold mb-7">Key Features</h2>
                <ul className="space-y-4">
                  {projectData.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={featuresInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{
                        duration: 0.4,
                        delay: i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{
                        x: 4,
                        backgroundColor: isDark
                          ? "rgba(255, 255, 255, 0.04)"
                          : "rgba(0, 0, 0, 0.04)",
                        transition: { duration: 0.05 },
                      }}
                      className="flex items-start gap-4 p-2 rounded-lg"
                      style={{ lineHeight: "1.6" }}
                    >
                      <span
                        className="mt-1 p-2 rounded-lg flex-shrink-0"
                        style={{
                          backgroundColor: isDark
                            ? `${projectData.orbColors.primary}15`
                            : `${projectData.orbColors.light.primary}20`,
                          color: isDark
                            ? projectData.orbColors.primary
                            : projectData.orbColors.light.primary,
                          opacity: 0.85,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <feature.icon className="w-5 h-5" />
                      </span>
                      <span
                        style={{
                          color: isDark ? "rgba(255,255,255,0.85)" : "rgba(31, 41, 55, 0.85)",
                        }}
                      >
                        {feature.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech Stack Card - with scroll animations, glass morphism */}
            <div ref={techStackRef} className="lg:col-span-1">
              <div
                className="p-10 rounded-3xl h-full relative overflow-hidden"
                style={{
                  backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.4)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: isDark
                    ? "inset 0 2px 4px rgba(255,255,255,0.05), 0 20px 40px rgba(0, 0, 0, 0.35)"
                    : "inset 0 2px 4px rgba(255,255,255,0.6), 0 20px 40px rgba(0, 0, 0, 0.08)",
                  border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
                }}
              >
                <h2 className="text-2xl font-bold mb-7">Tech Stack</h2>
                <div className="flex flex-wrap gap-2.5">
                  {projectData.techStack.map((tech, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: techStackInView ? 1 : 0,
                        scale: techStackInView ? 1 : 0.8,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.05 },
                      }}
                      className="px-4 py-2.5 rounded-full text-sm font-medium cursor-default"
                      style={{
                        backgroundColor: isDark
                          ? `${projectData.orbColors.primary}18`
                          : `${projectData.orbColors.light.primary}20`,
                        color: isDark
                          ? projectData.orbColors.primary
                          : projectData.orbColors.light.primary,
                        border: `1px solid ${
                          isDark
                            ? `${projectData.orbColors.primary}28`
                            : `${projectData.orbColors.light.primary}35`
                        }`,
                        opacity: 0.85,
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>
          {/* Project Navigation - Prev/Next */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pt-16 border-t"
            style={{
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(31, 41, 55, 0.15)",
            }}
          >
            <div className="flex items-center justify-between">
              {/* Previous Project */}
              <Link href={`/work/${projectData.prevProject.slug}`}>
                <motion.div
                  className="flex items-center gap-3"
                  style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)" }}
                  whileHover="hover"
                  initial="normal"
                >
                  <motion.div
                    variants={{
                      normal: { x: 0, color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)" },
                      hover: { x: -8, color: projectData.orbColors.primary },
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.div>
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-60">Previous</p>
                    <p className="font-medium">{projectData.prevProject.name}</p>
                  </div>
                </motion.div>
              </Link>

              {/* Next Project */}
              <Link href={`/work/${projectData.nextProject.slug}`}>
                <motion.div
                  className="flex items-center gap-3"
                  style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)" }}
                  whileHover="hover"
                  initial="normal"
                >
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider opacity-60">Next</p>
                    <p className="font-medium">{projectData.nextProject.name}</p>
                  </div>
                  <motion.div
                    variants={{
                      normal: { x: 0, color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)" },
                      hover: { x: 8, color: projectData.orbColors.primary },
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Fullscreen Modal Viewer */}
        <AnimatePresence>
          {modalOpen && (
            <FullscreenModalViewer
              images={projectData.gallery}
              initialIndex={modalIndex}
              onClose={() => setModalOpen(false)}
              isDark={isDark}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
