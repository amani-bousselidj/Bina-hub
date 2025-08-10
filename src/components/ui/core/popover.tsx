import * as React from "react";
import { cn } from "@/core/shared/utils";

export interface PopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, children, open, onOpenChange, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative inline-block", className)}
      {...props}
    >
      {children}
    </div>
  )
);
Popover.displayName = "Popover";

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverContent };


