// @ts-nocheck
import React from 'react';

export interface StatusBadgeProps {
  status: 'active' | 'pending' | 'completed' | 'cancelled' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'returned' | string;
  className?: string;
  children?: React.ReactNode;
  label?: string;
  color?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', children, label, color }) => {
  const getStatusColor = () => {
    // Use provided color if specified
    if (color) {
      return `bg-${color}-100 text-${color}-800`;
    }

    switch (status) {
      case 'active':
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
      case 'returned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()} ${className}`}>
      {children || label || status}
    </span>
  );
};




