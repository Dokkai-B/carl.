"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import { ANIMATION_CONFIG } from "@/lib/animations";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const textControls = useAnimation();
  const iconControls = useAnimation();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      textControls.stop();
      iconControls.stop();
    };
  }, [textControls, iconControls]);

  useEffect(() => {
    // =============================================
    // ⏱️ LOADING SPEED - Adjust these values
    // =============================================
    const INTERVAL_MS = 50; // How often progress updates (lower = faster)
    const FAST_INCREMENT = 8; // Speed when progress < 80%
    const SLOW_INCREMENT = 2; // Speed when progress >= 80%
    const MIN_DISPLAY_TIME = 2500; // Minimum time loader shows (milliseconds)
    // =============================================

    // Start icon fade in animation
    if (isMountedRef.current) {
      iconControls.start({
        opacity: 1,
        y: [0, -8, 0],
        scale: 1,
        transition: {
          opacity: { duration: 0.6 },
          scale: { duration: 0.6 },
          y: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          },
        },
      });
    }

    // Start text enter animation after a short delay
    const textEnterTimer = setTimeout(() => {
      if (isMountedRef.current) {
        setTextVisible(true);
        textControls.start({
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: ANIMATION_CONFIG.spring.stiffness,
            damping: ANIMATION_CONFIG.spring.damping,
          },
        });
      }
    }, 300);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment =
          prev < 80 ? Math.random() * FAST_INCREMENT + 2 : Math.random() * SLOW_INCREMENT + 0.5;
        return Math.min(prev + increment, 100);
      });
    }, INTERVAL_MS);

    const timer = setTimeout(() => {
      setLoadingComplete(true);
    }, MIN_DISPLAY_TIME);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      clearTimeout(textEnterTimer);
    };
  }, [textControls, iconControls]);

  // Handle exit animations when loading is complete
  useEffect(() => {
    if (loadingComplete && textVisible && isMountedRef.current) {
      // Animate text sliding back up (into pocket)
      textControls.start({
        y: ANIMATION_CONFIG.slideDistance.exit,
        opacity: 0,
        transition: {
          type: "spring",
          stiffness: ANIMATION_CONFIG.spring.stiffness,
          damping: ANIMATION_CONFIG.spring.damping,
        },
      });

      // Animate icon sliding up and fading out (slightly delayed from text)
      setTimeout(() => {
        if (isMountedRef.current) {
          iconControls
            .start({
              y: ANIMATION_CONFIG.slideDistance.exit * 1.5,
              opacity: 0,
              scale: 0.9,
              transition: {
                type: "spring",
                stiffness: ANIMATION_CONFIG.spring.stiffness,
                damping: ANIMATION_CONFIG.spring.damping,
              },
            })
            .then(() => {
              // After both exit, hide the loader
              setTimeout(() => {
                setIsLoading(false);
                window.dispatchEvent(new CustomEvent("loaderComplete"));
              }, 100);
            });
        }
      }, 100);
    }
  }, [loadingComplete, textVisible, textControls, iconControls]);

  // =============================================
  // 📐 SIZE & SPACING - Adjust these values (in pixels)
  // =============================================
  const ICON_WIDTH = 250; // Icon width in pixels (96, 128, 160, 192)
  const ICON_HEIGHT = 250; // Icon height in pixels
  const GAP_ICON_TO_TEXT = -100; // Gap below icon in pixels (use negative to pull closer: -10, -20, -30)
  const TEXT_SIZE = 20; // Text size in pixels (16, 18, 20, 24)
  const TEXT_TRACKING = "0.2em"; // Letter spacing: "0.1em", "0.2em", "0.3em"
  // =============================================

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: ANIMATION_CONFIG.ease }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--background)",
          }}
        >
          {/* Floating Alibata Icon - Progress fills from bottom to top */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={iconControls}
            style={{
              position: "relative",
              width: ICON_WIDTH,
              height: ICON_HEIGHT,
            }}
          >
            {/* Background icon (unfilled - shows through) */}
            <Image
              src="/loader/1.png"
              alt="Loading"
              fill
              sizes="(max-width: 768px) 40vw, (max-width: 1200px) 30vw, 20vw"
              className="object-contain opacity-20"
              priority
            />

            {/* Foreground icon - fills based on progress (bottom to top) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                transition: "all 150ms ease-out",
                clipPath: `inset(${100 - progress}% 0 0 0)`,
              }}
            >
              <Image
                src="/loader/2.png"
                alt="Loading progress"
                fill
                sizes="(max-width: 768px) 40vw, (max-width: 1200px) 30vw, 20vw"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Kamusta! Text - Slide pocket animation */}
          <motion.div
            initial={{
              y: ANIMATION_CONFIG.slideDistance.enter,
              opacity: 0,
            }}
            animate={textControls}
            style={{ marginTop: GAP_ICON_TO_TEXT }}
          >
            <p
              className="text-xl text-muted-foreground font-primary"
              style={{ letterSpacing: TEXT_TRACKING }}
            >
              Kamusta!
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
