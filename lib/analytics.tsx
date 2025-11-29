"use client";

import { useEffect } from "react";
import ReactGA from "react-ga4";

export function Analytics() {
  useEffect(() => {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    
    if (measurementId && typeof window !== "undefined") {
      ReactGA.initialize(measurementId);
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }
  }, []);

  return null;
}

export const logEvent = (category: string, action: string, label?: string) => {
  if (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};
