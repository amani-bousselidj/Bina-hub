// @ts-nocheck
"use client";
import * as React from "react";
import { UnifiedLoading } from "./unified-loading";

interface EnhancedLoadingProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  fullScreen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  logoSrc?: string;
}

export function EnhancedLoading(props: EnhancedLoadingProps) {
  return <UnifiedLoading {...props} mode="simple" />;
}

// Also export as default for convenience
export default EnhancedLoading;


