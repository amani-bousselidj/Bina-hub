import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );
};

export const LoadingSkeleton: React.FC<{ height?: string; width?: string }> = ({ 
  height = 'h-4', 
  width = 'w-full' 
}) => {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${height} ${width}`} />
  );
};


