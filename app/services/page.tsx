"use client";

import { motion, useInView, useAnimation } from "framer-motion";
import { Code2, Smartphone, Monitor, Palette, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  slidePocketContainer,
  slidePocketChild,
  ANIMATION_CONFIG,
  coordinatedContainer,
} from "@/lib/animations";

// Header animations with coordinated slide-pocket effect
const headerContainer = coordinatedContainer(ANIMATION_CONFIG.stagger.normal, 0);

// Services grid container
const gridContainer = coordinatedContainer(ANIMATION_CONFIG.stagger.slow, 0.1);

const services = [
  {
    icon: Code2,
    title: "Web Development",
    description:
      "Creating responsive, modern websites using cutting-edge technologies like React, Next.js, and TypeScript. Building scalable web applications with clean code and best practices.",
    features: ["Responsive Design", "Modern Frameworks", "SEO Optimization", "Performance Focused"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description:
      "Developing high-performance mobile apps for iOS and Android using React Native. Focusing on smooth user experiences, native features, and cross-platform compatibility.",
    features: [
      "Cross-Platform Apps",
      "Native Performance",
      "Intuitive UI/UX",
      "Firebase Integration",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Monitor,
    title: "Desktop Solutions",
    description:
      "Building efficient desktop applications tailored to specific needs. Creating cross-platform solutions that are secure, responsive, and easy to use.",
    features: ["Cross-Platform", "Secure & Reliable", "Modern UI", "Custom Solutions"],
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Designing beautiful, user-centered interfaces using Figma and Adobe Creative Suite. Creating engaging digital experiences that combine aesthetics with functionality.",
    features: ["User Research", "Wireframing & Prototyping", "Brand Identity", "Design Systems"],
    color: "from-green-500 to-emerald-500",
  },
];

const Services = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [menuOpen, setMenuOpen] = useState(false);
  const isExitingRef = useRef(false);
  const headerControls = useAnimation();
  const gridControls = useAnimation();
  const ctaControls = useAnimation();

  // Listen for menu state changes
  useEffect(() => {
    const handleMenuState = (e: CustomEvent<{ isOpen: boolean }>) => {
      setMenuOpen(e.detail.isOpen);

      if (e.detail.isOpen) {
        // Menu opened - slide content up (hide into pocket)
        isExitingRef.current = true;
        headerControls.start("exit");
        gridControls.start("exit");
        ctaControls.start("exit");
      } else {
        // Menu closed - wait for distraction, then slide content back
        isExitingRef.current = false;
        const enterDelay = ANIMATION_CONFIG.transition.enterDelay * 1000;
        setTimeout(() => {
          if (!isExitingRef.current) {
            headerControls.start("visible");
            gridControls.start("visible");
            ctaControls.start("visible");
          }
        }, enterDelay);
      }
    };

    window.addEventListener("menuStateChange", handleMenuState as EventListener);
    return () => window.removeEventListener("menuStateChange", handleMenuState as EventListener);
  }, [headerControls, gridControls, ctaControls]);

  // Initial animation
  useEffect(() => {
    if (!menuOpen && !isExitingRef.current) {
      headerControls.start("visible");
      ctaControls.start("visible");
    }
  }, [menuOpen, headerControls, ctaControls]);

  // Grid animation when in view
  useEffect(() => {
    if (isInView && !menuOpen && !isExitingRef.current) {
      gridControls.start("visible");
    }
  }, [isInView, menuOpen, gridControls]);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header - Slide pocket animation with stagger */}
        <motion.div
          variants={headerContainer}
          initial="hidden"
          animate={headerControls}
          exit="exit"
          className="text-center mb-16"
        >
          <motion.div
            variants={slidePocketChild}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm mb-4"
          >
            <Code2 className="h-4 w-4" />
            <span>What I Offer</span>
          </motion.div>
          <motion.h1 variants={slidePocketChild} className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Services</span>
          </motion.h1>
          <motion.p
            variants={slidePocketChild}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Comprehensive solutions tailored to bring your digital vision to life with modern
            technologies and best practices
          </motion.p>
        </motion.div>

        {/* Services Grid - Slide pocket with stagger */}
        <motion.div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16"
          variants={gridContainer}
          initial="hidden"
          animate={gridControls}
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={index} variants={slidePocketChild} className="group relative">
                <div className="glass-strong p-8 rounded-3xl border border-border/50 hover:border-primary/50 transition-all duration-500 h-full">
                  {/* Icon with gradient background */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} p-0.5 mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Decorative gradient */}
                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section - Slide pocket animation */}
        <motion.div
          variants={slidePocketChild}
          initial="hidden"
          animate={ctaControls}
          viewport={{ once: true }}
          className="glass-strong rounded-3xl p-12 text-center border border-border/50"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your <span className="gradient-text">Project?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Let's collaborate to create something amazing together. I'm here to help turn your ideas
            into reality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/work">
              <Button size="lg" variant="outline">
                View My Work
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
