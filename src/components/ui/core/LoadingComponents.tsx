import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('animate-spin rounded-full border-b-2 border-blue-600', sizeClasses[size], className)} />
  );
};

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  size = 'md', 
  className 
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      <LoadingSpinner size={size} />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export { LoadingSpinner, LoadingState };


