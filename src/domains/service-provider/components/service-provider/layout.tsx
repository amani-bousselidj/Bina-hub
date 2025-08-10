'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { AuthProvider } from '@/core/shared/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { LogOut, Wrench } from 'lucide-react';

interface ServiceProviderLayoutProps {
  children: React.ReactNode;
}

export default function ServiceProviderLayout({ children }: ServiceProviderLayoutProps) {
  const router = useRouter();
  const [logoutLoading, setLogoutLoading] = useState(false);
  
  // Safe auth hook usage
  let user: any = null;
  let signOut: (() => Promise<void>) | null = null;
  try {
    const authResult = useAuth();
    user = authResult.user;
    signOut = authResult.signOut;
  } catch (error) {
    user = null;
    signOut = null;
  }

  // Logout handler
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      console.log('🚪 [Service Provider Layout] Starting logout process...');
      
      // Call our logout API
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        console.log('✅ [Service Provider Layout] Logout API successful');
      } else {
        console.warn('⚠️ [Service Provider Layout] Logout API failed, continuing with client-side cleanup');
      }
      
      // Clear client-side auth state if signOut function available
      if (signOut) {
        await signOut();
      }
      
      // Redirect to login
      router.push('/auth/login');
      console.log('✅ [Service Provider Layout] Logout complete, redirecting to login');
    } catch (error) {
      console.error('❌ [Service Provider Layout] Logout error:', error);
      // Even if API fails, clear client state and redirect
      if (signOut) {
        await signOut();
      }
      router.push('/auth/login');
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Wrench className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    لوحة مقدم الخدمة
                  </h1>
                  <p className="text-sm text-gray-500">
                    منصة إدارة الخدمات
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  مرحباً، {user?.name || 'مقدم الخدمة'}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  {logoutLoading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}



