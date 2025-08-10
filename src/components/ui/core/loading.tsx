// Enhanced Loading Component
import React from 'react';

interface EnhancedLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: 'spinner' | 'dots' | 'bars' | 'pulse';
  color?: 'primary' | 'secondary' | 'accent' | 'gray';
  text?: string;
  fullScreen?: boolean;
}

export function EnhancedLoading({
  size = 'md',
  type = 'spinner',
  color = 'primary',
  text,
  fullScreen = false
}: EnhancedLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    accent: 'text-purple-600',
    gray: 'text-gray-400'
  };

  const renderSpinner = () => (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}>
      <svg fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-full ${
            size === 'sm' ? 'w-2 h-2' :
            size === 'md' ? 'w-3 h-3' :
            size === 'lg' ? 'w-4 h-4' : 'w-5 h-5'
          } ${colorClasses[color].replace('text-', 'bg-')} animate-pulse`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const renderBars = () => (
    <div className="flex space-x-1 items-end">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`${colorClasses[color].replace('text-', 'bg-')} animate-pulse rounded`}
          style={{
            width: size === 'sm' ? '3px' : size === 'md' ? '4px' : size === 'lg' ? '5px' : '6px',
            height: size === 'sm' ? `${8 + i * 2}px` : size === 'md' ? `${12 + i * 3}px` : size === 'lg' ? `${16 + i * 4}px` : `${20 + i * 5}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`${sizeClasses[size]} ${colorClasses[color].replace('text-', 'bg-')} rounded-full animate-pulse`} />
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'bars':
        return renderBars();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-8'}`}>
      {renderLoader()}
      {text && (
        <p className={`mt-4 text-sm ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

// Loading states for specific use cases
export function PageLoading({ text = "Loading page..." }: { text?: string }) {
  return <EnhancedLoading type="spinner" size="lg" text={text} fullScreen />;
}

export function ComponentLoading({ text }: { text?: string }) {
  return <EnhancedLoading type="dots" size="md" text={text} />;
}

export function ButtonLoading() {
  return <EnhancedLoading type="spinner" size="sm" />;
}

export function TableLoading() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex space-x-4 animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default EnhancedLoading;

// Simple LoadingSpinner alias for backward compatibility
export const LoadingSpinner = EnhancedLoading;


