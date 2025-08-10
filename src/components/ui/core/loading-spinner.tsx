// @ts-nocheck
"use client";
import * as React from "react";
import { cn } from "@/core/shared/utils";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  size = "md",
  className,
  ...props
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-gray-300 border-t-current loading-spinner",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;


