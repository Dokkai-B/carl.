"use client";

import { motion, useAnimation } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SkillNodes, { SkillNodesMobile } from "@/components/SkillNodes";
import { useEffect, useState, useRef, useCallback } from "react";
import { slidePocketChild, ANIMATION_CONFIG, coordinatedContainer } from "@/lib/animations";

// Container for staggered hero content - coordinated slide pocket animation
const heroContainer = coordinatedContainer(ANIMATION_CONFIG.stagger.normal, 0);

// Container for skill cards with slower stagger
const skillCardsContainer = coordinatedContainer(ANIMATION_CONFIG.stagger.slow, 0.1);

const HomePage = () => {
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const isExitingRef = useRef(false);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
    mountedRef.current = true;
    setShouldAnimate(true); // Immediately enable animations
    // Always wait for loader to complete on page load/refresh
    const handleLoaderComplete = () => {
      setLoaderComplete(true);
    };

    window.addEventListener("loaderComplete", handleLoaderComplete);

    // Check if loader already completed (e.g., fast navigation)
    // Give a small timeout in case the event already fired
    const fallbackTimer = setTimeout(() => {
      if (!loaderComplete) {
        // If no loader event after 3 seconds, assume it's done
        setLoaderComplete(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("loaderComplete", handleLoaderComplete);
      clearTimeout(fallbackTimer);
      if (menuTimeoutRef.current) {
        clearTimeout(menuTimeoutRef.current);
      }
    };
  }, []);

  // Listen for menu state changes
  useEffect(() => {
    const handleMenuState = (e: CustomEvent<{ isOpen: boolean }>) => {
      setMenuOpen(e.detail.isOpen);

      if (e.detail.isOpen) {
        // Menu opened - slide content up (hide into pocket)
        isExitingRef.current = true;
        setShouldAnimate(false);
      } else {
        // Menu closed - wait for distraction animation, then slide content back
        isExitingRef.current = false;

        // Delay content re-entry to sync with distraction animation
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

  // Hero section mouse handlers for orb scale boost
  // Name hover handler for orb merge animation - fixed positions
  const handleNameHover = useCallback((type: "full" | "short" | null) => {
    window.dispatchEvent(new CustomEvent("nameHover", { detail: { type } }));
  }, []);

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
              animate={shouldAnimate && !menuOpen ? "visible" : "hidden"}
              className="space-y-8 z-10 lg:col-span-3"
            >
              {/* Main Heading - Line by line slide pocket animation */}
              <div className="space-y-1 cursor-default">
                <motion.div variants={slidePocketChild}>
                  <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-normal leading-tight block">
                    Hey, I'm
                  </span>
                </motion.div>
                <motion.div variants={slidePocketChild}>
                  <span
                    data-hero-name="full"
                    className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight block cursor-pointer transition-all duration-300 ease-out hover:-translate-y-[2px] hover:tracking-wide hover:drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                    onMouseEnter={() => handleNameHover("full")}
                    onMouseLeave={() => handleNameHover(null)}
                  >
                    Carl Patrick Aguas
                  </span>
                </motion.div>
                <motion.div variants={slidePocketChild}>
                  <span className="text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-normal leading-tight block">
                    but you can call me
                  </span>
                </motion.div>
                <motion.div variants={slidePocketChild}>
                  <span
                    data-hero-name="short"
                    className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight block cursor-pointer transition-all duration-300 ease-out hover:-translate-y-[2px] hover:tracking-wide hover:drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]"
                    onMouseEnter={() => handleNameHover("short")}
                    onMouseLeave={() => handleNameHover(null)}
                  >
                    Carlo
                  </span>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <motion.div variants={slidePocketChild} className="flex flex-wrap gap-4">
                <Link href="/work">
                  <Button size="lg" className="group gap-2">
                    see my projects
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/resume">
                  <Button size="lg" variant="outline">
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

            {/* Right Side - Floating Skill Nodes (takes 2 of 5 columns = 40%) */}
            <motion.div
              initial="hidden"
              animate={shouldAnimate && !menuOpen ? "visible" : "hidden"}
              variants={skillCardsContainer}
              className="relative hidden lg:block lg:col-span-2"
            >
              <motion.div variants={slidePocketChild}>
                <SkillNodes />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Skills Section - Shows only on smaller screens */}
      <section className="lg:hidden py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate={shouldAnimate && !menuOpen ? "visible" : "exit"}
            variants={skillCardsContainer}
          >
            <motion.h2 variants={slidePocketChild} className="text-2xl font-bold text-center mb-8">
              What I <span className="gradient-text">Do</span>
            </motion.h2>
            <SkillNodesMobile />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
