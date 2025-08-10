'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui'
import { Switch } from '@/components/ui/switch'
import { 
  Settings as SettingsIcon, 
  Shield, 
  Globe,
  Bell,
  Database,
  Users,
  DollarSign,
  Mail,
  Key,
  Server,
  Monitor,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PlatformSettings {
  general: {
    platformName: string
    supportEmail: string
    maintenanceMode: boolean
    newUserRegistration: boolean
  }
  financial: {
    defaultCommission: number
    minimumPayout: number
    paymentProcessing: boolean
    autoPayouts: boolean
  }
  security: {
    twoFactorRequired: boolean
    sessionTimeout: number
    passwordExpiry: number
    ipWhitelist: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    adminAlerts: boolean
  }
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Simulate loading settings
    const timer = setTimeout(() => {
      setSettings({
        general: {
          platformName: 'منصة بنّا',
          supportEmail: 'support@binaa.sa',
          maintenanceMode: false,
          newUserRegistration: true
        },
        financial: {
          defaultCommission: 10,
          minimumPayout: 1000,
          paymentProcessing: true,
          autoPayouts: false
        },
        security: {
          twoFactorRequired: true,
          sessionTimeout: 30,
          passwordExpiry: 90,
          ipWhitelist: false
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          adminAlerts: true
        }
      })
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSave = () => {
    // Simulate saving settings
    alert('تم حفظ الإعدادات بنجاح')
    setHasChanges(false)
  }

  const updateSetting = (section: keyof PlatformSettings, key: string, value: any) => {
    if (!settings) return
    
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value
      }
    })
    setHasChanges(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-muted-foreground">جارٍ تحميل إعدادات المنصة...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إعدادات المنصة</h1>
          <p className="text-muted-foreground">إعدادات شاملة لإدارة منصة بنّا</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              تغييرات غير محفوظة
            </Badge>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className={hasChanges ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <Save className="h-4 w-4 ml-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      {/* System Status */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            حالة النظام
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium">حالة الخادم</p>
              <p className="text-lg font-bold">نشط</p>
            </div>
            <div>
              <p className="text-sm font-medium">وقت التشغيل</p>
              <p className="text-lg font-bold">99.9%</p>
            </div>
            <div>
              <p className="text-sm font-medium">آخر نسخة احتياطية</p>
              <p className="text-lg font-bold">اليوم 03:00</p>
            </div>
            <div>
              <p className="text-sm font-medium">الإصدار</p>
              <p className="text-lg font-bold">v3.2.1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="financial">مالي</TabsTrigger>
          <TabsTrigger value="security">أمان</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="system">النظام</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات العامة</CardTitle>
              <CardDescription>إعدادات أساسية للمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم المنصة</label>
                  <Input
                    value={settings?.general.platformName || ''}
                    onChange={(e) => updateSetting('general', 'platformName', e.target.value)}
                    placeholder="اسم المنصة"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">بريد الدعم الفني</label>
                  <Input
                    type="email"
                    value={settings?.general.supportEmail || ''}
                    onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                    placeholder="support@example.com"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">وضع الصيانة</p>
                    <p className="text-sm text-muted-foreground">تعطيل الوصول للمستخدمين مؤقتاً</p>
                  </div>
                  <Switch
                    checked={settings?.general.maintenanceMode || false}
                    onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">تسجيل المستخدمين الجدد</p>
                    <p className="text-sm text-muted-foreground">السماح بتسجيل حسابات جديدة</p>
                  </div>
                  <Switch
                    checked={settings?.general.newUserRegistration || false}
                    onCheckedChange={(checked) => updateSetting('general', 'newUserRegistration', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>الإعدادات المالية</CardTitle>
              <CardDescription>إعدادات العمولات والمدفوعات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">العمولة الافتراضية (%)</label>
                  <Input
                    type="number"
                    value={settings?.financial.defaultCommission || 0}
                    onChange={(e) => updateSetting('financial', 'defaultCommission', parseFloat(e.target.value))}
                    placeholder="10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">الحد الأدنى للسحب (ريال)</label>
                  <Input
                    type="number"
                    value={settings?.financial.minimumPayout || 0}
                    onChange={(e) => updateSetting('financial', 'minimumPayout', parseFloat(e.target.value))}
                    placeholder="1000"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">معالجة المدفوعات</p>
                    <p className="text-sm text-muted-foreground">تفعيل نظام المدفوعات الإلكترونية</p>
                  </div>
                  <Switch
                    checked={settings?.financial.paymentProcessing || false}
                    onCheckedChange={(checked) => updateSetting('financial', 'paymentProcessing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">الدفع التلقائي</p>
                    <p className="text-sm text-muted-foreground">دفع العمولات تلقائياً عند الوصول للحد الأدنى</p>
                  </div>
                  <Switch
                    checked={settings?.financial.autoPayouts || false}
                    onCheckedChange={(checked) => updateSetting('financial', 'autoPayouts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>إعدادات الحماية والأمان</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">مهلة الجلسة (دقيقة)</label>
                  <Input
                    type="number"
                    value={settings?.security.sessionTimeout || 0}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">انتهاء صلاحية كلمة المرور (يوم)</label>
                  <Input
                    type="number"
                    value={settings?.security.passwordExpiry || 0}
                    onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))}
                    placeholder="90"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">المصادقة الثنائية إجبارية</p>
                    <p className="text-sm text-muted-foreground">إجبار جميع المستخدمين على تفعيل المصادقة الثنائية</p>
                  </div>
                  <Switch
                    checked={settings?.security.twoFactorRequired || false}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorRequired', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">قائمة عناوين IP البيضاء</p>
                    <p className="text-sm text-muted-foreground">تفعيل قائمة عناوين IP المسموحة</p>
                  </div>
                  <Switch
                    checked={settings?.security.ipWhitelist || false}
                    onCheckedChange={(checked) => updateSetting('security', 'ipWhitelist', checked)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-yellow-50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">مفتاح API الرئيسي</p>
                    <p className="text-sm text-yellow-700 mb-3">مفتاح API للوصول للخدمات الخارجية</p>
                    <div className="flex items-center gap-2">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                        readOnly
                        className="font-mono text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button size="sm" onClick={() => alert('إنشاء مفتاح جديد')}>
                        <Key className="h-3 w-3 ml-1" />
                        إعادة إنشاء
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>إعدادات إشعارات النظام والمستخدمين</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">الإشعارات البريدية</p>
                    <p className="text-sm text-muted-foreground">إرسال إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.emailNotifications || false}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">الرسائل النصية</p>
                    <p className="text-sm text-muted-foreground">إرسال إشعارات عبر الرسائل النصية</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.smsNotifications || false}
                    onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">الإشعارات الفورية</p>
                    <p className="text-sm text-muted-foreground">إشعارات فورية في التطبيق والمتصفح</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.pushNotifications || false}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">تنبيهات المدراء</p>
                    <p className="text-sm text-muted-foreground">إشعارات عاجلة للمدراء عند حدوث مشاكل</p>
                  </div>
                  <Switch
                    checked={settings?.notifications.adminAlerts || false}
                    onCheckedChange={(checked) => updateSetting('notifications', 'adminAlerts', checked)}
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">قوالب الإشعارات</h3>
                <div className="space-y-2">
                  {[
                    'ترحيب بالمستخدم الجديد',
                    'تأكيد الطلب',
                    'تحديث حالة الطلب',
                    'إشعار الدفع',
                    'تذكير بالمراجعة'
                  ].map((template, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{template}</span>
                      <Button size="sm" variant="outline" onClick={() => alert(`تعديل قالب: ${template}`)}>
                        تعديل
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النظام</CardTitle>
              <CardDescription>إعدادات الخادم والنسخ الاحتياطية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    النسخ الاحتياطية
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">آخر نسخة احتياطية:</span>
                      <span className="text-sm font-medium">اليوم 03:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">التكرار:</span>
                      <span className="text-sm font-medium">يومياً</span>
                    </div>
                    <Button size="sm" onClick={() => alert('إنشاء نسخة احتياطية الآن')}>
                      إنشاء نسخة احتياطية
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    حالة الخادم
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">استخدام المعالج:</span>
                      <span className="text-sm font-medium">34%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">استخدام الذاكرة:</span>
                      <span className="text-sm font-medium">68%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">مساحة القرص:</span>
                      <span className="text-sm font-medium">12% مستخدم</span>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">إدارة السجلات</h3>
                  <div className="space-y-2">
                    {[
                      { log: 'سجل الأخطاء', size: '2.3 MB', action: 'عرض' },
                      { log: 'سجل المعاملات', size: '15.7 MB', action: 'تحميل' },
                      { log: 'سجل الأمان', size: '892 KB', action: 'عرض' },
                      { log: 'سجل الأداء', size: '5.1 MB', action: 'تحميل' }
                    ].map((log, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium">{log.log}</span>
                          <span className="text-xs text-muted-foreground ml-2">({log.size})</span>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => alert(`${log.action} ${log.log}`)}>
                          {log.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-red-50">
                  <h3 className="font-medium mb-3 text-red-800">المنطقة الخطرة</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="text-red-600 border-red-300" onClick={() => alert('إعادة تشغيل النظام')}>
                      إعادة تشغيل النظام
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-300" onClick={() => alert('مسح الذاكرة المؤقتة')}>
                      مسح الذاكرة المؤقتة
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}




