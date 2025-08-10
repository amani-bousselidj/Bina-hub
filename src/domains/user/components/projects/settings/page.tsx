'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Database,
  HelpCircle,
  Save,
  X
} from 'lucide-react';

export default function SettingsPage() {
  const { user, session, isLoading, error } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: 'ar',
    autoSave: true,
    currency: 'SAR'
  });

  const settingsTabs = [
    { id: 'profile', title: 'الملف الشخصي', icon: <User className="w-5 h-5" /> },
    { id: 'notifications', title: 'الإشعارات', icon: <Bell className="w-5 h-5" /> },
    { id: 'privacy', title: 'الخصوصية', icon: <Shield className="w-5 h-5" /> },
    { id: 'appearance', title: 'المظهر', icon: <Palette className="w-5 h-5" /> },
    { id: 'data', title: 'البيانات', icon: <Database className="w-5 h-5" /> },
    { id: 'help', title: 'المساعدة', icon: <HelpCircle className="w-5 h-5" /> },
  ];

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved:', settings);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">حدث خطأ في تحميل البيانات</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="أدخل رقم هاتفك"
              />
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subheading" size="sm" weight="medium">إشعارات البريد الإلكتروني</Typography>
                <Typography variant="body" size="sm" className="text-gray-600">تلقي الإشعارات عبر البريد الإلكتروني</Typography>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="subheading" size="sm" weight="medium">الحفظ التلقائي</Typography>
                <Typography variant="body" size="sm" className="text-gray-600">حفظ التغييرات تلقائياً</Typography>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, autoSave: !prev.autoSave }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        );
      
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اللغة</label>
              <select
                value={settings.language}
                onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="SAR">ريال سعودي (SAR)</option>
                <option value="USD">دولار أمريكي (USD)</option>
                <option value="EUR">يورو (EUR)</option>
              </select>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <Typography variant="body" className="text-gray-600">المحتوى قيد التطوير</Typography>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 font-tajawal">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            رجوع
          </Button>
          <div>
            <Typography variant="heading" size="2xl" weight="bold" className="text-gray-800">
              الإعدادات
            </Typography>
            <Typography variant="body" className="text-gray-600">
              إدارة إعدادات التطبيق والملف الشخصي
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <EnhancedCard variant="elevated" className="p-4">
              <div className="space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                      activeTab === tab.id 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {tab.icon}
                    <Typography variant="body" size="sm" weight="medium">
                      {tab.title}
                    </Typography>
                  </button>
                ))}
              </div>
            </EnhancedCard>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <EnhancedCard variant="elevated" className="p-6">
              <div className="mb-6">
                <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-800">
                  {settingsTabs.find(tab => tab.id === activeTab)?.title}
                </Typography>
              </div>

              {renderTabContent()}

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  إلغاء
                </Button>
                <Button
                  variant="filled"
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  حفظ التغييرات
                </Button>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </div>
    </main>
  );
}



