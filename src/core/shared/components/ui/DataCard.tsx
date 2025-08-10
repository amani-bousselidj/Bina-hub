import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    default: 'border-gray-200',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    danger: 'border-red-200 bg-red-50',
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow', variantClasses[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {trend && (
            <div className={cn('text-sm font-medium', trendClasses[trend.direction])}>
              {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
};

export default DataCard;


