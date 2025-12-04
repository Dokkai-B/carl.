"use client";

import { motion, useAnimation } from "framer-motion";
import { ArrowRight, Code2, Palette, Rocket, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SkillCard from "@/components/SkillCard";
import { useEffect, useState, useRef } from "react";
import {
  slidePocketContainer,
  slidePocketChild,
  ANIMATION_CONFIG,
  coordinatedContainer,
} from "@/lib/animations";

// Container for staggered hero content - coordinated slide pocket animation
const heroContainer = coordinatedContainer(ANIMATION_CONFIG.stagger.normal, 0);

// Container for skill cards with slower stagger
const skillCardsContainer = coordinatedContainer(ANIMATION_CONFIG.stagger.slow, 0.1);

const HomePage = () => {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const contentControls = useAnimation();
  const skillsControls = useAnimation();
  const isExitingRef = useRef(false);

  useEffect(() => {
    // Always wait for loader to complete on page load/refresh
    const handleLoaderComplete = () => {
      setLoaderComplete(true);
    };

    window.addEventListener("loaderComplete", handleLoaderComplete);

    // Check if loader already completed (e.g., fast navigation)
    // Give a small timeout in case the event already fired
    const fallbackTimer = setTimeout(() => {
      if (!loaderComplete) {
        // If no loader event after 5 seconds, assume it's done
        setLoaderComplete(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener("loaderComplete", handleLoaderComplete);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Listen for menu state changes
  useEffect(() => {
    const handleMenuState = (e: CustomEvent<{ isOpen: boolean }>) => {
      setMenuOpen(e.detail.isOpen);

      if (e.detail.isOpen) {
        // Menu opened - slide content up (hide into pocket)
        isExitingRef.current = true;
        contentControls.start("exit");
        skillsControls.start("exit");
      } else {
        // Menu closed - wait for distraction animation, then slide content back
        isExitingRef.current = false;

        // Delay content re-entry to sync with distraction animation
        const enterDelay = ANIMATION_CONFIG.transition.enterDelay * 1000;
        setTimeout(() => {
          if (!isExitingRef.current) {
            contentControls.start("visible");
            skillsControls.start("visible");
          }
        }, enterDelay);
      }
    };

    window.addEventListener("menuStateChange", handleMenuState as EventListener);
    return () => window.removeEventListener("menuStateChange", handleMenuState as EventListener);
  }, [contentControls, skillsControls]);

  // Trigger initial animation when loader completes
  useEffect(() => {
    if (loaderComplete && !menuOpen && !isExitingRef.current) {
      contentControls.start("visible");
      skillsControls.start("visible");
    }
  }, [loaderComplete, menuOpen, contentControls, skillsControls]);

  return (
    <div>
      {/* Hero Section - Full Screen Split Design */}
      <section className="min-h-[calc(100vh-6rem)] relative flex items-center overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left Side - Content (takes 3 of 5 columns = 60%) */}
            <motion.div
              variants={heroContainer}
              initial="hidden"
              animate={contentControls}
              exit="exit"
              className="space-y-8 z-10 lg:col-span-3"
            >
              {/* Main Heading - Line by line slide pocket animation */}
              <div className="space-y-1">
                <motion.div variants={slidePocketChild}>
                  <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-normal leading-tight block">
                    Hey, I'm
                  </span>
                </motion.div>
                <motion.div variants={slidePocketChild}>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight block">
                    Carl Patrick Aguas
                  </span>
                </motion.div>
                <motion.div variants={slidePocketChild}>
                  <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-normal leading-tight block">
                    but you can call me
                  </span>
                </motion.div>
                <motion.div variants={slidePocketChild}>
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight block">
                    Carlo
                  </span>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <motion.div variants={slidePocketChild} className="flex flex-wrap gap-4">
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
              <motion.div variants={slidePocketChild} className="flex items-center gap-4 pt-4">
                <span className="text-sm text-muted-foreground">Follow me:</span>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/Dokkai-B"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-primary/50 transition-all hover:scale-110"
                  >
                    <Github className="w-5 h-5" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/carl-patrick-adrian-aguas-0a5959292/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-primary/50 transition-all hover:scale-110"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="mailto:cpacaguas@mymail.mapua.edu.ph"
                    className="w-10 h-10 glass rounded-full flex items-center justify-center hover:border-primary/50 transition-all hover:scale-110"
                  >
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Visual Element (takes 2 of 5 columns = 40%) */}
            <motion.div
              initial="hidden"
              animate={skillsControls}
              exit="exit"
              variants={skillCardsContainer}
              className="relative h-[600px] hidden lg:block lg:col-span-2"
            >
              {/* Skill Cards with slide pocket animation */}
              <motion.div variants={slidePocketChild} className="absolute top-10 right-60 z-30">
                <SkillCard
                  icon={Code2}
                  title="Full-Stack Development"
                  description="Building scalable web applications with modern technologies"
                  floatDirection="up"
                  floatDuration={6}
                  delay={0}
                />
              </motion.div>

              <motion.div variants={slidePocketChild} className="absolute top-[30%] right-2 z-20">
                <SkillCard
                  icon={Palette}
                  title="UI/UX Design"
                  description="Crafting intuitive and beautiful user interfaces"
                  floatDirection="down"
                  floatDuration={7}
                  delay={1}
                />
              </motion.div>

              <motion.div variants={slidePocketChild} className="absolute bottom-10 left-0 z-10">
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
