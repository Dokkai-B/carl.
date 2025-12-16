"use client";

import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  ArrowUp,
  Mic,
  Cloud,
  Music,
  Play,
  Shield,
  Zap,
  Radio,
  MapPin,
  Camera,
  Monitor,
  Heart,
  Map,
  Users,
  Clock,
  Lock,
  Bolt,
  Wifi,
  AlertCircle,
} from "lucide-react";
import { Project, hasModuleMobileScreens, hasWebViews, IconName } from "@/data/projects";
import { FullscreenModalViewer } from "@/components/projects/FullscreenModalViewer";
import { PhoneMockup } from "@/components/projects/PhoneMockup";
import { OrbBackground } from "@/components/projects/OrbBackground";
import { GlassSection } from "@/components/projects/GlassSection";
import { BrowserMockup } from "@/components/projects/BrowserMockup";

// Icon map for resolving icon names to components
const iconMap: Record<IconName, typeof Mic> = {
  Mic,
  Cloud,
  Music,
  Play,
  Shield,
  Zap,
  Radio,
  MapPin,
  Camera,
  Monitor,
  Heart,
  Map,
  Users,
  Clock,
  Lock,
  Bolt,
  Wifi,
  AlertCircle,
};

const getIcon = (iconName: IconName) => {
  return iconMap[iconName];
};

// Helper function to darken a hex color by a percentage
const darkenColor = (hex: string, percent: number): string => {
  // Remove # if present
  const cleanHex = hex.replace("#", "");

  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Darken each component
  const darkenedR = Math.max(0, Math.floor(r * (1 - percent)));
  const darkenedG = Math.max(0, Math.floor(g * (1 - percent)));
  const darkenedB = Math.max(0, Math.floor(b * (1 - percent)));

  // Convert back to hex
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(darkenedR)}${toHex(darkenedG)}${toHex(darkenedB)}`;
};

// Helper to check if color is white or near-white
const isLightColor = (hex: string): boolean => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  // Consider colors with RGB values > 200 as too light
  return r > 200 && g > 200 && b > 200;
};

// Get gradient colors with proper darkening logic
const getGradientColors = (
  primary: string,
  secondary: string,
  isDark: boolean,
  projectSlug?: string
): { start: string; end: string } => {
  // Special case for Womens CLUB - lighten in dark mode for readability
  if (isDark && projectSlug === "womens-club") {
    return {
      start: "#4f46e5", // Lighter blue for dark mode
      end: "#6366f1",
    };
  }

  // If secondary is white/near-white, use a darker shade of primary instead
  if (isLightColor(secondary)) {
    return {
      start: darkenColor(primary, 0.15),
      end: darkenColor(primary, 0.35), // Darker variant of primary
    };
  }

  // Normal case: darken both colors
  return {
    start: darkenColor(primary, 0.15),
    end: darkenColor(secondary, 0.15),
  };
};

// Get display color for project (handles Womens CLUB special case)
const getDisplayColor = (primary: string, isDark: boolean, projectSlug?: string): string => {
  if (isDark && projectSlug === "womens-club") {
    return "#6366f1"; // Lighter blue for dark mode
  }
  return primary;
};

interface ProjectPageContentProps {
  project: Project;
  navigation: {
    prev: Project | null;
    next: Project | null;
  };
}

const ScrollProgressBar = ({ project }: { project: Project }) => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        background: `linear-gradient(90deg, ${project.colors.primary}, ${project.colors.secondary})`,
      }}
    />
  );
};

const BackToTopButton = ({ project }: { project: Project }) => {
  const [showButton, setShowButton] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const onScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Use light colors in dark mode, dark colors in light mode
  const bgColor = isDark ? project.colors.primary : project.colors.light?.primary;
  const arrowColor = isDark ? "white" : "#000";
  const borderColor = isDark ? `${project.colors.primary}40` : `${project.colors.light?.primary}40`;

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full"
          style={{
            background: bgColor,
            border: `1.5px solid ${borderColor}`,
          }}
          whileHover={{
            y: -4,
            scale: 1.08,
            boxShadow: `0 0 20px ${
              isDark ? `${project.colors.primary}80` : `${project.colors.light?.primary}60`
            }`,
          }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 transition-all" style={{ color: arrowColor }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function ProjectPageContent({ project, navigation }: ProjectPageContentProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const showMobileSection = hasModuleMobileScreens(project);
  const showWebSection = hasWebViews(project);

  // Prevent hydration mismatch - don't render theme-dependent content until mounted
  if (!mounted) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        body::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <ScrollProgressBar project={project} />
      <BackToTopButton project={project} />

      <div ref={containerRef} className="min-h-screen relative">
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

        <OrbBackground
          orbs={[
            { size: 450, x: 12, y: 18, duration: 22, colorIndex: 0 },
            { size: 380, x: 78, y: 58, duration: 26, colorIndex: 1 },
            { size: 350, x: 48, y: 82, duration: 20, colorIndex: 0 },
          ]}
          primaryColor={project.colors.primary}
          secondaryColor={project.colors.secondary}
          lightPrimaryColor={project.colors.light.primary}
          lightSecondaryColor={project.colors.light.secondary}
          zIndex={-10}
        />

        <div className="container mx-auto px-6 md:px-12 lg:px-[120px] py-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <motion.div
              role="button"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-medium cursor-pointer"
              whileHover="hover"
              initial="normal"
              style={{ color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(31, 41, 55, 0.75)" }}
            >
              <motion.div
                variants={{
                  normal: {
                    x: 0,
                    color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)",
                  },
                  hover: { x: -8, color: project.colors.primary },
                }}
                transition={{ duration: 0.2 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <span>Back to Projects</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 md:mb-24"
          >
            <div className="flex flex-col justify-center order-2 lg:order-1">
              <div className="mb-6">
                <motion.h1
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
                  style={{
                    color: isDark ? "white" : "rgb(17, 24, 39)",
                  }}
                >
                  {project.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-6 flex-wrap"
                >
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${getDisplayColor(
                        project.colors.primary,
                        isDark,
                        project.slug
                      )}20`,
                      color: getDisplayColor(project.colors.primary, isDark, project.slug),
                      border: `1px solid ${getDisplayColor(
                        project.colors.primary,
                        isDark,
                        project.slug
                      )}40`,
                    }}
                  >
                    {project.category}
                  </span>
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                      color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(31, 41, 55, 0.5)",
                      border: isDark
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    {project.year}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                  className="h-1 mb-6 origin-left"
                  style={{
                    background: (() => {
                      const colors = getGradientColors(
                        project.colors.primary,
                        project.colors.secondary,
                        isDark,
                        project.slug
                      );
                      return `linear-gradient(90deg, ${colors.start}, ${colors.end})`;
                    })(),
                    width: "160px",
                  }}
                />
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg leading-relaxed mb-8"
                style={{
                  color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(31, 41, 55, 0.8)",
                }}
              >
                {project.summary}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4 flex-wrap"
              >
                {project.links.prototype && (
                  <Link href={project.links.prototype} target="_blank">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                      style={{
                        background: (() => {
                          const colors = getGradientColors(
                            project.colors.primary,
                            project.colors.secondary,
                            isDark,
                            project.slug
                          );
                          return `linear-gradient(135deg, ${colors.start}, ${colors.end})`;
                        })(),
                        color: "white",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Prototype
                    </motion.button>
                  </Link>
                )}

                {project.links.github && (
                  <Link href={project.links.github} target="_blank">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all border"
                      style={{
                        borderColor: getDisplayColor(project.colors.primary, isDark, project.slug),
                        color: getDisplayColor(project.colors.primary, isDark, project.slug),
                        backgroundColor: isDark
                          ? `${getDisplayColor(project.colors.primary, isDark, project.slug)}08`
                          : `${getDisplayColor(project.colors.primary, isDark, project.slug)}10`,
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: isDark
                          ? `${getDisplayColor(project.colors.primary, isDark, project.slug)}15`
                          : `${getDisplayColor(project.colors.primary, isDark, project.slug)}15`,
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </motion.button>
                  </Link>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square rounded-2xl overflow-hidden order-1 lg:order-2"
            >
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </motion.div>

          {showMobileSection && project.mobileScreens && project.mobileScreens.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Mobile Experience</h2>
                <p
                  className="text-lg"
                  style={{
                    color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(31, 41, 55, 0.7)",
                  }}
                >
                  Intuitive interface designed for seamless mobile interaction
                </p>
              </div>

              {/* Mobile: Single column, Tablet: 2 phones, Desktop: 3 phones side by side */}
              {/* Mobile phones: stacked on small screens, side-by-side on larger */}
              <div className="flex items-center justify-center min-h-[400px] md:min-h-[500px] lg:min-h-[600px] px-2 sm:px-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2 md:gap-0 sm:flex-nowrap overflow-visible max-w-full">
                  {project.mobileScreens
                    .filter((screen) => /(MobileLeft|MobileCenter|MobileRight)/.test(screen.image))
                    .map((screen, index) => {
                      const position = index === 0 ? "left" : index === 1 ? "center" : "right";
                      return (
                        <PhoneMockup
                          key={index}
                          src={screen.image}
                          alt={screen.name}
                          index={index}
                          onClick={() => openModal(index)}
                          isDark={isDark}
                          position={position as "left" | "center" | "right"}
                          projectColors={project.colors}
                        />
                      );
                    })}
                </div>
              </div>
            </motion.div>
          )}

          {showWebSection && project.webViews && project.webViews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-24"
            >
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Web Interface</h2>
                <p
                  className="text-lg"
                  style={{
                    color: isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(31, 41, 55, 0.7)",
                  }}
                >
                  Responsive and feature-rich web experience
                </p>
              </div>

              {/* Satellite Orbital Layout - Responsive across all breakpoints */}
              <div className="relative w-full mx-auto">
                {(() => {
                  const heroView = project.webViews.find((view) =>
                    /DesktopCenter/i.test(view.image)
                  );
                  const leftView = project.webViews.find((view) => /DesktopLeft/i.test(view.image));
                  const rightView = project.webViews.find((view) =>
                    /DesktopRight/i.test(view.image)
                  );

                  // If no center hero exists (less than 3 images), display side by side
                  if (!heroView && project.webViews.length <= 2) {
                    return (
                      <div className="flex gap-4 md:gap-8 items-center justify-center flex-wrap">
                        {project.webViews.map((view, index) => (
                          <div key={index} className="w-full md:w-[45%] lg:w-[500px]">
                            <BrowserMockup
                              src={view.image}
                              alt={view.name}
                              onClick={() =>
                                openModal(
                                  showMobileSection && project.mobileScreens
                                    ? project.mobileScreens.length + index
                                    : index
                                )
                              }
                              variant="hero"
                              isDark={isDark}
                              primaryColor={project.colors.primary}
                              secondaryColor={project.colors.secondary}
                            />
                          </div>
                        ))}
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* Mobile & Tablet: Vertical Stack (< 1024px) */}
                      <div className="block lg:hidden space-y-6">
                        {heroView && (
                          <div className="w-full">
                            <BrowserMockup
                              src={heroView.image}
                              alt={heroView.name}
                              onClick={() =>
                                openModal(
                                  showMobileSection && project.mobileScreens
                                    ? project.mobileScreens.length +
                                        project.webViews.findIndex(
                                          (v) => v.image === heroView.image
                                        )
                                    : project.webViews.findIndex((v) => v.image === heroView.image)
                                )
                              }
                              variant="hero"
                              isDark={isDark}
                              primaryColor={project.colors.primary}
                              secondaryColor={project.colors.secondary}
                            />
                          </div>
                        )}
                        {leftView && (
                          <div className="w-full">
                            <BrowserMockup
                              src={leftView.image}
                              alt={leftView.name}
                              onClick={() =>
                                openModal(
                                  showMobileSection && project.mobileScreens
                                    ? project.mobileScreens.length +
                                        project.webViews.findIndex(
                                          (v) => v.image === leftView.image
                                        )
                                    : project.webViews.findIndex((v) => v.image === leftView.image)
                                )
                              }
                              variant="hero"
                              isDark={isDark}
                              primaryColor={project.colors.primary}
                              secondaryColor={project.colors.secondary}
                            />
                          </div>
                        )}
                        {rightView && (
                          <div className="w-full">
                            <BrowserMockup
                              src={rightView.image}
                              alt={rightView.name}
                              onClick={() =>
                                openModal(
                                  showMobileSection && project.mobileScreens
                                    ? project.mobileScreens.length +
                                        project.webViews.findIndex(
                                          (v) => v.image === rightView.image
                                        )
                                    : project.webViews.findIndex((v) => v.image === rightView.image)
                                )
                              }
                              variant="hero"
                              isDark={isDark}
                              primaryColor={project.colors.primary}
                              secondaryColor={project.colors.secondary}
                            />
                          </div>
                        )}
                      </div>

                      {/* Desktop: Satellite Orbital Layout (>= 1024px) */}
                      <div
                        className="hidden lg:flex items-center justify-center relative"
                        style={{ minHeight: "700px" }}
                      >
                        {/* Top-Left Satellite - Positioned diagonally, smaller, farther in depth */}
                        {leftView && (
                          <div
                            className="absolute"
                            style={{
                              left: "8%",
                              top: "0%",
                              width: "clamp(250px, 30%, 350px)",
                              transform: "translateY(-8%)",
                              zIndex: 5,
                            }}
                          >
                            <BrowserMockup
                              src={leftView.image}
                              alt={leftView.name}
                              onClick={() =>
                                openModal(
                                  showMobileSection && project.mobileScreens
                                    ? project.mobileScreens.length +
                                        project.webViews.findIndex(
                                          (v) => v.image === leftView.image
                                        )
                                    : project.webViews.findIndex((v) => v.image === leftView.image)
                                )
                              }
                              variant="satellite"
                              position="top-left"
                              isDark={isDark}
                              primaryColor={project.colors.primary}
                              secondaryColor={project.colors.secondary}
                              rotationIdle={-12}
                              depthScale={0.85}
                              idleOpacity={0.75}
                            />
                          </div>
                        )}

                        {/* Center Hero - Dominant, stable, frontmost */}
                        {heroView && (
                          <div
                            className="relative"
                            style={{
                              width: "clamp(500px, 55vw, 700px)",
                              zIndex: 20,
                            }}
                          >
                            <BrowserMockup
                              src={heroView.image}
                              alt={heroView.name}
                              onClick={() =>
                                openModal(
                                  showMobileSection && project.mobileScreens
                                    ? project.mobileScreens.length +
                                        project.webViews.findIndex(
                                          (v) => v.image === heroView.image
                                        )
                                    : project.webViews.findIndex((v) => v.image === heroView.image)
                                )
                              }
                              variant="hero"
                              isDark={isDark}
                              primaryColor={project.colors.primary}
                              secondaryColor={project.colors.secondary}
                            />
                          </div>
                        )}

                        {/* Bottom-Right Satellite - Positioned diagonally opposite, smaller, farther */}
                        {rightView && (
                          <div
                            className="absolute"
                            style={{
                              right: "8%",
                              bottom: "0%",
                              width: "clamp(250px, 30%, 350px)",
                              transform: "translateY(8%)",
                              zIndex: 5,
                            }}
                          >
                            <BrowserMockup
                              src={rightView.image}
                              alt={rightView.name}
                              onClick={() =>
                                openModal(
                                  showMobileSection && project.mobileScreens
                                    ? project.mobileScreens.length +
                                        project.webViews.findIndex(
                                          (v) => v.image === rightView.image
                                        )
                                    : project.webViews.findIndex((v) => v.image === rightView.image)
                                )
                              }
                              variant="satellite"
                              position="bottom-right"
                              isDark={isDark}
                              primaryColor={project.colors.primary}
                              secondaryColor={project.colors.secondary}
                              rotationIdle={12}
                              depthScale={0.85}
                              idleOpacity={0.75}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24 relative"
          >
            {/* Background orbs behind section */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              {[
                {
                  size: 360,
                  x: 8,
                  y: 14,
                  color: isDark ? project.colors.primary : project.colors.light.primary,
                  opacity: isDark ? 0.18 : 0.12,
                  duration: 22,
                },
                {
                  size: 300,
                  x: 78,
                  y: 64,
                  color: isDark ? project.colors.secondary : project.colors.light.secondary,
                  opacity: isDark ? 0.15 : 0.1,
                  duration: 26,
                },
              ].map((orb, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: orb.size,
                    height: orb.size,
                    background: `radial-gradient(circle, ${orb.color}60, transparent 70%)`,
                    opacity: orb.opacity,
                    left: `${orb.x}%`,
                    top: `${orb.y}%`,
                    filter: `blur(${isDark ? 80 : 70}px)`,
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

            <h2 className="text-3xl md:text-4xl font-bold mb-12">Key Features</h2>

            <GlassSection
              allowOrbOverlap={true}
              orbSlot="inside"
              orbs={[
                { size: 240, x: 64, y: 10, duration: 18, colorIndex: 0 },
                { size: 180, x: 22, y: 72, duration: 20, colorIndex: 1 },
              ]}
              primaryColor={project.colors.primary}
              secondaryColor={project.colors.secondary}
              lightPrimaryColor={project.colors.light.primary}
              lightSecondaryColor={project.colors.light.secondary}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.features.map((feature, index) => {
                  const Icon = getIcon(feature.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 group"
                      whileHover="hover"
                    >
                      <motion.div
                        className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{
                          background: isDark
                            ? `${getDisplayColor(project.colors.primary, isDark, project.slug)}15`
                            : `${project.colors.primary}20`,
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{
                            color: getDisplayColor(project.colors.primary, isDark, project.slug),
                          }}
                        />
                      </motion.div>

                      <motion.div
                        className="flex-1 px-3 py-2 rounded-lg transition-colors"
                        variants={{
                          normal: {
                            backgroundColor: "transparent",
                          },
                          hover: {
                            backgroundColor: isDark
                              ? "rgba(255, 255, 255, 0.08)"
                              : "rgba(0, 0, 0, 0.06)",
                          },
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <p
                          className="font-medium mb-1"
                          style={{
                            color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgb(31, 41, 55)",
                          }}
                        >
                          {feature.text}
                        </p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassSection>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24 relative"
          >
            {/* Background orbs behind section */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
              {[
                {
                  size: 340,
                  x: 10,
                  y: 22,
                  color: isDark ? project.colors.primary : project.colors.light.primary,
                  opacity: isDark ? 0.17 : 0.12,
                  duration: 24,
                },
                {
                  size: 280,
                  x: 74,
                  y: 50,
                  color: isDark ? project.colors.secondary : project.colors.light.secondary,
                  opacity: isDark ? 0.14 : 0.1,
                  duration: 28,
                },
              ].map((orb, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: orb.size,
                    height: orb.size,
                    background: `radial-gradient(circle, ${orb.color}60, transparent 70%)`,
                    opacity: orb.opacity,
                    left: `${orb.x}%`,
                    top: `${orb.y}%`,
                    filter: `blur(${isDark ? 80 : 70}px)`,
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

            <h2 className="text-3xl md:text-4xl font-bold mb-12">Tech Stack</h2>

            <GlassSection
              allowOrbOverlap={true}
              orbSlot="inside"
              orbs={[
                { size: 230, x: 64, y: 12, duration: 18, colorIndex: 0 },
                { size: 170, x: 20, y: 70, duration: 20, colorIndex: 1 },
              ]}
              primaryColor={project.colors.primary}
              secondaryColor={project.colors.secondary}
              lightPrimaryColor={project.colors.light.primary}
              lightSecondaryColor={project.colors.light.secondary}
            >
              <div className="flex flex-wrap gap-3">
                {project.techStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
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
                        ? `${getDisplayColor(project.colors.primary, isDark, project.slug)}18`
                        : `${getDisplayColor(project.colors.primary, isDark, project.slug)}20`,
                      color: getDisplayColor(project.colors.primary, isDark, project.slug),
                      border: `1px solid ${
                        isDark
                          ? `${getDisplayColor(project.colors.primary, isDark, project.slug)}28`
                          : `${getDisplayColor(project.colors.primary, isDark, project.slug)}35`
                      }`,
                      opacity: 0.85,
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </GlassSection>
          </motion.div>

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
              {navigation.prev ? (
                <Link href={`/work/${navigation.prev.slug}`}>
                  <motion.div
                    className="flex items-center gap-3 cursor-pointer"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)",
                    }}
                    whileHover="hover"
                    initial="normal"
                  >
                    <motion.div
                      variants={{
                        normal: {
                          x: 0,
                          color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)",
                        },
                        hover: { x: -8, color: project.colors.primary },
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </motion.div>
                    <div>
                      <p className="text-xs uppercase tracking-wider opacity-60">Previous</p>
                      <p className="font-medium">{navigation.prev.title}</p>
                    </div>
                  </motion.div>
                </Link>
              ) : (
                <div />
              )}

              {navigation.next ? (
                <Link href={`/work/${navigation.next.slug}`}>
                  <motion.div
                    className="flex items-center gap-3 cursor-pointer"
                    style={{
                      color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)",
                    }}
                    whileHover="hover"
                    initial="normal"
                  >
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider opacity-60">Next</p>
                      <p className="font-medium">{navigation.next.title}</p>
                    </div>
                    <motion.div
                      variants={{
                        normal: {
                          x: 0,
                          color: isDark ? "rgba(255,255,255,0.75)" : "rgba(31, 41, 55, 0.8)",
                        },
                        hover: { x: 8, color: project.colors.primary },
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {modalOpen && (
            <FullscreenModalViewer
              images={
                showMobileSection && project.mobileScreens
                  ? [...(project.mobileScreens || []), ...(project.webViews || [])]
                  : project.webViews || []
              }
              initialIndex={modalIndex}
              onClose={() => setModalOpen(false)}
              isDark={isDark}
              projectColors={project.colors}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
