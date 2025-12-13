"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
}

interface Line {
  id: string;
  fromNode: number;
  toNode: number;
}

interface NetworkLayerProps {
  isMenuOpen: boolean;
  hoveredMenuItem: string | null;
}

// Default balanced constellation pattern
const defaultNodes: Node[] = [
  { id: 0, x: 15, y: 20 },
  { id: 1, x: 35, y: 15 },
  { id: 2, x: 55, y: 25 },
  { id: 3, x: 75, y: 18 },
  { id: 4, x: 85, y: 35 },
  { id: 5, x: 25, y: 45 },
  { id: 6, x: 45, y: 55 },
  { id: 7, x: 65, y: 50 },
  { id: 8, x: 30, y: 75 },
  { id: 9, x: 70, y: 80 },
];

// Unique constellation patterns for each menu item
const menuPatterns: Record<string, Node[]> = {
  Home: [
    // Circular formation near center
    { id: 0, x: 50, y: 35 },
    { id: 1, x: 58, y: 30 },
    { id: 2, x: 62, y: 38 },
    { id: 3, x: 58, y: 46 },
    { id: 4, x: 50, y: 50 },
    { id: 5, x: 42, y: 46 },
    { id: 6, x: 38, y: 38 },
    { id: 7, x: 42, y: 30 },
    { id: 8, x: 50, y: 26 },
    { id: 9, x: 50, y: 54 },
  ],
  "About Me": [
    // Scattered organic pattern
    { id: 0, x: 20, y: 15 },
    { id: 1, x: 45, y: 20 },
    { id: 2, x: 70, y: 12 },
    { id: 3, x: 85, y: 28 },
    { id: 4, x: 30, y: 40 },
    { id: 5, x: 55, y: 45 },
    { id: 6, x: 75, y: 55 },
    { id: 7, x: 25, y: 70 },
    { id: 8, x: 50, y: 75 },
    { id: 9, x: 80, y: 85 },
  ],
  Work: [
    // Structured grid-like pattern
    { id: 0, x: 25, y: 25 },
    { id: 1, x: 50, y: 25 },
    { id: 2, x: 75, y: 25 },
    { id: 3, x: 25, y: 45 },
    { id: 4, x: 50, y: 45 },
    { id: 5, x: 75, y: 45 },
    { id: 6, x: 25, y: 65 },
    { id: 7, x: 50, y: 65 },
    { id: 8, x: 75, y: 65 },
    { id: 9, x: 50, y: 85 },
  ],
  Contacts: [
    // Dense interconnected network
    { id: 0, x: 50, y: 30 },
    { id: 1, x: 40, y: 40 },
    { id: 2, x: 60, y: 40 },
    { id: 3, x: 35, y: 50 },
    { id: 4, x: 50, y: 50 },
    { id: 5, x: 65, y: 50 },
    { id: 6, x: 40, y: 60 },
    { id: 7, x: 60, y: 60 },
    { id: 8, x: 45, y: 70 },
    { id: 9, x: 55, y: 70 },
  ],
};

// Connection patterns for each menu state
const defaultConnections: Line[] = [
  { id: "0-1", fromNode: 0, toNode: 1 },
  { id: "1-2", fromNode: 1, toNode: 2 },
  { id: "2-3", fromNode: 2, toNode: 3 },
  { id: "3-4", fromNode: 3, toNode: 4 },
  { id: "0-5", fromNode: 0, toNode: 5 },
  { id: "5-6", fromNode: 5, toNode: 6 },
  { id: "6-7", fromNode: 6, toNode: 7 },
  { id: "6-8", fromNode: 6, toNode: 8 },
  { id: "7-9", fromNode: 7, toNode: 9 },
  { id: "2-7", fromNode: 2, toNode: 7 },
];

const contactsConnections: Line[] = [
  // Dense web for contacts
  { id: "0-1", fromNode: 0, toNode: 1 },
  { id: "0-2", fromNode: 0, toNode: 2 },
  { id: "1-3", fromNode: 1, toNode: 3 },
  { id: "1-4", fromNode: 1, toNode: 4 },
  { id: "2-4", fromNode: 2, toNode: 4 },
  { id: "2-5", fromNode: 2, toNode: 5 },
  { id: "3-4", fromNode: 3, toNode: 4 },
  { id: "3-6", fromNode: 3, toNode: 6 },
  { id: "4-5", fromNode: 4, toNode: 5 },
  { id: "4-6", fromNode: 4, toNode: 6 },
  { id: "4-7", fromNode: 4, toNode: 7 },
  { id: "5-7", fromNode: 5, toNode: 7 },
  { id: "6-8", fromNode: 6, toNode: 8 },
  { id: "7-9", fromNode: 7, toNode: 9 },
  { id: "8-9", fromNode: 8, toNode: 9 },
];

const NetworkLayer = ({ isMenuOpen, hoveredMenuItem }: NetworkLayerProps) => {
  // Determine which pattern to use based on hovered menu item
  const activeNodes = useMemo(() => {
    if (!hoveredMenuItem) return defaultNodes;
    return menuPatterns[hoveredMenuItem] || defaultNodes;
  }, [hoveredMenuItem]);

  // Determine which connections to use
  const activeConnections = useMemo(() => {
    if (hoveredMenuItem === "Contacts") return contactsConnections;
    return defaultConnections;
  }, [hoveredMenuItem]);

  // Calculate brightness based on menu item
  const brightness = useMemo(() => {
    if (!hoveredMenuItem) return 1;
    if (hoveredMenuItem === "Contacts") return 1.6;
    if (hoveredMenuItem === "Home") return 1.3;
    return 1.1;
  }, [hoveredMenuItem]);

  if (!isMenuOpen) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* SVG for Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {activeConnections.map((connection, index) => {
          const fromNode = activeNodes.find((n) => n.id === connection.fromNode);
          const toNode = activeNodes.find((n) => n.id === connection.toNode);

          if (!fromNode || !toNode) return null;

          return (
            <motion.line
              key={connection.id}
              x1={`${fromNode.x}%`}
              y1={`${fromNode.y}%`}
              x2={`${toNode.x}%`}
              y2={`${toNode.y}%`}
              stroke="#5dade2"
              strokeWidth={2}
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: 0.4 * brightness,
                x1: `${fromNode.x}%`,
                y1: `${fromNode.y}%`,
                x2: `${toNode.x}%`,
                y2: `${toNode.y}%`,
              }}
              transition={{
                pathLength: { duration: 1.5, delay: 0.8 + index * 0.08 },
                opacity: { duration: 0.6 },
                x1: { type: "spring", stiffness: 80, damping: 20 },
                y1: { type: "spring", stiffness: 80, damping: 20 },
                x2: { type: "spring", stiffness: 80, damping: 20 },
                y2: { type: "spring", stiffness: 80, damping: 20 },
              }}
            />
          );
        })}
      </svg>

      {/* Nodes - purely decorative, no interaction */}
      {activeNodes.map((node, index) => {
        const targetNode = activeNodes.find((n) => n.id === node.id);
        if (!targetNode) return null;

        return (
          <motion.div
            key={node.id}
            style={{
              position: "absolute",
              width: 24,
              height: 24,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none", // Never interactive
            }}
            initial={{
              left: `${defaultNodes[node.id].x}%`,
              top: `${defaultNodes[node.id].y}%`,
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              left: `${targetNode.x}%`,
              top: `${targetNode.y}%`,
            }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 20,
              duration: 0.7,
            }}
          >
            {/* Outer glow ring - subtle ambient animation */}
            <motion.div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "#5dade2",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.2 * brightness, 0.1 * brightness, 0.2 * brightness],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            />

            {/* Core node */}
            <motion.div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#5dade2",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: 0.7 * brightness,
                boxShadow: `0 0 ${12 * brightness}px rgba(93, 173, 226, ${0.7 * brightness})`,
              }}
              transition={{
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror",
                  delay: 0.6 + index * 0.12, // Staggered appearance
                },
                opacity: { duration: 0.4, delay: 0.6 + index * 0.12 },
                boxShadow: { duration: 0.6 },
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default NetworkLayer;
