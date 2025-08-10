// @ts-nocheck
import React from 'react';
import { Card } from './card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  color?: string;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon,
  className = '',
  color,
  subtitle
}) => {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-primary opacity-80">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};




