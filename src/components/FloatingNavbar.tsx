// File: src/components/FloatingNavbar.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  icon: string;
  value: string;
}

interface FloatingNavbarProps {
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}

export function FloatingNavbar({
  navItems,
  activeTab,
  onTabChange,
  className,
}: FloatingNavbarProps) {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (current) => {
    // Show navbar when scrolling up, hide when scrolling down
    if (current < lastScrollY || current < 50) {
      setVisible(true);
    } else if (current > lastScrollY && current > 50) {
      setVisible(false);
    }
    setLastScrollY(current);
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "fixed top-4 inset-x-0 mx-auto z-50 flex items-center justify-center",
          className
        )}
      >
        <div className="relative">
          {/* Navbar Container */}
          <motion.div
            className={cn(
              "flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3",
              "px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2.5 lg:px-6 lg:py-3",
              "rounded-full border border-pink-200/50 dark:border-pink-800/50",
              "bg-white/80 dark:bg-gray-900/80",
              "backdrop-blur-lg shadow-lg",
              "max-w-fit"
            )}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {navItems.map((item, idx) => {
              const isActive = activeTab === item.value;
              return (
                <motion.button
                  key={item.value}
                  onClick={() => onTabChange(item.value)}
                  className={cn(
                    "relative flex items-center justify-center",
                    "rounded-full transition-all duration-300",
                    "cursor-pointer group",
                    // Mobile: icon only, smaller size
                    "w-9 h-9 sm:w-10 sm:h-10 md:w-auto md:h-auto",
                    "md:px-3 md:py-2 lg:px-4 lg:py-2.5",
                    isActive
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Active Background */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full shadow-lg"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}

                  {/* Content */}
                  <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
                    {/* Icon */}
                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl">
                      {item.icon}
                    </span>
                    {/* Text - hidden on mobile, visible on md+ */}
                    <span className="hidden md:inline-block text-xs lg:text-sm font-semibold whitespace-nowrap">
                      {item.name}
                    </span>
                  </span>

                  {/* Hover effect for inactive items */}
                  {!isActive && (
                    <motion.div
                      className="absolute inset-0 bg-pink-100/50 dark:bg-pink-900/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 blur-xl opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 rounded-full" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
