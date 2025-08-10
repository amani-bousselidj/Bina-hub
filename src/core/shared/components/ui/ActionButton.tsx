import React, { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
};

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const buttonClassName = useMemo(() => cn(
    'flex items-center gap-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    variantClasses[variant],
    sizeClasses[size],
    loading && 'opacity-50 cursor-not-allowed',
    className
  ), [variant, size, loading, className]);

  return (
    <Button
      className={buttonClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      )}
      {icon && !loading && icon}
      {children}
    </Button>
  );
};

export default ActionButton;


