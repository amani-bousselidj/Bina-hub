// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Calendar,
  Download,
  FileText,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  Database,
  Activity,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  TrendingDown,
  Percent,
  Calculator,
  Building,
  MapPin,
  Phone,
  Mail,
  Star,
  BookOpen
} from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  category: string;
  description: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
  icon: React.ReactNode;
  color: string;
  metrics: {
    total: number;
    change: number;
    period: string;
  }[];
}

export function AdvancedReportingEngine() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [reportType, setReportType] = useState('dashboard');
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  const reportCategories = [
    {
      id: 'dashboard',
      name: 'لوحة التحكم',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'sales',
      name: 'تقارير المبيعات',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'inventory',
      name: 'تقارير المخزون',
      icon: <Package className="h-5 w-5" />,
      color: 'bg-orange-500'
    },
    {
      id: 'customers',
      name: 'تقارير العملاء',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'financial',
      name: 'التقارير المالية',
      icon: <Calculator className="h-5 w-5" />,
      color: 'bg-red-500'
    },
    {
      id: 'projects',
      name: 'تقارير المشاريع',
      icon: <Building className="h-5 w-5" />,
      color: 'bg-indigo-500'
    }
  ];

  const reportsData: ReportData[] = [
    {
      id: 'sales-summary',
      title: 'ملخص المبيعات',
      category: 'sales',
      description: 'تقرير شامل عن أداء المبيعات والإيرادات',
      lastGenerated: '2025-01-25T10:30:00',
      status: 'ready',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'text-green-600',
      metrics: [
        { total: 125000, change: 12.5, period: 'آخر 30 يوم' },
        { total: 850, change: 8.3, period: 'عدد الطلبات' }
      ]
    },
    {
      id: 'inventory-status',
      title: 'حالة المخزون',
      category: 'inventory',
      description: 'تتبع مستويات المخزون والمنتجات المنخفضة',
      lastGenerated: '2025-01-25T09:15:00',
      status: 'ready',
      icon: <Package className="h-6 w-6" />,
      color: 'text-orange-600',
      metrics: [
        { total: 1250, change: -3.2, period: 'إجمالي المنتجات' },
        { total: 45, change: 15.0, period: 'مخزون منخفض' }
      ]
    },
    {
      id: 'customer-analytics',
      title: 'تحليل العملاء',
      category: 'customers',
      description: 'رؤى حول سلوك العملاء وأنماط الشراء',
      lastGenerated: '2025-01-25T08:45:00',
      status: 'ready',
      icon: <Users className="h-6 w-6" />,
      color: 'text-purple-600',
      metrics: [
        { total: 1850, change: 5.7, period: 'إجمالي العملاء' },
        { total: 420, change: 12.1, period: 'عملاء نشطون' }
      ]
    },
    {
      id: 'project-performance',
      title: 'أداء المشاريع',
      category: 'projects',
      description: 'تقرير شامل عن حالة وأداء المشاريع',
      lastGenerated: '2025-01-25T07:20:00',
      status: 'ready',
      icon: <Building className="h-6 w-6" />,
      color: 'text-indigo-600',
      metrics: [
        { total: 85, change: 7.2, period: 'مشاريع نشطة' },
        { total: 92, change: 3.5, period: 'نسبة الإنجاز %' }
      ]
    },
    {
      id: 'financial-overview',
      title: 'النظرة المالية',
      category: 'financial',
      description: 'ملخص الوضع المالي والربحية',
      lastGenerated: '2025-01-25T11:00:00',
      status: 'generating',
      icon: <Calculator className="h-6 w-6" />,
      color: 'text-red-600',
      metrics: [
        { total: 2500000, change: 18.5, period: 'إجمالي الإيرادات' },
        { total: 22.5, change: 4.1, period: 'هامش الربح %' }
      ]
    }
  ];

  const generateReport = async (reportId: string) => {
    setLoading(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('تم إنشاء التقرير بنجاح!');
    } catch (error) {
      toast.error('فشل في إنشاء التقرير');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reportType === 'dashboard' 
    ? reportsData 
    : reportsData.filter(report => report.category === reportType);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">مركز التقارير المتقدم</h1>
            <p className="text-indigo-100">محرك التقارير الذكي مع تحليلات العملاء والمشاريع</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              تصدير جميع التقارير
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Settings className="h-4 w-4 mr-2" />
              إعدادات التقارير
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              تقرير مخصص
            </Button>
          </div>
        </div>
        
        {/* Quick Stats in Header */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-indigo-200" />
              <div>
                <p className="text-indigo-100 text-sm">التقارير المتاحة</p>
                <p className="text-2xl font-bold">{reportsData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-200" />
              <div>
                <p className="text-indigo-100 text-sm">تقارير جاهزة</p>
                <p className="text-2xl font-bold">{reportsData.filter(r => r.status === 'ready').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-yellow-200" />
              <div>
                <p className="text-indigo-100 text-sm">قيد الإنشاء</p>
                <p className="text-2xl font-bold">{reportsData.filter(r => r.status === 'generating').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-purple-200" />
              <div>
                <p className="text-indigo-100 text-sm">المستخدمون النشطون</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Search className="h-5 w-5" />
            تقارير العملاء والمشاريع
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerSearchWidget
            onCustomerSelect={(customer: Customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name}`);
            }}
            placeholder="البحث عن عميل أو مشروع لإنشاء تقارير مخصصة..."
          />
          
          {selectedCustomer && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">العميل المحدد للتقارير</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium mr-2">{selectedCustomer.name}</span>
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-medium mr-2">{selectedCustomer.phone}</span>
                  </div>
                )}
                {selectedCustomer.email && (
                  <div>
                    <span className="text-gray-600">البريد:</span>
                    <span className="font-medium mr-2">{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="col-span-2">
                    <span className="text-gray-600">العنوان:</span>
                    <span className="font-medium mr-2">{selectedCustomer.address}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-1" />
                  تقرير العميل
                </Button>
                <Button size="sm" variant="outline">
                  <DollarSign className="h-4 w-4 mr-1" />
                  تقرير المبيعات
                </Button>
                <Button size="sm" variant="outline">
                  <Package className="h-4 w-4 mr-1" />
                  تقرير المشاريع
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Categories */}
      <Card>
        <CardHeader>
          <CardTitle>فئات التقارير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
            {reportCategories.map(category => (
              <Button
                key={category.id}
                variant={reportType === category.id ? "default" : "outline"}
                onClick={() => setReportType(category.id)}
                className="h-20 flex flex-col gap-2"
              >
                <div className={`p-2 rounded-full ${category.color} text-white`}>
                  {category.icon}
                </div>
                <span className="text-xs">{category.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date Range and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <Label>الفترة الزمنية:</Label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7">آخر 7 أيام</option>
                <option value="30">آخر 30 يوم</option>
                <option value="90">آخر 3 أشهر</option>
                <option value="365">آخر سنة</option>
                <option value="custom">فترة مخصصة</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Button variant="outline" size="sm">
                مرشحات متقدمة
              </Button>
            </div>
            <div className="flex-1"></div>
            <Button 
              onClick={() => generateReport('refresh')}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map(report => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={report.color}>
                    {report.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>
                </div>
                <Badge 
                  variant={report.status === 'ready' ? 'default' : report.status === 'generating' ? 'secondary' : 'destructive'}
                >
                  {report.status === 'ready' ? 'جاهز' : report.status === 'generating' ? 'جاري الإنشاء' : 'خطأ'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.metrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{metric.period}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{metric.total.toLocaleString('ar-SA')}</span>
                      <div className={`flex items-center gap-1 text-xs ${metric.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>{Math.abs(metric.change)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-xs text-gray-500">
                  آخر تحديث: {new Date(report.lastGenerated).toLocaleString('ar-SA')}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => generateReport(report.id)}
                    disabled={loading || report.status === 'generating'}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    عرض
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => generateReport(report.id)}
                    disabled={loading}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    تحميل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reportType === 'dashboard' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              ملخص الأداء العام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">98.5%</div>
                <div className="text-sm text-gray-600">معدل النجاح</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">1.2s</div>
                <div className="text-sm text-gray-600">متوسط وقت الإنشاء</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">145</div>
                <div className="text-sm text-gray-600">تقارير هذا الشهر</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                <div className="text-sm text-gray-600">تقييم المستخدمين</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default AdvancedReportingEngine;





