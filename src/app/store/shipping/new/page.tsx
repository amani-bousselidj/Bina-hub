'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function NewShippingPage() {
  const router = useRouter();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">إضافة شحنة جديدة</h1>
      <p>هذه الصفحة لإدخال تفاصيل شحنة جديدة.</p>
      <Button variant="outline" onClick={() => router.back()} className="mt-4">
        العودة
      </Button>
    </div>
  );
}
