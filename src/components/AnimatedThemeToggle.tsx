"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AnimatedThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative overflow-hidden">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden group transition-all duration-300"
    >
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={false}
        animate={{
          background: isDark
            ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
            : "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
        }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      />

      {/* Animated circle that expands/contracts */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        initial={false}
        animate={{
          scale: isDark ? 0 : 2,
          opacity: isDark ? 0 : 0.4,
        }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        style={{
          background: "radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, transparent 70%)",
        }}
      />

      {/* Moon glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        initial={false}
        animate={{
          scale: isDark ? 2 : 0,
          opacity: isDark ? 0.3 : 0,
        }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        style={{
          background: "radial-gradient(circle, #60a5fa 0%, #3b82f6 50%, transparent 70%)",
        }}
      />

      {/* Icons with smooth animation */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ y: -30, opacity: 0, rotate: -180, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: 30, opacity: 0, rotate: 180, scale: 0.5 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.43, 0.13, 0.23, 0.96],
                opacity: { duration: 0.3 }
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Moon className="h-[1.2rem] w-[1.2rem] text-blue-200 drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]" />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ y: 30, opacity: 0, rotate: 180, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
              exit={{ y: -30, opacity: 0, rotate: -180, scale: 0.5 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.43, 0.13, 0.23, 0.96],
                opacity: { duration: 0.3 }
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hover effect with smooth transition */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-md"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.15 }}
        transition={{ duration: 0.3 }}
        style={{
          background: isDark
            ? "radial-gradient(circle, #60a5fa 0%, transparent 70%)"
            : "radial-gradient(circle, #f472b6 0%, transparent 70%)",
        }}
      />

      {/* Pulse effect on click */}
      <motion.div
        className="absolute inset-0 -z-10 rounded-md"
        initial={{ scale: 1, opacity: 0 }}
        whileTap={{ scale: 1.5, opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.4 }}
        style={{
          background: isDark
            ? "rgba(96, 165, 250, 0.3)"
            : "rgba(244, 114, 182, 0.3)",
        }}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
