"use client";

import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  useAnimationControls,
} from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

// Orb state for name-driven merge animation
type OrbState = "default" | "merging" | "morphing" | "returning" | null;

// Type for the dynamic cluster target
interface ClusterTarget {
  type: "full" | "short";
}

// Parallax configuration for mouse movement
const PARALLAX_CONFIG = {
  orb1: { strength: 45, direction: { x: 1, y: 1 } },
  orb2: { strength: 25, direction: { x: -1, y: 1 } },
  orb3: { strength: 30, direction: { x: 1, y: -1 } },
};

// Target screen positions for clusters (absolute viewport coordinates)
// These are where we want the CENTER of the cluster to be
const CLUSTER_TARGETS = {
  full: {
    // Upper left corner - partially off screen
    center: { x: 80, y: 60 },
    offsets: {
      core: { x: 0, y: 0 },
      sat1: { x: 70, y: 30 },
      sat2: { x: 30, y: 80 },
    },
  },
  short: {
    // Lower right corner - behind the icons, partially off screen
    // We'll use viewport width/height relative positioning
    fromRight: 100, // pixels from right edge
    fromBottom: 80, // pixels from bottom edge
    offsets: {
      core: { x: 0, y: 0 },
      sat1: { x: -70, y: -30 },
      sat2: { x: -30, y: -80 },
    },
  },
};

// Shape morphing configurations (inspired by resume shapes)
const MORPH_SHAPES = {
  full: {
    core: { borderRadius: "0% 100% 100% 0%", rotate: 45 },
    sat1: { borderRadius: "50% 0% 50% 50%", rotate: -30 },
    sat2: { borderRadius: "0% 50% 50% 0%", rotate: 60 },
  },
  short: {
    core: { borderRadius: "30% 70% 70% 30%", rotate: 0 },
    sat1: { borderRadius: "70% 30% 30% 70%", rotate: 120 },
    sat2: { borderRadius: "50% 50% 0% 50%", rotate: -45 },
  },
};

// Color palettes for morphed state - using theme colors
const MORPH_COLORS = {
  dark: {
    // Dark theme: teal/cyan colors (matching the site's dark theme)
    full: {
      core: "rgba(56, 189, 248, 0.5)", // Sky blue
      sat1: "rgba(34, 211, 238, 0.45)", // Cyan
      sat2: "rgba(45, 212, 191, 0.4)", // Teal
    },
    short: {
      core: "rgba(34, 211, 238, 0.5)", // Cyan
      sat1: "rgba(56, 189, 248, 0.45)", // Sky
      sat2: "rgba(14, 165, 233, 0.4)", // Light blue
    },
  },
  light: {
    // Light theme: pink/rose colors (matching the site's light theme)
    full: {
      core: "rgba(244, 114, 182, 0.35)", // Pink
      sat1: "rgba(251, 113, 133, 0.3)", // Rose
      sat2: "rgba(236, 72, 153, 0.28)", // Fuchsia
    },
    short: {
      core: "rgba(251, 113, 133, 0.35)", // Rose
      sat1: "rgba(244, 114, 182, 0.3)", // Pink
      sat2: "rgba(249, 168, 212, 0.28)", // Light pink
    },
  },
};

// Spring configs for different orbs - softer for smooth ease in/out
const SPRING_CONFIGS = {
  core: { stiffness: 60, damping: 20, mass: 1.2 },
  sat1: { stiffness: 50, damping: 22, mass: 1.4 },
  sat2: { stiffness: 45, damping: 24, mass: 1.5 },
};

// Orb sizes (from CSS classes) - needed to calculate centers
const ORB_SIZES = {
  orb1: 288, // w-72 = 18rem = 288px
  orb2: 384, // w-96 = 24rem = 384px
  orb3: 320, // w-80 = 20rem = 320px
};

export function AnimatedBackground() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [orbState, setOrbState] = useState<OrbState>("default");
  const [mounted, setMounted] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [isSettled, setIsSettled] = useState(false);
  const [currentTarget, setCurrentTarget] = useState<ClusterTarget | null>(null);
  const [isMorphed, setIsMorphed] = useState(false);
  // Store computed translations for use in pulsing animation
  const [activeTranslations, setActiveTranslations] = useState<{
    translate1: { x: number; y: number };
    translate2: { x: number; y: number };
    translate3: { x: number; y: number };
  } | null>(null);
  // Store base positions (calculated once on mount)
  const [basePositions, setBasePositions] = useState<{
    orb1: { x: number; y: number };
    orb2: { x: number; y: number };
    orb3: { x: number; y: number };
  } | null>(null);
  const returnTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const orbitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const settleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const morphTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  // Animation controls for each orb
  const orb1Controls = useAnimationControls();
  const orb2Controls = useAnimationControls();
  const orb3Controls = useAnimationControls();

  // Normalized mouse position (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring interpolation for gentle drift
  const springConfig = { stiffness: 50, damping: 30, mass: 1 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Create parallax transforms for each orb
  const orb1ParallaxX = useTransform(
    smoothMouseX,
    (v) => v * PARALLAX_CONFIG.orb1.strength * PARALLAX_CONFIG.orb1.direction.x
  );
  const orb1ParallaxY = useTransform(
    smoothMouseY,
    (v) => v * PARALLAX_CONFIG.orb1.strength * PARALLAX_CONFIG.orb1.direction.y
  );
  const orb2ParallaxX = useTransform(
    smoothMouseX,
    (v) => v * PARALLAX_CONFIG.orb2.strength * PARALLAX_CONFIG.orb2.direction.x
  );
  const orb2ParallaxY = useTransform(
    smoothMouseY,
    (v) => v * PARALLAX_CONFIG.orb2.strength * PARALLAX_CONFIG.orb2.direction.y
  );
  const orb3ParallaxX = useTransform(
    smoothMouseX,
    (v) => v * PARALLAX_CONFIG.orb3.strength * PARALLAX_CONFIG.orb3.direction.x
  );
  const orb3ParallaxY = useTransform(
    smoothMouseY,
    (v) => v * PARALLAX_CONFIG.orb3.strength * PARALLAX_CONFIG.orb3.direction.y
  );

  useEffect(() => {
    setMounted(true);
    const hasPointer = window.matchMedia("(pointer: fine)").matches;
    setIsPointerDevice(hasPointer);

    // Calculate base positions from CSS layout
    // These are the CENTER positions of each orb based on their CSS classes
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Orb 1: top-0 -left-4 (positioned at top, slightly left of viewport)
    // Center = position + half width
    const orb1Base = {
      x: -16 + ORB_SIZES.orb1 / 2, // -left-4 = -16px, center is half width in
      y: 0 + ORB_SIZES.orb1 / 2, // top-0, center is half height down
    };

    // Orb 2: top-1/4 right-0
    // Right-0 means right edge at viewport right
    const orb2Base = {
      x: vw - ORB_SIZES.orb2 / 2, // right edge at vw, center is half width left
      y: vh * 0.25 + ORB_SIZES.orb2 / 2, // top-1/4
    };

    // Orb 3: bottom-0 left-1/3
    const orb3Base = {
      x: vw * 0.333 + ORB_SIZES.orb3 / 2, // left-1/3
      y: vh - ORB_SIZES.orb3 / 2, // bottom-0, center is half height up from bottom
    };

    setBasePositions({ orb1: orb1Base, orb2: orb2Base, orb3: orb3Base });
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

  // Default orb colors (theme-aware)
  const defaultOrbColors = {
    core: isDark ? "rgba(66, 129, 164, 0.4)" : "rgba(255, 112, 166, 0.15)",
    sat1: isDark ? "rgba(77, 150, 191, 0.35)" : "rgba(255, 140, 180, 0.12)",
    sat2: isDark ? "rgba(61, 165, 217, 0.3)" : "rgba(255, 112, 166, 0.1)",
  };

  // Get current orb colors based on state
  const getOrbColors = useCallback(() => {
    if (isMorphed && currentTarget) {
      const palette = isDark ? MORPH_COLORS.dark : MORPH_COLORS.light;
      return palette[currentTarget.type];
    }
    return defaultOrbColors;
  }, [isDark, isMorphed, currentTarget, defaultOrbColors]);

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

  // Animate orbs to merge cluster - uses BASE positions for consistent behavior
  const animateToCluster = useCallback(
    (target: ClusterTarget) => {
      if (!basePositions) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Calculate target cluster center based on type
      let targetCenterX: number;
      let targetCenterY: number;

      if (target.type === "full") {
        // Upper left - partially off screen
        targetCenterX = CLUSTER_TARGETS.full.center.x;
        targetCenterY = CLUSTER_TARGETS.full.center.y;
      } else {
        // Lower right - behind the icons area
        targetCenterX = vw - CLUSTER_TARGETS.short.fromRight;
        targetCenterY = vh - CLUSTER_TARGETS.short.fromBottom;
      }

      const offsets =
        target.type === "full" ? CLUSTER_TARGETS.full.offsets : CLUSTER_TARGETS.short.offsets;

      // Target positions for each orb (cluster center + offset)
      const target1 = { x: targetCenterX + offsets.core.x, y: targetCenterY + offsets.core.y };
      const target2 = { x: targetCenterX + offsets.sat1.x, y: targetCenterY + offsets.sat1.y };
      const target3 = { x: targetCenterX + offsets.sat2.x, y: targetCenterY + offsets.sat2.y };

      // Calculate translation needed from BASE position (not current animated position!)
      const translate1 = {
        x: target1.x - basePositions.orb1.x,
        y: target1.y - basePositions.orb1.y,
      };
      const translate2 = {
        x: target2.x - basePositions.orb2.x,
        y: target2.y - basePositions.orb2.y,
      };
      const translate3 = {
        x: target3.x - basePositions.orb3.x,
        y: target3.y - basePositions.orb3.y,
      };

      // Store translations for use in pulsing animation
      setActiveTranslations({ translate1, translate2, translate3 });

      setIsSettled(false);
      setIsMorphed(false);
      setCurrentTarget(target);

      // Phase 1: Smooth glide to cluster positions with tween (not spring)
      orb1Controls.start(
        {
          x: translate1.x,
          y: translate1.y,
          scale: 1.3,
          opacity: 0.5, // Reduced opacity when clustered
          borderRadius: "50%",
          rotate: 0,
        },
        {
          duration: 1.2,
          ease: [0.4, 0, 0.2, 1], // Material Design ease-out
        }
      );

      setTimeout(() => {
        orb2Controls.start(
          {
            x: translate2.x,
            y: translate2.y,
            scale: 1.25,
            opacity: 0.45,
            borderRadius: "50%",
            rotate: 0,
          },
          {
            duration: 1.1,
            ease: [0.4, 0, 0.2, 1],
          }
        );
      }, 80);

      setTimeout(() => {
        orb3Controls.start(
          {
            x: translate3.x,
            y: translate3.y,
            scale: 1.2,
            opacity: 0.4,
            borderRadius: "50%",
            rotate: 0,
          },
          {
            duration: 1.0,
            ease: [0.4, 0, 0.2, 1],
          }
        );
      }, 150);

      // Phase 2: Gentle orbit dance (1000ms after pull starts)
      orbitTimeoutRef.current = setTimeout(() => {
        const orbitRadius = 10;

        orb2Controls.start(
          {
            x: [
              translate2.x,
              translate2.x + orbitRadius,
              translate2.x,
              translate2.x - orbitRadius,
              translate2.x,
            ],
            y: [
              translate2.y,
              translate2.y - orbitRadius,
              translate2.y,
              translate2.y + orbitRadius,
              translate2.y,
            ],
          },
          { duration: 0.6, ease: "easeInOut" }
        );

        orb3Controls.start(
          {
            x: [
              translate3.x,
              translate3.x - orbitRadius,
              translate3.x,
              translate3.x + orbitRadius,
              translate3.x,
            ],
            y: [
              translate3.y,
              translate3.y + orbitRadius,
              translate3.y,
              translate3.y - orbitRadius,
              translate3.y,
            ],
          },
          { duration: 0.6, ease: "easeInOut" }
        );
      }, 1000);

      // Phase 3: MORPH into shapes! (1400ms after pull)
      morphTimeoutRef.current = setTimeout(() => {
        setIsMorphed(true);
        setOrbState("morphing");
        const shapes = MORPH_SHAPES[target.type];

        // Core orb morphs with smooth ease - keep low opacity
        orb1Controls.start(
          {
            x: translate1.x,
            y: translate1.y,
            scale: [1.3, 1.5, 1.4],
            borderRadius: shapes.core.borderRadius,
            rotate: shapes.core.rotate,
            opacity: 0.55,
          },
          {
            duration: 1.0,
            ease: [0.4, 0, 0.2, 1],
          }
        );

        // Satellite 1 morphs with delay
        setTimeout(() => {
          orb2Controls.start(
            {
              x: translate2.x,
              y: translate2.y,
              scale: [1.25, 1.45, 1.35],
              borderRadius: shapes.sat1.borderRadius,
              rotate: shapes.sat1.rotate,
              opacity: 0.5,
            },
            {
              duration: 0.9,
              ease: [0.4, 0, 0.2, 1],
            }
          );
        }, 120);

        // Satellite 2 morphs with delay
        setTimeout(() => {
          orb3Controls.start(
            {
              x: translate3.x,
              y: translate3.y,
              scale: [1.2, 1.4, 1.3],
              borderRadius: shapes.sat2.borderRadius,
              rotate: shapes.sat2.rotate,
              opacity: 0.45,
            },
            {
              duration: 0.85,
              ease: [0.4, 0, 0.2, 1],
            }
          );
        }, 220);
      }, 1400);

      // Phase 4: Settled with pulsing shapes
      settleTimeoutRef.current = setTimeout(() => {
        setIsSettled(true);
      }, 2400);
    },
    [basePositions, orb1Controls, orb2Controls, orb3Controls]
  );

  // Animate orbs back to neutral (circles, original colors)
  const animateToNeutral = useCallback(() => {
    setIsSettled(false);
    setIsMorphed(false);
    setCurrentTarget(null);
    setActiveTranslations(null);

    // Smooth return to neutral - morph back to circles
    orb1Controls.start(
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0.7,
        borderRadius: "50%",
        rotate: 0,
      },
      {
        type: "spring",
        stiffness: 60,
        damping: 25,
        mass: 1,
      }
    );

    orb2Controls.start(
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0.7,
        borderRadius: "50%",
        rotate: 0,
      },
      {
        type: "spring",
        stiffness: 50,
        damping: 28,
        mass: 1.1,
      }
    );

    orb3Controls.start(
      {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0.7,
        borderRadius: "50%",
        rotate: 0,
      },
      {
        type: "spring",
        stiffness: 45,
        damping: 30,
        mass: 1.2,
      }
    );
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
      window.removeEventListener(
        "nameHover" as keyof WindowEventMap,
        handleNameHover as EventListener
      );
      clearAllTimeouts();
    };
  }, [animateToCluster, animateToNeutral, clearAllTimeouts]);

  // Pulsing animation for morphed settled state
  useEffect(() => {
    if (!isSettled || !isMorphed || !currentTarget || !activeTranslations) return;

    const shapes = MORPH_SHAPES[currentTarget.type];
    const { translate1, translate2, translate3 } = activeTranslations;

    // Gentle pulsing shapes with slight rotation oscillation - low opacity
    orb1Controls.start(
      {
        scale: [1.4, 1.5, 1.4],
        rotate: [shapes.core.rotate, shapes.core.rotate + 8, shapes.core.rotate],
        x: translate1.x,
        y: translate1.y,
        opacity: [0.5, 0.55, 0.5],
      },
      {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }
    );

    orb2Controls.start(
      {
        scale: [1.35, 1.45, 1.35],
        rotate: [shapes.sat1.rotate, shapes.sat1.rotate - 10, shapes.sat1.rotate],
        x: translate2.x,
        y: translate2.y,
        opacity: [0.45, 0.5, 0.45],
      },
      {
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      }
    );

    orb3Controls.start(
      {
        scale: [1.3, 1.4, 1.3],
        rotate: [shapes.sat2.rotate, shapes.sat2.rotate + 8, shapes.sat2.rotate],
        x: translate3.x,
        y: translate3.y,
        opacity: [0.4, 0.45, 0.4],
      },
      {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }
    );
  }, [
    isSettled,
    isMorphed,
    currentTarget,
    activeTranslations,
    orb1Controls,
    orb2Controls,
    orb3Controls,
  ]);

  // Check if we're in default state (for idle animation + parallax)
  const isDefaultState = orbState === "default" || orbState === null;

  if (!mounted) {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
      </div>
    );
  }

  const orbColors = getOrbColors();

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

        {/* Orbs - Only render on home page */}
        {isHomePage && (
          <>
            {/* Orb 1 - Core */}
            <motion.div
              ref={orb1Ref}
              className="absolute top-0 -left-4 w-72 h-72 filter blur-3xl"
              style={{
                backgroundColor: orbColors.core,
                // Apply parallax only in default state
                translateX: isDefaultState && isPointerDevice ? orb1ParallaxX : 0,
                translateY: isDefaultState && isPointerDevice ? orb1ParallaxY : 0,
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 0.7, borderRadius: "50%", rotate: 0 }}
              animate={
                isDefaultState
                  ? {
                      scale: [1, 1.15, 1.05, 1.2, 1],
                      x: [0, 80, 40, 100, 0],
                      y: [0, 30, 60, 40, 0],
                      opacity: 0.7,
                      borderRadius: "50%",
                      rotate: 0,
                    }
                  : orb1Controls
              }
              transition={
                isDefaultState
                  ? {
                      duration: 20,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }
                  : undefined
              }
            />

            {/* Orb 2 - Satellite 1 */}
            <motion.div
              ref={orb2Ref}
              className="absolute top-1/4 right-0 w-96 h-96 filter blur-3xl"
              style={{
                backgroundColor: orbColors.sat1,
                translateX: isDefaultState && isPointerDevice ? orb2ParallaxX : 0,
                translateY: isDefaultState && isPointerDevice ? orb2ParallaxY : 0,
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 0.7, borderRadius: "50%", rotate: 0 }}
              animate={
                isDefaultState
                  ? {
                      scale: [1, 1.2, 1.1, 1.3, 1],
                      x: [0, -60, -80, -50, 0],
                      y: [0, 60, 30, 80, 0],
                      opacity: 0.7,
                      borderRadius: "50%",
                      rotate: 0,
                    }
                  : orb2Controls
              }
              transition={
                isDefaultState
                  ? {
                      duration: 25,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }
                  : undefined
              }
            />

            {/* Orb 3 - Satellite 2 */}
            <motion.div
              ref={orb3Ref}
              className="absolute bottom-0 left-1/3 w-80 h-80 filter blur-3xl"
              style={{
                backgroundColor: orbColors.sat2,
                translateX: isDefaultState && isPointerDevice ? orb3ParallaxX : 0,
                translateY: isDefaultState && isPointerDevice ? orb3ParallaxY : 0,
              }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 0.7, borderRadius: "50%", rotate: 0 }}
              animate={
                isDefaultState
                  ? {
                      scale: [1, 1.08, 1.15, 1.05, 1],
                      x: [0, 30, 60, 20, 0],
                      y: [0, -30, -20, -50, 0],
                      opacity: 0.7,
                      borderRadius: "50%",
                      rotate: 0,
                    }
                  : orb3Controls
              }
              transition={
                isDefaultState
                  ? {
                      duration: 22,
                      repeat: Infinity,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }
                  : undefined
              }
            />
          </>
        )}

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
