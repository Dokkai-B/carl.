"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Social from "@/components/Social";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  }),
};

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
          {/* Left Content */}
          <motion.div
            className="flex flex-col justify-center space-y-8"
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div custom={0} variants={textVariants} className="inline-flex">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary border border-primary/20 backdrop-blur-sm">
                <Sparkles className="h-4 w-4" />
                <span>Available for opportunities</span>
              </div>
            </motion.div>

            {/* Heading */}
            <div className="space-y-4">
              <motion.h1
                custom={1}
                variants={textVariants}
                className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none"
              >
                Hello, I'm{" "}
                <span className="gradient-text inline-block">
                  Carl Patrick Adrian Aguas
                </span>
              </motion.h1>
              
              <motion.div
                custom={2}
                variants={textVariants}
                className="space-y-2"
              >
                <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground">
                  Aspiring Full-Stack Developer
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full" />
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              custom={3}
              variants={textVariants}
              className="max-w-[600px] text-lg text-muted-foreground md:text-xl"
            >
              I specialize in crafting exceptional digital experiences with modern web
              technologies. Passionate about clean code, intuitive design, and creating
              solutions that make a difference.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={4}
              variants={textVariants}
              className="flex flex-col gap-4 sm:flex-row"
            >
              <Button
                size="lg"
                className="group relative overflow-hidden px-8 py-6 text-lg"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Download className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
                  Download CV
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 transition-opacity group-hover:opacity-100" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg backdrop-blur-sm"
              >
                View Projects
              </Button>
            </motion.div>

            {/* Social Links */}
            <motion.div custom={5} variants={textVariants}>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Connect with me:</span>
                <Social
                  containerStyles="flex gap-3"
                  iconStyles="w-10 h-10 border border-border rounded-full flex justify-center items-center text-foreground hover:text-primary hover:border-primary transition-all duration-300 hover:scale-110"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full aspect-square">
              {/* Animated rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/20"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <motion.div
                className="absolute inset-8 rounded-full border-2 border-accent/20"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <motion.div
                className="absolute inset-16 rounded-full border-2 border-secondary/20"
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              {/* Center glow */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary via-accent to-secondary opacity-20 blur-3xl" />
              </div>

              {/* Profile image placeholder */}
              <div className="absolute inset-24 rounded-full bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 backdrop-blur-xl border border-border flex items-center justify-center overflow-hidden">
                <div className="text-6xl font-bold text-primary/20">CA</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-sm text-muted-foreground">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
