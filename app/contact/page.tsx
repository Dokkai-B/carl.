"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FaGithub, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { slidePocketChild, ANIMATION_CONFIG } from "@/lib/animations";
import { useTheme } from "next-themes";

const Contact = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const isExitingRef = useRef(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { resolvedTheme } = useTheme();

  // Generate particle positions only on client to avoid hydration mismatch
  const [particles] = useState(() =>
    [...Array(6)].map((_, i) => ({
      id: i,
      opacity: 0.3 + Math.random() * 0.4,
      left: Math.random() * 100,
      top: Math.random() * 100,
      yEnd1: -100 - Math.random() * 100,
      yEnd2: -200 - Math.random() * 100,
      xEnd1: (Math.random() - 0.5) * 100,
      xEnd2: (Math.random() - 0.5) * 100,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
    }))
  );

  const isDark = mounted && resolvedTheme === "dark";

  // Orb data for background
  const orbs = [
    { id: 1, color: "#5dade2", size: 350, x: "85%", y: "-5%" },
    { id: 2, color: "#3498db", size: 280, x: "-5%", y: "15%" },
    { id: 3, color: "#667eea", size: 320, x: "80%", y: "85%" },
  ];

  // Social links
  const socialLinks = [
    {
      id: 1,
      label: "GitHub",
      icon: <FaGithub className="w-6 h-6" />,
      path: "https://github.com/Dokkai-B?tab=overview&from=2024-09-01&to=2024-09-08",
      color: "#9b9b9b",
    },
    {
      id: 2,
      label: "LinkedIn",
      icon: <FaLinkedinIn className="w-6 h-6" />,
      path: "https://www.linkedin.com/in/carlaguas",
      color: "#0a66c2",
    },
    {
      id: 3,
      label: "Instagram",
      icon: <FaInstagram className="w-6 h-6" />,
      path: "https://instagram.com",
      color: "#e1306c",
    },
  ];

  // Listen for menu state changes
  useEffect(() => {
    setMounted(true);
    mountedRef.current = true;
    setShouldAnimate(true); // Immediately enable animations

    const handleMenuState = (e: CustomEvent<{ isOpen: boolean }>) => {
      setMenuOpen(e.detail.isOpen);

      if (e.detail.isOpen) {
        isExitingRef.current = true;
        setShouldAnimate(false);
      } else {
        isExitingRef.current = false;
        const enterDelay = ANIMATION_CONFIG.transition.enterDelay * 1000;
        if (menuTimeoutRef.current) {
          clearTimeout(menuTimeoutRef.current);
        }
        menuTimeoutRef.current = setTimeout(() => {
          if (!isExitingRef.current) {
            setShouldAnimate(true);
          }
        }, enterDelay);
      }
    };

    window.addEventListener("menuStateChange", handleMenuState as EventListener);
    return () => {
      window.removeEventListener("menuStateChange", handleMenuState as EventListener);
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid texture background */}
      <div className="fixed inset-0 -z-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(93, 173, 226, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(93, 173, 226, 0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {orbs.map((orb, index) => (
          <motion.div
            key={orb.id}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              backgroundColor: orb.color,
              filter: "blur(80px)",
              opacity: 0.08,
              left: orb.x,
              top: orb.y,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 40, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25 + index * 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Interactive background particles */}
      <div className="fixed inset-0 -z-5 overflow-hidden pointer-events-none">
        {mounted && particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            style={{
              position: "absolute",
              width: "2px",
              height: "2px",
              borderRadius: "50%",
              backgroundColor: `rgba(93, 173, 226, ${particle.opacity})`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, particle.yEnd1, particle.yEnd2],
              opacity: [0.3, 0.8, 0],
              x: [0, particle.xEnd1, particle.xEnd2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          variants={slidePocketChild}
          initial="hidden"
          animate={shouldAnimate && !menuOpen ? "visible" : "exit"}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Title */}
          <motion.h1
            variants={slidePocketChild}
            className="text-5xl md:text-6xl font-bold text-center mb-12"
          >
            Contacts
          </motion.h1>

          {/* Email Pill */}
          <motion.div
            variants={slidePocketChild}
            className="flex justify-center mb-16"
          >
            <motion.a
              href="mailto:cpacaguas@mymail.mapua.edu.ph"
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative group"
            >
              {/* Pill background blur */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  backgroundColor: isDark ? "rgba(20, 30, 40, 0.6)" : "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              />

              {/* Pill border and shadow */}
              <div
                className="absolute inset-0 rounded-full transition-shadow duration-300"
                style={{
                  border: `1.5px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)"}`,
                  boxShadow: isDark
                    ? "inset 0 2px 4px rgba(255,255,255,0.05), 0 10px 30px rgba(93, 173, 226, 0.15)"
                    : "inset 0 2px 4px rgba(255,255,255,0.6), 0 10px 30px rgba(93, 173, 226, 0.1)",
                }}
              />

              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: isDark
                    ? "0 0 30px rgba(93, 173, 226, 0.3), inset 0 0 20px rgba(93, 173, 226, 0.1)"
                    : "0 0 30px rgba(93, 173, 226, 0.2), inset 0 0 20px rgba(93, 173, 226, 0.08)",
                }}
              />

              {/* Content */}
              <div className="relative px-8 py-3 font-medium text-foreground">
                cpacaguas@mymail.mapua.edu.ph
              </div>
            </motion.a>
          </motion.div>

          {/* Social Icons Grid */}
          <motion.div
            variants={slidePocketChild}
            className="flex justify-center gap-6 md:gap-8"
          >
            {socialLinks.map((social, index) => (
              <SocialIconCard key={social.id} social={social} index={index} isDark={isDark} />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Social Icon Card Component
const SocialIconCard = ({ social, index, isDark }: { social: any; index: number; isDark: boolean }) => {
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" } as any}
      className="relative group"
    >
      <motion.a
        href={social.path}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Background blur */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundColor: isDark ? "rgba(20, 30, 40, 0.5)" : "rgba(255, 255, 255, 0.4)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        />

        {/* Border and shadow */}
        <div
          className="absolute inset-0 rounded-2xl transition-shadow duration-300"
          style={{
            border: `1.5px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)"}`,
            boxShadow: isDark
              ? "inset 0 2px 4px rgba(255,255,255,0.05), 0 20px 40px rgba(0, 0, 0, 0.35)"
              : "inset 0 2px 4px rgba(255,255,255,0.6), 0 20px 40px rgba(0, 0, 0, 0.08)",
          }}
        />

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: isDark
              ? `0 0 40px ${social.color}40, inset 0 0 30px ${social.color}20`
              : `0 0 40px ${social.color}30, inset 0 0 30px ${social.color}15`,
          }}
        />

        {/* Shine sweep */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Content */}
        <div className="relative p-6 flex flex-col items-center gap-2" style={{ transform: "translateZ(20px)" } as any}>
          <div style={{ color: social.color }} className="text-2xl">
            {social.icon}
          </div>
          <motion.span
            initial={{ opacity: 0, y: -5 }}
            animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-xs font-medium uppercase tracking-wide"
          >
            {social.label}
          </motion.span>
        </div>
      </motion.a>
    </motion.div>
  );
};

export default Contact;
