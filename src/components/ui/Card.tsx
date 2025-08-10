// @ts-nocheck
"use client";

import { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, ...props }: CardProps) {
  return (
    <div {...props} className={`border p-4 rounded-lg shadow ${props.className ?? ""}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, ...props }: CardProps) {
  return (
    <div {...props} className={`p-4 ${props.className ?? ""}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, ...props }: CardProps) {
  return (
    <div {...props} className={`p-4 pb-2 ${props.className ?? ""}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, ...props }: CardProps) {
  return (
    <h3 {...props} className={`text-lg font-semibold ${props.className ?? ""}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, ...props }: CardProps) {
  return (
    <p {...props} className={`text-sm text-gray-500 ${props.className ?? ""}`}>
      {children}
    </p>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );
}

export function EmptyState({ title, description }: { title?: string; description?: string }) {
  return (
    <div className="text-center p-8">
      <h3 className="text-lg font-medium text-gray-900">{title || 'لا توجد بيانات'}</h3>
      <p className="text-gray-500">{description || 'لم يتم العثور على أي بيانات'}</p>
    </div>
  );
}




