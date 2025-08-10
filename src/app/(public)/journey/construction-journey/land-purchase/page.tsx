'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Building2,
  CheckCircle,
  Clock,
  Users,
  DollarSign
} from 'lucide-react';

export default function LandPurchasePage() {
  const router = useRouter();

  const landPurchaseSteps = [
    {
      title: 'البحث عن الأراضي',
      description: 'استكشف الأراضي المتاحة في المواقع المرغوبة',
      icon: MapPin,
      status: 'pending'
    },
    {
      title: 'تقييم الأرض',
      description: 'فحص الموقع والخدمات والمرافق المتاحة',
      icon: CheckCircle,
      status: 'pending'
    },
    {
      title: 'التفاوض على السعر',
      description: 'التفاوض مع المالك للحصول على أفضل سعر',
      icon: DollarSign,
      status: 'pending'
    },
    {
      title: 'إجراءات الشراء',
      description: 'إتمام المعاملات القانونية ونقل الملكية',
      icon: Users,
      status: 'pending'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">شراء الأرض</h1>
            <p className="text-gray-600">الخطوة الأولى في رحلة البناء</p>
          </div>
        </div>

        {/* Integration Notice */}
        <Card className="border-l-4 border-l-blue-500 bg-blue-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-200 rounded-lg">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">
                    تكامل مع منصة عقار السعودية
                  </h3>
                  <p className="text-blue-600">
                    يمكنك الآن البحث عن الأراضي وإنشاء مشروع بناء متكامل مع التكامل الكامل مع المنصات الخارجية
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/user/projects/create')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                ابدأ مشروع بناء متكامل
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Construction Journey Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {landPurchaseSteps.map((step, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <step.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">قيد الانتظار</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              مميزات مرحلة شراء الأرض
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">بحث متقدم</h4>
                <p className="text-sm text-gray-600">
                  ابحث عن الأراضي حسب الموقع والمساحة والسعر مع التكامل مع منصة عقار
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">تقييم شامل</h4>
                <p className="text-sm text-gray-600">
                  تقييم الأرض من ناحية الموقع والخدمات والمرافق المتاحة
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">دعم قانوني</h4>
                <p className="text-sm text-gray-600">
                  المساعدة في الإجراءات القانونية ونقل الملكية
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




