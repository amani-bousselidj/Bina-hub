"use client";

/**
 * Hydration-safe utilities for formatting dates, numbers, and locale-specific content
 * This prevents SSR/client mismatches by ensuring consistent formatting
 */

import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

// Hook to detect if we're on the client side
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

// Format dates in a hydration-safe way - always use Gregorian calendar with English format
export const formatDateSafe = (dateString: string | Date, options?: {
  includeTime?: boolean;
  format?: 'short' | 'long' | 'medium';
}) => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  const { includeTime = false, format = 'medium' } = options || {};

  // Always use English locale and Gregorian calendar for consistency
  const formatOptions: Intl.DateTimeFormatOptions = {
    calendar: 'gregory', // Force Gregorian calendar
    numberingSystem: 'latn', // Force Latin numerals
  };

  switch (format) {
    case 'short':
      formatOptions.year = 'numeric';
      formatOptions.month = '2-digit';
      formatOptions.day = '2-digit';
      break;
    case 'long':
      formatOptions.year = 'numeric';
      formatOptions.month = 'long';
      formatOptions.day = 'numeric';
      formatOptions.weekday = 'long';
      break;
    case 'medium':
    default:
      formatOptions.year = 'numeric';
      formatOptions.month = 'short';
      formatOptions.day = 'numeric';
      break;
  }

  if (includeTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
    formatOptions.hour12 = false; // Use 24-hour format for consistency
  }

  // Use English locale for consistent formatting across server and client
  return date.toLocaleDateString('en-GB', formatOptions);
};

// Format numbers in a hydration-safe way - always use English numerals
export const formatNumberSafe = (number: number, options?: {
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}) => {
  const { 
    style = 'decimal', 
    currency = 'SAR', 
    minimumFractionDigits = 0,
    maximumFractionDigits = 2 
  } = options || {};

  const formatOptions: Intl.NumberFormatOptions = {
    numberingSystem: 'latn', // Force Latin numerals
    style,
    minimumFractionDigits,
    maximumFractionDigits,
  };

  if (style === 'currency') {
    formatOptions.currency = currency;
  }

  // Use English locale for consistent number formatting
  return new Intl.NumberFormat('en-US', formatOptions).format(number);
};

// Format currency specifically for Saudi Riyal with English numerals
export const formatCurrencySafe = (amount: number) => {
  return `${formatNumberSafe(amount, { 
    style: 'decimal', 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })} SAR`;
};

// Format phone numbers in a consistent way
export const formatPhoneSafe = (phone: string) => {
  // Remove any Arabic numerals and normalize
  const cleaned = phone.replace(/[0-9]/g, (match) => {
    const arabicToEnglish: { [key: string]: string } = {
      '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
      '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
    };
    return arabicToEnglish[match] || match;
  }).replace(/\D/g, '');

  // Format Saudi phone numbers
  if (cleaned.startsWith('966')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  } else if (cleaned.startsWith('05') && cleaned.length === 10) {
    return `+966 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  
  return phone; // Return original if no pattern matches
};

// Convert Arabic numerals to English numerals
export const arabicToEnglishNumerals = (text: string) => {
  const arabicToEnglish: { [key: string]: string } = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9'
  };
  
  return text.replace(/[0-9]/g, (match) => arabicToEnglish[match] || match);
};

// Hydration-safe component wrapper (use this pattern in your components)
export const useHydrationSafe = (fallback?: any) => {
  const isClient = useIsClient();
  return { isClient, fallback };
};

// Format time ago in a consistent way
export const formatTimeAgoSafe = (date: string | Date) => {
  const now = new Date();
  const past = typeof date === 'string' ? new Date(date) : date;
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;
  
  // For longer periods, use formatted date
  return formatDateSafe(past, { format: 'short' });
};

// Generate consistent IDs that work on both server and client
let idCounter = 0;
export const generateSafeId = (prefix: string = 'id') => {
  return `${prefix}-${++idCounter}`;
};

// Safe localStorage access
export const getLocalStorageSafe = (key: string, defaultValue: any = null) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setLocalStorageSafe = (key: string, value: any) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail if localStorage is not available
  }
};


