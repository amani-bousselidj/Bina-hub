'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Download, 
  Filter,
  Calendar,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  FileText,
  Eye,
  RefreshCw,
  Settings
} from 'lucide-react';
import { CustomerSearchWidget, Customer } from '@/components/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function ReportsPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportType, setReportType] = useState('sales');

  const salesData = {
    total: 125000,
    growth: 12.5,
    orders: 342,
    customers: 89
  };

  const handleGenerateReport = () => {
    toast.success('تم إنشاء التقرير بنجاح');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">التقارير والتحليلات المتقدمة</h1>
              <p className="text-teal-100 text-lg">تحليل شامل للأداء وإحصائيات المبيعات والعملاء</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير التقارير
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <RefreshCw className="h-4 w-4 mr-2" />
                تحديث البيانات
              </Button>
              <Button className="bg-white text-emerald-600 hover:bg-gray-50" onClick={handleGenerateReport}>
                <FileText className="h-4 w-4 mr-2" />
                إنشاء تقرير
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="border-l-4 border-l-emerald-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-emerald-700">فلترة التقارير حسب العميل</CardTitle>
              <p className="text-sm text-emerald-600 mt-1">
                اختر عميل محدد لعرض تقاريره الخاصة أو اتركه فارغاً لعرض التقرير العام
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <CustomerSearchWidget
            onCustomerSelect={(customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name} للتقارير`);
            }}
          />
        </CardContent>
      </Card>

      {/* Report Filters */}
      <Card>
        <CardHeader>
          <CardTitle>إعدادات التقرير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">نوع التقرير</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="sales">تقرير المبيعات</option>
                <option value="customers">تقرير العملاء</option>
                <option value="products">تقرير المنتجات</option>
                <option value="inventory">تقرير المخزون</option>
                <option value="financial">التقرير المالي</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الفترة الزمنية</label>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="day">اليوم</option>
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذا العام</option>
                <option value="custom">فترة مخصصة</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={handleGenerateReport}>
                <BarChart3 className="h-4 w-4 mr-2" />
                إنشاء التقرير
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-blue-800">{salesData.total.toLocaleString()} ريال</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{salesData.growth}%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-500 rounded-full">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">عدد الطلبات</p>
                <p className="text-2xl font-bold text-green-800">{salesData.orders}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-green-500 rounded-full">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">عدد العملاء</p>
                <p className="text-2xl font-bold text-purple-800">{salesData.customers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+15.3%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-500 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 mb-1">المنتجات المباعة</p>
                <p className="text-2xl font-bold text-orange-800">1,247</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">-2.1%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-500 rounded-full">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>مخطط المبيعات الشهرية</CardTitle>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                عرض تفصيلي
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">مخطط المبيعات الشهرية</p>
                <p className="text-sm text-gray-500">البيانات محمّلة ديناميكياً</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>أداء المنتجات</CardTitle>
              <Button variant="outline" size="sm">
                <PieChart className="h-4 w-4 mr-2" />
                مخطط دائري
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">أجهزة الكمبيوتر</p>
                  <p className="text-sm text-gray-600">45% من المبيعات</p>
                </div>
                <Badge variant="secondary">الأعلى مبيعاً</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">الإكسسوارات</p>
                  <p className="text-sm text-gray-600">30% من المبيعات</p>
                </div>
                <Badge variant="outline">جيد</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">البرمجيات</p>
                  <p className="text-sm text-gray-600">25% من المبيعات</p>
                </div>
                <Badge variant="outline">متوسط</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات التقارير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير PDF
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير Excel
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              جدولة التقرير
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              إعدادات التقرير
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

