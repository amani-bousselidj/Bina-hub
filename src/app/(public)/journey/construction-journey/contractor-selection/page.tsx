'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Users, 
  Building2,
  FileText,
  Star,
  Phone,
  DollarSign
} from 'lucide-react';

export default function ContractorSelectionPage() {
  const router = useRouter();

  const contractors = [
    {
      name: 'شركة البناء المتقدم',
      rating: 4.8,
      projects: 150,
      speciality: 'المباني السكنية',
      phone: '+966501234567'
    },
    {
      name: 'مؤسسة التشييد الحديث',
      rating: 4.6,
      projects: 98,
      speciality: 'الفلل والقصور',
      phone: '+966507654321'
    },
    {
      name: 'شركة الإنشاءات الذكية',
      rating: 4.9,
      projects: 203,
      speciality: 'المباني التجارية',
      phone: '+966502468135'
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
            <h1 className="text-3xl font-bold text-gray-800">اختيار المقاول</h1>
            <p className="text-gray-600">اختر أفضل المقاولين والمخططات المعمارية</p>
          </div>
        </div>

        {/* Integration Notice */}
        <Card className="border-l-4 border-l-green-500 bg-green-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-200 rounded-lg">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    تكامل مع ACKD للمخططات المعمارية
                  </h3>
                  <p className="text-green-600">
                    ابحث عن المخططات المعمارية واختر المقاولين المناسبين مع التكامل الكامل
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/user/projects/create')}
                className="bg-green-600 hover:bg-green-700"
              >
                ابدأ مشروع بناء متكامل
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contractors List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {contractors.map((contractor, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{contractor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{contractor.rating}</span>
                      <span className="text-sm text-gray-500">({contractor.projects} مشروع)</span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-700">التخصص:</span>
                    <span className="text-sm text-gray-600 mr-2">{contractor.speciality}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600" dir="ltr">{contractor.phone}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                      عرض التفاصيل
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                      تواصل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              خطوات اختيار المقاول
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">اختيار المخطط</h4>
                <p className="text-sm text-gray-600">
                  ابحث واختر المخطط المعماري المناسب من ACKD
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">مقارنة المقاولين</h4>
                <p className="text-sm text-gray-600">
                  قارن بين المقاولين من ناحية الخبرة والأسعار
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">طلب عروض أسعار</h4>
                <p className="text-sm text-gray-600">
                  احصل على عروض أسعار مفصلة من المقاولين
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">توقيع العقد</h4>
                <p className="text-sm text-gray-600">
                  وقع العقد مع المقاول المختار وابدأ العمل
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




