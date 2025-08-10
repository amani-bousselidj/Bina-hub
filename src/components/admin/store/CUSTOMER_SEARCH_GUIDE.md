# Customer Search Widget - دليل الاستخدام

## نظرة عامة
يوفر مكون البحث عن العملاء (`CustomerSearchWidget`) وظائف بحث متقدمة للعملاء مع إمكانية عرض تفاصيل المشاريع ومعلومات التسليم عبر جميع صفحات المتجر.

## الميزات الرئيسية
- **البحث المتقدم**: البحث بالاسم، رقم الهاتف، البريد الإلكتروني، رقم العميل، المدينة، موقع المشروع
- **معلومات المشروع**: عرض نوع المشروع، الموقع، العنوان التفصيلي، الإحداثيات
- **تفاصيل التسليم**: تعليمات التسليم، عنوان المشروع، معلومات الاتصال
- **المرونة**: يمكن استخدامه في أي صفحة متجر (المخزون، الطلبات، المبيعات، إلخ)

## التثبيت والاستيراد

```tsx
import { CustomerSearchWidget, CustomerDetailModal, type Customer } from '@/core/shared/components/store/CustomerSearchWidget';
```

## الاستخدام الأساسي

### 1. في صفحة السوق (Marketplace)
```tsx
<CustomerSearchWidget
  onCustomerSelect={handleCustomerSelect}
  showProjectDetails={true}
  showDeliveryInfo={true}
  placeholder="البحث عن العملاء لمعلومات المشروع والتسليم..."
/>
```

### 2. في صفحة إدارة المخزون
```tsx
// إضافة زر لإظهار البحث
<Button 
  variant="outline" 
  size="sm" 
  onClick={() => setShowCustomerSearch(!showCustomerSearch)}
>
  <Users className="w-4 h-4 mr-2" />
  البحث عن عميل
</Button>

// مكون البحث مع العرض المدمج
<CustomerSearchWidget
  onCustomerSelect={handleCustomerSelect}
  showProjectDetails={true}
  showDeliveryInfo={true}
  compact={true}
  placeholder="البحث عن العملاء لمعلومات المشروع والتسليم..."
/>
```

## خصائص المكون (Props)

| الخاصية | النوع | الافتراضي | الوصف |
|---------|------|----------|-------|
| `onCustomerSelect` | `(customer: Customer) => void` | **مطلوب** | دالة تستدعى عند اختيار عميل |
| `showProjectDetails` | `boolean` | `true` | إظهار تفاصيل المشروع |
| `showDeliveryInfo` | `boolean` | `false` | إظهار معلومات التسليم |
| `compact` | `boolean` | `false` | العرض المدمج للمساحات الصغيرة |
| `placeholder` | `string` | نص افتراضي | نص البحث |

## واجهة العميل (Customer Interface)

```tsx
interface Customer {
  id: string;
  customerCode: string;           // رقم العميل
  name: string;                   // الاسم
  email: string;                  // البريد الإلكتروني
  phone: string;                  // رقم الهاتف
  alternativePhone?: string;      // رقم هاتف بديل
  address: string;                // العنوان الشخصي
  city: string;                   // المدينة
  region: string;                 // المنطقة
  
  // معلومات المشروع
  projectType: string;            // نوع المشروع (فيلا، عمارة، إلخ)
  projectLocation: string;        // موقع المشروع
  projectAddress: string;         // عنوان المشروع التفصيلي
  projectCoordinates?: {          // إحداثيات المشروع
    lat: number;
    lng: number;
  };
  projectStartDate?: string;      // تاريخ بداية المشروع
  projectEndDate?: string;        // تاريخ انتهاء المشروع
  projectBudget?: number;         // ميزانية المشروع
  contactPerson?: string;         // الشخص المسؤول
  
  // معلومات التسليم
  deliveryInstructions?: string;  // تعليمات التسليم
  
  // إحصائيات العميل
  registrationDate: string;       // تاريخ التسجيل
  totalOrders: number;            // إجمالي الطلبات
  totalSpent: number;             // إجمالي الإنفاق
  lastOrderDate?: string;         // تاريخ آخر طلب
  status: 'active' | 'inactive';  // حالة العميل
  loyaltyTier: 'bronze' | 'silver' | 'gold' | 'platinum'; // مستوى الولاء
  notes?: string;                 // ملاحظات
}
```

## مثال كامل للتطبيق

### 1. إعداد الحالة (State)
```tsx
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
const [showCustomerDetail, setShowCustomerDetail] = useState(false);
const [customerDetailData, setCustomerDetailData] = useState<Customer | null>(null);

// دالة التعامل مع اختيار العميل
const handleCustomerSelect = (customer: Customer) => {
  setSelectedCustomer(customer);
  toast.success(\`تم اختيار العميل: \${customer.name} - \${customer.projectType}\`);
};

// دالة إظهار تفاصيل العميل
const handleShowCustomerDetails = (customer: Customer) => {
  setCustomerDetailData(customer);
  setShowCustomerDetail(true);
};
```

### 2. عرض البحث والنتائج
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
  <CustomerSearchWidget
    onCustomerSelect={handleCustomerSelect}
    showProjectDetails={true}
    showDeliveryInfo={true}
    compact={true}
  />
  
  {selectedCustomer && (
    <Card className="p-3 bg-green-50 border-green-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-green-900">
          معلومات التسليم للطلب
        </h4>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleShowCustomerDetails(selectedCustomer)}
        >
          تفاصيل كاملة
        </Button>
      </div>
      
      <div className="space-y-2 text-sm">
        <p><strong>العميل:</strong> {selectedCustomer.name}</p>
        <p><strong>المشروع:</strong> {selectedCustomer.projectType}</p>
        <p><strong>العنوان:</strong> {selectedCustomer.projectAddress}</p>
        {selectedCustomer.deliveryInstructions && (
          <p><strong>تعليمات التسليم:</strong> {selectedCustomer.deliveryInstructions}</p>
        )}
      </div>
    </Card>
  )}
</div>
```

### 3. نافذة التفاصيل المنبثقة
```tsx
{showCustomerDetail && customerDetailData && (
  <CustomerDetailModal
    customer={customerDetailData}
    onClose={() => setShowCustomerDetail(false)}
    showDeliveryInfo={true}
  />
)}
```

## حالات الاستخدام في صفحات المتجر

### 1. صفحة إدارة المخزون
- **الهدف**: تحديد عنوان التسليم قبل تحضير الطلب
- **المعلومات المطلوبة**: عنوان المشروع، تعليمات التسليم، نوع المشروع
- **الفائدة**: تجهيز الطلبات بشكل صحيح وفقاً لموقع المشروع

### 2. صفحة المبيعات
- **الهدف**: إنشاء فاتورة مع تفاصيل العميل والمشروع
- **المعلومات المطلوبة**: بيانات العميل، ميزانية المشروع، معلومات الاتصال
- **الفائدة**: فوترة دقيقة وتسليم مناسب

### 3. صفحة الطلبات
- **الهدف**: تتبع حالة الطلب وتحديد وقت التسليم
- **المعلومات المطلوبة**: عنوان التسليم، تعليمات خاصة، معلومات المشروع
- **الفائدة**: تسليم فعال ودقيق

### 4. صفحة التقارير
- **الهدف**: تحليل بيانات العملاء حسب المشاريع والمواقع
- **المعلومات المطلوبة**: إحصائيات العميل، تاريخ المشاريع، أنواع المشاريع
- **الفائدة**: رؤى تجارية قيمة

## أفضل الممارسات

### 1. الأداء
- استخدم debouncing للبحث (مدمج بالفعل - 300ms)
- عرض النتائج تدريجياً للقوائم الطويلة
- استخدم الـ compact mode في المساحات الصغيرة

### 2. تجربة المستخدم
- أظهر معلومات التسليم بوضوح للموظفين
- استخدم الألوان للتمييز بين أنواع المعلومات
- وفر إمكانية الوصول السريع للتفاصيل الكاملة

### 3. أمان البيانات
- احم معلومات العملاء الحساسة
- اعرض المعلومات حسب صلاحيات المستخدم
- سجل عمليات الوصول لمعلومات العملاء

## مثال التكامل في صفحة جديدة

```tsx
'use client';

import React, { useState } from 'react';
import { CustomerSearchWidget, CustomerDetailModal, type Customer } from '@/core/shared/components/store/CustomerSearchWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/shared/components/ui/card';
import { Button } from '@/core/shared/components/ui/button';

export default function MyStorePage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    // منطق العمل الخاص بصفحتك هنا
    console.log('Selected customer:', customer);
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>البحث عن العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerSearchWidget
            onCustomerSelect={handleCustomerSelect}
            showProjectDetails={true}
            showDeliveryInfo={true}
            placeholder="ابحث عن العميل لرؤية تفاصيل المشروع..."
          />
        </CardContent>
      </Card>

      {selectedCustomer && (
        <Card>
          <CardHeader>
            <CardTitle>تفاصيل العميل المختار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>الاسم:</strong> {selectedCustomer.name}</p>
              <p><strong>المشروع:</strong> {selectedCustomer.projectType}</p>
              <p><strong>الموقع:</strong> {selectedCustomer.projectLocation}</p>
              <Button 
                onClick={() => {
                  setShowCustomerDetail(true);
                }}
              >
                عرض التفاصيل الكاملة
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showCustomerDetail && selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setShowCustomerDetail(false)}
          showDeliveryInfo={true}
        />
      )}
    </div>
  );
}
```

## الدعم والمساعدة

للحصول على المساعدة أو الإبلاغ عن مشاكل:
1. تحقق من وجود Customer interface كاملة
2. تأكد من استيراد المكونات بشكل صحيح
3. راجع console للتأكد من عدم وجود أخطاء JavaScript
4. استخدم الإعدادات المناسبة للصفحة (compact, showDeliveryInfo, etc.)
