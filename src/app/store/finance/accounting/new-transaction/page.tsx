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
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  FileText,
  CreditCard,
  Building,
  User,
  Plus,
  Save,
  X,
  Receipt
} from 'lucide-react';
import { toast } from 'sonner';

export default function NewTransactionPage() {
  const [transactionData, setTransactionData] = useState({
    type: '',
    amount: '',
    description: '',
    category: '',
    account: '',
    paymentMethod: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    customer: '',
    notes: ''
  });

  const [categories] = useState([
    'مبيعات',
    'مشتريات', 
    'رواتب',
    'إيجار',
    'مرافق',
    'تسويق',
    'صيانة',
    'أخرى'
  ]);

  const [accounts] = useState([
    'الحساب الرئيسي',
    'حساب البنك الأهلي',
    'حساب الراجحي',
    'الصندوق النقدي',
    'حساب مدى'
  ]);

  const [paymentMethods] = useState([
    'نقدي',
    'تحويل بنكي',
    'بطاقة ائتمان',
    'بطاقة مدى',
    'شيك',
    'حوالة'
  ]);

  const handleInputChange = (field: string, value: string) => {
    setTransactionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!transactionData.type || !transactionData.amount || !transactionData.description) {
      toast.error('يرجى تعبئة الحقول الإجبارية');
      return;
    }

    // Here you would typically save to database
    toast.success('تم حفظ المعاملة بنجاح');
    
    // Reset form
    setTransactionData({
      type: '',
      amount: '',
      description: '',
      category: '',
      account: '',
      paymentMethod: '',
      reference: '',
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      customer: '',
      notes: ''
    });
  };

  const handleSaveDraft = () => {
    toast.success('تم حفظ المسودة');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-green-600" />
            معاملة مالية جديدة
          </h1>
          <p className="text-gray-600">
            إضافة معاملة مالية جديدة للنظام المحاسبي
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <FileText className="h-4 w-4 mr-2" />
            حفظ كمسودة
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            حفظ المعاملة
          </Button>
        </div>
      </div>

      {/* Transaction Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>نوع المعاملة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={transactionData.type === 'income' ? 'default' : 'outline'}
              onClick={() => handleInputChange('type', 'income')}
              className="h-20 flex-col"
            >
              <ArrowUpCircle className="h-8 w-8 mb-2 text-green-600" />
              <span>إيراد</span>
              <span className="text-sm text-gray-500">دخل للمتجر</span>
            </Button>
            <Button
              variant={transactionData.type === 'expense' ? 'default' : 'outline'}
              onClick={() => handleInputChange('type', 'expense')}
              className="h-20 flex-col"
            >
              <ArrowDownCircle className="h-8 w-8 mb-2 text-red-600" />
              <span>مصروف</span>
              <span className="text-sm text-gray-500">خرج من المتجر</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details */}
      <Card>
        <CardHeader>
          <CardTitle>تفاصيل المعاملة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="amount">المبلغ *</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={transactionData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="pl-12"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ر.س
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">الوصف *</Label>
              <Input
                id="description"
                placeholder="وصف المعاملة"
                value={transactionData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
          </div>

          {/* Category and Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>الفئة</Label>
              <Select value={transactionData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الفئة" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الحساب</Label>
              <Select value={transactionData.account} onValueChange={(value) => handleInputChange('account', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحساب" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Payment Method and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>طريقة الدفع</Label>
              <Select value={transactionData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر طريقة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                type="date"
                value={transactionData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>
          </div>

          {/* Reference and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reference">المرجع</Label>
              <Input
                id="reference"
                placeholder="رقم الفاتورة أو المرجع"
                value={transactionData.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
              />
            </div>

            {transactionData.type === 'income' ? (
              <div className="space-y-2">
                <Label htmlFor="customer">العميل</Label>
                <Input
                  id="customer"
                  placeholder="اسم العميل"
                  value={transactionData.customer}
                  onChange={(e) => handleInputChange('customer', e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="vendor">المورد</Label>
                <Input
                  id="vendor"
                  placeholder="اسم المورد"
                  value={transactionData.vendor}
                  onChange={(e) => handleInputChange('vendor', e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              placeholder="ملاحظات إضافية..."
              value={transactionData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transaction Summary */}
      {transactionData.amount && (
        <Card>
          <CardHeader>
            <CardTitle>ملخص المعاملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${transactionData.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {transactionData.type === 'income' ? '+' : '-'}{parseFloat(transactionData.amount || '0').toLocaleString()} ر.س
                </div>
                <div className="text-sm text-gray-600">المبلغ</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-medium">
                  {transactionData.type === 'income' ? 'إيراد' : 'مصروف'}
                </div>
                <div className="text-sm text-gray-600">نوع المعاملة</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-medium">
                  {transactionData.category || 'غير محدد'}
                </div>
                <div className="text-sm text-gray-600">الفئة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>إجراءات سريعة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col">
              <Receipt className="h-6 w-6 mb-2" />
              معاملة من فاتورة
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              دفعة متكررة
            </Button>
            <Button variant="outline" className="h-16 flex-col">
              <Building className="h-6 w-6 mb-2" />
              تحويل بين الحسابات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
