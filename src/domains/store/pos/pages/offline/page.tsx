'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  Database,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function OfflinePOSPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">نقطة البيع غير متصل</h1>
          <p className="text-gray-600">إدارة المبيعات بدون اتصال بالإنترنت</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">وضع غير متصل</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">الحالة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold">متاح</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">البيانات المحلية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold">محدثة</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">المعاملات المعلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-lg font-bold">5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">آخر مزامنة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              منذ 30 دقيقة
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>إدارة البيانات المحلية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">تحميل المنتجات</p>
                <p className="text-sm text-gray-600">تحديث قاعدة بيانات المنتجات المحلية</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                تحميل
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">رفع المعاملات</p>
                <p className="text-sm text-gray-600">مزامنة المعاملات المحلية مع الخادم</p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                رفع
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">مزامنة تلقائية</p>
                <p className="text-sm text-gray-600">تشغيل المزامنة عند توفر الاتصال</p>
              </div>
              <Button variant="outline" size="sm">
                <Wifi className="h-4 w-4 mr-2" />
                تفعيل
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>المعاملات المعلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">معاملة #{item}</p>
                    <p className="text-sm text-gray-600">قبل {item * 5} دقائق</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">معلق</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات الوضع غير المتصل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">تخزين المعاملات محلياً</label>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">مزامنة تلقائية عند الاتصال</label>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">إشعارات المزامنة</label>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">مساحة التخزين المحلي</label>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">350 MB من 1 GB مستخدمة</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



