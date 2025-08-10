'use client';

import { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/core/shared/auth/AuthProvider'; // Use the enhanced AuthProvider
import OnboardingTour from '@/components/ui/OnboardingTour';

interface LayoutProviderProps {
  children: React.ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  const [showTour, setShowTour] = useState(false);
  const pathname = usePathname();

  // Pages that should not show the navbar or onboarding
  const noNavbarPages = ['/login', '/auth/login', '/auth/signup', '/reset-password-confirm', '/clear-auth'];
  // Hide Navbar for all authenticated areas - they use their own layout
  const isStoreAdminPage = pathname ? pathname.startsWith('/store') : false;
  const isUserPage = pathname ? pathname.startsWith('/user') : false;
  const isAdminPage = pathname ? pathname.startsWith('/admin') : false;
  const isAuthenticatedPage = isStoreAdminPage || isUserPage || isAdminPage;

  const handleTourComplete = useCallback(() => {
    setShowTour(false);
    localStorage.setItem('hasSeenOnboardingTour', 'true');
  }, []);

  useEffect(() => {
    // Only show onboarding tour if not seen before and not on excluded pages
    if (
      pathname &&
      !noNavbarPages.includes(pathname) &&
      !isAuthenticatedPage &&
      typeof window !== 'undefined' &&
      localStorage.getItem('hasSeenOnboardingTour') !== 'true'
    ) {
      setShowTour(true);
    }
  }, [pathname, isAuthenticatedPage]);

  // For auth pages and authenticated areas, provide minimal layout with providers but no navbar
  if ((pathname && noNavbarPages.includes(pathname)) || isAuthenticatedPage) {
    return (
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        {children}
        {showTour && (
          <OnboardingTour
            onFinish={handleTourComplete}
          />
        )}
      </CartProvider>
    </AuthProvider>
  );
}




