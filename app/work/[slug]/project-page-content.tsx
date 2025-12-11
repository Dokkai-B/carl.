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
            backgroundColor: `${project.colors.primary}33`,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: `1px solid ${project.colors.primary}4d`,
          }}
          whileHover={{
            backgroundColor: `${project.colors.primary}4d`,
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

export default function ProjectPageContent({ project, navigation }: ProjectPageContentProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const containerRef = useRef(null);

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  const showMobileSection = hasModuleMobileScreens(project);
  const showWebSection = hasWebViews(project);

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

        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {[
            {
              size: 450,
              x: 12,
              y: 18,
              color: isDark ? project.colors.primary : project.colors.light.primary,
              opacity: isDark ? 0.12 : 0.08,
              duration: 22,
            },
            {
              size: 380,
              x: 78,
              y: 58,
              color: isDark ? project.colors.secondary : project.colors.light.secondary,
              opacity: isDark ? 0.1 : 0.07,
              duration: 26,
            },
            {
              size: 350,
              x: 48,
              y: 82,
              color: isDark ? project.colors.primary : project.colors.light.primary,
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

        <div className="container mx-auto px-6 md:px-12 lg:px-[120px] py-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <motion.button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg"
              style={{
                color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(31, 41, 55, 0.75)",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.4)"}`,
              }}
              whileHover={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.4)",
                color: project.colors.primary,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-24"
          >
            <div className="flex flex-col justify-center">
              <div className="mb-6">
                <motion.h1
                  className="text-5xl md:text-6xl font-bold mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${isDark ? "white" : "black"}, ${
                      project.colors.primary
                    })`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {project.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-4 flex-wrap"
                >
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${project.colors.primary}20`,
                      color: project.colors.primary,
                      border: `1px solid ${project.colors.primary}40`,
                    }}
                  >
                    {project.category}
                  </span>
                  <span
                    className="text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                      color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(31, 41, 55, 0.5)",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    {project.year}
                  </span>
                </motion.div>
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
                {project.links.prototype && project.links.prototype !== "#" && (
                  <Link href={project.links.prototype} target="_blank">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                      style={{
                        background: `linear-gradient(135deg, ${project.colors.primary}, ${project.colors.secondary})`,
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

                {project.links.github && project.links.github !== "#" && (
                  <Link href={project.links.github} target="_blank">
                    <motion.button
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all border"
                      style={{
                        borderColor: project.colors.primary,
                        color: project.colors.primary,
                        backgroundColor: isDark
                          ? `${project.colors.primary}08`
                          : `${project.colors.primary}10`,
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: isDark
                          ? `${project.colors.primary}15`
                          : `${project.colors.primary}15`,
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
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <Image
                src={project.heroImage}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at top right, ${project.colors.primary}20, transparent 70%)`,
                }}
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

              <div className="flex items-center justify-center min-h-[600px]">
                <div className="flex gap-8 items-center justify-center flex-wrap">
                  {project.mobileScreens.slice(0, 3).map((screen, index) => {
                    const position = index === 0 ? "left" : index === 1 ? "center" : "right";
                    return (
                      <PhoneMockup
                        key={index}
                        src={screen.image}
                        alt={screen.name}
                        index={index}
                        onClick={() => openModal(index)}
                        isDark={isDark}
                        position={position as any}
                        projectColors={project.colors}
                      />
                    );
                  })}
                </div>
              </div>

              {project.mobileScreens.length > 3 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
                  {project.mobileScreens.slice(3).map((screen, index) => (
                    <motion.div
                      key={index + 3}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="relative aspect-[9/19.5] rounded-2xl overflow-hidden cursor-pointer group"
                      onClick={() => openModal(index + 3)}
                    >
                      <Image src={screen.image} alt={screen.name} fill className="object-cover" />
                      <motion.div
                        className="absolute inset-0 flex items-end justify-center p-4"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)",
                        }}
                      >
                        <p className="text-white font-medium">{screen.name}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              )}
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
              <div className="mb-12">
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

              <div className="space-y-6">
                {project.webViews.map((view, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => openModal(index)}
                  >
                    <Image src={view.image} alt={view.name} fill className="object-cover" />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        background: `linear-gradient(135deg, ${project.colors.primary}40, ${project.colors.secondary}40)`,
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <p className="text-white font-medium text-lg">{view.name}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Key Features</h2>

            <div
              className="p-8 md:p-12 rounded-3xl"
              style={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.6)"}`,
                boxShadow: isDark
                  ? "inset 0 1px 2px rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.3)"
                  : "inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.06)",
              }}
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
                    className="flex gap-4"
                  >
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background: isDark
                          ? `${project.colors.primary}15`
                          : `${project.colors.primary}20`,
                      }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="w-6 h-6" style={{ color: project.colors.primary }} />
                    </motion.div>

                    <div>
                      <p
                        className="font-medium mb-1"
                        style={{
                          color: isDark ? "rgba(255, 255, 255, 0.9)" : "rgb(31, 41, 55)",
                        }}
                      >
                        {feature.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Tech Stack</h2>

            <div
              className="p-8 md:p-12 rounded-3xl"
              style={{
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.4)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.6)"}`,
                boxShadow: isDark
                  ? "inset 0 1px 2px rgba(255, 255, 255, 0.05), 0 20px 40px rgba(0, 0, 0, 0.3)"
                  : "inset 0 1px 2px rgba(255, 255, 255, 0.6), 0 20px 40px rgba(0, 0, 0, 0.06)",
              }}
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
                        ? `${project.colors.primary}18`
                        : `${project.colors.light.primary}20`,
                      color: isDark ? project.colors.primary : project.colors.light.primary,
                      border: `1px solid ${
                        isDark ? `${project.colors.primary}28` : `${project.colors.light.primary}35`
                      }`,
                      opacity: 0.85,
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
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
