// @ts-nocheck
'use client';
import React, { forwardRef } from 'react';
import { cn, formatCurrency } from '@/core/shared/utils';
import { ChevronDown, Search, Filter, SortAsc, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

// Enhanced Typography Components
export function Typography({
  variant = 'body',
  size = 'md',
  weight = 'normal',
  children,
  className = '',
  ...props
}: {
  variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  const variantClasses: Record<string, string> = {
    heading: 'text-gray-900 leading-tight',
    subheading: 'text-gray-700 leading-relaxed',
    body: 'text-gray-800 leading-relaxed',
    caption: 'text-gray-600 leading-normal',
    label: 'text-gray-700 font-medium leading-normal',
  };
  const sizeClasses: Record<string, string> = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
  };
  const weightClasses: Record<string, string> = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };
  const Component = variant === 'heading' ? 'h2' : variant === 'subheading' ? 'h3' : 'p';
  return (
    <Component
      className={cn(
        'font-tajawal',
        variantClasses[variant],
        sizeClasses[size],
        weightClasses[weight],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Enhanced Card Component
export function EnhancedCard({
  variant = 'default',
  padding = 'md',
  hover = true,
  children,
  className = '',
  ...props
}: {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const variantClasses: Record<string, string> = {
    default: 'bg-white shadow-sm border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-white border-2 border-gray-200 shadow-none',
    glass: 'glass-effect shadow-md',
  };

  const paddingClasses: Record<string, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div
      className={cn(
        'rounded-xl transition-all duration-200',
        variantClasses[variant],
        paddingClasses[padding],
        hover && 'hover:shadow-md hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Responsive Button
export const Button = forwardRef(
  ({ className = '', size = 'md', variant = 'default', loading = false, disabled = false, ...props }: any, ref) => {
    const sizeClasses: Record<string, string> = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm sm:text-base',
      lg: 'px-5 py-2.5 text-base sm:text-lg',
      xl: 'px-6 py-3 text-lg sm:text-xl',
    };
    
    const variantClasses: Record<string, string> = {
      default: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600 shadow-sm',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 border border-gray-600',
      outline: 'bg-transparent text-blue-600 hover:bg-blue-50 border border-blue-600',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border-transparent',
      danger: 'bg-red-600 text-white hover:bg-red-700 border border-red-600',
    };
    
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'relative inline-flex items-center justify-center',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <span className={loading ? 'opacity-0' : 'opacity-100'}>
          {props.children}
        </span>
      </button>
    );
  }
);
Button.displayName = 'Button';

// Responsive Input
export const Input = forwardRef(
  ({ className = '', size = 'md', ...props }: any, ref) => {
    const sizeClasses: Record<string, string> = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm sm:text-base',
      lg: 'px-5 py-2.5 text-base sm:text-lg',
      xl: 'px-6 py-3 text-lg sm:text-xl',
    };
    return (
      <input
        ref={ref}
        className={cn(
          'border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

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
            leftIcon && 'pr-10',
            rightIcon && 'pl-10',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
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

// Enhanced Badge Component
export function EnhancedBadge({
  variant = 'default',
  size = 'md',
  children,
  className = '',
  ...props
}: {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-50 text-gray-600',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={cn(
        'font-tajawal font-medium rounded-full inline-flex items-center',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Enhanced Modal Component
export function EnhancedModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        <div
          className={cn(
            'relative w-full bg-white rounded-xl shadow-xl',
            sizeClasses[size],
            className
          )}
        >
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Typography variant="heading" size="lg" weight="semibold">
                {title}
              </Typography>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Table Component
export function EnhancedTable({
  columns,
  data,
  loading = false,
  emptyMessage = 'لا توجد بيانات',
  className = '',
}: {
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;
    width?: string;
  }>;
  data: Array<Record<string, any>>;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        <Typography variant="body" size="sm" className="mr-3 text-gray-600">
          جاري التحميل...
        </Typography>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <Typography variant="body" size="md" className="text-gray-500">
          {emptyMessage}
        </Typography>
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  'px-6 py-4 text-right font-tajawal font-semibold text-gray-700',
                  column.width && `w-${column.width}`
                )}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <SortAsc className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 font-tajawal">
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Enhanced Action Menu Component
export function EnhancedActionMenu({
  items,
  trigger,
  className = '',
}: {
  items: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
    disabled?: boolean;
  }>;
  trigger?: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {trigger || (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {items.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'w-full text-right px-4 py-2 text-sm font-tajawal transition-colors',
                    'flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed',
                    item.variant === 'danger'
                      ? 'text-red-700 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Enhanced Stats Grid Component
export function EnhancedStatsGrid({
  stats,
  columns = 4,
  className = '',
}: {
  stats: Array<{
    title: string;
    value: string | number;
    change?: number;
    icon?: React.ReactNode;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
    href?: string;
  }>;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
    purple: 'text-purple-600 bg-purple-50',
    gray: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className={cn('grid gap-6', gridClasses[columns], className)}>
      {stats.map((stat, index) => {
        const content = (
          <EnhancedCard
            variant="default"
            hover={!!stat.href}
            className="h-full"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Typography variant="caption" size="sm" className="text-gray-600 mb-1">
                  {stat.title}
                </Typography>
                <Typography variant="heading" size="2xl" weight="bold" className="mb-2">
                  {typeof stat.value === 'number' ? formatCurrency(stat.value) : stat.value}
                </Typography>
                {stat.change !== undefined && (
                  <div className={cn(
                    'flex items-center gap-1 text-sm',
                    stat.change > 0 ? 'text-green-600' : stat.change < 0 ? 'text-red-600' : 'text-gray-600'
                  )}>
                    {stat.change > 0 ? '↗' : stat.change < 0 ? '↘' : '→'}
                    {Math.abs(stat.change)}%
                  </div>
                )}
              </div>
              {stat.icon && (
                <div className={cn(
                  'p-3 rounded-lg',
                  colorClasses[stat.color || 'blue']
                )}>
                  {stat.icon}
                </div>
              )}
            </div>
          </EnhancedCard>
        );

        return stat.href ? (
          <a key={index} href={stat.href} className="block">
            {content}
          </a>
        ) : (
          <div key={index}>{content}</div>
        );
      })}
    </div>
  );
}

export default {
  Typography,
  EnhancedCard,
  Button,
  Input,
  EnhancedInput,
  EnhancedSelect,
  EnhancedBadge,
  EnhancedModal,
  EnhancedTable,
  EnhancedActionMenu,
  EnhancedStatsGrid,
};




