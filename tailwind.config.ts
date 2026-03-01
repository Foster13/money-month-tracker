// File: tailwind.config.ts
import {
  colors,
  spacing,
  typography,
  breakpoints,
  borderRadius,
  shadows,
  transitions,
  zIndex,
} from "./src/constants/design-tokens";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    // Override default breakpoints with design tokens
    screens: breakpoints,
    extend: {
      // Design token colors
      colors: {
        ...colors,
        // Preserve existing CSS variable-based colors for shadcn/ui compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          ...colors.primary,
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // Design token spacing
      spacing: spacing,
      // Design token typography
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      // Design token border radius
      borderRadius: {
        ...borderRadius,
        // Preserve existing CSS variable-based radius
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Design token shadows
      boxShadow: shadows,
      // Design token transitions
      transitionDuration: transitions.duration,
      transitionTimingFunction: transitions.timing,
      // Design token z-index
      zIndex: zIndex,
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;
