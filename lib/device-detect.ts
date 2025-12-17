"use client";

import { useEffect, useState } from "react";

// Breakpoints matching tailwind.config.js
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 960,
  xl: 1200,
} as const;

// Device tier for animation strategy
export type DeviceTier = "mobile" | "tablet" | "desktop";

/**
 * Hook to detect device tier for animation optimization
 * Returns null on server/first render to avoid hydration mismatch
 */
export function useDeviceTier(): DeviceTier | null {
  const [tier, setTier] = useState<DeviceTier | null>(null);

  useEffect(() => {
    const updateTier = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.md) {
        setTier("mobile");
      } else if (width < BREAKPOINTS.lg) {
        setTier("tablet");
      } else {
        setTier("desktop");
      }
    };

    updateTier();
    window.addEventListener("resize", updateTier);
    return () => window.removeEventListener("resize", updateTier);
  }, []);

  return tier;
}

/**
 * Hook to detect if device has hover capability (mouse/trackpad)
 * Returns false for touch-only devices
 */
export function useHasHover(): boolean {
  const [hasHover, setHasHover] = useState(false);

  useEffect(() => {
    setHasHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  return hasHover;
}

/**
 * Hook to detect if device is touch-capable
 */
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia("(pointer: coarse)").matches
    );
  }, []);

  return isTouch;
}

/**
 * Simplified device detection - just mobile vs not mobile
 */
export function useIsMobile(): boolean | null {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.md);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}
