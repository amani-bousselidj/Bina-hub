// Temporary Progress component - needs to be replaced with proper implementation
import React from 'react';

export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

export function Progress({ value = 0, max = 100, className = '' }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`progress w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="progress-bar bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}


