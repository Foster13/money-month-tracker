"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeTransition({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (mounted && !prefersReducedMotion) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [resolvedTheme, mounted, prefersReducedMotion]);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Smooth animated overlay for theme transitions - disabled if prefers-reduced-motion */}
      {!prefersReducedMotion && (
        <AnimatePresence>
          {isTransitioning && (
            <>
              {/* Main transition overlay */}
              <motion.div
                key={`transition-${resolvedTheme}`}
                className="fixed inset-0 z-50 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.3, 
                  times: [0, 0.5, 1], 
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
                animate={{ opacity: [0, 0.4, 0] }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.3, 
                  times: [0, 0.4, 1],
                  ease: "easeOut"
                }}
              >
                <motion.div
                  className="rounded-full"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ 
                    duration: 0.3,
                    ease: [0.43, 0.13, 0.23, 0.96]
                  }}
                  style={{
                    width: "100vmax",
                    height: "100vmax",
                    background:
                      resolvedTheme === "dark"
                        ? "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
                        : "radial-gradient(circle, rgba(244, 114, 182, 0.3) 0%, transparent 70%)",
                  }}
                />
              </motion.div>

              {/* Subtle particles effect */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`particle-${i}-${resolvedTheme}`}
                  className="fixed z-50 pointer-events-none rounded-full"
                  style={{
                    width: Math.random() * 3 + 2,
                    height: Math.random() * 3 + 2,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background:
                      resolvedTheme === "dark"
                        ? "rgba(147, 197, 253, 0.5)"
                        : "rgba(251, 207, 232, 0.5)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 0.8, 0],
                    scale: [0, 1.2, 0],
                    y: [0, -40, -80]
                  }}
                  transition={{ 
                    duration: 0.3,
                    delay: i * 0.03,
                    ease: "easeOut"
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      )}
      
      {/* Content with smooth fade - instant if prefers-reduced-motion */}
      <motion.div
        key={resolvedTheme}
        initial={{ opacity: prefersReducedMotion ? 1 : 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
