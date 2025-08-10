'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Users, 
  Settings, 
  Lock, 
  Unlock, 
  UserCheck,
  Plus,
  Edit,
  Search,
  Info,
  Key,
  Eye
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function PermissionsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const permissionStats = {
    totalRoles: 12,
    activeUsers: 45,
    permissions: 28,
    restrictedAccess: 8,
    adminUsers: 5,
    pendingApprovals: 3
  };

  const roles = [
    {
      id: 1,
      name: 'مدير المتجر',
      description: 'صلاحيات كاملة لإدارة المتجر',
      users: 3,
      permissions: ['قراءة', 'كتابة', 'حذف', 'إدارة'],
      active: true
    },
    {
      id: 2,
      name: 'موظف المبيعات',
      description: 'صلاحيات المبيعات والعملاء',
      users: 15,
      permissions: ['قراءة', 'كتابة'],
      active: true
    },
    {
      id: 3,
      name: 'موظف المخزون',
      description: 'إدارة المخزون والمنتجات',
      users: 8,
      permissions: ['قراءة', 'كتابة'],
      active: true
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
              <h1 className="text-3xl font-bold mb-2">إدارة الصلاحيات والأدوار</h1>
              <p className="text-blue-100 text-lg">نظام شامل لإدارة صلاحيات المستخدمين والأدوار</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Eye className="h-4 w-4 mr-2" />
                عرض السجل
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Settings className="h-4 w-4 mr-2" />
                إعدادات الأمان
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                دور جديد
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
              toast.success(`تم اختيار العميل: ${customer.name} لإدارة الصلاحيات`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي الأدوار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{permissionStats.totalRoles}</span>
                <p className="text-xs text-blue-600 mt-1">دور نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">المستخدمون النشطون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{permissionStats.activeUsers}</span>
                <p className="text-xs text-green-600 mt-1">مستخدم</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">الصلاحيات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Key className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{permissionStats.permissions}</span>
                <p className="text-xs text-purple-600 mt-1">صلاحية</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700">وصول محدود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-orange-800">{permissionStats.restrictedAccess}</span>
                <p className="text-xs text-orange-600 mt-1">مقيد</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-700">المديرون</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-indigo-800">{permissionStats.adminUsers}</span>
                <p className="text-xs text-indigo-600 mt-1">مدير</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700">في الانتظار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-800">{permissionStats.pendingApprovals}</span>
                <p className="text-xs text-yellow-600 mt-1">موافقة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>إدارة الأدوار والصلاحيات</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الأدوار..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{role.users} مستخدم</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((permission, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                  <Switch checked={role.active} />
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}






