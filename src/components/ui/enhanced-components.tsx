// Temporary enhanced components - needs to be replaced with proper implementation
import React from 'react';

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'body' | 'caption' | 'heading' | 'subheading' | 'label';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export function Typography({ children, variant = 'p', size, weight, className = '' }: TypographyProps) {
  // Map complex variants to actual HTML elements
  const getHtmlElement = (variant: string) => {
    switch (variant) {
      case 'heading': return 'h2';
      case 'subheading': return 'h3';
      case 'body': return 'p';
      case 'caption': return 'span';
      default: return variant;
    }
  };

  const Component = getHtmlElement(variant) as keyof JSX.IntrinsicElements;
  
  const baseClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-semibold',
    h4: 'text-xl font-semibold',
    h5: 'text-lg font-medium',
    h6: 'text-base font-medium',
    p: 'text-base',
    span: 'text-base',
    body: 'text-base',
    caption: 'text-sm text-gray-600',
    heading: 'text-3xl font-semibold',
    subheading: 'text-xl font-medium',
  };

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const computedClasses = [
    baseClasses[variant as keyof typeof baseClasses] || baseClasses.p,
    size && sizeClasses[size],
    weight && weightClasses[weight],
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={computedClasses}>
      {children}
    </Component>
  );
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'filled' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Enhanced input props
export interface EnhancedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  loading?: boolean;
  error?: string;
  className?: string;
}

// Enhanced select props  
export interface EnhancedSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  loading?: boolean;
  error?: string;
  className?: string;
}

// Progress bar
export interface ProgressProps {
  value: number;
  max?: number; 
  className?: string;
}

// Product search props
export interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  availableStores?: { id: string; name: string }[];
  className?: string; 
}

// Category filter props
export interface CategoryFilterProps {
  categories: { id: string; name: string; count: number }[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

// Product grid props
export interface ProductGridProps {
  products: any[];
  loading?: boolean;
  onAddToProject?: (productId: string) => void;
  onViewStore?: (storeId: string) => void;
  onViewProduct?: (productId: string) => void;
  showAddToProject?: boolean;
  emptyMessage?: string;
  className?: string;
}

// Enhanced card props 
export interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  hover?: boolean;
}

export function EnhancedCard({ children, className = '', title, description, variant = 'default', hover = false }: EnhancedCardProps) {
  const variantClasses = {
    default: 'bg-white rounded-lg shadow-md border',
    elevated: 'bg-white rounded-lg shadow-lg border',
    outlined: 'bg-white rounded-lg border-2',
    filled: 'bg-gray-50 rounded-lg border',
  };

  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';
  
  return (
    <div className={`${variantClasses[variant]} p-6 ${hoverClasses} ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {description && <p className="text-gray-600 mb-4">{description}</p>}
      {children}
    </div>
  );
}

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'filled' | 'ghost';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
}

export function Button({ children, onClick, className = '', variant = 'primary', disabled = false, size = 'md', type = 'button' }: ButtonProps) {
  const baseClasses = 'rounded-md font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'bg-transparent border hover:bg-gray-50',
    filled: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="flex justify-center mb-4 text-gray-400">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      )}
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]} ${className}`} />
  );
}

// Simple toast implementation
export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

export function toast({ title, description, variant = 'default' }: ToastOptions) {
  // Simple browser alert for now - can be replaced with proper toast library
  const message = description ? `${title}: ${description}` : title;
  
  if (variant === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
  
  // For development, use alert
  if (typeof window !== 'undefined') {
    alert(message);
  }
}

export function Progress({ value = 0, max = 100, className = '' }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

// Textarea component
export interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  disabled?: boolean;
}

export function Textarea({ 
  placeholder, 
  value, 
  onChange, 
  className = '', 
  rows = 3,
  disabled = false 
}: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${className}`}
      rows={rows}
      disabled={disabled}
    />
  );
}


