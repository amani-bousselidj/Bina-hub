'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Bell, Shield, Globe, CreditCard, Calendar } from 'lucide-react';

export default function ServiceProviderSettingsPage() {
  const settingsData = {
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      newBookings: true,
      paymentUpdates: true,
      projectReminders: true,
      marketingEmails: false
    },
    privacy: {
      profileVisibility: 'public',
      showPhoneNumber: true,
      showEmail: false,
      showLocation: true,
      allowDirectMessages: true
    },
    business: {
      autoAcceptBookings: false,
      requireDeposit: true,
      depositPercentage: 30,
      cancellationPolicy: 'flexible',
      refundPolicy: 'partial'
    },
    billing: {
      preferredCurrency: 'SAR',
      taxNumber: '123456789',
      paymentMethods: ['bank-transfer', 'online'],
      invoiceTemplate: 'standard'
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            الإعدادات
          </h1>
          <p className="text-gray-600">
            إدارة إعدادات حسابك ونشاطك التجاري
          </p>
        </div>
        <Button>
          حفظ جميع التغييرات
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              إعدادات الإشعارات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>إشعارات البريد الإلكتروني</Label>
                <p className="text-sm text-gray-600">تلقي إشعارات عبر البريد الإلكتروني</p>
              </div>
              <Switch checked={settingsData.notifications.emailNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>إشعارات الرسائل النصية</Label>
                <p className="text-sm text-gray-600">تلقي إشعارات عبر الرسائل النصية</p>
              </div>
              <Switch checked={settingsData.notifications.smsNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>الإشعارات الفورية</Label>
                <p className="text-sm text-gray-600">إشعارات فورية في المتصفح</p>
              </div>
              <Switch checked={settingsData.notifications.pushNotifications} />
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">أنواع الإشعارات:</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>الحجوزات الجديدة</Label>
                  <Switch checked={settingsData.notifications.newBookings} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تحديثات المدفوعات</Label>
                  <Switch checked={settingsData.notifications.paymentUpdates} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>تذكيرات المشاريع</Label>
                  <Switch checked={settingsData.notifications.projectReminders} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>الرسائل التسويقية</Label>
                  <Switch checked={settingsData.notifications.marketingEmails} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              إعدادات الخصوصية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ظهور الملف الشخصي</Label>
              <Select value={settingsData.privacy.profileVisibility}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">عام (للجميع)</SelectItem>
                  <SelectItem value="registered">للمسجلين فقط</SelectItem>
                  <SelectItem value="private">خاص</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium">المعلومات المرئية:</h4>
              <div className="flex items-center justify-between">
                <Label>إظهار رقم الهاتف</Label>
                <Switch checked={settingsData.privacy.showPhoneNumber} />
              </div>
              <div className="flex items-center justify-between">
                <Label>إظهار البريد الإلكتروني</Label>
                <Switch checked={settingsData.privacy.showEmail} />
              </div>
              <div className="flex items-center justify-between">
                <Label>إظهار الموقع</Label>
                <Switch checked={settingsData.privacy.showLocation} />
              </div>
              <div className="flex items-center justify-between">
                <Label>السماح بالرسائل المباشرة</Label>
                <Switch checked={settingsData.privacy.allowDirectMessages} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              إعدادات النشاط التجاري
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>قبول الحجوزات تلقائياً</Label>
                <p className="text-sm text-gray-600">قبول الحجوزات دون موافقة يدوية</p>
              </div>
              <Switch checked={settingsData.business.autoAcceptBookings} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>طلب عربون</Label>
                <p className="text-sm text-gray-600">طلب دفع عربون عند الحجز</p>
              </div>
              <Switch checked={settingsData.business.requireDeposit} />
            </div>

            {settingsData.business.requireDeposit && (
              <div className="space-y-2">
                <Label>نسبة العربون (%)</Label>
                <Input 
                  type="number" 
                  value={settingsData.business.depositPercentage}
                  min="10"
                  max="50"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>سياسة الإلغاء</Label>
              <Select value={settingsData.business.cancellationPolicy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">مرنة (إلغاء حتى 24 ساعة)</SelectItem>
                  <SelectItem value="moderate">متوسطة (إلغاء حتى 48 ساعة)</SelectItem>
                  <SelectItem value="strict">صارمة (إلغاء حتى أسبوع)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>سياسة الاسترداد</Label>
              <Select value={settingsData.business.refundPolicy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">استرداد كامل</SelectItem>
                  <SelectItem value="partial">استرداد جزئي</SelectItem>
                  <SelectItem value="no-refund">لا يوجد استرداد</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Billing Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              إعدادات الفوترة والدفع
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>العملة المفضلة</Label>
              <Select value={settingsData.billing.preferredCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                  <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
                  <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>الرقم الضريبي</Label>
              <Input value={settingsData.billing.taxNumber} />
            </div>

            <div className="space-y-2">
              <Label>طرق الدفع المقبولة</Label>
              <div className="space-y-2">
                {[
                  { key: 'bank-transfer', label: 'تحويل بنكي' },
                  { key: 'online', label: 'دفع إلكتروني' },
                  { key: 'cash', label: 'نقداً' },
                  { key: 'check', label: 'شيك' }
                ].map((method) => (
                  <div key={method.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settingsData.billing.paymentMethods.includes(method.key)}
                      className="rounded"
                    />
                    <span className="text-sm">{method.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>قالب الفاتورة</Label>
              <Select value={settingsData.billing.invoiceTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">قياسي</SelectItem>
                  <SelectItem value="detailed">مفصل</SelectItem>
                  <SelectItem value="minimal">بسيط</SelectItem>
                  <SelectItem value="custom">مخصص</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language & Regional Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            إعدادات اللغة والمنطقة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>اللغة</Label>
              <Select defaultValue="ar">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>المنطقة الزمنية</Label>
              <Select defaultValue="riyadh">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riyadh">الرياض (GMT+3)</SelectItem>
                  <SelectItem value="dubai">دبي (GMT+4)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>تنسيق التاريخ</Label>
              <Select defaultValue="hijri">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hijri">هجري</SelectItem>
                  <SelectItem value="gregorian">ميلادي</SelectItem>
                  <SelectItem value="both">كلاهما</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline">
          استعادة الإعدادات الافتراضية
        </Button>
        <div className="flex gap-4">
          <Button variant="outline">
            إلغاء التغييرات
          </Button>
          <Button>
            حفظ جميع الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
}




