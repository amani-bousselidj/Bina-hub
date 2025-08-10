"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./Input";

export interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        )}
        <Input
          className={cn(className)}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

EnhancedInput.displayName = "EnhancedInput";
