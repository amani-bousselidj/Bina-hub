'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { DollarSign, TrendingUp, CreditCard, Clock, FileText, Download } from 'lucide-react';

export default function ServiceProviderPaymentsPage() {
  const payments = [
    {
      id: '1',
      customerName: 'أحمد محمد الزهراني',
      projectTitle: 'بناء فيلا سكنية',
      amount: 25000,
      date: '2025-07-25',
      method: 'bank-transfer',
      status: 'completed',
      invoiceNumber: 'INV-2025-001'
    },
    {
      id: '2',
      customerName: 'فاطمة عبدالله',
      projectTitle: 'استشارة هندسية',
      amount: 2000,
      date: '2025-07-20',
      method: 'online',
      status: 'completed',
      invoiceNumber: 'INV-2025-002'
    },
    {
      id: '3',
      customerName: 'خالد العتيبي',
      projectTitle: 'إشراف على البناء',
      amount: 15000,
      date: '2025-07-15',
      method: 'cash',
      status: 'pending',
      invoiceNumber: 'INV-2025-003'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'completed': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'failed': 'bg-red-500',
      'refunded': 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'completed': 'مكتمل',
      'pending': 'في الانتظار',
      'failed': 'فاشل',
      'refunded': 'مسترد'
    };
    return texts[status] || status;
  };

  const getMethodText = (method: string) => {
    const texts: Record<string, string> = {
      'bank-transfer': 'تحويل بنكي',
      'online': 'دفع إلكتروني',
      'cash': 'نقداً',
      'check': 'شيك'
    };
    return texts[method] || method;
  };

  const totalEarnings = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingPayments = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-blue-600" />
            إدارة المدفوعات
          </h1>
          <p className="text-gray-600">
            تتبع وإدارة جميع المدفوعات والفواتير
          </p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          إنشاء فاتورة جديدة
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEarnings.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground">مكتملة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مدفوعات معلقة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.toLocaleString()} ر.س</div>
            <p className="text-xs text-muted-foreground">في الانتظار</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الفواتير</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معدل النجاح</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">نسبة الدفع</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>سجل المدفوعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{payment.projectTitle}</h3>
                    <p className="text-gray-600">{payment.customerName}</p>
                    <p className="text-sm text-gray-500">فاتورة رقم: {payment.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{payment.amount.toLocaleString()} ر.س</div>
                    <Badge className={getStatusColor(payment.status)}>
                      {getStatusText(payment.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-gray-500">تاريخ الدفع:</span>
                    <div className="font-medium">
                      {new Date(payment.date).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">طريقة الدفع:</span>
                    <div className="font-medium flex items-center gap-1">
                      <CreditCard className="h-4 w-4" />
                      {getMethodText(payment.method)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">حالة الدفع:</span>
                    <div className="font-medium">{getStatusText(payment.status)}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    تحميل الفاتورة
                  </Button>
                  {payment.status === 'pending' && (
                    <Button size="sm">
                      <Clock className="h-3 w-3 mr-1" />
                      متابعة الدفع
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    عرض التفاصيل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ملخص الشهر الحالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>إجمالي الفواتير:</span>
                <span className="font-medium">{payments.length}</span>
              </div>
              <div className="flex justify-between">
                <span>المدفوعات المكتملة:</span>
                <span className="font-medium">{payments.filter(p => p.status === 'completed').length}</span>
              </div>
              <div className="flex justify-between">
                <span>المدفوعات المعلقة:</span>
                <span className="font-medium">{payments.filter(p => p.status === 'pending').length}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>صافي الإيرادات:</span>
                  <span>{totalEarnings.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>طرق الدفع الأكثر استخداماً</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                payments.reduce((acc, payment) => {
                  acc[payment.method] = (acc[payment.method] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort(([,a], [,b]) => b - a)
                .map(([method, count]) => (
                  <div key={method} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>{getMethodText(method)}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{count} فاتورة</div>
                      <div className="text-sm text-gray-500">
                        {Math.round((count / payments.length) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



