// @ts-nocheck
/**
 * PWA Install Prompt Component
 * Handles Progressive Web App installation and updates
 */

'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  Bell, 
  RefreshCw, 
  CheckCircle,
  AlertTriangle,
  X,
  Settings,
  Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { usePWA } from '@/core/shared/services/pwa/pwa-manager'

export default function PWAInstallPrompt() {
  const {
    canInstall,
    isInstalled,
    hasUpdate,
    isOnline,
    showInstallPrompt,
    applyUpdate,
    requestNotificationPermission
  } = usePWA()

  const [showPrompt, setShowPrompt] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Show install prompt if app can be installed
    if (canInstall && !isInstalled) {
      setTimeout(() => setShowPrompt(true), 10000) // Show after 10 seconds
    }
  }, [canInstall, isInstalled])

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const handleInstall = async () => {
    try {
      const success = await showInstallPrompt()
      if (success) {
        setShowPrompt(false)
      }
    } catch (error) {
      console.error('Install failed:', error)
    }
  }

  const handleUpdate = async () => {
    setIsUpdating(true)
    try {
      await applyUpdate()
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('فشل في التحديث')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleNotificationPermission = async () => {
    try {
      const permission = await requestNotificationPermission()
      setNotificationPermission(permission)
    } catch (error) {
      console.error('Notification permission failed:', error)
    }
  }

  // Don't show anything if already installed and no updates
  if (isInstalled && !hasUpdate && notificationPermission === 'granted') {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Install Prompt */}
      {showPrompt && canInstall && !isInstalled && (
        <Alert className="border-blue-200 bg-blue-50">
          <Smartphone className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">تثبيت تطبيق بنا</p>
                <p className="text-sm">احصل على تجربة أفضل مع التطبيق المحلي</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleInstall}>
                  <Download className="w-4 h-4 mr-1" />
                  تثبيت
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowPrompt(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Update Available */}
      {hasUpdate && (
        <Alert className="border-orange-200 bg-orange-50">
          <RefreshCw className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">تحديث متاح</p>
                <p className="text-sm">يتوفر إصدار جديد من التطبيق</p>
              </div>
              <Button 
                size="sm" 
                onClick={handleUpdate}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-1" />
                )}
                تحديث
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status */}
      {!isOnline && (
        <Alert className="border-red-200 bg-red-50">
          <WifiOff className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">وضع عدم الاتصال</p>
                <p className="text-sm">أنت تعمل حالياً في وضع عدم الاتصال</p>
              </div>
              <Badge variant="destructive">
                غير متصل
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Notification Permission */}
      {isInstalled && notificationPermission !== 'granted' && (
        <Alert className="border-purple-200 bg-purple-50">
          <Bell className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">تفعيل الإشعارات</p>
                <p className="text-sm">احصل على إشعارات الطلبات والتحديثات</p>
              </div>
              <Button 
                size="sm" 
                onClick={handleNotificationPermission}
                disabled={notificationPermission === 'denied'}
              >
                <Bell className="w-4 h-4 mr-1" />
                {notificationPermission === 'denied' ? 'مرفوض' : 'تفعيل'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* PWA Features Card (for non-installed users) */}
      {!isInstalled && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Zap className="w-5 h-5" />
              مزايا التطبيق المحلي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <WifiOff className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">عمل بدون إنترنت</p>
                  <p className="text-xs text-slate-600">استخدم التطبيق حتى بدون اتصال</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">أداء أسرع</p>
                  <p className="text-xs text-slate-600">تحميل فوري وتجربة سلسة</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">إشعارات فورية</p>
                  <p className="text-xs text-slate-600">تنبيهات الطلبات والتحديثات</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Smartphone className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">تجربة محلية</p>
                  <p className="text-xs text-slate-600">يبدو ويعمل مثل التطبيق المحلي</p>
                </div>
              </div>
            </div>

            {canInstall && (
              <div className="mt-6 pt-4 border-t">
                <Button onClick={handleInstall} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  تثبيت التطبيق الآن
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Installation Success (for installed users) */}
      {isInstalled && (
        <Card className="border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-green-800">تم تثبيت التطبيق بنجاح</p>
                <p className="text-sm text-green-600">
                  يمكنك الآن الوصول للتطبيق من الشاشة الرئيسية
                </p>
              </div>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-green-600">
                  <Wifi className="w-3 h-3 mr-1" />
                  {isOnline ? 'متصل' : 'غير متصل'}
                </Badge>
                {notificationPermission === 'granted' && (
                  <Badge variant="outline" className="text-purple-600">
                    <Bell className="w-3 h-3 mr-1" />
                    مفعل
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Standalone Install Button Component
export function PWAInstallButton() {
  const { canInstall, isInstalled, showInstallPrompt } = usePWA()

  if (isInstalled || !canInstall) {
    return null
  }

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={showInstallPrompt}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
      تثبيت التطبيق
    </Button>
  )
}

// PWA Status Badge Component
export function PWAStatusBadge() {
  const { isInstalled, isOnline, hasUpdate } = usePWA()

  if (!isInstalled) {
    return null
  }

  return (
    <div className="flex gap-1">
      <Badge variant={isOnline ? 'default' : 'destructive'}>
        {isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
        {isOnline ? 'متصل' : 'غير متصل'}
      </Badge>
      
      {hasUpdate && (
        <Badge variant="outline" className="text-orange-600">
          <RefreshCw className="w-3 h-3 mr-1" />
          تحديث متاح
        </Badge>
      )}
    </div>
  )
}







