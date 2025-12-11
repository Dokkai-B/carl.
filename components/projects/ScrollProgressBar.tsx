"use client";

import { motion } from "framer-motion";
import { Project } from "@/data/projects";

interface ScrollProgressBarProps {
  project: Project;
}

export function ScrollProgressBar({ project }: ScrollProgressBarProps) {
  const { scrollYProgress } = require("framer-motion").useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        scaleX: scrollYProgress,
        background: `linear-gradient(90deg, ${project.colors.primary}, ${project.colors.secondary})`,
      }}
    />
  );
}
