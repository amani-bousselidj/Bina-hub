'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('❌ Unhandled Promise Rejection:', event.reason);
      
      // Prevent the default browser behavior (console error)
      event.preventDefault();
      
      // Show a user-friendly error message
      const errorMessage = event.reason?.message || 'حدث خطأ غير متوقع';
      
      // Only show toast for user-facing errors, not network/auth errors
      if (!shouldIgnoreError(event.reason)) {
        toast.error(`خطأ: ${errorMessage}`, {
          duration: 4000,
          id: 'unhandled-rejection' // Prevent duplicate toasts
        });
      }
    };

    // Handle general JavaScript errors
    const handleError = (event: ErrorEvent) => {
      console.error('❌ Global Error:', event.error);
      
      // Only show toast for critical errors
      if (event.error && !shouldIgnoreError(event.error)) {
        toast.error('حدث خطأ في التطبيق', {
          duration: 4000,
          id: 'global-error'
        });
      }
    };

    // Function to determine if we should ignore certain errors
    const shouldIgnoreError = (error: any): boolean => {
      if (!error) return true;
      
      const errorString = error.toString().toLowerCase();
      const errorMessage = error.message?.toLowerCase() || '';
      
      // Ignore common non-critical errors
      const ignoredErrors = [
        'network error',
        'fetch failed',
        'load failed',
        'aborted',
        'cancelled',
        'timeout',
        'auth',
        'session',
        'non-error promise rejection',
        'script error',
        'loading chunk failed',
        'chrome-extension'
      ];
      
      return ignoredErrors.some(ignored => 
        errorString.includes(ignored) || errorMessage.includes(ignored)
      );
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null; // This component doesn't render anything
}


