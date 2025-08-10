// Temporary Separator component - needs to be replaced with proper implementation
import React from 'react';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ orientation = 'horizontal', className = '' }, ref) => {
    const orientationClasses = orientation === 'horizontal' 
      ? 'h-px w-full' 
      : 'w-px h-full';
      
    return (
      <div 
        ref={ref}
        className={`shrink-0 bg-gray-200 ${orientationClasses} ${className}`}
        role="separator"
        aria-orientation={orientation}
      />
    );
  }
);

Separator.displayName = 'Separator';


