// File: src/constants/design-tokens.ts
/**
 * Design Tokens for Personal Finance Manager
 * Centralized design system values for consistent UI/UX
 */

/**
 * Color Palette
 * Primary colors, semantic colors, and neutral shades
 */
export const colors = {
  // Primary Colors
  primary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
  
  // Semantic Colors - Income (Green)
  income: {
    light: '#10b981',
    DEFAULT: '#059669',
    dark: '#047857',
  },
  
  // Semantic Colors - Expense (Red)
  expense: {
    light: '#ef4444',
    DEFAULT: '#dc2626',
    dark: '#b91c1c',
  },
  
  // Semantic Colors - Budget (Blue/Purple)
  budget: {
    light: '#8b5cf6',
    DEFAULT: '#7c3aed',
    dark: '#6d28d9',
  },
  
  // Neutral Colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
} as const;

/**
 * Spacing Scale
 * Consistent spacing values throughout the application
 */
export const spacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

/**
 * Typography Scale
 * Font sizes, weights, and line heights
 */
export const typography = {
  // Font Family
  fontFamily: {
    sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  // Font Sizes
  fontSize: {
    // Body text (minimum 14px)
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    
    // Headings (minimum 18px)
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
  },
  
  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    body: 1.5,
    heading: 1.2,
    tight: 1.1,
  },
} as const;

/**
 * Breakpoints
 * Responsive design breakpoints for different devices
 */
export const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large Desktop
  '2xl': '1536px',
} as const;

/**
 * Border Radius
 * Consistent corner rounding
 */
export const borderRadius = {
  none: '0',
  sm: '6px',
  DEFAULT: '8px',
  md: '8px',
  lg: '12px',
  full: '9999px',
} as const;

/**
 * Shadows
 * Elevation and depth
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

/**
 * Transitions
 * Animation timing and durations
 */
export const transitions = {
  duration: {
    fast: '100ms',
    DEFAULT: '200ms',
    slow: '300ms',
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

/**
 * Icon Sizes
 * Standardized icon size scale for consistent visual hierarchy
 */
export const iconSizes = {
  sm: '16px',   // Small icons: action buttons, inline icons
  md: '20px',   // Medium icons: default size, section headers
  lg: '24px',   // Large icons: prominent headers, hero sections
} as const;

/**
 * Z-Index Scale
 * Layering system
 */
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;
