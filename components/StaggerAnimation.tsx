"use client";

import React, { ReactNode } from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { slidePocketContainer, slidePocketChild, ANIMATION_CONFIG } from "@/lib/animations";

// =============================================
// StaggerContainer Component
// =============================================
// A container that orchestrates staggered animations for its children

interface StaggerContainerProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  /** Delay between each child animation */
  stagger?: number;
  /** Initial delay before children start animating */
  delay?: number;
  /** Whether animation should be triggered */
  animate?: boolean;
  /** Additional class names */
  className?: string;
  /** Custom variants to override defaults */
  variants?: Variants;
}

/**
 * Container component that provides staggered animation to children
 * Children should use StaggerItem for coordinated animations
 *
 * @example
 * ```tsx
 * <StaggerContainer animate={isReady} stagger={0.08}>
 *   <StaggerItem>Line 1</StaggerItem>
 *   <StaggerItem>Line 2</StaggerItem>
 *   <StaggerItem>Line 3</StaggerItem>
 * </StaggerContainer>
 * ```
 */
export const StaggerContainer = ({
  children,
  stagger = ANIMATION_CONFIG.stagger.normal,
  delay = 0,
  animate = true,
  className,
  variants,
  ...props
}: StaggerContainerProps) => {
  const containerVariants = variants || slidePocketContainer(stagger, delay);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// =============================================
// StaggerItem Component
// =============================================
// An item within a StaggerContainer that animates with the slide-pocket effect

interface StaggerItemProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  /** Additional class names */
  className?: string;
  /** Custom variants to override defaults */
  variants?: Variants;
  /** HTML tag to render as */
  as?:
    | "div"
    | "span"
    | "p"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "li"
    | "article"
    | "section";
}

/**
 * An animated item within a StaggerContainer
 * Uses the slide-pocket effect (slides down from above, fades in)
 *
 * @example
 * ```tsx
 * <StaggerItem className="text-xl">
 *   This line will slide down into place
 * </StaggerItem>
 * ```
 */
export const StaggerItem = ({
  children,
  className,
  variants,
  as = "div",
  ...props
}: StaggerItemProps) => {
  const itemVariants = variants || slidePocketChild;
  const Component = motion[as];

  return (
    <Component variants={itemVariants} className={className} {...props}>
      {children}
    </Component>
  );
};

// =============================================
// StaggerText Component
// =============================================
// For animating multi-line text where each line drops in

interface StaggerTextProps {
  /** The text to animate, split by line breaks or array of lines */
  text: string | string[];
  /** Whether animation should be triggered */
  animate?: boolean;
  /** Delay between each line */
  stagger?: number;
  /** Initial delay before animation starts */
  delay?: number;
  /** Container class names */
  containerClassName?: string;
  /** Line class names */
  lineClassName?: string;
  /** HTML tag for each line */
  lineAs?: "span" | "p" | "div";
}

/**
 * Renders text with line-by-line staggered animation
 * Each line slides down from above with a small delay
 *
 * @example
 * ```tsx
 * <StaggerText
 *   text={["Hey, I'm", "Carl Patrick", "but you can call me", "Carlo"]}
 *   animate={loaderComplete}
 *   lineClassName="text-4xl font-bold"
 * />
 * ```
 */
export const StaggerText = ({
  text,
  animate = true,
  stagger = ANIMATION_CONFIG.stagger.normal,
  delay = 0,
  containerClassName,
  lineClassName,
  lineAs = "span",
}: StaggerTextProps) => {
  const lines = Array.isArray(text) ? text : text.split("\n");
  const LineComponent = motion[lineAs];

  return (
    <motion.div
      variants={slidePocketContainer(stagger, delay)}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      exit="exit"
      className={containerClassName}
    >
      {lines.map((line, index) => (
        <LineComponent
          key={index}
          variants={slidePocketChild}
          className={cn("block", lineClassName)}
        >
          {line}
        </LineComponent>
      ))}
    </motion.div>
  );
};

// =============================================
// SlideIn Component
// =============================================
// A standalone animated element that slides in from a "pocket"

interface SlideInProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  /** Direction to slide from */
  direction?: "up" | "down" | "left" | "right";
  /** Animation delay */
  delay?: number;
  /** Whether to animate */
  animate?: boolean;
  /** Additional class names */
  className?: string;
}

/**
 * A standalone element that slides in with the pocket animation
 * Use when you need a single element to animate independently
 *
 * @example
 * ```tsx
 * <SlideIn delay={0.2} animate={isReady}>
 *   <Button>Click me</Button>
 * </SlideIn>
 * ```
 */
export const SlideIn = ({
  children,
  direction = "up",
  delay = 0,
  animate = true,
  className,
  ...props
}: SlideInProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: ANIMATION_CONFIG.slideDistance.enter };
      case "down":
        return { y: -ANIMATION_CONFIG.slideDistance.enter };
      case "left":
        return { x: ANIMATION_CONFIG.slideDistance.enter };
      case "right":
        return { x: -ANIMATION_CONFIG.slideDistance.enter };
    }
  };

  const getExitPosition = () => {
    switch (direction) {
      case "up":
        return { y: ANIMATION_CONFIG.slideDistance.exit };
      case "down":
        return { y: -ANIMATION_CONFIG.slideDistance.exit };
      case "left":
        return { x: ANIMATION_CONFIG.slideDistance.exit };
      case "right":
        return { x: -ANIMATION_CONFIG.slideDistance.exit };
    }
  };

  const variants: Variants = {
    hidden: {
      ...getInitialPosition(),
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: ANIMATION_CONFIG.spring.stiffness,
        damping: ANIMATION_CONFIG.spring.damping,
        delay,
      },
    },
    exit: {
      ...getExitPosition(),
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: ANIMATION_CONFIG.spring.stiffness,
        damping: ANIMATION_CONFIG.spring.damping,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={animate ? "visible" : "hidden"}
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default StaggerContainer;
