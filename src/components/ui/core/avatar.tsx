// @ts-nocheck
"use client";

import * as React from "react";
import { cn } from "@/core/shared/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  name?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRandomColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 65%)`;
}

export function Avatar({ size = "md", name = "", className, ...props }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gray-100 font-semibold text-gray-900",
        sizeClasses[size],
        className
      )}
      style={name ? { backgroundColor: getRandomColor(name) } : undefined}
      {...props}
    >
      {name ? (
        <span className="text-white">{getInitials(name)}</span>
      ) : (
        <span className="text-gray-500">??</span>
      )}
    </div>
  );
}

export function AvatarImage({ 
  src, 
  alt = "", 
  className,
  ...props 
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full rounded-full object-cover", className)}
      {...props}
    />
  );
}

export function AvatarFallback({ 
  children, 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}


