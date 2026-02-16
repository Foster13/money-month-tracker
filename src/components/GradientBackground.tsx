// File: src/components/GradientBackground.tsx
"use client";

import { motion } from "framer-motion";

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, #FDDDE6 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, #FDD5DF 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #FECDD7 0%, transparent 50%),
            radial-gradient(circle at 60% 90%, #FEC6D0 0%, transparent 50%),
            radial-gradient(circle at 90% 20%, #FFBEC8 0%, transparent 50%),
            radial-gradient(circle at 50% 70%, #FFB6C1 0%, transparent 50%)
          `,
        }}
        animate={{
          backgroundPosition: [
            "20% 50%, 80% 80%, 40% 40%, 60% 90%, 90% 20%, 50% 70%",
            "25% 55%, 75% 75%, 45% 35%, 55% 85%, 85% 25%, 55% 65%",
            "30% 60%, 70% 70%, 50% 30%, 50% 80%, 80% 30%, 60% 60%",
            "25% 55%, 75% 75%, 45% 35%, 55% 85%, 85% 25%, 55% 65%",
            "20% 50%, 80% 80%, 40% 40%, 60% 90%, 90% 20%, 50% 70%",
          ],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
      
      {/* Overlay gradient for smooth blending */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(253, 221, 230, 0.3) 0%,
              rgba(253, 213, 223, 0.3) 20%,
              rgba(254, 205, 215, 0.3) 40%,
              rgba(254, 198, 208, 0.3) 60%,
              rgba(255, 190, 200, 0.3) 80%,
              rgba(255, 182, 193, 0.3) 100%
            )
          `,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Floating orbs for extra depth */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, #FDDDE6 0%, transparent 70%)",
          top: "10%",
          left: "10%",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      <motion.div
        className="absolute w-80 h-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, #FEC6D0 0%, transparent 70%)",
          bottom: "15%",
          right: "15%",
        }}
        animate={{
          x: [0, -40, 0],
          y: [0, -25, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 16,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 1,
        }}
      />

      <motion.div
        className="absolute w-72 h-72 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, #FFB6C1 0%, transparent 70%)",
          top: "50%",
          right: "20%",
        }}
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 14,
          ease: "easeInOut",
          repeat: Infinity,
          delay: 2,
        }}
      />
    </div>
  );
}
