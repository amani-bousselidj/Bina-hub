import React from 'react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children?: React.ReactNode;
  options?: { value: string; label: string; }[];
  onValueChange?: (value: string) => void;
}

export function Select({ children, className = '', options, onValueChange, ...props }: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
    // Also call the original onChange if provided
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <select
      className={`border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
      onChange={handleChange}
    >
      {options ? (
        options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))
      ) : (
        children
      )}
    </select>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
}

export function SelectContent({ children }: SelectContentProps) {
  return <>{children}</>;
}

interface SelectItemProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

export function SelectItem({ children, ...props }: SelectItemProps) {
  return <option {...props}>{children}</option>;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className = '' }: SelectTriggerProps) {
  return <div className={className}>{children}</div>;
}

interface SelectValueProps {
  placeholder?: string;
}

export function SelectValue({ placeholder }: SelectValueProps) {
  return <span>{placeholder}</span>;
}




