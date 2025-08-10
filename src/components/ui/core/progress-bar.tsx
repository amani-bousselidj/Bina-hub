// @ts-nocheck
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
}

export function ProgressBar({ 
  percentage, 
  showLabel = true, 
  size = 'md', 
  color = 'blue',
  className = '' 
}: ProgressBarProps) {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-6';
      default:
        return 'h-4';
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>التقدم</span>
          <span>{clampedPercentage}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${getSizeClasses(size)}`}>
        <div
          className={`${getSizeClasses(size)} ${getColorClasses(color)} transition-all duration-300 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
}




