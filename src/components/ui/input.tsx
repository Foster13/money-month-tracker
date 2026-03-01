// File: src/components/ui/input.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: 'sm' | 'default' | 'lg';
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize = 'default', error, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-11 rounded-sm md:h-9', // 44px on mobile/tablet, 36px on desktop
      default: 'h-11 rounded-md md:h-10', // 44px on mobile/tablet, 40px on desktop
      lg: 'h-11 rounded-lg', // 44px at all sizes
    };
    
    return (
      <input
        type={type}
        className={cn(
          "flex w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          sizeClasses[inputSize],
          error && "border-destructive focus-visible:ring-destructive",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
