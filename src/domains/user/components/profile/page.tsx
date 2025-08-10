'use client';
import { useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic'

export default function UserProfile() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to settings page where profile management is now consolidated
    router.replace('/user/settings');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg text-gray-600">جاري التحويل إلى الإعدادات...</div>
      </div>
    </div>
  );
}
