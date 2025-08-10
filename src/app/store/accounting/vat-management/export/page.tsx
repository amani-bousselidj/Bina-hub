'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function VATExportPage() {
  const router = useRouter();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">تصدير بيانات ضريبة القيمة المضافة</h1>
      <p>هذا الجزء مخصص لتصدير إقرارات ضريبة القيمة المضافة.</p>
      <Button variant="outline" onClick={() => router.back()} className="mt-4">
        العودة
      </Button>
    </div>
  );
}
