// @ts-nocheck
'use client';

import React from 'react';
import { cn } from '@/core/shared/utils';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface TabProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  active?: boolean;
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
}>({ value: '', onValueChange: () => {} });

export function Tabs({ defaultValue = '', value, onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn('', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-gray-100 p-1',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, active }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  const isActive = active !== undefined ? active : context.value === value;

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-white text-gray-950 shadow-sm'
          : 'text-gray-500 hover:text-gray-900',
        className
      )}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;

  if (!isActive) return null;

  return (
    <div
      className={cn(
        'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
}

export function Tab({ value, className, children }: TabProps) {
  return (
    <div className={cn('', className)} data-value={value}>
      {children}
    </div>
  );
}




