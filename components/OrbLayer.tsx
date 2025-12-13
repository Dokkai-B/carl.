"use client";

import { motion } from "framer-motion";

const OrbLayer = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  if (!isMenuOpen) return null;

  const orbs = [
    {
      id: 1,
      color: "#5dade2",
      size: 350,
      initialX: "85%",
      initialY: "-5%",
    },
    {
      id: 2,
      color: "#3498db",
      size: 280,
      initialX: "-5%",
      initialY: "15%",
    },
    {
      id: 3,
      color: "#667eea",
      size: 320,
      initialX: "80%",
      initialY: "85%",
    },
    {
      id: 4,
      color: "#5dade2",
      size: 240,
      initialX: "10%",
      initialY: "75%",
    },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
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
            left: orb.initialX,
            top: orb.initialY,
            transform: "translate(-50%, -50%)",
          }}
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: 0.08,
            scale: [1, 1.15, 1],
            x: [0, 40, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25 + index * 3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.4 + index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default OrbLayer;
