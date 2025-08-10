'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShoppingCart, Search, Filter, Star, Package, Truck, Shield, Store, Eye, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface StorefrontTheme {
  id: string;
  name: string;
  description: string;
  preview_image: string;
  is_active: boolean;
  features: string[];
}

interface StorefrontSettings {
  store_name: string;
  store_description: string;
  logo_url?: string;
  banner_url?: string;
  primary_color: string;
  secondary_color: string;
  social_links: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  contact_info: {
    phone: string;
    email: string;
    address: string;
  };
}

const []: StorefrontTheme[] = [
  {
    id: 'modern-arabic',
    name: 'العربية الحديثة',
    description: 'تصميم حديث مناسب للأسواق العربية مع دعم كامل للغة العربية',
    preview_image: '/themes/modern-arabic.jpg',
    is_active: true,
    features: ['دعم RTL', 'تصميم متجاوب', 'ألوان عربية']
  },
  {
    id: 'classic-business',
    name: 'الأعمال الكلاسيكية',
    description: 'تصميم كلاسيكي وأنيق مناسب للشركات والأعمال التجارية',
    preview_image: '/themes/classic-business.jpg',
    is_active: false,
    features: ['تصميم احترافي', 'ألوان هادئة', 'سهل التنقل']
  },
  {
    id: 'minimal-clean',
    name: 'البساطة النظيفة',
    description: 'تصميم بسيط ونظيف يركز على المنتجات',
    preview_image: '/themes/minimal-clean.jpg',
    is_active: false,
    features: ['تصميم بسيط', 'سرعة التحميل', 'تركيز على المحتوى']
  }
];

const defaultSettings: StorefrontSettings = {
  store_name: 'متجر بنا',
  store_description: 'متجرك الإلكتروني المتكامل لجميع احتياجاتك',
  primary_color: '#3B82F6',
  secondary_color: '#10B981',
  social_links: {
    facebook: 'https://facebook.com/binna',
    twitter: 'https://twitter.com/binna',
    instagram: 'https://instagram.com/binna'
  },
  contact_info: {
    phone: '+966501234567',
    email: 'info@binna.store',
    address: 'الرياض، المملكة العربية السعودية'
  }
};

export default function StorefrontPage() {
const supabase = createClientComponentClient();

  const [themes, setThemes] = useState<StorefrontTheme[]>([]);
  const [settings, setSettings] = useState<StorefrontSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'themes' | 'settings' | 'preview'>('themes');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleThemeActivate = (themeId: string) => {
    setThemes(themes.map(theme => ({
      ...theme,
      is_active: theme.id === themeId
    })));
  };

  const handleSettingsUpdate = (key: keyof StorefrontSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const activeTheme = themes.find(theme => theme.is_active);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">واجهة المتجر</h1>
            <p className="text-gray-600 mt-2">إدارة تصميم ومظهر متجرك الإلكتروني</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
              <Eye size={16} />
              معاينة المتجر
            </Button>
            <Button className="flex items-center gap-2" onClick={() => alert('Button clicked')}>
              <Settings size={16} />
              إعدادات متقدمة
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'themes'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            القوالب
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'settings'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            الإعدادات
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'preview'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            المعاينة
          </button>
        </div>

        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store size={20} />
                  قوالب المتجر
                </CardTitle>
                <CardDescription>
                  اختر القالب المناسب لمتجرك من مجموعة متنوعة من التصاميم
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {themes.map((theme) => (
                    <Card key={theme.id} className={`relative ${theme.is_active ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg flex items-center justify-center">
                        <Store size={48} className="text-blue-500" />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{theme.name}</h3>
                          {theme.is_active && (
                            <Badge className="bg-green-100 text-green-800">نشط</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{theme.description}</p>
                        <div className="space-y-2 mb-4">
                          {theme.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              <span className="text-xs text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {!theme.is_active && (
                            <Button 
                              size="sm" 
                              onClick={() => handleThemeActivate(theme.id)}
                              className="flex-1"
                            >
                              تفعيل
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => alert('Button clicked')}>
                            معاينة
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات المتجر الأساسية</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اسم المتجر</label>
                    <Input
                      value={settings.store_name}
                      onChange={(e) => handleSettingsUpdate('store_name', e.target.value)}
                      placeholder="أدخل اسم المتجر"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">وصف المتجر</label>
                    <Input
                      value={settings.store_description}
                      onChange={(e) => handleSettingsUpdate('store_description', e.target.value)}
                      placeholder="وصف مختصر للمتجر"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">اللون الأساسي</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.primary_color}
                        onChange={(e) => handleSettingsUpdate('primary_color', e.target.value)}
                        className="w-12 h-10 border rounded"
                      />
                      <Input
                        value={settings.primary_color}
                        onChange={(e) => handleSettingsUpdate('primary_color', e.target.value)}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">اللون الثانوي</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.secondary_color}
                        onChange={(e) => handleSettingsUpdate('secondary_color', e.target.value)}
                        className="w-12 h-10 border rounded"
                      />
                      <Input
                        value={settings.secondary_color}
                        onChange={(e) => handleSettingsUpdate('secondary_color', e.target.value)}
                        placeholder="#10B981"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>معلومات الاتصال</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                    <Input
                      value={settings.contact_info.phone}
                      onChange={(e) => handleSettingsUpdate('contact_info', {
                        ...settings.contact_info,
                        phone: e.target.value
                      })}
                      placeholder="+966501234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                    <Input
                      value={settings.contact_info.email}
                      onChange={(e) => handleSettingsUpdate('contact_info', {
                        ...settings.contact_info,
                        email: e.target.value
                      })}
                      placeholder="info@store.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">العنوان</label>
                    <Input
                      value={settings.contact_info.address}
                      onChange={(e) => handleSettingsUpdate('contact_info', {
                        ...settings.contact_info,
                        address: e.target.value
                      })}
                      placeholder="العنوان"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>روابط التواصل الاجتماعي</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">فيسبوك</label>
                    <Input
                      value={settings.social_links.facebook || ''}
                      onChange={(e) => handleSettingsUpdate('social_links', {
                        ...settings.social_links,
                        facebook: e.target.value
                      })}
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">تويتر</label>
                    <Input
                      value={settings.social_links.twitter || ''}
                      onChange={(e) => handleSettingsUpdate('social_links', {
                        ...settings.social_links,
                        twitter: e.target.value
                      })}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">إنستغرام</label>
                    <Input
                      value={settings.social_links.instagram || ''}
                      onChange={(e) => handleSettingsUpdate('social_links', {
                        ...settings.social_links,
                        instagram: e.target.value
                      })}
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="px-8" onClick={() => alert('Button clicked')}>
                حفظ الإعدادات
              </Button>
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>معاينة المتجر</CardTitle>
                <CardDescription>
                  معاينة شكل متجرك مع القالب النشط والإعدادات الحالية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  {/* Real data from Supabase */}
                  <div className="bg-white" style={{ color: settings.primary_color }}>
                    {/* Header */}
                    <div className="bg-white border-b p-4">
                      <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">{settings.store_name}</h1>
                        <div className="flex items-center gap-4">
                          <Search size={20} />
                          <ShoppingCart size={20} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{settings.store_description}</p>
                    </div>
                    
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-8 text-center">
                      <h2 className="text-2xl font-bold mb-2">مرحباً بك في {settings.store_name}</h2>
                      <p className="mb-4">اكتشف مجموعة واسعة من المنتجات عالية الجودة</p>
                      <Button style={{ backgroundColor: settings.secondary_color }} onClick={() => alert('Button clicked')}>
                        تسوق الآن
                      </Button>
                    </div>
                    
                    {/* Products Grid */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4">منتجاتنا المميزة</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border rounded-lg p-4">
                            <div className="aspect-square bg-gray-100 rounded mb-3 flex items-center justify-center">
                              <Package size={48} className="text-gray-400" />
                            </div>
                            <h4 className="font-medium">منتج تجريبي {i}</h4>
                            <p className="text-sm text-gray-600">وصف المنتج التجريبي</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-bold">299 ر.س</span>
                              <Button size="sm" style={{ backgroundColor: settings.primary_color }} onClick={() => alert('Button clicked')}>
                                إضافة للسلة
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="bg-gray-50 p-6 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center">
                          <Truck size={24} className="mb-2" style={{ color: settings.primary_color }} />
                          <span className="text-sm">شحن مجاني</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Shield size={24} className="mb-2" style={{ color: settings.primary_color }} />
                          <span className="text-sm">دفع آمن</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Star size={24} className="mb-2" style={{ color: settings.primary_color }} />
                          <span className="text-sm">ضمان الجودة</span>
                        </div>
                      </div>
                      <div className="text-center mt-4 text-sm text-gray-600">
                        <p>{settings.contact_info.email} | {settings.contact_info.phone}</p>
                        <p>{settings.contact_info.address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
