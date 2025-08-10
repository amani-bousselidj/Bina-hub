'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Eye,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const analyticsData = {
    totalViews: 12543,
    uniqueVisitors: 3876,
    conversionRate: 4.2,
    avgSessionDuration: '4:32',
    bounceRate: 23.5,
    topProducts: [
      { name: 'أسمنت بورتلاند', sales: 156, revenue: 39000 },
      { name: 'حديد التسليح 12مم', sales: 89, revenue: 40050 },
      { name: 'طلاء خارجي أبيض', sales: 67, revenue: 5695 }
    ],
    salesByCategory: [
      { category: 'مواد البناء', percentage: 45, sales: 180 },
      { category: 'الحديد والمعادن', percentage: 30, sales: 120 },
      { category: 'الدهانات', percentage: 15, sales: 60 },
      { category: 'أدوات البناء', percentage: 10, sales: 40 }
    ],
    customerSegments: [
      { segment: 'عملاء جدد', count: 45, percentage: 35 },
      { segment: 'عملاء متكررون', count: 67, percentage: 52 },
      { segment: 'عملاء كبار', count: 17, percentage: 13 }
    ]
  };

  const timeframes = [
    { value: 'week', label: 'هذا الأسبوع' },
    { value: 'month', label: 'هذا الشهر' },
    { value: 'quarter', label: 'هذا الربع' },
    { value: 'year', label: 'هذا العام' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">تحليلات المبيعات</h1>
          <p className="text-gray-600 mt-1">تحليل شامل لأداء المتجر والمبيعات</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            {timeframes.map(tf => (
              <option key={tf.value} value={tf.value}>{tf.label}</option>
            ))}
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            تصفية
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              إجمالي المشاهدات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalViews.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              زوار فريدون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">
              متوسط الجلسة: {analyticsData.avgSessionDuration}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <ShoppingCart className="w-4 h-4 mr-1" />
              معدل التحويل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {analyticsData.conversionRate}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              معدل الارتداد: {analyticsData.bounceRate}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <BarChart3 className="w-4 h-4 mr-1" />
              إجمالي العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {analyticsData.customerSegments.reduce((acc, seg) => acc + seg.count, 0)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              عميل نشط
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              المبيعات حسب الفئة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.salesByCategory.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded" style={{
                      backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                    }}></div>
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{item.sales}</div>
                    <div className="text-sm text-gray-600">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              تقسيم العملاء
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded" style={{
                      backgroundColor: `hsl(${120 + index * 40}, 60%, 50%)`
                    }}></div>
                    <span className="font-medium">{segment.segment}</span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold">{segment.count}</div>
                    <div className="text-sm text-gray-600">{segment.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            أفضل المنتجات مبيعاً
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3 font-medium">المنتج</th>
                  <th className="text-right p-3 font-medium">عدد المبيعات</th>
                  <th className="text-right p-3 font-medium">الإيرادات</th>
                  <th className="text-right p-3 font-medium">الاتجاه</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.topProducts.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3">{product.sales}</td>
                    <td className="p-3">{product.revenue.toLocaleString()} ر.س</td>
                    <td className="p-3">
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +15%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            اتجاهات الأداء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">مخطط اتجاهات الأداء الزمني</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
