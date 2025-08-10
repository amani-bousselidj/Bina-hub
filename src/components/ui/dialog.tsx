// Temporary Dialog component - needs to be replaced with proper implementation
import React, { useState } from 'react';

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ children, open, onOpenChange }: DialogProps) {
  return <div className="dialog-container">{children}</div>;
}

export interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  return <div className="dialog-trigger">{children}</div>;
}

export interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  dir?: 'ltr' | 'rtl';
}

export function DialogContent({ children, className = '', dir }: DialogContentProps) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" dir={dir}>
        {children}
      </div>
    </div>
  );
}

export interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogHeader({ children, className = '' }: DialogHeaderProps) {
  return <div className={`space-y-1.5 text-center sm:text-left ${className}`}>{children}</div>;
}

export interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogTitle({ children, className = '' }: DialogTitleProps) {
  return <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h2>;
}

export interface DialogDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogDescription({ children, className = '' }: DialogDescriptionProps) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
}

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogFooter({ children, className = '' }: DialogFooterProps) {
  return <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>{children}</div>;
}


