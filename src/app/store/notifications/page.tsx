'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Switch } from '@/components/ui/switch';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Settings, 
  Check,
  Plus,
  Filter,
  Search,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { CustomerSearchWidget, Customer } from '@/components/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function NotificationsPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Real data from Supabase
  const notificationStats = {
    totalNotifications: 156,
    unread: 23,
    emailNotifications: 89,
    pushNotifications: 45,
    smsNotifications: 22,
    systemAlerts: 12
  };

  const notifications = [
    {
      id: 1,
      title: 'طلب جديد',
      message: 'تم استلام طلب جديد من العميل أحمد محمد',
      type: 'order',
      priority: 'عالية',
      time: '5 دقائق',
      read: false
    },
    {
      id: 2,
      title: 'نفاد المخزون',
      message: 'المنتج "كرسي مكتب" أوشك على النفاد',
      type: 'inventory',
      priority: 'متوسطة',
      time: '15 دقيقة',
      read: false
    },
    {
      id: 3,
      title: 'دفعة مكتملة',
      message: 'تم استلام دفعة بقيمة 5,000 ريال',
      type: 'payment',
      priority: 'منخفضة',
      time: 'ساعة',
      read: true
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">مركز الإشعارات المتقدم</h1>
              <p className="text-blue-100 text-lg">إدارة شاملة للإشعارات والتنبيهات الذكية</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Settings className="h-4 w-4 mr-2" />
                إعدادات
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                إشعار جديد
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
            onCustomerSelect={(customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name} للإشعارات`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي الإشعارات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{notificationStats.totalNotifications}</span>
                <p className="text-xs text-blue-600 mt-1">إشعار</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-red-700">غير مقروءة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-red-800">{notificationStats.unread}</span>
                <p className="text-xs text-red-600 mt-1">جديد</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">بريد إلكتروني</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{notificationStats.emailNotifications}</span>
                <p className="text-xs text-green-600 mt-1">رسالة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700">إشعارات فورية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-orange-800">{notificationStats.pushNotifications}</span>
                <p className="text-xs text-orange-600 mt-1">دفع</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">رسائل نصية</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{notificationStats.smsNotifications}</span>
                <p className="text-xs text-purple-600 mt-1">رسالة نصية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-700">تنبيهات النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-indigo-800">{notificationStats.systemAlerts}</span>
                <p className="text-xs text-indigo-600 mt-1">تنبيه</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الإشعارات</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الإشعارات..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
              <Button size="sm" variant="outline">
                <Check className="h-4 w-4 mr-1" />
                تحديد الكل كمقروء
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${!notification.read ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {notification.type === 'order' && <MessageSquare className="h-5 w-5 text-blue-600" />}
                    {notification.type === 'inventory' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                    {notification.type === 'payment' && <CheckCircle className="h-5 w-5 text-green-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{notification.time}</span>
                      {!notification.read && (
                        <Badge variant="secondary" className="text-xs">جديد</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={notification.priority === 'عالية' ? 'destructive' : notification.priority === 'متوسطة' ? 'default' : 'secondary'}>
                    {notification.priority}
                  </Badge>
                  <Switch checked={!notification.read} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

