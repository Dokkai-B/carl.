"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface TransitionContextType {
  isTransitioning: boolean;
  menuOpen: boolean;
  startTransition: () => void;
  endTransition: () => void;
  setMenuOpen: (open: boolean) => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [menuOpen, setMenuOpenState] = useState(false);

  const startTransition = useCallback(() => {
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  const setMenuOpen = useCallback((open: boolean) => {
    setMenuOpenState(open);
  }, []);

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        menuOpen,
        startTransition,
        endTransition,
        setMenuOpen,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useTransition must be used within TransitionProvider");
  }
  return context;
};
