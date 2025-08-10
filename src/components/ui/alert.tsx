// Temporary Alert component - needs to be replaced with proper implementation
import React from 'react';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  className?: string;
}

export function Alert({ children, variant = 'default', className = '' }: AlertProps) {
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    destructive: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div className={`border rounded-lg p-4 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}

export interface AlertDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function AlertDescription({ children, className = '' }: AlertDescriptionProps) {
  return <div className={`text-sm ${className}`}>{children}</div>;
}


