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
  Settings, 
  Store,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Shield,
  CreditCard,
  DollarSign,
  Truck,
  Users,
  Eye,
  Upload,
  Save,
  Monitor,
  Smartphone,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export default function StorefrontSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      storeName: 'متجر بناء المتقدم',
      storeDescription: 'متجر متخصص في مواد البناء والتشييد بأعلى جودة وأفضل الأسعار',
      storeSlogan: 'بناء المستقبل معاً',
      contactEmail: 'info@binaa-store.com',
      contactPhone: '+966 50 123 4567',
      whatsappNumber: '+966 50 123 4567',
      address: 'شارع الملك فهد، حي العليا، الرياض 12345',
      businessHours: {
        weekdays: 'من 8 صباحاً إلى 10 مساءً',
        weekend: 'من 9 صباحاً إلى 11 مساءً'
      }
    },
    appearance: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      theme: 'light',
      logoUrl: '',
      bannerUrl: '',
      customCss: '',
      layout: 'modern',
      font: 'arabic'
    },
    seo: {
      metaTitle: 'متجر بناء المتقدم - مواد البناء والتشييد',
      metaDescription: 'متجر متخصص في مواد البناء والتشييد بأعلى جودة وأفضل الأسعار في المملكة العربية السعودية',
      keywords: 'مواد البناء، تشييد، أسمنت، حديد، بلاط، أدوات بناء',
      googleAnalytics: '',
      facebookPixel: '',
      structuredData: true
    },
    payments: {
      acceptCash: true,
      acceptCards: true,
      acceptMada: true,
      acceptApplePay: true,
      acceptStcPay: true,
      acceptBankTransfer: true,
      currency: 'SAR',
      taxRate: 15,
      minimumOrder: 100
    },
    shipping: {
      freeShippingThreshold: 500,
      localDeliveryFee: 50,
      regionalDeliveryFee: 100,
      expressDeliveryFee: 150,
      deliveryTime: '1-3 أيام عمل',
      deliveryAreas: 'الرياض وضواحيها',
      trackingEnabled: true
    },
    security: {
      twoFactorAuth: false,
      sslEnabled: true,
      backupFrequency: 'daily',
      maintenanceMode: false,
      privacyPolicy: '',
      termsOfService: ''
    }
  });

  const tabs = [
    { id: 'general', name: 'عام', icon: Store },
    { id: 'appearance', name: 'المظهر', icon: Palette },
    { id: 'seo', name: 'تحسين محركات البحث', icon: Globe },
    { id: 'payments', name: 'المدفوعات', icon: CreditCard },
    { id: 'shipping', name: 'الشحن والتوصيل', icon: Truck },
    { id: 'security', name: 'الأمان', icon: Shield }
  ];

  const themes = [
    { id: 'light', name: 'فاتح', preview: 'bg-white border' },
    { id: 'dark', name: 'داكن', preview: 'bg-gray-900 text-white' },
    { id: 'auto', name: 'تلقائي', preview: 'bg-gradient-to-r from-white to-gray-100' }
  ];

  const layouts = [
    { id: 'classic', name: 'كلاسيكي' },
    { id: 'modern', name: 'عصري' },
    { id: 'minimal', name: 'بسيط' },
    { id: 'enterprise', name: 'مؤسسي' }
  ];

  const handleSettingsChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // Save settings logic here
    toast.success('تم حفظ إعدادات المتجر بنجاح');
  };

  const handlePreview = () => {
    // Preview storefront logic here
    toast.info('سيتم فتح معاينة المتجر في نافذة جديدة');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            إعدادات المتجر الإلكتروني
          </h1>
          <p className="text-gray-600">
            تخصيص وإعداد متجرك الإلكتروني
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            معاينة المتجر
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            حفظ الإعدادات
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إعدادات المتجر</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-gray-50 transition-colors ${
                        activeTab === tab.id ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  الإعدادات العامة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">اسم المتجر</Label>
                    <Input
                      id="storeName"
                      value={settings.general.storeName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingsChange('general', 'storeName', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="storeSlogan">شعار المتجر</Label>
                    <Input
                      id="storeSlogan"
                      value={settings.general.storeSlogan}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSettingsChange('general', 'storeSlogan', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">وصف المتجر</Label>
                  <Textarea
                    id="storeDescription"
                    value={settings.general.storeDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleSettingsChange('general', 'storeDescription', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.general.contactEmail}
                        onChange={(e) => handleSettingsChange('general', 'contactEmail', e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">رقم الهاتف</Label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactPhone"
                        value={settings.general.contactPhone}
                        onChange={(e) => handleSettingsChange('general', 'contactPhone', e.target.value)}
                        className="pr-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      value={settings.general.address}
                      onChange={(e) => handleSettingsChange('general', 'address', e.target.value)}
                      className="pr-10"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weekdayHours">ساعات العمل (أيام الأسبوع)</Label>
                    <div className="relative">
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="weekdayHours"
                        value={settings.general.businessHours.weekdays}
                        onChange={(e) => handleSettingsChange('general', 'businessHours', {
                          ...settings.general.businessHours,
                          weekdays: e.target.value
                        })}
                        className="pr-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weekendHours">ساعات العمل (عطلة نهاية الأسبوع)</Label>
                    <div className="relative">
                      <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="weekendHours"
                        value={settings.general.businessHours.weekend}
                        onChange={(e) => handleSettingsChange('general', 'businessHours', {
                          ...settings.general.businessHours,
                          weekend: e.target.value
                        })}
                        className="pr-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  إعدادات المظهر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">الألوان</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>اللون الأساسي</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleSettingsChange('appearance', 'primaryColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={settings.appearance.primaryColor}
                          onChange={(e) => handleSettingsChange('appearance', 'primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>اللون الثانوي</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleSettingsChange('appearance', 'secondaryColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={settings.appearance.secondaryColor}
                          onChange={(e) => handleSettingsChange('appearance', 'secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>لون التمييز</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={settings.appearance.accentColor}
                          onChange={(e) => handleSettingsChange('appearance', 'accentColor', e.target.value)}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={settings.appearance.accentColor}
                          onChange={(e) => handleSettingsChange('appearance', 'accentColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">المظهر</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleSettingsChange('appearance', 'theme', theme.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          settings.appearance.theme === theme.id ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <div className={`w-full h-16 rounded mb-2 ${theme.preview}`}></div>
                        <div className="text-sm font-medium">{theme.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">التخطيط</h3>
                  <Select value={settings.appearance.layout} onValueChange={(value) => handleSettingsChange('appearance', 'layout', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {layouts.map((layout) => (
                        <SelectItem key={layout.id} value={layout.id}>
                          {layout.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">الشعار والصور</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>شعار المتجر</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">اسحب الشعار هنا أو انقر لاختيار</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          اختيار الشعار
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>صورة الغلاف</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">اسحب صورة الغلاف هنا أو انقر لاختيار</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          اختيار الصورة
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  تحسين محركات البحث (SEO)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">عنوان الصفحة (Meta Title)</Label>
                  <Input
                    id="metaTitle"
                    value={settings.seo.metaTitle}
                    onChange={(e) => handleSettingsChange('seo', 'metaTitle', e.target.value)}
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">
                    {settings.seo.metaTitle.length}/60 حرف
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">وصف الصفحة (Meta Description)</Label>
                  <Textarea
                    id="metaDescription"
                    value={settings.seo.metaDescription}
                    onChange={(e) => handleSettingsChange('seo', 'metaDescription', e.target.value)}
                    rows={3}
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500">
                    {settings.seo.metaDescription.length}/160 حرف
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">الكلمات المفتاحية</Label>
                  <Input
                    id="keywords"
                    value={settings.seo.keywords}
                    onChange={(e) => handleSettingsChange('seo', 'keywords', e.target.value)}
                    placeholder="افصل الكلمات بفاصلة"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      value={settings.seo.googleAnalytics}
                      onChange={(e) => handleSettingsChange('seo', 'googleAnalytics', e.target.value)}
                      placeholder="GA-XXXXXXXXX-X"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facebookPixel">Facebook Pixel ID</Label>
                    <Input
                      id="facebookPixel"
                      value={settings.seo.facebookPixel}
                      onChange={(e) => handleSettingsChange('seo', 'facebookPixel', e.target.value)}
                      placeholder="1234567890123456"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="structuredData"
                    checked={settings.seo.structuredData}
                    onChange={(e) => handleSettingsChange('seo', 'structuredData', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="structuredData">تفعيل البيانات المهيكلة (Structured Data)</Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  إعدادات المدفوعات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">طرق الدفع المقبولة</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'acceptCash', label: 'الدفع نقداً', icon: DollarSign },
                      { key: 'acceptCards', label: 'البطاقات الائتمانية', icon: CreditCard },
                      { key: 'acceptMada', label: 'مدى', icon: CreditCard },
                      { key: 'acceptApplePay', label: 'Apple Pay', icon: Smartphone },
                      { key: 'acceptStcPay', label: 'STC Pay', icon: Smartphone },
                      { key: 'acceptBankTransfer', label: 'التحويل البنكي', icon: Users }
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <div key={method.key} className="flex items-center space-x-2 rtl:space-x-reverse">
                          <input
                            type="checkbox"
                            id={method.key}
                            checked={settings.payments[method.key as keyof typeof settings.payments] as boolean}
                            onChange={(e) => handleSettingsChange('payments', method.key, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={method.key} className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {method.label}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">العملة</Label>
                    <Select value={settings.payments.currency} onValueChange={(value) => handleSettingsChange('payments', 'currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
                        <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                        <SelectItem value="EUR">يورو (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">معدل الضريبة (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      value={settings.payments.taxRate}
                      onChange={(e) => handleSettingsChange('payments', 'taxRate', parseFloat(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumOrder">الحد الأدنى للطلب</Label>
                    <div className="relative">
                      <Input
                        id="minimumOrder"
                        type="number"
                        value={settings.payments.minimumOrder}
                        onChange={(e) => handleSettingsChange('payments', 'minimumOrder', parseFloat(e.target.value))}
                        className="pl-12"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ر.س
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Settings */}
          {activeTab === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  إعدادات الشحن والتوصيل
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingThreshold">الحد الأدنى للشحن المجاني</Label>
                    <div className="relative">
                      <Input
                        id="freeShippingThreshold"
                        type="number"
                        value={settings.shipping.freeShippingThreshold}
                        onChange={(e) => handleSettingsChange('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                        className="pl-12"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ر.س
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryTime">مدة التوصيل</Label>
                    <Input
                      id="deliveryTime"
                      value={settings.shipping.deliveryTime}
                      onChange={(e) => handleSettingsChange('shipping', 'deliveryTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="localDeliveryFee">رسوم التوصيل المحلي</Label>
                    <div className="relative">
                      <Input
                        id="localDeliveryFee"
                        type="number"
                        value={settings.shipping.localDeliveryFee}
                        onChange={(e) => handleSettingsChange('shipping', 'localDeliveryFee', parseFloat(e.target.value))}
                        className="pl-12"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ر.س
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regionalDeliveryFee">رسوم التوصيل الإقليمي</Label>
                    <div className="relative">
                      <Input
                        id="regionalDeliveryFee"
                        type="number"
                        value={settings.shipping.regionalDeliveryFee}
                        onChange={(e) => handleSettingsChange('shipping', 'regionalDeliveryFee', parseFloat(e.target.value))}
                        className="pl-12"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ر.س
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expressDeliveryFee">رسوم التوصيل السريع</Label>
                    <div className="relative">
                      <Input
                        id="expressDeliveryFee"
                        type="number"
                        value={settings.shipping.expressDeliveryFee}
                        onChange={(e) => handleSettingsChange('shipping', 'expressDeliveryFee', parseFloat(e.target.value))}
                        className="pl-12"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ر.س
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryAreas">مناطق التوصيل</Label>
                  <Textarea
                    id="deliveryAreas"
                    value={settings.shipping.deliveryAreas}
                    onChange={(e) => handleSettingsChange('shipping', 'deliveryAreas', e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    id="trackingEnabled"
                    checked={settings.shipping.trackingEnabled}
                    onChange={(e) => handleSettingsChange('shipping', 'trackingEnabled', e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="trackingEnabled">تفعيل تتبع الشحنات</Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  إعدادات الأمان
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="twoFactorAuth"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingsChange('security', 'twoFactorAuth', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="twoFactorAuth">تفعيل المصادقة الثنائية</Label>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="sslEnabled"
                      checked={settings.security.sslEnabled}
                      onChange={(e) => handleSettingsChange('security', 'sslEnabled', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="sslEnabled">تفعيل شهادة SSL</Label>
                  </div>

                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      id="maintenanceMode"
                      checked={settings.security.maintenanceMode}
                      onChange={(e) => handleSettingsChange('security', 'maintenanceMode', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="maintenanceMode">وضع الصيانة</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>تكرار النسخ الاحتياطي</Label>
                  <Select value={settings.security.backupFrequency} onValueChange={(value) => handleSettingsChange('security', 'backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">يومياً</SelectItem>
                      <SelectItem value="weekly">أسبوعياً</SelectItem>
                      <SelectItem value="monthly">شهرياً</SelectItem>
                      <SelectItem value="manual">يدوي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy">سياسة الخصوصية</Label>
                  <Textarea
                    id="privacyPolicy"
                    value={settings.security.privacyPolicy}
                    onChange={(e) => handleSettingsChange('security', 'privacyPolicy', e.target.value)}
                    rows={5}
                    placeholder="اكتب سياسة الخصوصية هنا..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termsOfService">شروط الخدمة</Label>
                  <Textarea
                    id="termsOfService"
                    value={settings.security.termsOfService}
                    onChange={(e) => handleSettingsChange('security', 'termsOfService', e.target.value)}
                    rows={5}
                    placeholder="اكتب شروط الخدمة هنا..."
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
