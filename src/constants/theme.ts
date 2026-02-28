// File: src/constants/theme.ts
export const THEME_COLORS = {
  PRIMARY: {
    LIGHT: '#FF69B4',
    DARK: '#FF1493',
  },
  SECONDARY: {
    LIGHT: '#FFB6C1',
    DARK: '#C71585',
  },
  BACKGROUND: {
    LIGHT: '#FFF5FA',
    DARK: '#1A1A1A',
  },
} as const;

export const GRADIENT_CLASSES = {
  PRIMARY: 'bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400',
  SECONDARY: 'bg-gradient-to-r from-pink-400 to-rose-400',
  BACKGROUND: 'bg-gradient-to-br from-pink-50 to-rose-50',
} as const;

export const ANIMATION_DELAYS = {
  FAST: '0.1s',
  MEDIUM: '0.2s',
  SLOW: '0.3s',
} as const;
