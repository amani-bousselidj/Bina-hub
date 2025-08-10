'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Truck, Building2 } from 'lucide-react';

export default function WasteDisposalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">مخلفات البناء</h1>
            <p className="text-gray-600">إدارة وتصريف مخلفات البناء</p>
          </div>
        </div>

        <Card className="border-l-4 border-l-red-500 bg-red-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-200 rounded-lg">
                  <Truck className="w-8 h-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-800 mb-2">إدارة مخلفات البناء</h3>
                  <p className="text-red-600">تنظيم وتصريف مخلفات البناء بطريقة آمنة وصديقة للبيئة</p>
                </div>
              </div>
              <Button onClick={() => router.push('/user/projects/create')} className="bg-red-600 hover:bg-red-700">
                ابدأ مشروع بناء متكامل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




