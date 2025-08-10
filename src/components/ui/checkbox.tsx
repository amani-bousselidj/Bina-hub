// Temporary Checkbox component - needs to be replaced with proper implementation
import React from 'react';

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function Checkbox({ checked = false, onCheckedChange, disabled = false, className = '', id }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      disabled={disabled}
      className={`
        h-4 w-4 rounded border border-gray-300 text-blue-600 
        focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
    />
  );
}


