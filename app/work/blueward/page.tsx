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
  mobileGallery: {
    dark: Array<{ name: string; image: string }>;
    light: Array<{ name: string; image: string }>;
  };
  desktopGallery: Array<{ name: string; image: string }>;
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
    { icon: Radio, text: "Live WebSocket-powered bidirectional messaging between mobile users and web dashboard" },
    {
      icon: Camera,
      text: "Remote camera and audio capture for visual and auditory context gathering",
    },
    { icon: MapPin, text: "Continuous geolocation tracking with background services and GPS updates" },
    { icon: Shield, text: "Cloud media storage using AWS S3 with secure pre-signed URLs" },
    { icon: Monitor, text: "Agent dashboard for monitoring active sessions, viewing media, and sending commands" },
    { icon: Zap, text: "JWT authentication with bcrypt hashing, Helmet.js, CORS, and rate limiting" },
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
  mobileGallery: {
    dark: [
      { name: "Status", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Status_Dark.png" },
      { name: "GPS", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/GPS_Dark.png" },
      { name: "Camera", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Camera_Dark.png" },
      { name: "Audio", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Audio_Dark.png" },
      { name: "Battery", image: "/Temp Projects UI/Blue Ward/Mobile/Dark/Battery_Dark.png" },
    ],
    light: [
      { name: "Status", image: "/Temp Projects UI/Blue Ward/Mobile/Light/Status_Light.png" },
      { name: "GPS", image: "/Temp Projects UI/Blue Ward/Mobile/Light/GPS_Light.png" },
      { name: "Camera", image: "/Temp Projects UI/Blue Ward/Mobile/Light/Camera_Light.png" },
      { name: "Audio", image: "/Temp Projects UI/Blue Ward/Mobile/Light/Audio_Light.png" },
      { name: "Status", image: "/Temp Projects UI/Blue Ward/Mobile/Light/Status_Light (2).png" },
    ],
  },
  desktopGallery: [
    { name: "Login", image: "/Temp Projects UI/Blue Ward/Desktop/Login.png" },
    { name: "Dashboard", image: "/Temp Projects UI/Blue Ward/Desktop/Dashboard.png" },
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
// FULLSCREEN MODAL VIEWER
// =============================================
interface FullscreenModalViewerProps {
  images: Array<{ name: string; image: string }>;
  initialIndex: number;
  onClose: () => void;
  isDark: boolean;
  isDesktop?: boolean;
}

const FullscreenModalViewer = ({
  images,
  initialIndex,
  onClose,
  isDark,
  isDesktop = false,
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

        {/* Device container */}
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
            width: isDesktop ? "min(85vw, 1400px)" : "min(420px, 90vw)",
            aspectRatio: isDesktop ? "16/10" : "9/19",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: isZoomed ? 1.8 : 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.3,
                scale: { type: "spring", stiffness: 200, damping: 25 },
              }}
              className="w-full h-full cursor-pointer"
              onClick={handleImageClick}
              style={{
                backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderRadius: isDesktop ? "16px" : "32px",
                border: `1px solid ${
                  isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"
                }`,
                boxShadow: isDark
                  ? "0 32px 80px rgba(0, 0, 0, 0.5)"
                  : "0 24px 64px rgba(0, 0, 0, 0.12)",
                overflow: "hidden",
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={images[currentIndex].image}
                  alt={images[currentIndex].name}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Image counter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-white text-sm font-medium"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {currentIndex + 1} / {images.length} — {images[currentIndex].name}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// =============================================
// PHONE MOCKUP COMPONENT (Mobile)
// =============================================
interface PhoneMockupProps {
  src: string;
  alt: string;
  index: number;
  onClick: () => void;
  isDark: boolean;
  position: "left" | "center" | "right";
}

const PhoneMockup = ({ src, alt, index, onClick, isDark, position }: PhoneMockupProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const positionConfig = {
    left: {
      scale: 0.85,
      rotateY: 12,
      x: 30,
      zIndex: 1,
    },
    center: {
      scale: 1,
      rotateY: 0,
      x: 0,
      zIndex: 3,
    },
    right: {
      scale: 0.85,
      rotateY: -12,
      x: -30,
      zIndex: 2,
    },
  };

  const config = positionConfig[position];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              scale: config.scale,
              rotateY: config.rotateY,
              x: config.x,
            }
          : {}
      }
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: position === "center" ? 1.05 : 0.9,
        rotateY: 0,
        zIndex: 10,
        transition: { duration: 0.3 },
      }}
      onClick={onClick}
      className="cursor-pointer relative group"
      style={{
        zIndex: config.zIndex,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <motion.div
        className="relative rounded-[32px] overflow-hidden"
      >
        <div
          className={position === "center" ? "relative w-72 lg:w-80" : "relative w-64 lg:w-72"}
          style={{
            aspectRatio: "9/19",",
            backgroundColor: isDark ? "rgba(30, 45, 60, 0.4)" : "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"}`,
            boxShadow: isDark
              ? "0 24px 64px rgba(0, 0, 0, 0.4)"
              : "0 16px 48px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Image src={src} alt={alt} fill className="object-cover" priority />
          
          {/* Overlay - Click to Expand */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          >
            <span className="text-white text-sm font-medium">Click to Expand</span>
          </motion.div>
        </div>
      </div>
      </motion.div>

      {/* Enhanced glow */}
      <motion.div
        className="absolute inset-0 rounded-[32px] pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${
            isDark ? projectData.orbColors.primary : projectData.orbColors.light.primary
          }40, transparent 70%)`,
          filter: `blur(${position === "center" ? 50 : 40}px)`,
          opacity: position === "center" ? 0.4 : 0.25,
        }}
        animate={{
          opacity: position === "center" ? [0.35, 0.45, 0.35] : [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

// =============================================
// DESKTOP MOCKUP COMPONENT
// =============================================
interface DesktopMockupProps {
  src: string;
  alt: string;
  index: number;
  onClick: () => void;
  isDark: boolean;
  position: "left" | "right";
}

const DesktopMockup = ({ src, alt, index, onClick, isDark, position }: DesktopMockupProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              scale: 1,
            }
          : {}
      }
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3 },
      }}
      onClick={onClick}
      className="cursor-pointer relative group"
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: "100%",
          aspectRatio: "16/10",
          backgroundColor: isDark ? "rgba(30, 45, 60, 0.4)" : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"}`,
          boxShadow: isDark
            ? "0 24px 64px rgba(0, 0, 0, 0.4)"
            : "0 16px 48px rgba(0, 0, 0, 0.08)",
        }}
      >
        <div className="relative w-full h-full">
          <Image src={src} alt={alt} fill className="object-cover" priority />
        </div>

        {/* Overlay on hover - Click to Expand */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(4px)",
            WebkitBackdropFilter: "blur(4px)",
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileHover={{ scale: 1 }}
            className="text-white text-lg font-medium"
          >
            Click to Expand
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none -z-10"
        style={{
          background: `radial-gradient(circle, ${
            isDark ? projectData.orbColors.secondary : projectData.orbColors.light.secondary
          }40, transparent 70%)`,
          filter: "blur(60px)",
          opacity: 0.3,
        }}
        animate={{
          opacity: [0.25, 0.35, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

// =============================================
// MAIN PAGE COMPONENT
// =============================================
export default function BlueWardPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<Array<{ name: string; image: string }>>([]);
  const [modalInitialIndex, setModalInitialIndex] = useState(0);
  const [isDesktopModal, setIsDesktopModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = !mounted || resolvedTheme === "dark";

  // Get theme-appropriate mobile gallery
  const mobileGallery = isDark ? projectData.mobileGallery.dark : projectData.mobileGallery.light;

  const handleOpenModal = (
    images: Array<{ name: string; image: string }>,
    index: number,
    isDesktop: boolean = false
  ) => {
    setModalImages(images);
    setModalInitialIndex(index);
    setIsDesktopModal(isDesktop);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Back to Top Button */}
      <BackToTopButton />

      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 800,
              height: 800,
              background: `radial-gradient(circle, ${
                isDark ? projectData.orbColors.primary : projectData.orbColors.light.primary
              }, transparent 70%)`,
              filter: `blur(${isDark ? 120 : 100}px)`,
              opacity: isDark ? 0.25 : 0.2,
              top: "10%",
              right: "-10%",
            }}
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute rounded-full"
            style={{
              width: 700,
              height: 700,
              background: `radial-gradient(circle, ${
                isDark ? projectData.orbColors.secondary : projectData.orbColors.light.secondary
              }, transparent 70%)`,
              filter: `blur(${isDark ? 100 : 80}px)`,
              opacity: isDark ? 0.2 : 0.15,
              bottom: "15%",
              left: "-5%",
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, -20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 xl:px-12 pt-24 pb-16">
          {/* Back to Projects Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm group"
              style={{
                color: isDark ? "rgba(255,255,255,0.65)" : "rgba(31, 41, 55, 0.7)",
              }}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Projects</span>
            </Link>
          </motion.div>

          {/* Two-column hero layout */}
          <div className="grid lg:grid-cols-2 gap-16 mb-24">
            {/* LEFT COLUMN - Text Content */}
            <motion.div
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

              {/* Action buttons */}
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

            {/* RIGHT COLUMN - Hero Image */}
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

              {/* Hero image */}
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

          {/* Desktop Mockups Section */}
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
                Desktop Views
              </h2>
              <p
                className="text-lg mt-2"
                style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(31, 41, 55, 0.7)" }}
              >
                Web-based emergency response dashboard
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {projectData.desktopGallery.map((item, index) => (
                <DesktopMockup
                  key={item.name}
                  src={item.image}
                  alt={`${projectData.title} — ${item.name}`}
                  index={index}
                  onClick={() => handleOpenModal(projectData.desktopGallery, index, true)}
                  isDark={isDark}
                  position={index === 0 ? "left" : "right"}
                />
              ))}
            </div>
          </div>

          {/* Mobile Mockups Section */}
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
                Cross-platform mobile emergency assistance
              </p>
            </motion.div>

            <div
              className="flex justify-center items-end gap-6"
              style={{ transformStyle: "preserve-3d" }}
            >
              <PhoneMockup
                src={mobileGallery[1].image}
                alt={`${projectData.title} — ${mobileGallery[1].name}`}
                index={0}
                onClick={() => handleOpenModal(mobileGallery, 1)}
                isDark={isDark}
                position="left"
              />

              <PhoneMockup
                src={mobileGallery[0].image}
                alt={`${projectData.title} — ${mobileGallery[0].name}`}
                index={1}
                onClick={() => handleOpenModal(mobileGallery, 0)}
                isDark={isDark}
                position="center"
              />

              <PhoneMockup
                src={mobileGallery[2].image}
                alt={`${projectData.title} — ${mobileGallery[2].name}`}
                index={2}
                onClick={() => handleOpenModal(mobileGallery, 2)}
                isDark={isDark}
                position="right"
              />
            </div>
          </div>

          {/* Features & Tech Stack Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
            {/* Features Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 p-8 rounded-3xl"
              style={{
                backgroundColor: isDark ? "rgba(30, 45, 60, 0.4)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${
                  isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"
                }`,
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{
                  color: isDark ? "rgba(255,255,255,0.95)" : "rgba(31, 41, 55, 0.95)",
                }}
              >
                Key Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectData.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ x: 4, transition: { duration: 0.2 } }}
                    className="flex items-start gap-3 p-3 rounded-xl cursor-pointer"
                    style={{
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <div
                      className="p-2 rounded-lg mt-1"
                      style={{
                        backgroundColor: `${projectData.orbColors.primary}20`,
                      }}
                    >
                      <feature.icon className="w-5 h-5" style={{ color: projectData.orbColors.primary }} />
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)",
                      }}
                    >
                      {feature.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tech Stack Card - Using Moonii design */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl"
              style={{
                backgroundColor: isDark ? "rgba(30, 45, 60, 0.4)" : "rgba(255, 255, 255, 0.5)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${
                  isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"
                }`,
              }}
            >
              <h3
                className="text-2xl font-bold mb-6"
                style={{
                  color: isDark ? "rgba(255,255,255,0.95)" : "rgba(31, 41, 55, 0.95)",
                }}
              >
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {projectData.techStack.map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="px-4 py-2 rounded-full text-xs font-medium cursor-default"
                    style={{
                      backgroundColor: `${projectData.orbColors.primary}15`,
                      color: isDark
                        ? projectData.orbColors.primary
                        : projectData.orbColors.light.primary,
                      border: `1px solid ${projectData.orbColors.primary}30`,
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Project Navigation */}
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
              <Link href={`/work/${projectData.prevProject.slug}`} className="group">
                <motion.div
                  whileHover={{ x: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3"
                  style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)" }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider opacity-60">Previous</p>
                    <p className="font-medium">{projectData.prevProject.name}</p>
                  </div>
                </motion.div>
              </Link>

              {/* Next Project */}
              <Link href={`/work/${projectData.nextProject.slug}`} className="group">
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-3"
                  style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)" }}
                >
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider opacity-60">Next</p>
                    <p className="font-medium">{projectData.nextProject.name}</p>
                  </div>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Fullscreen Modal */}
        <AnimatePresence>
          {modalOpen && (
            <FullscreenModalViewer
              images={modalImages}
              initialIndex={modalInitialIndex}
              onClose={handleCloseModal}
              isDark={isDark}
              isDesktop={isDesktopModal}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
