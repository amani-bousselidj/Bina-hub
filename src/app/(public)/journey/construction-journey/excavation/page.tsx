'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Hammer, Building2 } from 'lucide-react';

export default function ExcavationPage() {
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
            <h1 className="text-3xl font-bold text-gray-800">الحفر وتجهيز الأرض</h1>
            <p className="text-gray-600">تجهيز الموقع للبناء</p>
          </div>
        </div>

        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-200 rounded-lg">
                  <Hammer className="w-8 h-8 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-yellow-800 mb-2">الحفر وتجهيز الأرض</h3>
                  <p className="text-yellow-600">أعمال الحفر والتسوية وتجهيز الأساسات</p>
                </div>
              </div>
              <Button onClick={() => router.push('/user/projects/create')} className="bg-yellow-600 hover:bg-yellow-700">
                ابدأ مشروع بناء متكامل
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




