"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Node {
  id: number;
  x: number;
  y: number;
}

interface Line {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const NetworkLayer = ({ isMenuOpen }: { isMenuOpen: boolean }) => {
  const [nodes] = useState<Node[]>(() => [
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
  ]);

  const [lines] = useState<Line[]>(() => [
    { id: "0-1", x1: 15, y1: 20, x2: 35, y2: 15 },
    { id: "1-2", x1: 35, y1: 15, x2: 55, y2: 25 },
    { id: "2-3", x1: 55, y1: 25, x2: 75, y2: 18 },
    { id: "3-4", x1: 75, y1: 18, x2: 85, y2: 35 },
    { id: "0-5", x1: 15, y1: 20, x2: 25, y2: 45 },
    { id: "5-6", x1: 25, y1: 45, x2: 45, y2: 55 },
    { id: "6-7", x1: 45, y1: 55, x2: 65, y2: 50 },
    { id: "6-8", x1: 45, y1: 55, x2: 30, y2: 75 },
    { id: "7-9", x1: 65, y1: 50, x2: 70, y2: 80 },
    { id: "2-7", x1: 55, y1: 25, x2: 65, y2: 50 },
  ]);

  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  if (!isMenuOpen) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* SVG for Lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {lines.map((line, index) => {
          // Check if this line connects to the hovered node
          const nodeId1 = parseInt(line.id.split('-')[0]);
          const nodeId2 = parseInt(line.id.split('-')[1]);
          const isConnectedToHovered = hoveredNode === nodeId1 || hoveredNode === nodeId2;
          
          return (
            <motion.line
              key={line.id}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="#5dade2"
              strokeWidth={isConnectedToHovered ? 3 : 2}
              filter="url(#glow)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: isConnectedToHovered ? 0.8 : 0.4 
              }}
              transition={{
                pathLength: { duration: 1.5, delay: 0.8 + index * 0.1 },
                opacity: { duration: 0.3 },
              }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node, index) => {
        const isHovered = hoveredNode === node.id;
        
        return (
          <motion.div
            key={node.id}
            style={{
              position: "absolute",
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: 24, // Larger hit area
              height: 24,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
              cursor: "pointer",
              zIndex: isHovered ? 30 : 20,
            }}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Outer glow ring */}
            <motion.div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                backgroundColor: "#5dade2",
                opacity: 0.2,
              }}
              animate={{
                scale: isHovered ? [1, 2, 1] : 1,
                opacity: isHovered ? [0.3, 0, 0.3] : 0.2,
              }}
              transition={{
                duration: isHovered ? 1 : 0,
                repeat: isHovered ? Infinity : 0,
              }}
            />
            
            {/* Core node */}
            <motion.div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#5dade2",
                boxShadow: isHovered
                  ? "0 0 24px 4px rgba(93, 173, 226, 1), inset 0 0 12px rgba(93, 173, 226, 1)"
                  : "0 0 12px rgba(93, 173, 226, 0.7)",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: isHovered ? 1.8 : [1, 1.3, 1],
                opacity: isHovered ? 1 : 0.6,
              }}
              transition={{
                scale: {
                  duration: isHovered ? 0.2 : 2,
                  repeat: isHovered ? 0 : Infinity,
                  repeatType: "mirror",
                  delay: isHovered ? 0 : 0.6 + index * 0.08,
                },
                opacity: { duration: 0.2, delay: isHovered ? 0 : 0.6 + index * 0.08 },
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default NetworkLayer;
