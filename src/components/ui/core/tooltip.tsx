import * as React from "react";
import { cn } from "@/core/shared/utils";

export interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  content?: string;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, children, content, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative inline-block", className)}
      {...props}
    >
      {children}
      {content && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-black rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {content}
        </div>
      )}
    </div>
  )
);
Tooltip.displayName = "Tooltip";

export { Tooltip };


