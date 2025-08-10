'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/Badge';
import { 
  CreditCard, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Building,
  Calendar,
  Receipt,
  ArrowRight,
  Search,
  Plus,
  Eye,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProcessPaymentPage() {
  const [paymentData, setPaymentData] = useState({
    invoiceNumber: '',
    customerName: '',
    amount: '',
    paymentMethod: '',
    bankAccount: '',
    reference: '',
    notes: '',
    installments: 1,
    dueDate: new Date().toISOString().split('T')[0]
  });

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const [pendingInvoices] = useState([
    {
      id: 'INV-001',
      customerName: 'شركة البناء المتقدم',
      amount: 15750,
      dueDate: '2025-07-30',
      status: 'pending',
      items: ['أسمنت - 50 كيس', 'حديد تسليح - 2 طن']
    },
    {
      id: 'INV-002', 
      customerName: 'مقاولات الخليج',
      amount: 28900,
      dueDate: '2025-08-05',
      status: 'overdue',
      items: ['بلاط سيراميك', 'أدوات صحية']
    },
    {
      id: 'INV-003',
      customerName: 'مؤسسة النماء للتطوير',
      amount: 12300,
      dueDate: '2025-08-10',
      status: 'pending',
      items: ['دهانات', 'أدوات كهربائية']
    }
  ]);

  const [paymentMethods] = useState([
    { id: 'cash', name: 'نقدي', icon: DollarSign },
    { id: 'bank_transfer', name: 'تحويل بنكي', icon: Building },
    { id: 'credit_card', name: 'بطاقة ائتمان', icon: CreditCard },
    { id: 'check', name: 'شيك', icon: Receipt }
  ]);

  const [bankAccounts] = useState([
    'البنك الأهلي السعودي - 1234567890',
    'مصرف الراجحي - 0987654321', 
    'بنك الرياض - 1122334455',
    'البنك السعودي الفرنسي - 5566778899'
  ]);

  const handleInputChange = (field: string, value: string | number) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInvoiceSelect = (invoice: any) => {
    setSelectedInvoice(invoice);
    setPaymentData(prev => ({
      ...prev,
      invoiceNumber: invoice.id,
      customerName: invoice.customerName,
      amount: invoice.amount.toString()
    }));
  };

  const handleProcessPayment = async () => {
    if (!paymentData.invoiceNumber || !paymentData.amount || !paymentData.paymentMethod) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast.success('تم معالجة الدفعة بنجاح');
      
      // Reset form
      setPaymentData({
        invoiceNumber: '',
        customerName: '',
        amount: '',
        paymentMethod: '',
        bankAccount: '',
        reference: '',
        notes: '',
        installments: 1,
        dueDate: new Date().toISOString().split('T')[0]
      });
      setSelectedInvoice(null);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'overdue': return 'متأخر';
      case 'paid': return 'مدفوع';
      default: return status;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CreditCard className="h-8 w-8 text-blue-600" />
            معالجة المدفوعات
          </h1>
          <p className="text-gray-600">
            معالجة وإدارة مدفوعات العملاء والفواتير
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تقرير المدفوعات
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            دفعة جديدة
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Invoices */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                الفواتير المعلقة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedInvoice?.id === invoice.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInvoiceSelect(invoice)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{invoice.id}</h3>
                      <p className="text-sm text-gray-600">{invoice.customerName}</p>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {getStatusText(invoice.status)}
                    </Badge>
                  </div>
                  
                  <div className="text-lg font-bold text-green-600 mb-2">
                    {invoice.amount.toLocaleString()} ر.س
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    تاريخ الاستحقاق: {new Date(invoice.dueDate).toLocaleDateString('ar-SA')}
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">البنود:</p>
                    <ul className="text-xs text-gray-600">
                      {invoice.items.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Payment Processing Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>معالجة الدفعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Invoice and Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">رقم الفاتورة</Label>
                  <div className="relative">
                    <Input
                      id="invoiceNumber"
                      placeholder="اختر من القائمة أو أدخل رقم الفاتورة"
                      value={paymentData.invoiceNumber}
                      onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">اسم العميل</Label>
                  <Input
                    id="customerName"
                    placeholder="اسم العميل"
                    value={paymentData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                  />
                </div>
              </div>

              {/* Amount and Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">المبلغ</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={paymentData.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="pl-12"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ر.س
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>طريقة الدفع</Label>
                  <Select value={paymentData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        return (
                          <SelectItem key={method.id} value={method.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {method.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bank Account and Reference */}
              {paymentData.paymentMethod === 'bank_transfer' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>الحساب البنكي</Label>
                    <Select value={paymentData.bankAccount} onValueChange={(value) => handleInputChange('bankAccount', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحساب البنكي" />
                      </SelectTrigger>
                      <SelectContent>
                        {bankAccounts.map((account) => (
                          <SelectItem key={account} value={account}>
                            {account}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">رقم المرجع</Label>
                    <Input
                      id="reference"
                      placeholder="رقم التحويل أو المرجع"
                      value={paymentData.reference}
                      onChange={(e) => handleInputChange('reference', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Installments and Due Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="installments">عدد الأقساط</Label>
                  <Select value={paymentData.installments.toString()} onValueChange={(value) => handleInputChange('installments', parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">دفعة واحدة</SelectItem>
                      <SelectItem value="2">قسطين</SelectItem>
                      <SelectItem value="3">3 أقساط</SelectItem>
                      <SelectItem value="6">6 أقساط</SelectItem>
                      <SelectItem value="12">12 قسط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">تاريخ الاستحقاق</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={paymentData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات</Label>
                <Textarea
                  id="notes"
                  placeholder="ملاحظات إضافية حول الدفعة..."
                  value={paymentData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  onClick={handleProcessPayment} 
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      معالجة الدفعة
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  معاينة
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          {selectedInvoice && paymentData.amount && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>ملخص الدفعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {parseFloat(paymentData.amount).toLocaleString()} ر.س
                    </div>
                    <div className="text-sm text-gray-600">المبلغ المدفوع</div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-lg font-medium">{paymentData.customerName}</div>
                    <div className="text-sm text-gray-600">العميل</div>
                  </div>

                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-lg font-medium">
                      {paymentMethods.find(m => m.id === paymentData.paymentMethod)?.name || 'غير محدد'}
                    </div>
                    <div className="text-sm text-gray-600">طريقة الدفع</div>
                  </div>
                </div>

                {paymentData.installments > 1 && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">تفاصيل الأقساط:</h4>
                    <div className="text-sm">
                      <span className="font-medium">عدد الأقساط:</span> {paymentData.installments} قسط
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">قيمة القسط:</span> {(parseFloat(paymentData.amount) / paymentData.installments).toLocaleString()} ر.س
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
