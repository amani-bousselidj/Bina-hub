// Temporary Select component - needs to be replaced with proper implementation
import React from 'react';

export interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({ children, value, onChange, className = '', disabled, defaultValue, ...props }: SelectProps) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      disabled={disabled}
      defaultValue={defaultValue}
      {...props}
    >
      {children}
    </select>
  );
}

export interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  return (
    <button className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}>
      {children}
    </button>
  );
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder, className = '' }: SelectValueProps) {
  return <span className={`block truncate ${className}`}>{placeholder}</span>;
}

export interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectContent({ children, className = '' }: SelectContentProps) {
  return (
    <div className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-gray-950 shadow-md ${className}`}>
      {children}
    </div>
  );
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function SelectItem({ children, className = '' }: SelectItemProps) {
  return (
    <div className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 ${className}`}>
      {children}
    </div>
  );
}


