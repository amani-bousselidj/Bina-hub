'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  FileText,
  Download,
  Eye,
  Calendar,
  Filter,
  PieChart,
  LineChart,
  Users,
  Package,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle,
  Target,
  Clock
} from 'lucide-react';

export default function FinanceReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('this_month');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date().toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const reportPeriods = [
    { value: 'today', label: 'اليوم' },
    { value: 'this_week', label: 'هذا الأسبوع' },
    { value: 'this_month', label: 'هذا الشهر' },
    { value: 'last_month', label: 'الشهر الماضي' },
    { value: 'this_quarter', label: 'هذا الربع' },
    { value: 'this_year', label: 'هذا العام' },
    { value: 'custom', label: 'فترة مخصصة' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'نظرة عامة', icon: BarChart3 },
    { value: 'income_statement', label: 'بيان الدخل', icon: TrendingUp },
    { value: 'cash_flow', label: 'التدفق النقدي', icon: DollarSign },
    { value: 'expenses', label: 'تقرير المصروفات', icon: CreditCard },
    { value: 'sales', label: 'تقرير المبيعات', icon: Package },
    { value: 'customers', label: 'تقرير العملاء', icon: Users },
    { value: 'profit_loss', label: 'الربح والخسارة', icon: Target }
  ];

  // Sample financial data
  const financialOverview = {
    totalRevenue: 125750,
    totalExpenses: 87500,
    netProfit: 38250,
    grossMargin: 30.4,
    monthlyGrowth: 12.5,
    cashFlow: 45600
  };

  const monthlyData = [
    { month: 'يناير', revenue: 98000, expenses: 65000, profit: 33000 },
    { month: 'فبراير', revenue: 102000, expenses: 68000, profit: 34000 },
    { month: 'مارس', revenue: 95000, expenses: 70000, profit: 25000 },
    { month: 'أبريل', revenue: 110000, expenses: 72000, profit: 38000 },
    { month: 'مايو', revenue: 118000, expenses: 75000, profit: 43000 },
    { month: 'يونيو', revenue: 125000, expenses: 80000, profit: 45000 },
    { month: 'يوليو', revenue: 125750, expenses: 87500, profit: 38250 }
  ];

  const expenseCategories = [
    { category: 'مشتريات', amount: 35000, percentage: 40 },
    { category: 'رواتب', amount: 25000, percentage: 28.5 },
    { category: 'إيجار', amount: 12000, percentage: 13.7 },
    { category: 'مرافق', amount: 8500, percentage: 9.7 },
    { category: 'تسويق', amount: 4000, percentage: 4.6 },
    { category: 'أخرى', amount: 3000, percentage: 3.5 }
  ];

  const topCustomers = [
    { name: 'شركة البناء المتقدم', revenue: 25000, orders: 8 },
    { name: 'مقاولات الخليج', revenue: 18500, orders: 6 },
    { name: 'مؤسسة النماء', revenue: 15200, orders: 5 },
    { name: 'شركة التطوير الحديث', revenue: 12800, orders: 4 },
    { name: 'مقاولات الرياض', revenue: 10500, orders: 3 }
  ];

  const handleGenerateReport = () => {
    // Generate report logic here
    console.log('Generating report:', { selectedReport, selectedPeriod, dateRange });
  };

  const handleExportReport = (format: string) => {
    // Export logic here
    console.log(`Exporting ${selectedReport} report as ${format}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            التقارير المالية
          </h1>
          <p className="text-gray-600">
            تقارير مالية شاملة لمتجرك
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            تصدير PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            تصدير Excel
          </Button>
          <Button onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            إنشاء تقرير
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            خيارات التقرير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>نوع التقرير</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الفترة الزمنية</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportPeriods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPeriod === 'custom' && (
              <>
                <div className="space-y-2">
                  <Label>من تاريخ</Label>
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>إلى تاريخ</Label>
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {financialOverview.totalRevenue.toLocaleString()} ر.س
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600">+{financialOverview.monthlyGrowth}%</span> عن الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المصروفات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">
                {financialOverview.totalExpenses.toLocaleString()} ر.س
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {((financialOverview.totalExpenses / financialOverview.totalRevenue) * 100).toFixed(1)}% من الإيرادات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">صافي الربح</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {financialOverview.netProfit.toLocaleString()} ر.س
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              هامش ربح {financialOverview.grossMargin}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">التدفق النقدي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {financialOverview.cashFlow.toLocaleString()} ر.س
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">السيولة المتاحة</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              الأداء الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, index) => {
                const maxRevenue = Math.max(...monthlyData.map(m => m.revenue));
                const revenuePercentage = (month.revenue / maxRevenue) * 100;
                const profitPercentage = (month.profit / month.revenue) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{month.month}</span>
                      <span className="text-sm text-gray-600">
                        {month.revenue.toLocaleString()} ر.س
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full relative"
                        style={{ width: `${revenuePercentage}%` }}
                      >
                        <div 
                          className="bg-green-400 h-3 rounded-full absolute top-0 right-0"
                          style={{ width: `${profitPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>ربح: {month.profit.toLocaleString()} ر.س</span>
                      <span>هامش: {profitPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              توزيع المصروفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.category}</span>
                    <span className="text-sm text-gray-600">
                      {category.amount.toLocaleString()} ر.س ({category.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-500' :
                        index === 2 ? 'bg-yellow-500' :
                        index === 3 ? 'bg-green-500' :
                        index === 4 ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            أفضل العملاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-3 px-4">العميل</th>
                  <th className="text-right py-3 px-4">الإيرادات</th>
                  <th className="text-right py-3 px-4">عدد الطلبات</th>
                  <th className="text-right py-3 px-4">متوسط الطلب</th>
                  <th className="text-right py-3 px-4">النسبة</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((customer, index) => {
                  const averageOrder = customer.revenue / customer.orders;
                  const percentage = (customer.revenue / financialOverview.totalRevenue) * 100;
                  
                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{customer.name}</td>
                      <td className="py-3 px-4 text-green-600 font-medium">
                        {customer.revenue.toLocaleString()} ر.س
                      </td>
                      <td className="py-3 px-4">{customer.orders}</td>
                      <td className="py-3 px-4">
                        {averageOrder.toLocaleString()} ر.س
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle>تقارير سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Clock className="h-6 w-6 mb-2" />
              تقرير يومي
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Calendar className="h-6 w-6 mb-2" />
              تقرير أسبوعي
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <TrendingUp className="h-6 w-6 mb-2" />
              تحليل الاتجاهات
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              مقارنة الأهداف
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
