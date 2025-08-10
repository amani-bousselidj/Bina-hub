import * as React from "react";
import { cn } from "@/core/shared/utils";

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
);
Command.displayName = "Command";

const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CommandList.displayName = "CommandList";

export { Command, CommandInput, CommandList };


