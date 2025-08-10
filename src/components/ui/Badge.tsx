"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "warning" | "success" | "neutral";
  size?: "sm" | "md" | "lg";
}

const Badge = ({
  className,
  variant = "default",
  size = "md",
  ...props
}: BadgeProps) => {
  const variants = {
    default: "bg-gray-900 text-gray-50 hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
    destructive: "bg-red-500 text-gray-50 hover:bg-red-500/80 dark:bg-red-900 dark:text-gray-50 dark:hover:bg-red-900/80",
    warning: "bg-yellow-500 text-gray-50 hover:bg-yellow-500/80 dark:bg-yellow-600 dark:text-gray-50 dark:hover:bg-yellow-600/80",
    success: "bg-green-500 text-gray-50 hover:bg-green-500/80 dark:bg-green-600 dark:text-gray-50 dark:hover:bg-green-600/80",
    neutral: "bg-gray-500 text-gray-50 hover:bg-gray-500/80 dark:bg-gray-600 dark:text-gray-50 dark:hover:bg-gray-600/80",
    outline: "text-gray-950 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-50",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5", 
    lg: "text-sm px-3 py-1"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:focus:ring-gray-300",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export { Badge };
