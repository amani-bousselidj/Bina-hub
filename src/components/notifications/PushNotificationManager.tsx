// @ts-nocheck
'use client';

import { useEffect, useState } from 'react';
import { Bell, BellOff, Settings, Check, X, AlertTriangle } from 'lucide-react';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  timestamp: number;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

interface NotificationSettings {
  enabled: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
  promotions: boolean;
  systemUpdates: boolean;
  deliveryUpdates: boolean;
}

export class PushNotificationService {
  private static instance: PushNotificationService;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications are not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', this.registration);
      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribeUser(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    if (!this.registration) {
      return null;
    }

    try {
      const applicationServerKey = this.urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'default-vapid-key'
      );

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      console.log('User subscribed:', subscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);
      
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe user:', error);
      return null;
    }
  }

  async unsubscribeUser(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        // Remove subscription from server
        await this.removeSubscriptionFromServer(subscription);
        console.log('User unsubscribed');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe user:', error);
      return false;
    }
  }

  async sendNotification(notification: PushNotification): Promise<void> {
    if (Notification.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/icons/icon-192x192.png',
        badge: notification.badge || '/icons/icon-72x72.png',
        tag: notification.tag,
        data: notification.data,
        actions: notification.actions,
        requireInteraction: true
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  async getSubscription(): Promise<PushSubscription | null> {
    if (!this.registration) {
      return null;
    }

    try {
      return await this.registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
    }
  }

  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Failed to remove subscription from server');
      }
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
    }
  }
}

interface PushNotificationManagerProps {
  className?: string;
}

export default function PushNotificationManager({ className = '' }: PushNotificationManagerProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    orderUpdates: true,
    priceAlerts: true,
    promotions: false,
    systemUpdates: true,
    deliveryUpdates: true
  });

  const notificationService = PushNotificationService.getInstance();

  useEffect(() => {
    const initializeNotifications = async () => {
      await notificationService.initialize();
      setPermission(Notification.permission);
      
      const subscription = await notificationService.getSubscription();
      setSubscribed(!!subscription);

      // Load settings from localStorage
      const savedSettings = localStorage.getItem('notificationSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };

    initializeNotifications();
  }, [notificationService]);

  const handleEnableNotifications = async () => {
    setLoading(true);
    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        const subscription = await notificationService.subscribeUser();
        setSubscribed(!!subscription);
        
        if (subscription) {
          setSettings(prev => ({ ...prev, enabled: true }));
          
          // Send welcome notification
          await notificationService.sendNotification({
            id: 'welcome',
            title: 'مرحباً بك في منصة بنا!',
            body: 'تم تفعيل الإشعارات بنجاح. ستصلك إشعارات حول طلباتك وآخر العروض.',
            icon: '/icons/icon-192x192.png',
            timestamp: Date.now()
          });
        }
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    try {
      const success = await notificationService.unsubscribeUser();
      if (success) {
        setSubscribed(false);
        setSettings(prev => ({ ...prev, enabled: false }));
      }
    } catch (error) {
      console.error('Failed to disable notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const sendTestNotification = async () => {
    if (!subscribed) return;

    await notificationService.sendNotification({
      id: 'test',
      title: 'إشعار تجريبي من بنا',
      body: 'هذا إشعار تجريبي للتأكد من عمل النظام بشكل صحيح.',
      icon: '/icons/icon-192x192.png',
      timestamp: Date.now(),
      actions: [
        { action: 'view', title: 'عرض', icon: '/icons/icon-192x192.png' },
        { action: 'dismiss', title: 'إغلاق' }
      ]
    });
  };

  const getStatusColor = () => {
    if (permission === 'granted' && subscribed) return 'text-green-600';
    if (permission === 'denied') return 'text-red-600';
    return 'text-yellow-600';
  };

  const getStatusText = () => {
    if (permission === 'granted' && subscribed) return 'مفعل';
    if (permission === 'denied') return 'مرفوض';
    if (permission === 'default') return 'غير مفعل';
    return 'معطل';
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            {subscribed ? (
              <Bell className="w-8 h-8 text-green-600" />
            ) : (
              <BellOff className="w-8 h-8 text-gray-400" />
            )}
            {permission === 'denied' && (
              <X className="w-4 h-4 text-red-600 absolute -top-1 -right-1 bg-white rounded-full" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">إشعارات الهاتف</h3>
            <p className={`text-sm ${getStatusColor()}`}>
              الحالة: {getStatusText()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {subscribed && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Status and Actions */}
      <div className="space-y-4">
        {permission === 'default' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">تفعيل الإشعارات</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  فعل الإشعارات لتلقي آخر الأخبار حول طلباتك والعروض الجديدة
                </p>
                <button
                  onClick={handleEnableNotifications}
                  disabled={loading}
                  className="mt-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  {loading ? 'جاري التفعيل...' : 'تفعيل الإشعارات'}
                </button>
              </div>
            </div>
          </div>
        )}

        {permission === 'denied' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <X className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800">الإشعارات مرفوضة</h4>
                <p className="text-red-700 text-sm mt-1">
                  تم رفض إذن الإشعارات. يرجى تفعيلها من إعدادات المتصفح لتلقي الإشعارات.
                </p>
              </div>
            </div>
          </div>
        )}

        {permission === 'granted' && subscribed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-800">الإشعارات مفعلة</h4>
                <p className="text-green-700 text-sm mt-1">
                  ستصلك إشعارات حول طلباتك وآخر العروض والتحديثات المهمة.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={sendTestNotification}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    إرسال إشعار تجريبي
                  </button>
                  <button
                    onClick={handleDisableNotifications}
                    disabled={loading}
                    className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    {loading ? 'جاري الإلغاء...' : 'إلغاء الإشعارات'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {showSettings && subscribed && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4">إعدادات الإشعارات</h4>
            <div className="space-y-3">
              {[
                { key: 'orderUpdates', label: 'تحديثات الطلبات', description: 'إشعارات حول حالة طلباتك' },
                { key: 'priceAlerts', label: 'تنبيهات الأسعار', description: 'إشعارات عند تغيير أسعار المنتجات' },
                { key: 'promotions', label: 'العروض والخصومات', description: 'إشعارات حول العروض الجديدة' },
                { key: 'systemUpdates', label: 'تحديثات النظام', description: 'إشعارات حول التحديثات المهمة' },
                { key: 'deliveryUpdates', label: 'تحديثات التوصيل', description: 'إشعارات حول عملية التوصيل' }
              ].map(({ key, label, description }) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-900">{label}</label>
                    <p className="text-sm text-gray-600">{description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings[key as keyof NotificationSettings] as boolean}
                    onChange={(e) => handleSettingsChange(key as keyof NotificationSettings, e.target.checked)}
                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* BinnaHub Branding */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          خدمة الإشعارات مقدمة من <span className="font-semibold text-green-600">BinnaHub</span>
        </p>
      </div>
    </div>
  );
}




