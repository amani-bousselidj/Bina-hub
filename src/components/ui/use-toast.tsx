"use client";

// Simple toast implementation for now
import { useState } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

export function toast({ title, description, variant = 'default' }: Omit<Toast, 'id'>) {
  console.log('Toast:', { title, description, variant });
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
    return id;
  };

  const dismiss = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return { toast: showToast, dismiss, toasts };
}


