// File: src/components/icons/IconRenderer.tsx
import { LucideProps } from "lucide-react";
import * as Icons from "./icon-registry";

interface IconRendererProps extends Omit<LucideProps, "ref"> {
  name: string;
  fallback?: string;
  "aria-label"?: string; // Descriptive label for screen readers
  "aria-hidden"?: boolean; // Hide decorative icons from screen readers
}

/**
 * Dynamically renders a Lucide icon by name
 * Used for category icons where the icon name is stored as a string
 */
export function IconRenderer({
  name,
  fallback = "Circle",
  "aria-label": ariaLabel,
  "aria-hidden": ariaHidden,
  ...props
}: IconRendererProps) {
  // Get the icon component from our registry
  const IconComponent = (Icons as any)[name] || (Icons as any)[fallback];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon-registry, using fallback "${fallback}"`);
    const FallbackIcon = Icons.Circle;
    return <FallbackIcon {...props} aria-hidden={ariaHidden} aria-label={ariaLabel} />;
  }

  return <IconComponent {...props} aria-hidden={ariaHidden} aria-label={ariaLabel} />;
}
