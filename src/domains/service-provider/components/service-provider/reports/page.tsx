'use client';
import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, FileText } from 'lucide-react';

export default function ServiceProviderReportsPage() {
  const monthlyData = [
    { month: 'يناير', revenue: 45000, projects: 8, customers: 6 },
    { month: 'فبراير', revenue: 52000, projects: 10, customers: 8 },
    { month: 'مارس', revenue: 48000, projects: 9, customers: 7 },
    { month: 'أبريل', revenue: 61000, projects: 12, customers: 10 },
    { month: 'مايو', revenue: 58000, projects: 11, customers: 9 },
    { month: 'يونيو', revenue: 67000, projects: 14, customers: 12 },
    { month: 'يوليو', revenue: 73000, projects: 15, customers: 13 }
  ];

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData[monthlyData.length - 2];

  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(1);
  const projectsGrowth = ((currentMonth.projects - previousMonth.projects) / previousMonth.projects * 100).toFixed(1);

  const reports = [
    {
      id: '1',
      title: 'تقرير الإيرادات الشهرية',
      description: 'تحليل شامل للإيرادات والمدفوعات',
      type: 'revenue',
      period: 'يوليو 2025',
      size: '2.3 MB'
    },
    {
      id: '2',
      title: 'تقرير أداء المشاريع',
      description: 'إحصائيات المشاريع المكتملة والجارية',
      type: 'projects',
      period: 'الربع الثاني 2025',
      size: '1.8 MB'
    },
    {
      id: '3',
      title: 'تقرير تحليل العملاء',
      description: 'بيانات العملاء والتفاعل معهم',
      type: 'customers',
      period: 'النصف الأول 2025',
      size: '1.2 MB'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            التقارير والإحصائيات
          </h1>
          <p className="text-gray-600">
            تحليل شامل لأداء نشاطك التجاري
          </p>
        </div>
        <Link href="/service-provider/reports/create">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            إنشاء تقرير مخصص
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إيرادات الشهر</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.revenue.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground">
              <span className={parseFloat(revenueGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {parseFloat(revenueGrowth) >= 0 ? '+' : ''}{revenueGrowth}%
              </span>
              {' '}من الشهر السابق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاريع المكتملة</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.projects}</div>
            <p className="text-xs text-muted-foreground">
              <span className={parseFloat(projectsGrowth) >= 0 ? 'text-green-600' : 'text-red-600'}>
                {parseFloat(projectsGrowth) >= 0 ? '+' : ''}{projectsGrowth}%
              </span>
              {' '}من الشهر السابق
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عملاء جدد</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentMonth.customers}</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط قيمة المشروع</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(currentMonth.revenue / currentMonth.projects).toLocaleString()} ر.س
            </div>
            <p className="text-xs text-muted-foreground">لكل مشروع</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>الأداء الشهري</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {monthlyData.reduce((sum, month) => sum + month.revenue, 0).toLocaleString()} ر.س
                </div>
                <div className="text-sm text-gray-600">إجمالي الإيرادات (7 أشهر)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {monthlyData.reduce((sum, month) => sum + month.projects, 0)}
                </div>
                <div className="text-sm text-gray-600">إجمالي المشاريع</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.max(...monthlyData.map(m => m.customers))}
                </div>
                <div className="text-sm text-gray-600">أعلى عدد عملاء شهرياً</div>
              </div>
            </div>

            {/* Simple bar chart representation */}
            <div className="space-y-2">
              <h4 className="font-medium">الإيرادات الشهرية</h4>
              {monthlyData.map((month, index) => {
                const percentage = (month.revenue / Math.max(...monthlyData.map(m => m.revenue))) * 100;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm">{month.month}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                      <div 
                        className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {month.revenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600">{month.projects} مشروع</div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>التقارير المتاحة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-gray-600 text-sm">{report.description}</p>
                  </div>
                  <Badge variant="outline">{report.type}</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">الفترة:</span>
                    <div className="font-medium">{report.period}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">الحجم:</span>
                    <div className="font-medium">{report.size}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/service-provider/reports/${report.id}/download?format=pdf`}>
                      <Download className="h-3 w-3 mr-1" />
                      تحميل PDF
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/service-provider/reports/${report.id}/download?format=excel`}>
                      <Download className="h-3 w-3 mr-1" />
                      تحميل Excel
                    </a>
                  </Button>
                  <Link href={`/service-provider/reports/${report.id}`}>
                    <Button size="sm">
                      عرض التقرير
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/service-provider/reports/weekly-analysis">
              <Button variant="outline" className="h-20 flex-col w-full">
                <BarChart3 className="h-6 w-6 mb-2" />
                تحليل الأداء الأسبوعي
              </Button>
            </Link>
            <Link href="/service-provider/reports/new-customers">
              <Button variant="outline" className="h-20 flex-col w-full">
                <FileText className="h-6 w-6 mb-2" />
                تقرير العملاء الجدد
              </Button>
            </Link>
            <Link href="/service-provider/reports/annual-comparison">
              <Button variant="outline" className="h-20 flex-col w-full">
                <TrendingUp className="h-6 w-6 mb-2" />
                مقارنة الأرباح السنوية
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



