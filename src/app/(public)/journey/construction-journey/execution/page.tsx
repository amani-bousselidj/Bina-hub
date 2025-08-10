'use client';

export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Building2,
  CheckCircle,
  Clock,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function ExecutionPage() {
  const router = useRouter();

  const executionPhases = [
    {
      phase: 'الأساسات',
      duration: '2-4 أسابيع',
      status: 'completed',
      progress: 100
    },
    {
      phase: 'الهيكل الإنشائي',
      duration: '6-8 أسابيع',
      status: 'in-progress',
      progress: 65
    },
    {
      phase: 'الأعمال الكهربائية',
      duration: '3-4 أسابيع',
      status: 'pending',
      progress: 0
    },
    {
      phase: 'أعمال السباكة',
      duration: '2-3 أسابيع',
      status: 'pending',
      progress: 0
    },
    {
      phase: 'التشطيبات',
      duration: '4-6 أسابيع',
      status: 'pending',
      progress: 0
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
            <h1 className="text-3xl font-bold text-gray-800">التنفيذ والمتابعة</h1>
            <p className="text-gray-600">متابعة تقدم العمل وإدارة المشروع</p>
          </div>
        </div>

        {/* Integration Notice */}
        <Card className="border-l-4 border-l-green-500 bg-green-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-200 rounded-lg">
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    نظام متابعة متقدم
                  </h3>
                  <p className="text-green-600">
                    تتبع تقدم العمل والمراحل الزمنية مع إشعارات فورية وتقارير مفصلة
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

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              تقدم المشروع العام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>التقدم الإجمالي</span>
                <span className="font-semibold">33%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-blue-600 h-4 rounded-full transition-all duration-300" style={{ width: '33%' }}></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">1</div>
                  <div className="text-sm text-gray-600">مرحلة مكتملة</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1</div>
                  <div className="text-sm text-gray-600">مرحلة قيد التنفيذ</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-sm text-gray-600">مرحلة معلقة</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">17</div>
                  <div className="text-sm text-gray-600">أسبوع متبقي</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution Phases */}
        <div className="space-y-4 mb-8">
          {executionPhases.map((phase, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      phase.status === 'completed' ? 'bg-green-100' :
                      phase.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {phase.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : phase.status === 'in-progress' ? (
                        <Building2 className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Clock className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{phase.phase}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>المدة المتوقعة: {phase.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">{phase.progress}%</div>
                    <div className={`text-sm font-medium ${
                      phase.status === 'completed' ? 'text-green-600' :
                      phase.status === 'in-progress' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {phase.status === 'completed' ? 'مكتمل' :
                       phase.status === 'in-progress' ? 'قيد التنفيذ' : 'في الانتظار'}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      phase.status === 'completed' ? 'bg-green-600' :
                      phase.status === 'in-progress' ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                    style={{ width: `${phase.progress}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              إدارة الفريق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">مدير المشروع</h4>
                <p className="text-sm text-gray-600">
                  متابعة شاملة لجميع مراحل التنفيذ
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">مراقب الجودة</h4>
                <p className="text-sm text-gray-600">
                  ضمان الجودة والمطابقة للمواصفات
                </p>
              </div>
              <div className="text-center p-4">
                <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">منسق الجدولة</h4>
                <p className="text-sm text-gray-600">
                  تنسيق المواعيد والجداول الزمنية
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




