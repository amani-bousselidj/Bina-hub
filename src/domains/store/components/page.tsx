'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StorePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to store dashboard
    router.replace('/store/dashboard');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-xl font-semibold text-gray-800 mb-2">متجرك</h1>
        <p className="text-gray-600">جاري التحويل إلى لوحة تحكم المتجر...</p>
      </div>
    </div>
  );
}



