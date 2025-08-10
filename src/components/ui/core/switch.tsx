import * as React from "react";
import { cn } from "@/core/shared/utils";

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked = false, onCheckedChange, size, ...props }, ref) => {
    const sizeClasses = size === "sm" ? "h-4 w-8" : "h-6 w-11";
    const knobClasses = size === "sm" ? "h-3 w-3" : "h-5 w-5";
    const translateClasses = size === "sm" ? "translate-x-4" : "translate-x-5";
    
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={cn(
          "inline-flex items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          sizeClasses,
          checked ? "bg-primary" : "bg-gray-200",
          className
        )}
        onClick={() => onCheckedChange && onCheckedChange(!checked)}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "inline-block transform rounded-full bg-white shadow transition-transform",
            knobClasses,
            checked ? translateClasses : "translate-x-0"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };




