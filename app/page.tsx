"use client";

import { motion } from "framer-motion";
import { ArrowRight, Code2, Palette, Rocket, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SkillCard from "@/components/SkillCard";
import { useEffect, useState } from "react";

// Animation variants for staggered entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// Subtle slide up animation
const slideUp = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Subtle slide from left for buttons
const slideFromLeft = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Slide up with blur for skill cards
const slideUpBlur = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const HomePage = () => {
  const [loaderComplete, setLoaderComplete] = useState(false);

  useEffect(() => {
    // Check if this is a fresh page load or navigation
    const isInitialLoad = !sessionStorage.getItem("hasVisited");

    if (isInitialLoad) {
      // First visit - wait for loader to complete
      const handleLoaderComplete = () => {
        setLoaderComplete(true);
        sessionStorage.setItem("hasVisited", "true");
      };

      window.addEventListener("loaderComplete", handleLoaderComplete);
      return () => window.removeEventListener("loaderComplete", handleLoaderComplete);
    } else {
      // Navigation from another page - animate immediately
      setLoaderComplete(true);
    }
  }, []);

  return (
    <div>
      {/* Hero Section - Full Screen Split Design */}
      <section className="min-h-[calc(100vh-6rem)] relative flex items-center overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left Side - Content (takes 3 of 5 columns = 60%) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={loaderComplete ? "visible" : "hidden"}
              className="space-y-8 z-10 lg:col-span-3"
            >
              {/* Main Heading */}
              <div className="space-y-1">
                <motion.div variants={slideUp}>
                  <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-normal leading-tight block">
                    Hey, I'm
                  </span>
                </motion.div>
                <motion.div variants={slideUp}>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight block">
                    Carl Patrick Aguas
                  </span>
                </motion.div>
                <motion.div variants={slideUp}>
                  <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-normal leading-tight block">
                    but you can call me
                  </span>
                </motion.div>
                <motion.div variants={slideUp}>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight block">
                    Carlo
                  </span>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <motion.div variants={slideFromLeft} className="flex flex-wrap gap-4">
                <Link href="/work">
                  <Button
                    size="lg"
                    className="group gap-2"
                    onMouseEnter={() =>
                      window.dispatchEvent(new CustomEvent("orbHover", { detail: "projects" }))
                    }
                    onMouseLeave={() =>
                      window.dispatchEvent(new CustomEvent("orbHover", { detail: null }))
                    }
                  >
                    see my projects
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/resume">
                  <Button
                    size="lg"
                    variant="outline"
                    onMouseEnter={() =>
                      window.dispatchEvent(new CustomEvent("orbHover", { detail: "about" }))
                    }
                    onMouseLeave={() =>
                      window.dispatchEvent(new CustomEvent("orbHover", { detail: null }))
                    }
                  >
                    more about me
                  </Button>
                </Link>
              </motion.div>

              {/* Social Links */}
              <motion.div variants={slideUp} className="flex items-center gap-4 pt-4">
                <span className="text-sm text-muted-foreground">Follow me:</span>
                <div className="flex gap-3">
                  <motion.a
                    href="https://github.com/Dokkai-B"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-primary/50 transition-all hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="https://www.linkedin.com/in/carl-patrick-adrian-aguas-0a5959292/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-primary/50 transition-all hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="mailto:cpacaguas@mymail.mapua.edu.ph"
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-primary/50 transition-all hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Visual Element (takes 2 of 5 columns = 40%) */}
            <motion.div
              initial="hidden"
              animate={loaderComplete ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12,
                    delayChildren: 0.4,
                  },
                },
              }}
              className="relative h-[600px] hidden lg:block lg:col-span-2"
            >
              {/* Skill Cards with 3D tilt and glass hover */}
              <motion.div variants={slideUpBlur} className="absolute top-10 right-60 z-30">
                <SkillCard
                  icon={Code2}
                  title="Full-Stack Development"
                  description="Building scalable web applications with modern technologies"
                  floatDirection="up"
                  floatDuration={6}
                  delay={0}
                />
              </motion.div>

              <motion.div variants={slideUpBlur} className="absolute top-[30%] right-2 z-20">
                <SkillCard
                  icon={Palette}
                  title="UI/UX Design"
                  description="Crafting intuitive and beautiful user interfaces"
                  floatDirection="down"
                  floatDuration={7}
                  delay={1}
                />
              </motion.div>

              <motion.div variants={slideUpBlur} className="absolute bottom-10 left-0 z-10">
                <SkillCard
                  icon={Rocket}
                  title="Problem Solving"
                  description="Turning complex challenges into elegant solutions"
                  floatDirection="up"
                  floatDuration={8}
                  delay={2}
                />
              </motion.div>

              {/* Decorative Elements */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div
                  className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
