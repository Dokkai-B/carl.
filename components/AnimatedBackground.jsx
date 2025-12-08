"use client";

import { motion, useSpring, useMotionValue, useTransform, useAnimationControls } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

// Orb state for name-driven merge animation
type OrbState = "default" | "merging" | "morphing" | "returning" | null;

// Type for the dynamic cluster target
interface ClusterTarget {
  type: "full" | "short";
}

// Parallax configuration for idle mouse movement
const PARALLAX_CONFIG = {
  orb1: { strength: 45, direction: { x: 1, y: 1 } },
  orb2: { strength: 25, direction: { x: -1, y: 1 } },
  orb3: { strength: 30, direction: { x: 1, y: -1 } },
};

// Fixed cluster positions - UPPER LEFT for full name, LOWER LEFT for nickname
// Using negative x values to push orbs to the left side
const CLUSTER_POSITIONS = {
  full: {
    // Upper left - very left side, near top
    core: { x: -200, y: -150 },
    sat1: { x: -120, y: -200 },
    sat2: { x: -280, y: -100 },
  },
  short: {
    // Lower left - very left side, lower area
    core: { x: -180, y: 200 },
    sat1: { x: -100, y: 150 },
    sat2: { x: -260, y: 250 },
  },
};

// Shape morphing configurations
const MORPH_SHAPES = {
  full: {
    core: { borderRadius: "30% 70% 70% 30%", rotate: 15 },
    sat1: { borderRadius: "50% 20% 50% 50%", rotate: -20 },
    sat2: { borderRadius: "20% 50% 50% 20%", rotate: 30 },
  },
  short: {
    core: { borderRadius: "40% 60% 60% 40%", rotate: -10 },
    sat1: { borderRadius: "60% 40% 40% 60%", rotate: 25 },
    sat2: { borderRadius: "50% 50% 20% 50%", rotate: -35 },
  },
};

// Color palettes for morphed state - matching the teal/cyan theme
const MORPH_COLORS = {
  dark: {
    full: {
      // Deeper teals/cyans for full name
      core: "rgba(45, 160, 190, 0.55)",
      sat1: "rgba(60, 180, 210, 0.5)",
      sat2: "rgba(30, 140, 170, 0.45)",
    },
    short: {
      // Warmer teals with slight purple tint for nickname  
      core: "rgba(80, 150, 200, 0.55)",
      sat1: "rgba(100, 170, 220, 0.5)",
      sat2: "rgba(60, 130, 180, 0.45)",
    },
  },
  light: {
    full: {
      core: "rgba(45, 160, 190, 0.3)",
      sat1: "rgba(60, 180, 210, 0.25)",
      sat2: "rgba(30, 140, 170, 0.22)",
    },
    short: {
      core: "rgba(80, 150, 200, 0.3)",
      sat1: "rgba(100, 170, 220, 0.25)",
      sat2: "rgba(60, 130, 180, 0.22)",
    },
  },
};

// Spring configs for different orbs
const SPRING_CONFIGS = {
  core: { stiffness: 180, damping: 18, mass: 0.8 },
  sat1: { stiffness: 140, damping: 22, mass: 1 },
  sat2: { stiffness: 120, damping: 26, mass: 1.2 },
};

export function AnimatedBackground() {
  const [orbState, setOrbState] = useState<OrbState>("default");
  const [mounted, setMounted] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<ClusterTarget | null>(null);
  const [isMorphed, setIsMorphed] = useState(false);
  const returnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const orbitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const settleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const morphTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Animation controls for each orb
  const orb1Controls = useAnimationControls();
  const orb2Controls = useAnimationControls();
  const orb3Controls = useAnimationControls();

  // Normalized mouse position (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring interpolation for parallax
  const springConfig = { stiffness: 50, damping: 30, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Create parallax transforms for mouse movement
  const orb1ParallaxX = useTransform(smoothMouseX, (v) => v * PARALLAX_CONFIG.orb1.strength * PARALLAX_CONFIG.orb1.direction.x);
  const orb1ParallaxY = useTransform(smoothMouseY, (v) => v * PARALLAX_CONFIG.orb1.strength * PARALLAX_CONFIG.orb1.direction.y);
  const orb2ParallaxX = useTransform(smoothMouseX, (v) => v * PARALLAX_CONFIG.orb2.strength * PARALLAX_CONFIG.orb2.direction.x);
  const orb2ParallaxY = useTransform(smoothMouseY, (v) => v * PARALLAX_CONFIG.orb2.strength * PARALLAX_CONFIG.orb2.direction.y);
  const orb3ParallaxX = useTransform(smoothMouseX, (v) => v * PARALLAX_CONFIG.orb3.strength * PARALLAX_CONFIG.orb3.direction.x);
  const orb3ParallaxY = useTransform(smoothMouseY, (v) => v * PARALLAX_CONFIG.orb3.strength * PARALLAX_CONFIG.orb3.direction.y);

  useEffect(() => {
    setMounted(true);
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    setIsPointerDevice(hasPointer);
  }, []);

  // Mouse tracking for parallax effect (desktop only)
  useEffect(() => {
    if (!isPointerDevice || !mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isPointerDevice, mounted, mouseX, mouseY]);

  const isDark = !mounted || resolvedTheme === "dark";

  // Default orb colors (teal theme)
  const defaultColors = {
    core: isDark ? "rgba(66, 129, 164, 0.4)" : "rgba(255, 112, 166, 0.15)",
    sat1: isDark ? "rgba(77, 150, 191, 0.35)" : "rgba(255, 140, 180, 0.12)",
    sat2: isDark ? "rgba(61, 165, 217, 0.3)" : "rgba(255, 112, 166, 0.1)",
  };

  // Get current orb colors based on state
  const orbColors = isMorphed && currentTarget
    ? (isDark ? MORPH_COLORS.dark : MORPH_COLORS.light)[currentTarget.type]
    : defaultColors;

  // Clear all timeouts helper
  const clearAllTimeouts = useCallback(() => {
    if (returnTimeoutRef.current) clearTimeout(returnTimeoutRef.current);
    if (orbitTimeoutRef.current) clearTimeout(orbitTimeoutRef.current);
    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    if (morphTimeoutRef.current) clearTimeout(morphTimeoutRef.current);
    returnTimeoutRef.current = null;
    orbitTimeoutRef.current = null;
    settleTimeoutRef.current = null;
    morphTimeoutRef.current = null;
  }, []);

  // Animate orbs to merge cluster
  const animateToCluster = useCallback((target: ClusterTarget) => {
    const positions = CLUSTER_POSITIONS[target.type];
    setIsSettled(false);
    setIsMorphed(false);
    setCurrentTarget(target);

    // Phase 1: Gravity pull with staggered delays
    orb1Controls.start({
      x: positions.core.x,
      y: positions.core.y,
      scale: 1.5,
      opacity: 0.95,
      borderRadius: "50%",
      rotate: 0,
    }, {
      type: "spring",
      ...SPRING_CONFIGS.core,
    });

    setTimeout(() => {
      orb2Controls.start({
        x: positions.sat1.x,
        y: positions.sat1.y,
        scale: 1.4,
        opacity: 0.9,
        borderRadius: "50%",
        rotate: 0,
      }, {
        type: "spring",
        ...SPRING_CONFIGS.sat1,
      });
    }, 40);

    setTimeout(() => {
      orb3Controls.start({
        x: positions.sat2.x,
        y: positions.sat2.y,
        scale: 1.35,
        opacity: 0.88,
        borderRadius: "50%",
        rotate: 0,
      }, {
        type: "spring",
        ...SPRING_CONFIGS.sat2,
      });
    }, 80);

    // Phase 2: Quick orbit dance (180ms after pull)
    orbitTimeoutRef.current = setTimeout(() => {
      const orbitRadius = 15;
      
      orb2Controls.start({
        x: [positions.sat1.x, positions.sat1.x + orbitRadius, positions.sat1.x, positions.sat1.x - orbitRadius, positions.sat1.x],
        y: [positions.sat1.y, positions.sat1.y - orbitRadius, positions.sat1.y, positions.sat1.y + orbitRadius, positions.sat1.y],
      }, { duration: 0.25, ease: "easeInOut" });

      orb3Controls.start({
        x: [positions.sat2.x, positions.sat2.x - orbitRadius, positions.sat2.x, positions.sat2.x + orbitRadius, positions.sat2.x],
        y: [positions.sat2.y, positions.sat2.y + orbitRadius, positions.sat2.y, positions.sat2.y - orbitRadius, positions.sat2.y],
      }, { duration: 0.25, ease: "easeInOut" });
    }, 180);

    // Phase 3: MORPH into shapes (500ms after pull)
    morphTimeoutRef.current = setTimeout(() => {
      setIsMorphed(true);
      setOrbState("morphing");
      const shapes = MORPH_SHAPES[target.type];

      orb1Controls.start({
        x: positions.core.x,
        y: positions.core.y,
        scale: [1.5, 1.8, 1.6],
        borderRadius: shapes.core.borderRadius,
        rotate: shapes.core.rotate,
        opacity: 1,
      }, {
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1],
      });

      setTimeout(() => {
        orb2Controls.start({
          x: positions.sat1.x,
          y: positions.sat1.y,
          scale: [1.4, 1.7, 1.5],
          borderRadius: shapes.sat1.borderRadius,
          rotate: shapes.sat1.rotate,
          opacity: 0.95,
        }, {
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1],
        });
      }, 80);

      setTimeout(() => {
        orb3Controls.start({
          x: positions.sat2.x,
          y: positions.sat2.y,
          scale: [1.35, 1.6, 1.45],
          borderRadius: shapes.sat2.borderRadius,
          rotate: shapes.sat2.rotate,
          opacity: 0.92,
        }, {
          duration: 0.45,
          ease: [0.34, 1.56, 0.64, 1],
        });
      }, 150);
    }, 500);

    // Phase 4: Settled with pulsing shapes
    settleTimeoutRef.current = setTimeout(() => {
      setIsSettled(true);
    }, 1100);
  }, [orb1Controls, orb2Controls, orb3Controls]);

  // Animate orbs back to neutral
  const animateToNeutral = useCallback(() => {
    setIsSettled(false);
    setIsMorphed(false);
    setCurrentTarget(null);

    orb1Controls.start({
      x: 0,
      y: 0,
      scale: 1,
      opacity: 0.7,
      borderRadius: "50%",
      rotate: 0,
    }, {
      type: "spring",
      stiffness: 60,
      damping: 25,
      mass: 1,
    });

    orb2Controls.start({
      x: 0,
      y: 0,
      scale: 1,
      opacity: 0.7,
      borderRadius: "50%",
      rotate: 0,
    }, {
      type: "spring",
      stiffness: 50,
      damping: 28,
      mass: 1.1,
    });

    orb3Controls.start({
      x: 0,
      y: 0,
      scale: 1,
      opacity: 0.7,
      borderRadius: "50%",
      rotate: 0,
    }, {
      type: "spring",
      stiffness: 45,
      damping: 30,
      mass: 1.2,
    });
  }, [orb1Controls, orb2Controls, orb3Controls]);

  // Listen for name hover events
  useEffect(() => {
    const handleNameHover = (e: CustomEvent<{ type: "full" | "short" | null }>) => {
      clearAllTimeouts();

      const { type } = e.detail;

      if (type) {
        setOrbState("merging");
        animateToCluster({ type });
      } else {
        setOrbState("returning");
        animateToNeutral();
        
        returnTimeoutRef.current = setTimeout(() => {
          setOrbState("default");
        }, 800);
      }
    };

    window.addEventListener("nameHover" as keyof WindowEventMap, handleNameHover as EventListener);

    return () => {
      window.removeEventListener("nameHover" as keyof WindowEventMap, handleNameHover as EventListener);
      clearAllTimeouts();
    };
  }, [animateToCluster, animateToNeutral, clearAllTimeouts]);

  // Pulsing animation for morphed settled state
  useEffect(() => {
    if (!isSettled || !isMorphed || !currentTarget) return;

    const positions = CLUSTER_POSITIONS[currentTarget.type];
    const shapes = MORPH_SHAPES[currentTarget.type];

    orb1Controls.start({
      scale: [1.6, 1.75, 1.6],
      rotate: [shapes.core.rotate, shapes.core.rotate + 10, shapes.core.rotate],
      x: positions.core.x,
      y: positions.core.y,
    }, {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    });

    orb2Controls.start({
      scale: [1.5, 1.65, 1.5],
      rotate: [shapes.sat1.rotate, shapes.sat1.rotate - 15, shapes.sat1.rotate],
      x: positions.sat1.x,
      y: positions.sat1.y,
    }, {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    });

    orb3Controls.start({
      scale: [1.45, 1.58, 1.45],
      rotate: [shapes.sat2.rotate, shapes.sat2.rotate + 12, shapes.sat2.rotate],
      x: positions.sat2.x,
      y: positions.sat2.y,
    }, {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    });
  }, [isSettled, isMorphed, currentTarget, orb1Controls, orb2Controls, orb3Controls]);

  // Check if in default/idle state
  const isDefaultState = orbState === "default" || orbState === null;

  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="fixed inset-0 -z-10 overflow-hidden">
        {/* Base gradient layer */}
        <div
          className="absolute inset-0 animate-gradient-drift"
          style={{
            background: isDark
              ? `linear-gradient(var(--gradient-angle, 135deg), 
                  var(--background) 0%, 
                  var(--background) 40%, 
                  color-mix(in srgb, var(--muted) 30%, var(--background)) 100%)`
              : `linear-gradient(var(--gradient-angle, 135deg), 
                  var(--background) 0%, 
                  var(--background) 40%, 
                  color-mix(in srgb, var(--muted) 50%, var(--background)) 100%)`,
          }}
        />

        {/* Orb 1 - Core */}
        {/* @ts-expect-error - Framer Motion v11 + React 19 type incompatibility */}
        <motion.div
          className="absolute top-0 -left-4 w-72 h-72 filter blur-3xl"
          style={{
            backgroundColor: orbColors.core,
            ...(isDefaultState && isPointerDevice ? { x: orb1ParallaxX, y: orb1ParallaxY } : {}),
          } as React.CSSProperties}
          initial={{ scale: 1, opacity: 0.7, borderRadius: "50%", rotate: 0, x: 0, y: 0 }}
          animate={(isDefaultState ? {
            scale: [1, 1.15, 1.05, 1.2, 1],
            ...(isPointerDevice ? {} : { x: [0, 80, 40, 100, 0], y: [0, 30, 60, 40, 0] }),
            opacity: 0.7,
          } : orb1Controls) as any}
          transition={isDefaultState ? {
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut",
          } : undefined}
        />

        {/* Orb 2 - Satellite 1 */}
        {/* @ts-expect-error - Framer Motion v11 + React 19 type incompatibility */}
        <motion.div
          className="absolute top-1/4 right-0 w-96 h-96 filter blur-3xl"
          style={{
            backgroundColor: orbColors.sat1,
            ...(isDefaultState && isPointerDevice ? { x: orb2ParallaxX, y: orb2ParallaxY } : {}),
          } as React.CSSProperties}
          initial={{ scale: 1, opacity: 0.7, borderRadius: "50%", rotate: 0, x: 0, y: 0 }}
          animate={(isDefaultState ? {
            scale: [1, 1.2, 1.1, 1.3, 1],
            ...(isPointerDevice ? {} : { x: [0, -60, -80, -50, 0], y: [0, 60, 30, 80, 0] }),
            opacity: 0.7,
          } : orb2Controls) as any}
          transition={isDefaultState ? {
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut",
          } : undefined}
        />

        {/* Orb 3 - Satellite 2 */}
        {/* @ts-expect-error - Framer Motion v11 + React 19 type incompatibility */}
        <motion.div
          className="absolute bottom-0 left-1/3 w-80 h-80 filter blur-3xl"
          style={{
            backgroundColor: orbColors.sat2,
            ...(isDefaultState && isPointerDevice ? { x: orb3ParallaxX, y: orb3ParallaxY } : {}),
          } as React.CSSProperties}
          initial={{ scale: 1, opacity: 0.7, borderRadius: "50%", rotate: 0, x: 0, y: 0 }}
          animate={(isDefaultState ? {
            scale: [1, 1.08, 1.15, 1.05, 1],
            ...(isPointerDevice ? {} : { x: [0, 30, 60, 20, 0], y: [0, -30, -20, -50, 0] }),
            opacity: 0.7,
          } : orb3Controls) as any}
          transition={isDefaultState ? {
            duration: 22,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut",
          } : undefined}
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: isDark
              ? `linear-gradient(rgba(66, 129, 164, 0.08) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(66, 129, 164, 0.08) 1px, transparent 1px)`
              : `linear-gradient(rgba(255, 112, 166, 0.06) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(255, 112, 166, 0.06) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Static noise texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: isDark ? 0.18 : 0.22,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />
      </div>
    </>
  );
}
