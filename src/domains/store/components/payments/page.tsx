'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Download,
  Filter,
  Search,
  Info,
  Wallet,
  Receipt
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const paymentStats = {
    totalPayments: 1250,
    totalAmount: 785500,
    pendingPayments: 23,
    completedPayments: 1200,
    failedPayments: 27,
    averageAmount: 628
  };

  const recentPayments = [
    {
      id: 'PAY001',
      customerName: 'أحمد محمد علي',
      amount: 2500,
      method: 'بطاقة ائتمان',
      status: 'مكتمل',
      date: '2025-01-25',
      reference: 'TXN123456'
    },
    {
      id: 'PAY002',
      customerName: 'فاطمة حسن',
      amount: 1800,
      method: 'تحويل بنكي',
      status: 'معلق',
      date: '2025-01-25',
      reference: 'TXN123457'
    },
    {
      id: 'PAY003',
      customerName: 'محمد خالد',
      amount: 950,
      method: 'نقداً',
      status: 'مكتمل',
      date: '2025-01-24',
      reference: 'TXN123458'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة المدفوعات المتقدمة</h1>
              <p className="text-blue-100 text-lg">نظام شامل لإدارة ومراقبة جميع المعاملات المالية</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير المدفوعات
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                دفعة جديدة
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="border-l-4 border-l-purple-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-purple-700">البحث عن معلومات العملاء والمشاريع</CardTitle>
              <p className="text-sm text-purple-600 mt-1">
                يمكن للمتاجر رؤية معلومات المشاريع لتحديد أو تعريف المشروع للتسليم
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <CustomerSearchWidget
            onCustomerSelect={(customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name} للمدفوعات`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي المدفوعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{paymentStats.totalPayments}</span>
                <p className="text-xs text-blue-600 mt-1">معاملة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">إجمالي المبلغ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{paymentStats.totalAmount.toLocaleString()}</span>
                <p className="text-xs text-green-600 mt-1">ريال سعودي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700">معلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-800">{paymentStats.pendingPayments}</span>
                <p className="text-xs text-yellow-600 mt-1">في الانتظار</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-700">مكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-800">{paymentStats.completedPayments}</span>
                <p className="text-xs text-emerald-600 mt-1">نجحت</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-700">فاشلة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-red-800">{paymentStats.failedPayments}</span>
                <p className="text-xs text-red-600 mt-1">خطأ</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">متوسط المبلغ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{paymentStats.averageAmount}</span>
                <p className="text-xs text-purple-600 mt-1">ريال</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>المدفوعات الأخيرة</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في المدفوعات..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{payment.id}</div>
                    <div className="text-sm text-gray-600">{payment.customerName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {payment.method} • {payment.reference}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {payment.amount.toLocaleString()} ريال
                    </div>
                    <div className="text-sm text-gray-600">{payment.date}</div>
                  </div>
                  <Badge 
                    variant={payment.status === 'مكتمل' ? 'default' : payment.status === 'معلق' ? 'secondary' : 'destructive'}
                  >
                    {payment.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}





