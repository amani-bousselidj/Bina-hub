'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Shield, 
  Bell,
  Mail,
  Smartphone,
  Globe,
  Database,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  User,
  CreditCard,
  Palette,
  Monitor
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function StoreSettingsPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      marketing: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30
    },
    store: {
      autoBackup: true,
      maintenanceMode: false,
      publicProfile: true
    },
    payment: {
      autoInvoice: true,
      paymentReminders: true,
      multiCurrency: false
    }
  });

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    toast.success('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">إعدادات المتجر المتقدمة</h1>
              <p className="text-blue-100 text-lg">إدارة شاملة لجميع إعدادات وتكوينات المتجر</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير الإعدادات
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <RefreshCw className="h-4 w-4 mr-2" />
                إعادة تحميل
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50" onClick={handleSaveSettings}>
                <Save className="h-4 w-4 mr-2" />
                حفظ الإعدادات
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="border-l-4 border-l-purple-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-purple-700">البحث عن معلومات العملاء والمشاريع</CardTitle>
              <p className="text-sm text-purple-600 mt-1">
                يمكن للمتاجر رؤية معلومات المشاريع لتحديد أو تعريف المشروع للتسليم
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <CustomerSearchWidget
            onCustomerSelect={(customer: any) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name} للإعدادات`);
            }}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Settings */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-blue-700">إعدادات الإشعارات</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">إشعارات البريد الإلكتروني</p>
                  <p className="text-sm text-gray-600">تلقي التحديثات عبر البريد</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">رسائل SMS</p>
                  <p className="text-sm text-gray-600">إشعارات نصية فورية</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications.sms}
                onCheckedChange={(checked) => updateSetting('notifications', 'sms', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">الإشعارات الفورية</p>
                  <p className="text-sm text-gray-600">تنبيهات المتصفح</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">إشعارات التسويق</p>
                  <p className="text-sm text-gray-600">عروض وأخبار المنتجات</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications.marketing}
                onCheckedChange={(checked) => updateSetting('notifications', 'marketing', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-red-700">إعدادات الأمان</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-4 w-4 text-red-600" />
                <div>
                  <p className="font-medium">المصادقة الثنائية</p>
                  <p className="text-sm text-gray-600">طبقة حماية إضافية</p>
                </div>
              </div>
              <Switch
                checked={settings.security.twoFactor}
                onCheckedChange={(checked) => updateSetting('security', 'twoFactor', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="font-medium">تنبيهات تسجيل الدخول</p>
                  <p className="text-sm text-gray-600">إشعار عند دخول جديد</p>
                </div>
              </div>
              <Switch
                checked={settings.security.loginAlerts}
                onCheckedChange={(checked) => updateSetting('security', 'loginAlerts', checked)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">انتهاء صلاحية الجلسة (دقيقة)</label>
              <select 
                value={settings.security.sessionTimeout}
                onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full p-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value={15}>15 دقيقة</option>
                <option value={30}>30 دقيقة</option>
                <option value={60}>ساعة واحدة</option>
                <option value={120}>ساعتان</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Store Settings */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-green-700">إعدادات المتجر</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">النسخ الاحتياطي التلقائي</p>
                  <p className="text-sm text-gray-600">نسخ احتياطي يومي للبيانات</p>
                </div>
              </div>
              <Switch
                checked={settings.store.autoBackup}
                onCheckedChange={(checked) => updateSetting('store', 'autoBackup', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">وضع الصيانة</p>
                  <p className="text-sm text-gray-600">إغلاق مؤقت للمتجر</p>
                </div>
              </div>
              <Switch
                checked={settings.store.maintenanceMode}
                onCheckedChange={(checked) => updateSetting('store', 'maintenanceMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">الملف الشخصي العام</p>
                  <p className="text-sm text-gray-600">إظهار معلومات المتجر للعامة</p>
                </div>
              </div>
              <Switch
                checked={settings.store.publicProfile}
                onCheckedChange={(checked) => updateSetting('store', 'publicProfile', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-purple-700">إعدادات الدفع</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-medium">الفواتير التلقائية</p>
                  <p className="text-sm text-gray-600">إنشاء فواتير تلقائية</p>
                </div>
              </div>
              <Switch
                checked={settings.payment.autoInvoice}
                onCheckedChange={(checked) => updateSetting('payment', 'autoInvoice', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-medium">تذكيرات الدفع</p>
                  <p className="text-sm text-gray-600">إرسال تذكيرات للعملاء</p>
                </div>
              </div>
              <Switch
                checked={settings.payment.paymentReminders}
                onCheckedChange={(checked) => updateSetting('payment', 'paymentReminders', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-medium">دعم العملات المتعددة</p>
                  <p className="text-sm text-gray-600">قبول عملات مختلفة</p>
                </div>
              </div>
              <Switch
                checked={settings.payment.multiCurrency}
                onCheckedChange={(checked) => updateSetting('payment', 'multiCurrency', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>إدارة البيانات والنسخ الاحتياطي</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              استيراد الإعدادات
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              تصدير الإعدادات
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
              إعادة تعيين الإعدادات
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">المتجر نشط</p>
                <p className="text-sm text-green-600">جميع الأنظمة تعمل بشكل طبيعي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">آخر نسخة احتياطية</p>
                <p className="text-sm text-blue-600">منذ 2 ساعات</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800">مستوى الأمان</p>
                <p className="text-sm text-purple-600">عالي - كل الحماية مفعلة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
