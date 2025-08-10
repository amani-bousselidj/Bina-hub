// @ts-nocheck
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Show loading state
      toast.loading('جاري تسجيل الخروج...', { id: 'logout' });

      // Clear Supabase session
      await supabase.auth.signOut();

      // Clear all auth-related cookies
      const authCookies = [
        'auth_session_active',
        'user_email',
        'account_type',
        'user_name',
        'sync_login_timestamp',
        'remember_user',
        'last_auth_sync',
      ];

      authCookies.forEach((cookie) => {
        document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname}`;
        document.cookie = `${cookie}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      });

      // Call backend to clear Supabase session and cookies
      await fetch('/api/auth/sync-login', { method: 'DELETE' });

      toast.success('تم تسجيل الخروج بنجاح', { id: 'logout' });

      // Set logout timestamp cookie for middleware (5s grace)
      document.cookie = `logout_timestamp=${new Date().toISOString()}; path=/; max-age=10`;

      // Wait a moment then redirect to login page
      await new Promise((resolve) => setTimeout(resolve, 500));
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ [Logout] Error:', error);
      toast.error('حدث خطأ أثناء تسجيل الخروج', { id: 'logout' });
      // Force redirect to home on error
      window.location.href = '/';
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-semibold"
    >
      تسجيل الخروج
    </button>
  );
}




