import React, { forwardRef } from 'react';
import { Button as BaseButton } from '@/components/ui/Button'
import { ChevronDown } from 'lucide-react';

// Utility function (simplified version of cn)
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Typography component
interface TypographyProps {
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  size = 'md', 
  weight = 'normal', 
  className = '', 
  children 
}) => {
  const baseClasses = 'text-gray-900';
  const variantClasses = {
    heading: 'font-bold',
    subheading: 'font-semibold',
    body: 'font-normal',
    caption: 'font-normal text-gray-600',
    label: 'font-medium text-gray-700'
  };
  
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };
  
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${weightClasses[weight]} ${className}`;

  return <div className={classes}>{children}</div>;
};

// EnhancedCard component
interface EnhancedCardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({ 
  variant = 'default', 
  hover = false,
  className = '', 
  onClick,
  children
}) => {
  const baseClasses = 'rounded-lg p-4';
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-md border border-gray-100',
    outlined: 'bg-transparent border-2 border-gray-300'
  };
  
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  return <div className={classes} onClick={onClick}>{children}</div>;
};

// Button Component
interface ButtonProps {
  variant?: 'primary' | 'filled' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  onClick,
  children,
  disabled = false,
  loading = false
}) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    filled: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-8 text-lg'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button 
      type={type} 
      className={classes} 
      onClick={onClick} 
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {typeof children === 'string' ? 'Loading...' : children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Enhanced Input Component
export const EnhancedInput = forwardRef<
  HTMLInputElement,
  {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    variant?: 'default' | 'filled' | 'outlined';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(({ 
  label, 
  error, 
  hint, 
  leftIcon, 
  rightIcon, 
  variant = 'default' as const,
  size = 'md' as const,
  className = '',
  ...props 
}, ref) => {
  const variantClasses = {
    default: 'border border-gray-300 bg-white focus:border-blue-500',
    filled: 'border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500',
    outlined: 'border-2 border-gray-300 bg-transparent focus:border-blue-500',
  };
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-3 text-base min-h-[48px]',
    lg: 'px-5 py-4 text-lg min-h-[56px]',
  };

  return (
    <div className="space-y-2">
      {label && (
        <Typography variant="label" size="sm" className="block">
          {label}
        </Typography>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'font-tajawal w-full rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-0',
            variantClasses[variant],
            sizeClasses[size as keyof typeof sizeClasses],
            leftIcon ? 'pr-10' : '',
            rightIcon ? 'pl-10' : '',
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : '',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <Typography variant="caption" size="sm" className="text-red-600">
          {error}
        </Typography>
      )}
      {hint && !error && (
        <Typography variant="caption" size="sm" className="text-gray-500">
          {hint}
        </Typography>
      )}
    </div>
  );
});

EnhancedInput.displayName = 'EnhancedInput';

// Enhanced Select Component
export const EnhancedSelect = forwardRef<
  HTMLSelectElement,
  {
    label?: string;
    error?: string;
    hint?: string;
    placeholder?: string;
    options: Array<{ value: string; label: string; disabled?: boolean }>;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    dir?: 'rtl' | 'ltr';
    'aria-label'?: string;
  } & React.SelectHTMLAttributes<HTMLSelectElement>
>(({ 
  label, 
  error, 
  hint, 
  placeholder,
  options,
  size = 'md',
  className = '',
  dir = 'rtl',
  'aria-label': ariaLabel,
  ...props 
}, ref) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  return (
    <div className="space-y-2" dir={dir}>
      {label && (
        <Typography variant="label" size="sm" className="block">
          {label}
        </Typography>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'font-tajawal w-full rounded-lg border border-gray-300 bg-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'transition-all duration-200 appearance-none',
            sizeClasses[size as keyof typeof sizeClasses],
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          aria-label={ariaLabel || label}
          {...props}
        >
          {placeholder && (
            <option value="" disabled hidden>{placeholder}</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
      {error && (
        <Typography variant="caption" size="sm" className="text-red-600">
          {error}
        </Typography>
      )}
      {hint && !error && (
        <Typography variant="caption" size="sm" className="text-gray-500">
          {hint}
        </Typography>
      )}
    </div>
  );
});

EnhancedSelect.displayName = 'EnhancedSelect';


