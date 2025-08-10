import * as React from "react";
import { cn } from "@/core/shared/utils";

export interface SheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Sheet = React.forwardRef<HTMLDivElement, SheetProps>(
  ({ className, children, open, onOpenChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center sm:items-center",
        !open && "hidden",
        className
      )}
      {...props}
    >
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange?.(false)} />
      <div className="relative bg-white rounded-t-lg sm:rounded-lg p-6 w-full max-w-md">
        {children}
      </div>
    </div>
  )
);
Sheet.displayName = "Sheet";

const SheetContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-4", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SheetContent.displayName = "SheetContent";

export { Sheet, SheetContent };


