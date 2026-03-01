// File: src/components/icons/Icon.tsx
// Icons inspired by Icons8 3D Fluency style
import React from "react";
import { iconSizes } from "@/constants/design-tokens";

type IconSize = 'sm' | 'md' | 'lg';

interface IconProps {
  name: string;
  className?: string;
  size?: IconSize | number; // Support both size variants and custom pixel values
  'aria-label'?: string; // Descriptive label for screen readers
  'aria-hidden'?: boolean; // Hide decorative icons from screen readers
}

export function Icon({ name, className = "", size = 'md', 'aria-label': ariaLabel, 'aria-hidden': ariaHidden }: IconProps) {
  // Convert size to pixel value
  const sizeValue = typeof size === 'number' 
    ? size 
    : parseInt(iconSizes[size]);

  // Determine accessibility attributes
  const accessibilityProps: { 'aria-label'?: string; 'aria-hidden'?: boolean; role?: string } = {};
  
  if (ariaHidden) {
    accessibilityProps['aria-hidden'] = true;
  } else if (ariaLabel) {
    accessibilityProps['aria-label'] = ariaLabel;
    accessibilityProps['role'] = 'img';
  }

  const icons: Record<string, JSX.Element> = {
    notes: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <ellipse cx="32" cy="58" rx="18" ry="3" fill="#000000" opacity="0.1"/>
        <rect x="14" y="10" width="36" height="44" rx="3" fill="url(#notesGrad1)"/>
        <rect x="18" y="6" width="28" height="6" rx="2" fill="url(#notesGrad2)"/>
        <rect x="20" y="8" width="24" height="4" rx="1" fill="#FFE082"/>
        <rect x="20" y="18" width="24" height="32" rx="2" fill="#FFFFFF"/>
        <rect x="24" y="24" width="16" height="2" rx="1" fill="#E0E0E0"/>
        <rect x="24" y="30" width="16" height="2" rx="1" fill="#E0E0E0"/>
        <rect x="24" y="36" width="12" height="2" rx="1" fill="#E0E0E0"/>
        <rect x="24" y="42" width="14" height="2" rx="1" fill="#E0E0E0"/>
        <circle cx="22" cy="20" r="2" fill="#FFFFFF" opacity="0.6"/>
        <path d="M42 44L46 48L54 40" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="notesGrad1" x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE082"/>
            <stop offset="1" stopColor="#FFD54F"/>
          </linearGradient>
          <linearGradient id="notesGrad2" x1="32" y1="6" x2="32" y2="12" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFA726"/>
            <stop offset="1" stopColor="#FF9800"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    home: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <ellipse cx="32" cy="58" rx="20" ry="3" fill="#000000" opacity="0.1"/>
        <path d="M14 30L32 14L50 30V52C50 53.1046 49.1046 54 48 54H16C14.8954 54 14 53.1046 14 52V30Z" fill="url(#homeGrad1)"/>
        <path d="M10 32L32 12L54 32L50 36L32 20L14 36L10 32Z" fill="url(#homeGrad2)"/>
        <rect x="26" y="38" width="12" height="16" rx="1" fill="#8B4513"/>
        <circle cx="35" cy="46" r="1.5" fill="#FFD700"/>
        <rect x="18" y="34" width="8" height="8" rx="1" fill="#87CEEB" opacity="0.8"/>
        <rect x="38" y="34" width="8" height="8" rx="1" fill="#87CEEB" opacity="0.8"/>
        <defs>
          <linearGradient id="homeGrad1" x1="32" y1="14" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFB6C1"/>
            <stop offset="1" stopColor="#FF69B4"/>
          </linearGradient>
          <linearGradient id="homeGrad2" x1="32" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF1493"/>
            <stop offset="1" stopColor="#C71585"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    income: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <ellipse cx="32" cy="58" rx="18" ry="3" fill="#000000" opacity="0.1"/>
        <path d="M32 12C32 12 24 14 24 18V20C24 20 20 22 20 28V46C20 50 24 54 32 54C40 54 44 50 44 46V28C44 22 40 20 40 20V18C40 14 32 12 32 12Z" fill="url(#incomeGrad1)"/>
        <ellipse cx="32" cy="20" rx="8" ry="3" fill="#2E7D32"/>
        <path d="M32 26V48M32 26C29 26 27 28 27 30C27 32 29 33 32 33C35 33 37 34 37 36C37 38 35 40 32 40M32 26C35 26 37 28 37 30M32 48C29 48 27 46 27 44M32 48C35 48 37 46 37 44" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="32" r="2" fill="#FFFFFF" opacity="0.6"/>
        <defs>
          <linearGradient id="incomeGrad1" x1="32" y1="12" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#66BB6A"/>
            <stop offset="1" stopColor="#43A047"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    expenses: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <ellipse cx="32" cy="58" rx="18" ry="3" fill="#000000" opacity="0.1"/>
        <path d="M12 20C12 17.7909 13.7909 16 16 16H48C50.2091 16 52 17.7909 52 20V48C52 50.2091 50.2091 52 48 52H16C13.7909 52 12 50.2091 12 48V20Z" fill="url(#expensesGrad1)"/>
        <path d="M12 20C12 17.7909 13.7909 16 16 16H48C50.2091 16 52 17.7909 52 20V26H12V20Z" fill="url(#expensesGrad2)"/>
        <rect x="16" y="30" width="20" height="3" rx="1.5" fill="#FF1493" opacity="0.6"/>
        <path d="M38 32H48C49.1046 32 50 32.8954 50 34V42C50 43.1046 49.1046 44 48 44H38V32Z" fill="url(#expensesGrad3)"/>
        <circle cx="44" cy="38" r="3" fill="#8B4513"/>
        <circle cx="44" cy="38" r="1.5" fill="#FFD700"/>
        <circle cx="20" cy="22" r="2" fill="#FFFFFF" opacity="0.6"/>
        <defs>
          <linearGradient id="expensesGrad1" x1="32" y1="16" x2="32" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8A80"/>
            <stop offset="1" stopColor="#FF5252"/>
          </linearGradient>
          <linearGradient id="expensesGrad2" x1="32" y1="16" x2="32" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF5252"/>
            <stop offset="1" stopColor="#E53935"/>
          </linearGradient>
          <linearGradient id="expensesGrad3" x1="44" y1="32" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B4513"/>
            <stop offset="1" stopColor="#654321"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    budget: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <ellipse cx="32" cy="58" rx="18" ry="3" fill="#000000" opacity="0.1"/>
        <ellipse cx="32" cy="36" rx="18" ry="14" fill="url(#budgetGrad1)"/>
        <ellipse cx="48" cy="36" rx="4" ry="5" fill="url(#budgetGrad2)"/>
        <ellipse cx="48" cy="34" rx="1.5" ry="1" fill="#8B008B"/>
        <ellipse cx="48" cy="38" rx="1.5" ry="1" fill="#8B008B"/>
        <circle cx="26" cy="32" r="2.5" fill="#FFFFFF"/>
        <circle cx="26" cy="32" r="1.5" fill="#000000"/>
        <ellipse cx="20" cy="26" rx="3" ry="5" fill="url(#budgetGrad3)"/>
        <rect x="22" y="48" width="4" height="8" rx="2" fill="url(#budgetGrad2)"/>
        <rect x="38" y="48" width="4" height="8" rx="2" fill="url(#budgetGrad2)"/>
        <rect x="28" y="24" width="8" height="3" rx="1.5" fill="#8B008B"/>
        <circle cx="32" cy="20" r="4" fill="#FFD700"/>
        <circle cx="32" cy="20" r="2.5" fill="#FFA500"/>
        <text x="32" y="22" fontSize="4" fill="#FFD700" textAnchor="middle" fontWeight="bold">$</text>
        <path d="M14 36C14 36 12 34 12 32C12 30 14 28 14 28" stroke="url(#budgetGrad2)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <defs>
          <linearGradient id="budgetGrad1" x1="32" y1="22" x2="32" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E1BEE7"/>
            <stop offset="1" stopColor="#BA68C8"/>
          </linearGradient>
          <linearGradient id="budgetGrad2" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CE93D8"/>
            <stop offset="1" stopColor="#AB47BC"/>
          </linearGradient>
          <linearGradient id="budgetGrad3" x1="20" y1="21" x2="20" y2="31" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E1BEE7"/>
            <stop offset="1" stopColor="#CE93D8"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    rates: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <ellipse cx="32" cy="58" rx="20" ry="3" fill="#000000" opacity="0.1"/>
        <circle cx="24" cy="32" r="14" fill="url(#ratesGrad1)"/>
        <circle cx="24" cy="32" r="11" fill="#FFD700"/>
        <path d="M24 24V40M24 24C21 24 19 26 19 28C19 30 21 31 24 31C27 31 29 32 29 34C29 36 27 38 24 38M24 24C27 24 29 26 29 28M24 40C21 40 19 38 19 36M24 40C27 40 29 38 29 36" stroke="#FFA500" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="40" cy="32" r="14" fill="url(#ratesGrad2)"/>
        <circle cx="40" cy="32" r="11" fill="#90CAF9"/>
        <path d="M45 26C45 26 43 24 40 24C36 24 33 27 33 32C33 37 36 40 40 40C43 40 45 38 45 38M33 30H43M33 34H43" stroke="#1976D2" strokeWidth="2" strokeLinecap="round"/>
        <path d="M28 22L36 22L34 20M36 42L28 42L30 44" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="16" cy="20" r="1.5" fill="#FFD700"/>
        <circle cx="48" cy="20" r="1.5" fill="#90CAF9"/>
        <circle cx="16" cy="44" r="1.5" fill="#90CAF9"/>
        <circle cx="48" cy="44" r="1.5" fill="#FFD700"/>
        <defs>
          <linearGradient id="ratesGrad1" x1="24" y1="18" x2="24" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFE082"/>
            <stop offset="1" stopColor="#FFD54F"/>
          </linearGradient>
          <linearGradient id="ratesGrad2" x1="40" y1="18" x2="40" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#BBDEFB"/>
            <stop offset="1" stopColor="#64B5F6"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    simulation: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <ellipse cx="32" cy="58" rx="18" ry="3" fill="#000000" opacity="0.1"/>
        <rect x="16" y="12" width="32" height="42" rx="3" fill="url(#simGrad1)"/>
        <rect x="26" y="8" width="12" height="6" rx="2" fill="url(#simGrad2)"/>
        <rect x="28" y="10" width="8" height="4" rx="1" fill="#90CAF9"/>
        <rect x="20" y="18" width="24" height="32" rx="2" fill="#FFFFFF"/>
        <rect x="24" y="24" width="16" height="2" rx="1" fill="#E0E0E0"/>
        <rect x="24" y="30" width="16" height="2" rx="1" fill="#E0E0E0"/>
        <rect x="24" y="36" width="16" height="2" rx="1" fill="#E0E0E0"/>
        <rect x="24" y="42" width="12" height="2" rx="1" fill="#E0E0E0"/>
        <circle cx="38" cy="25" r="3" fill="#4CAF50"/>
        <path d="M36.5 25L37.5 26L39.5 24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="38" cy="31" r="3" fill="#4CAF50"/>
        <path d="M36.5 31L37.5 32L39.5 30" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="38" cy="37" r="3" fill="#FF9800"/>
        <path d="M37 37L39 37" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="22" cy="20" r="2" fill="#FFFFFF" opacity="0.6"/>
        <defs>
          <linearGradient id="simGrad1" x1="32" y1="12" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#90CAF9"/>
            <stop offset="1" stopColor="#42A5F5"/>
          </linearGradient>
          <linearGradient id="simGrad2" x1="32" y1="8" x2="32" y2="14" gradientUnits="userSpaceOnUse">
            <stop stopColor="#64B5F6"/>
            <stop offset="1" stopColor="#1E88E5"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <ellipse cx="32" cy="58" rx="16" ry="3" fill="#000000" opacity="0.1"/>
        <path d="M32 54C32 54 12 42 12 26C12 14 20 10 26 14C28 15 30 17 32 20C34 17 36 15 38 14C44 10 52 14 52 26C52 42 32 54 32 54Z" fill="url(#heartGrad1)"/>
        <path d="M32 20C34 17 36 15 38 14C44 10 52 14 52 26C52 30 50 34 46 38" fill="url(#heartGrad2)" opacity="0.6"/>
        <circle cx="22" cy="22" r="3" fill="#FFFFFF" opacity="0.8"/>
        <circle cx="28" cy="26" r="2" fill="#FFFFFF" opacity="0.6"/>
        <circle cx="42" cy="22" r="2.5" fill="#FFFFFF" opacity="0.7"/>
        <path d="M16 16L17 18L19 19L17 20L16 22L15 20L13 19L15 18L16 16Z" fill="#FFD700"/>
        <path d="M48 16L49 18L51 19L49 20L48 22L47 20L45 19L47 18L48 16Z" fill="#FFD700"/>
        <defs>
          <linearGradient id="heartGrad1" x1="32" y1="10" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8A80"/>
            <stop offset="0.5" stopColor="#FF5252"/>
            <stop offset="1" stopColor="#E53935"/>
          </linearGradient>
          <linearGradient id="heartGrad2" x1="42" y1="14" x2="42" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF"/>
            <stop offset="1" stopColor="#FF8A80"/>
          </linearGradient>
        </defs>
      </svg>
    ),
    sparkles: (
      <svg viewBox="0 0 64 64" fill="none" width={sizeValue} height={sizeValue} className={className} {...accessibilityProps}>
        <path d="M32 8L34 18L44 20L34 22L32 32L30 22L20 20L30 18L32 8Z" fill="url(#sparkleGrad1)"/>
        <path d="M32 8L34 18L44 20L34 22L32 32L30 22L20 20L30 18L32 8Z" stroke="#FFA500" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="30" cy="16" r="2" fill="#FFFFFF" opacity="0.8"/>
        <path d="M48 14L49 18L53 19L49 20L48 24L47 20L43 19L47 18L48 14Z" fill="url(#sparkleGrad2)"/>
        <path d="M48 14L49 18L53 19L49 20L48 24L47 20L43 19L47 18L48 14Z" stroke="#FF6B6B" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M16 40L17 44L21 45L17 46L16 50L15 46L11 45L15 44L16 40Z" fill="url(#sparkleGrad3)"/>
        <path d="M16 40L17 44L21 45L17 46L16 50L15 46L11 45L15 44L16 40Z" stroke="#4ECDC4" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M52 36L52.5 38L54.5 38.5L52.5 39L52 41L51.5 39L49.5 38.5L51.5 38L52 36Z" fill="#FFD93D"/>
        <path d="M12 24L12.5 26L14.5 26.5L12.5 27L12 29L11.5 27L9.5 26.5L11.5 26L12 24Z" fill="#95E1D3"/>
        <path d="M44 48L44.5 50L46.5 50.5L44.5 51L44 53L43.5 51L41.5 50.5L43.5 50L44 48Z" fill="#F38181"/>
        <circle cx="24" cy="12" r="1.5" fill="#FFD700"/>
        <circle cx="40" cy="28" r="1.5" fill="#FF6B6B"/>
        <circle cx="28" cy="48" r="1.5" fill="#4ECDC4"/>
        <circle cx="54" cy="28" r="1.5" fill="#95E1D3"/>
        <circle cx="10" cy="36" r="1.5" fill="#F38181"/>
        <defs>
          <linearGradient id="sparkleGrad1" x1="32" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD93D"/>
            <stop offset="1" stopColor="#FFA500"/>
          </linearGradient>
          <linearGradient id="sparkleGrad2" x1="48" y1="14" x2="48" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF8A80"/>
            <stop offset="1" stopColor="#FF6B6B"/>
          </linearGradient>
          <linearGradient id="sparkleGrad3" x1="16" y1="40" x2="16" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#95E1D3"/>
            <stop offset="1" stopColor="#4ECDC4"/>
          </linearGradient>
        </defs>
      </svg>
    ),
  };

  return (
    <span className={`inline-flex items-center justify-center ${className}`}>
      {icons[name] || icons.home}
    </span>
  );
}
