'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Receipt, 
  Plus, 
  FileText, 
  Calendar,
  DollarSign,
  TrendingUp,
  Calculator,
  Download,
  Upload,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface VATReturn {
  id: string;
  period: string;
  quarter: string;
  year: string;
  totalSales: number;
  totalPurchases: number;
  outputVAT: number;
  inputVAT: number;
  netVAT: number;
  status: 'draft' | 'submitted' | 'approved' | 'overdue';
  dueDate: string;
  submittedDate?: string;
}

interface VATTransaction {
  id: string;
  date: string;
  type: 'sale' | 'purchase';
  description: string;
  amount: number;
  vatAmount: number;
  vatRate: number;
  invoiceNumber: string;
  customerSupplier: string;
}

export default function VATManagementPage() {
const supabase = createClientComponentClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [vatReturns] = useState<VATReturn[]>([
    {
      id: '1',
      period: 'Q4 2024',
      quarter: 'الربع الرابع',
      year: '2024',
      totalSales: 150000,
      totalPurchases: 80000,
      outputVAT: 22500,
      inputVAT: 12000,
      netVAT: 10500,
      status: 'submitted',
      dueDate: '2025-01-31',
      submittedDate: '2025-01-25'
    },
    {
      id: '2',
      period: 'Q1 2025',
      quarter: 'الربع الأول',
      year: '2025',
      totalSales: 175000,
      totalPurchases: 95000,
      outputVAT: 26250,
      inputVAT: 14250,
      netVAT: 12000,
      status: 'draft',
      dueDate: '2025-04-30'
    },
    {
      id: '3',
      period: 'Q3 2024',
      quarter: 'الربع الثالث',
      year: '2024',
      totalSales: 140000,
      totalPurchases: 75000,
      outputVAT: 21000,
      inputVAT: 11250,
      netVAT: 9750,
      status: 'approved',
      dueDate: '2024-10-31',
      submittedDate: '2024-10-28'
    }
  ]);

  const [vatTransactions] = useState<VATTransaction[]>([
    {
      id: '1',
      date: '2025-01-15',
      type: 'sale',
      description: 'بيع منتجات إلكترونية',
      amount: 10000,
      vatAmount: 1500,
      vatRate: 15,
      invoiceNumber: 'INV-001',
      customerSupplier: 'شركة التقنية المتقدمة'
    },
    {
      id: '2',
      date: '2025-01-14',
      type: 'purchase',
      description: 'شراء مواد خام',
      amount: 5000,
      vatAmount: 750,
      vatRate: 15,
      invoiceNumber: 'PUR-001',
      customerSupplier: 'مؤسسة المواد الأولية'
    },
    {
      id: '3',
      date: '2025-01-13',
      type: 'sale',
      description: 'خدمات استشارية',
      amount: 8000,
      vatAmount: 1200,
      vatRate: 15,
      invoiceNumber: 'INV-002',
      customerSupplier: 'مكتب الهندسة الحديثة'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'مُعتمد';
      case 'submitted': return 'مُقدم';
      case 'draft': return 'مسودة';
      case 'overdue': return 'متأخر';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'submitted': return <Upload className="h-4 w-4" />;
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const currentQuarter = vatReturns.find(r => r.status === 'draft');
  const totalOutputVAT = vatTransactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.vatAmount, 0);
  const totalInputVAT = vatTransactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.vatAmount, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة ضريبة القيمة المضافة</h1>
          <p className="text-gray-600">إدارة الإقرارات الضريبية ومتابعة ضريبة القيمة المضافة</p>
        </div>
        <div className="flex gap-3">
    <Button variant="outline" onClick={() => router.push('/store/accounting/vat-management/export')}>
            <Download className="h-4 w-4 mr-2" />
            تصدير البيانات
          </Button>
    <Button onClick={() => router.push('/store/accounting/vat-management/new')}>
            <Plus className="h-4 w-4 mr-2" />
            إقرار جديد
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">ضريبة المخرجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {totalOutputVAT.toLocaleString()} ريال
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">ضريبة المدخلات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">
                {totalInputVAT.toLocaleString()} ريال
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">صافي الضريبة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {(totalOutputVAT - totalInputVAT).toLocaleString()} ريال
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">للدفع</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">الإقرار القادم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-bold text-orange-600">
                {currentQuarter?.dueDate || 'غير محدد'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">موعد الاستحقاق</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {vatReturns.map((vatReturn) => (
          <Card key={vatReturn.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{vatReturn.quarter} {vatReturn.year}</CardTitle>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(vatReturn.status)}`}>
                  {getStatusIcon(vatReturn.status)}
                  {getStatusText(vatReturn.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">إجمالي المبيعات</p>
                    <p className="font-medium">{vatReturn.totalSales.toLocaleString()} ريال</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">إجمالي المشتريات</p>
                    <p className="font-medium">{vatReturn.totalPurchases.toLocaleString()} ريال</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">ضريبة المخرجات</p>
                    <p className="font-medium text-green-600">{vatReturn.outputVAT.toLocaleString()} ريال</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ضريبة المدخلات</p>
                    <p className="font-medium text-blue-600">{vatReturn.inputVAT.toLocaleString()} ريال</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">صافي الضريبة:</span>
                    <span className="text-lg font-bold text-purple-600">
                      {vatReturn.netVAT.toLocaleString()} ريال
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>موعد الاستحقاق:</span>
                  <span className="font-medium">{vatReturn.dueDate}</span>
                </div>

                {vatReturn.submittedDate && (
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>تاريخ التقديم:</span>
                    <span className="font-medium">{vatReturn.submittedDate}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    عرض
                  </Button>
                  {vatReturn.status === 'draft' && (
                    <Button size="sm" className="flex-1">
                      <Upload className="h-4 w-4 mr-2" />
                      تقديم
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>معاملات ضريبة القيمة المضافة</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المعاملات..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">جميع المعاملات</option>
                <option value="sale">المبيعات</option>
                <option value="purchase">المشتريات</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 px-4 font-medium text-gray-600">التاريخ</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">النوع</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">الوصف</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">العميل/المورد</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">المبلغ الأساسي</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">مبلغ الضريبة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">معدل الضريبة</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">رقم الفاتورة</th>
                </tr>
              </thead>
              <tbody>
                {vatTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{transaction.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        transaction.type === 'sale' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.type === 'sale' ? 'مبيعات' : 'مشتريات'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{transaction.description}</td>
                    <td className="py-3 px-4 text-gray-600">{transaction.customerSupplier}</td>
                    <td className="py-3 px-4 font-medium">{transaction.amount.toLocaleString()} ريال</td>
                    <td className="py-3 px-4 font-medium text-purple-600">
                      {transaction.vatAmount.toLocaleString()} ريال
                    </td>
                    <td className="py-3 px-4 text-gray-600">{transaction.vatRate}%</td>
                    <td className="py-3 px-4 text-blue-600 font-medium">{transaction.invoiceNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ملخص الربع الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-900 font-medium">إجمالي المبيعات</span>
                <span className="text-green-600 font-bold">175,000 ريال</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-900 font-medium">إجمالي المشتريات</span>
                <span className="text-blue-600 font-bold">95,000 ريال</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-900 font-medium">صافي ضريبة القيمة المضافة</span>
                <span className="text-purple-600 font-bold">12,000 ريال</span>
              </div>

              <div className="pt-4">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  إنشاء إقرار ضريبي
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>التذكيرات والإشعارات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border border-orange-200 rounded-lg bg-orange-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">موعد استحقاق الإقرار</p>
                    <p className="text-sm text-orange-700">
                      ينتهي موعد تقديم إقرار الربع الأول في 30 أبريل 2025
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">إقرار جاهز للمراجعة</p>
                    <p className="text-sm text-blue-700">
                      إقرار الربع الأول 2025 جاهز للمراجعة والتقديم
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">تم قبول الإقرار</p>
                    <p className="text-sm text-green-700">
                      تم قبول إقرار الربع الرابع 2024 من قبل هيئة الزكاة والضريبة
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
