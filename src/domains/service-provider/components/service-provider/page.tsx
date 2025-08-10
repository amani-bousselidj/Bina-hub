'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Briefcase, Users, Star, DollarSign, MessageSquare, Settings } from 'lucide-react';

export default function ServiceProviderDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            لوحة تحكم مزود الخدمة
          </h1>
          <p className="text-gray-600">
            إدارة شاملة لخدماتك ومشاريعك
          </p>
        </div>
        <Button>
          <Settings className="h-4 w-4 mr-2" />
          الإعدادات
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات جديدة</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 عروض نشطة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مشاريع مكتملة</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+3 هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125,000 ر.س</div>
            <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التقييم</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              4.8
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">من 24 تقييم</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button className="h-16 flex-col">
          <MessageSquare className="h-6 w-6 mb-2" />
          طلبات الخدمة
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Users className="h-6 w-6 mb-2" />
          إدارة العملاء
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <DollarSign className="h-6 w-6 mb-2" />
          المدفوعات
        </Button>
        <Button variant="outline" className="h-16 flex-col">
          <Star className="h-6 w-6 mb-2" />
          التقييمات
        </Button>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>النشاط الأخير</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">طلب خدمة جديد: بناء فيلا سكنية</h4>
                <p className="text-gray-600 text-sm">أحمد محمد - الرياض</p>
              </div>
              <Badge>جديد</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">تم استلام دفعة: 25,000 ر.س</h4>
                <p className="text-gray-600 text-sm">مشروع تجديد المكتب</p>
              </div>
              <Badge className="bg-green-500">مكتمل</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">تقييم جديد: 5 نجوم</h4>
                <p className="text-gray-600 text-sm">فاطمة عبدالله</p>
              </div>
              <Badge className="bg-yellow-500">تقييم</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



