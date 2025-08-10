"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { User, Settings, Bell, Shield, Key, CreditCard, Globe, Moon, Sun, Smartphone, Monitor, Building2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import UserProfileForm from '@/components/forms/UserProfileForm';
import ConstructionProfileAdvice from '@/domains/construction/components/ConstructionProfileAdvice';
import { useAuth } from '@/core/shared/auth/AuthProvider';

export const dynamic = 'force-dynamic'

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar?: string;
  memberSince: string;
  accountType: 'free' | 'pro' | 'premium';
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const { user, session, isLoading, error } = useAuth();
  const supabase = createClientComponentClient();
  
  // All useState hooks must be at the top
  const [localUser, setLocalUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    city: '',
    memberSince: '',
    accountType: 'free'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    orderUpdates: true,
    priceAlerts: true
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: 60
  });

  const [preferences, setPreferences] = useState({
    language: 'ar',
    notifications: true,
    marketing: false,
    theme: 'light',
    autoSave: true
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // First try Supabase auth
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          setLocalUser(authUser);
          // Load profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
          
          if (profileData) {
            setProfile({
              name: profileData.name || '',
              email: authUser.email || '',
              phone: profileData.phone || '',
              city: profileData.city || '',
              memberSince: profileData.created_at || authUser.created_at,
              accountType: profileData.account_type || 'free'
            });
          }
          
          // Load user preferences
          const { data: prefData } = await supabase
            .from('user_preferences')
            .select('*')
            .eq('user_id', authUser.id)
            .single();
            
          if (prefData) {
            setPreferences({
              language: prefData.language || 'ar',
              notifications: prefData.notifications ?? true,
              marketing: prefData.marketing ?? false,
              theme: prefData.theme || 'light',
              autoSave: prefData.auto_save ?? true
            });
          }
        } else {
          // Fallback to temp auth cookie
          const getCookie = (name: string) => {
            if (typeof window === 'undefined') return null;
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
          };

          const tempAuthCookie = getCookie('temp_auth_user');
          if (tempAuthCookie) {
            try {
              const parsedUser = JSON.parse(decodeURIComponent(tempAuthCookie));
              setLocalUser({
                email: parsedUser.email,
                account_type: parsedUser.account_type,
                name: parsedUser.name || parsedUser.email?.split('@')[0]
              });
            } catch (e) {
              console.warn('Failed to parse temp auth user:', e);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile?.name || profile.name,
          phone: profile?.phone || profile.phone,
          city: profile?.city || profile.city,
          account_type: profile?.accountType || profile.accountType,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      alert('تم حفظ الملف الشخصي بنجاح');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('حدث خطأ في حفظ الملف الشخصي');
    }
  };

  const handleSavePreferences = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          language: preferences.language,
          notifications: preferences.notifications,
          marketing: preferences.marketing,
          theme: preferences.theme,
          auto_save: preferences.autoSave,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      alert('تم حفظ التفضيلات بنجاح');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('حدث خطأ في حفظ التفضيلات');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleNotificationUpdate = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSecurityUpdate = (key: keyof SecuritySettings, value: any) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getAccountTypeText = (type: string) => {
    switch(type) {
      case 'free': return 'مجاني';
      case 'pro': return 'احترافي';
      case 'premium': return 'مميز';
      default: return 'غير محدد';
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch(type) {
      case 'free': return 'bg-gray-100 text-gray-700';
      case 'pro': return 'bg-blue-100 text-blue-700';
      case 'premium': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: <User className="w-5 h-5" /> },
    { id: 'construction', label: 'دليل البناء', icon: <Building2 className="w-5 h-5" /> },
    { id: 'notifications', label: 'الإشعارات', icon: <Bell className="w-5 h-5" /> },
    { id: 'security', label: 'الأمان', icon: <Shield className="w-5 h-5" /> },
    { id: 'preferences', label: 'التفضيلات', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          إعدادات الحساب
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة معلوماتك الشخصية وتفضيلات الحساب
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <EnhancedCard className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </EnhancedCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <EnhancedCard className="p-6">
              {user ? (
                <UserProfileForm user={user} />
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <Typography variant="body" className="text-gray-600">جاري تحميل البيانات...</Typography>
                </div>
              )}
            </EnhancedCard>
          )}

          {/* Construction Advice Tab */}
          {activeTab === 'construction' && (
            <EnhancedCard className="p-6">
              <ConstructionProfileAdvice />
            </EnhancedCard>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <EnhancedCard className="p-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">إعدادات الإشعارات</Typography>
              
              <div className="space-y-6">
                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">طرق الإشعار</Typography>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'إشعارات البريد الإلكتروني', description: 'تلقي إشعارات عبر البريد الإلكتروني' },
                      { key: 'sms', label: 'إشعارات الرسائل النصية', description: 'تلقي إشعارات عبر الرسائل النصية' },
                      { key: 'push', label: 'الإشعارات الفورية', description: 'تلقي إشعارات فورية عبر التطبيق' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <Typography variant="subheading" size="lg" weight="semibold">{item.label}</Typography>
                          <Typography variant="caption" size="sm" className="text-gray-600">{item.description}</Typography>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof NotificationSettings] as boolean}
                            onChange={() => handleNotificationUpdate(item.key as keyof NotificationSettings)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">أنواع الإشعارات</Typography>
                  <div className="space-y-4">
                    {[
                      { key: 'orderUpdates', label: 'تحديثات الطلبات', description: 'إشعارات حول حالة طلباتك' },
                      { key: 'priceAlerts', label: 'تنبيهات الأسعار', description: 'إشعارات عند تغير أسعار المنتجات المفضلة' },
                      { key: 'marketing', label: 'العروض التسويقية', description: 'إشعارات حول العروض والخصومات' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <Typography variant="subheading" size="lg" weight="semibold">{item.label}</Typography>
                          <Typography variant="caption" size="sm" className="text-gray-600">{item.description}</Typography>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof NotificationSettings] as boolean}
                            onChange={() => handleNotificationUpdate(item.key as keyof NotificationSettings)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </EnhancedCard>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <EnhancedCard className="p-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">إعدادات الأمان</Typography>
              
              <div className="space-y-6">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <Typography variant="subheading" size="lg" weight="semibold">المصادقة الثنائية</Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">حماية إضافية لحسابك</Typography>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactor}
                        onChange={(e) => handleSecurityUpdate('twoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {security.twoFactor && (
                    <Button variant="outline" className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-50" onClick={() => alert('Button clicked')}>
                      إعداد المصادقة الثنائية
                    </Button>
                  )}
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="subheading" size="lg" weight="semibold">تنبيهات تسجيل الدخول</Typography>
                      <Typography variant="caption" size="sm" className="text-gray-600">إشعار عند تسجيل دخول جديد</Typography>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.loginAlerts}
                        onChange={(e) => handleSecurityUpdate('loginAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-2">مهلة انتهاء الجلسة</Typography>
                  <Typography variant="caption" size="sm" className="text-gray-600 mb-4">
                    مدة بقاء الجلسة نشطة (بالدقائق)
                  </Typography>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) => handleSecurityUpdate('sessionTimeout', parseInt(e.target.value))}
                    className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={30}>30 دقيقة</option>
                    <option value={60}>60 دقيقة</option>
                    <option value={120}>120 دقيقة</option>
                    <option value={0}>بدون انتهاء</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                   onClick={() => alert('Button clicked')}>
                    <Key className="w-4 h-4" />
                    تغيير كلمة المرور
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-50"
                   onClick={() => alert('Button clicked')}>
                    تسجيل الخروج من جميع الأجهزة
                  </Button>
                </div>
              </div>
            </EnhancedCard>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <EnhancedCard className="p-6">
              <Typography variant="subheading" size="xl" weight="semibold" className="mb-6">التفضيلات</Typography>
              
              <div className="space-y-6">
                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">المظهر</Typography>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'فاتح', icon: <Sun className="w-5 h-5" /> },
                      { value: 'dark', label: 'داكن', icon: <Moon className="w-5 h-5" /> },
                      { value: 'auto', label: 'تلقائي', icon: <Monitor className="w-5 h-5" /> }
                    ].map((option) => (
                      <div
                        key={option.value}
                        onClick={() => setPreferences(prev => ({ ...prev, theme: option.value }))}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          preferences.theme === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {option.icon}
                          <Typography variant="subheading" size="lg" weight="semibold">{option.label}</Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">اللغة</Typography>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ar">العربية</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="pt-6 border-t">
                  <Button
                    onClick={handleSavePreferences}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    حفظ التفضيلات
                  </Button>
                </div>

                <div>
                  <Typography variant="subheading" size="lg" weight="semibold" className="mb-4">إدارة البيانات</Typography>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                     onClick={() => alert('Button clicked')}>
                      تنزيل بياناتي
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-700 hover:bg-red-50"
                     onClick={() => alert('Button clicked')}>
                      حذف الحساب
                    </Button>
                  </div>
                </div>
              </div>
            </EnhancedCard>
          )}
        </div>
      </div>

      {/* Floating Help */}
      <Link href="/user/help-center" className="fixed bottom-8 left-8 bg-blue-600 text-white rounded-full shadow-lg px-5 py-3 hover:bg-blue-700 z-50">
        مساعدة؟
      </Link>
    </div>
  );
}




