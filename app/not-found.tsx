"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { slidePocketChild, ANIMATION_CONFIG } from "@/lib/animations";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Orb data for background
  const orbs = [
    { id: 1, color: "#5dade2", size: 350, x: "85%", y: "-5%" },
    { id: 2, color: "#3498db", size: 280, x: "-5%", y: "15%" },
    { id: 3, color: "#667eea", size: 320, x: "80%", y: "85%" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Grid texture background */}
      <div className="fixed inset-0 -z-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(93, 173, 226, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(93, 173, 226, 0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Floating orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {orbs.map((orb, index) => (
          <motion.div
            key={orb.id}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              borderRadius: "50%",
              backgroundColor: orb.color,
              filter: "blur(80px)",
              opacity: 0.08,
              left: orb.x,
              top: orb.y,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              x: [0, 40, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 25 + index * 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div
          variants={slidePocketChild}
          initial={mounted ? "hidden" : false}
          animate={mounted ? "visible" : false}
          style={{ maxWidth: "42rem", margin: "0 auto", textAlign: "center" }}
        >
          {/* 404 Number */}
          <motion.div variants={slidePocketChild} style={{ marginBottom: "2rem" }}>
            <h1 style={{
              fontSize: "clamp(3rem, 10vw, 9rem)",
              fontWeight: "bold",
              backgroundImage: "linear-gradient(to right, #5dade2, #3498db, #667eea)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              404
            </h1>
            {/* Animated underline */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              style={{
                height: "4px",
                backgroundImage: "linear-gradient(to right, #5dade2, #3498db, #667eea)",
                margin: "1rem auto 0",
                borderRadius: "999px",
              }}
            />
          </motion.div>

          {/* Title */}
          <motion.h2
            variants={slidePocketChild}
            style={{
              fontSize: "clamp(1.875rem, 5vw, 3rem)",
              fontWeight: "bold",
              color: "hsl(var(--foreground))",
              marginBottom: "1rem",
            }}
          >
            Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={slidePocketChild}
            style={{
              fontSize: "1.125rem",
              color: "hsl(var(--muted-foreground))",
              marginBottom: "3rem",
              maxWidth: "28rem",
              margin: "0 auto 3rem",
            }}
          >
            The page you're looking for doesn't exist yet or has been moved. Let's get you back on track.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={slidePocketChild}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {/* Go Home Button */}
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  position: "relative",
                }}
              >
                {/* Button background blur */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "0.5rem",
                    backgroundColor: "rgba(93, 173, 226, 0.15)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                />

                {/* Button border and shadow */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "0.5rem",
                    border: "1.5px solid rgba(93, 173, 226, 0.3)",
                    boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05), 0 10px 30px rgba(93, 173, 226, 0.1)",
                    transition: "all 0.3s",
                  }}
                />

                {/* Content */}
                <div style={{
                  position: "relative",
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  fontWeight: "500",
                  color: "hsl(var(--foreground))",
                }}>
                  Go Home
                </div>
              </motion.div>
            </Link>

            {/* View Projects Button */}
            <Link href="/work">
              <motion.div
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{
                  position: "relative",
                }}
              >
                {/* Button background blur */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "0.5rem",
                    backgroundColor: "rgba(102, 126, 234, 0.15)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                  }}
                />

                {/* Button border and shadow */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "0.5rem",
                    border: "1.5px solid rgba(102, 126, 234, 0.3)",
                    boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05), 0 10px 30px rgba(102, 126, 234, 0.1)",
                    transition: "all 0.3s",
                  }}
                />

                {/* Content */}
                <div style={{
                  position: "relative",
                  paddingLeft: "2rem",
                  paddingRight: "2rem",
                  paddingTop: "0.75rem",
                  paddingBottom: "0.75rem",
                  fontWeight: "500",
                  color: "hsl(var(--foreground))",
                }}>
                  View Projects
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
