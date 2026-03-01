// File: src/components/ui/error-state.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Button } from "./button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ 
    className, 
    title = "Something went wrong", 
    description = "We encountered an error while loading your data. Please try again.",
    onRetry,
    retryLabel = "Try Again",
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 px-4 text-center",
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" aria-hidden="true" />
        </div>
        <h3 className="text-heading-sm text-foreground mb-2">{title}</h3>
        <p className="text-body text-muted-foreground max-w-md mb-4">
          {description}
        </p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="mt-2"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }
);
ErrorState.displayName = "ErrorState";

export { ErrorState };
