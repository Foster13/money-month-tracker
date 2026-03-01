// File: src/components/ui/loading-spinner.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary';
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4 border-2',
      md: 'w-8 h-8 border-2',
      lg: 'w-12 h-12 border-3',
    };

    const variantClasses = {
      default: 'border-muted-foreground/30 border-t-muted-foreground',
      primary: 'border-primary/30 border-t-primary',
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn("inline-block", className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full animate-spin",
            sizeClasses[size],
            variantClasses[variant]
          )}
        />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }
);
LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
