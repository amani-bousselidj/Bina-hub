'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Shield, 
  Building2,
  CheckCircle,
  DollarSign,
  Clock,
  Phone
} from 'lucide-react';

export default function InsurancePage() {
  const router = useRouter();

  const insuranceCompanies = [
    {
      name: 'الشركة السعودية للتأمين',
      type: 'تأمين شامل',
      coverage: '2,000,000',
      premium: '15,000',
      rating: 4.8,
      features: ['تغطية شاملة', 'خدمة 24/7', 'تسوية سريعة']
    },
    {
      name: 'تأمين الراجحي',
      type: 'تأمين البناء',
      coverage: '1,500,000',
      premium: '12,500',
      rating: 4.6,
      features: ['تغطية البناء', 'حماية العمالة', 'تأمين المعدات']
    },
    {
      name: 'شركة اتحاد الخليج للتأمين',
      type: 'تأمين المقاولين',
      coverage: '3,000,000',
      premium: '18,000',
      rating: 4.9,
      features: ['تأمين المسؤولية', 'حماية شاملة', 'تغطية دولية']
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
            <h1 className="text-3xl font-bold text-gray-800">إصدار التأمين</h1>
            <p className="text-gray-600">احمِ مشروعك بأفضل برامج التأمين</p>
          </div>
        </div>

        {/* Integration Notice */}
        <Card className="border-l-4 border-l-purple-500 bg-purple-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-200 rounded-lg">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">
                    تكامل مع شركات التأمين الرائدة
                  </h3>
                  <p className="text-purple-600">
                    احصل على عروض أسعار فورية من شركات التأمين الرائدة في المملكة
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/user/projects/create')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                ابدأ مشروع بناء متكامل
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {insuranceCompanies.map((company, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {company.type}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">التغطية:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          {company.coverage} ريال
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">القسط السنوي:</span>
                      <div className="flex items-center gap-1 mt-1">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">
                          {company.premium} ريال
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700 mb-2 block">المميزات:</span>
                    <div className="flex flex-wrap gap-1">
                      {company.features.map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                      <Phone className="w-4 h-4 mr-2" />
                      تواصل
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                      اختيار
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insurance Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-600" />
              أهمية التأمين في مشاريع البناء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">حماية من المخاطر</h4>
                <p className="text-sm text-gray-600">
                  حماية شاملة ضد جميع مخاطر البناء والكوارث الطبيعية
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">راحة البال</h4>
                <p className="text-sm text-gray-600">
                  استمتع ببناء مشروعك بدون قلق مع التغطية التأمينية الشاملة
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">حماية مالية</h4>
                <p className="text-sm text-gray-600">
                  احمِ استثمارك من الخسائر المالية المحتملة
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center gap-2"
                onClick={() => router.push('/user/projects/create')}
              >
                <Building2 className="w-6 h-6" />
                <span>ابدأ مشروع بناء متكامل</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col items-center justify-center gap-2"
               onClick={() => alert('Button clicked')}>
                <Phone className="w-6 h-6" />
                <span>استشارة مجانية</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




