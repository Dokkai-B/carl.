"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Code2, Palette, Rocket, Download, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Stats from "@/components/Stats";
import { useRef } from "react";

const HomePage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef}>
      {/* Hero Section - Full Screen Split Design */}
      <section className="min-h-screen relative flex items-center overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Left Side - Content (takes 3 of 5 columns = 60%) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ y, opacity }}
              className="space-y-8 z-10 lg:col-span-3"
            >
              {/* Main Heading */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                    <span className="text-muted-foreground font-normal">Hey, I'm</span>
                    <br />
                    <span className="gradient-text">Carl Patrick Aguas</span>
                    <br />
                    <span className="text-muted-foreground font-normal">but you can call me</span>
                    <br />
                    <span className="gradient-text">Carlo</span>
                  </h1>
                </motion.div>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-4"
              >
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center gap-4 pt-4"
              >
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
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[600px] hidden lg:block lg:col-span-2"
            >
              {/* Floating Cards */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-64 glass-strong p-6 rounded-2xl border border-border/50"
              >
                <Code2 className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold mb-2">Full-Stack Development</h3>
                <p className="text-sm text-muted-foreground">
                  Building scalable web applications with modern technologies
                </p>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute bottom-32 right-16 w-64 glass-strong p-6 rounded-2xl border border-border/50"
              >
                <Palette className="w-12 h-12 text-accent mb-4" />
                <h3 className="font-semibold mb-2">UI/UX Design</h3>
                <p className="text-sm text-muted-foreground">
                  Crafting intuitive and beautiful user interfaces
                </p>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-0 left-0 w-64 glass-strong p-6 rounded-2xl border border-border/50"
              >
                <Rocket className="w-12 h-12 text-secondary mb-4" />
                <h3 className="font-semibold mb-2">Problem Solving</h3>
                <p className="text-sm text-muted-foreground">
                  Turning complex challenges into elegant solutions
                </p>
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

      {/* Stats Section */}
      <Stats />

      {/* Featured Work Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Check out some of my recent work
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <Link href="/work">
              <Button size="lg" variant="outline" className="group">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-strong rounded-3xl p-12 md:p-16 text-center border border-border/50 relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Work <span className="gradient-text">Together</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              I'm always interested in hearing about new projects and opportunities. Whether you
              have a question or just want to say hi, feel free to reach out!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="group">
                  Start a Conversation
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href="/assets/cv/resume.pdf" download>
                <Button size="lg" variant="outline">
                  <Download className="mr-2 w-4 h-4" />
                  Download CV
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
