"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [resolvedTheme, mounted]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Smooth animated overlay for theme transitions */}
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* Main transition overlay */}
            <motion.div
              key={`transition-${resolvedTheme}`}
              className="fixed inset-0 z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                times: [0, 0.4, 1], 
                ease: [0.43, 0.13, 0.23, 0.96] // Custom easing for smoother feel
              }}
              style={{
                background:
                  resolvedTheme === "dark"
                    ? "radial-gradient(circle at center, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 50%, rgba(51, 65, 85, 0.9) 100%)"
                    : "radial-gradient(circle at center, rgba(255, 245, 250, 0.98) 0%, rgba(255, 228, 240, 0.95) 50%, rgba(252, 231, 243, 0.9) 100%)",
              }}
            />
            
            {/* Ripple effect from center */}
            <motion.div
              key={`ripple-${resolvedTheme}`}
              className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                times: [0, 0.3, 1],
                ease: "easeOut"
              }}
            >
              <motion.div
                className="rounded-full"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ 
                  duration: 0.8,
                  ease: [0.43, 0.13, 0.23, 0.96]
                }}
                style={{
                  width: "100vmax",
                  height: "100vmax",
                  background:
                    resolvedTheme === "dark"
                      ? "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)"
                      : "radial-gradient(circle, rgba(244, 114, 182, 0.4) 0%, transparent 70%)",
                }}
              />
            </motion.div>

            {/* Subtle particles effect */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`particle-${i}-${resolvedTheme}`}
                className="fixed z-50 pointer-events-none rounded-full"
                style={{
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background:
                    resolvedTheme === "dark"
                      ? "rgba(147, 197, 253, 0.6)"
                      : "rgba(251, 207, 232, 0.6)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -50, -100]
                }}
                transition={{ 
                  duration: 0.8,
                  delay: i * 0.05,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Content with smooth fade */}
      <motion.div
        key={resolvedTheme}
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
