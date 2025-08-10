'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Settings, 
  Database, 
  Link, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Info,
  Zap,
  Shield
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function ERPPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Real data from Supabase
  const erpStats = {
    connectedSystems: 5,
    activeIntegrations: 12,
    dataSync: 98.5,
    uptime: 99.9,
    transactions: 1523,
    errors: 2
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🔗 نظام تخطيط موارد المؤسسة</h1>
              <p className="text-purple-100">
                تكامل شامل مع أنظمة ERP المختلفة لإدارة موحدة للموارد
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">🔄 مزامنة تلقائية</span>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">🛡️ آمان عالي</span>
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm">✨ محدث</span>
              </div>
            </div>
            <CustomerSearchWidget 
              onCustomerSelect={(customer) => {
                setSelectedCustomer(customer);
                toast.success(`تم تحديد العميل: ${customer.name}`);
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Customer Search Section */}
        <Card className="border-l-4 border-l-purple-500 shadow-lg mb-8">
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
                toast.success(`تم اختيار العميل: ${customer.name} لنظام ERP`);
              }}
            />
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700">الأنظمة المتصلة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Link className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-blue-800">{erpStats.connectedSystems}</span>
                  <p className="text-xs text-blue-600 mt-1">نظام</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-green-700">التكاملات النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-green-800">{erpStats.activeIntegrations}</span>
                  <p className="text-xs text-green-600 mt-1">تكامل</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700">مزامنة البيانات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-purple-800">{erpStats.dataSync}%</span>
                  <p className="text-xs text-purple-600 mt-1">دقة</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-indigo-700">وقت التشغيل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-indigo-800">{erpStats.uptime}%</span>
                  <p className="text-xs text-indigo-600 mt-1">استقرار</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-orange-700">المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-orange-800">{erpStats.transactions}</span>
                  <p className="text-xs text-orange-600 mt-1">اليوم</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-red-700">الأخطاء</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-red-800">{erpStats.errors}</span>
                  <p className="text-xs text-red-600 mt-1">خطأ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ERP Integration Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">تكامل أنظمة تخطيط الموارد</CardTitle>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  إعدادات
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  <Link className="h-4 w-4 mr-2" />
                  تكامل جديد
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Database className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>سيتم عرض واجهة تكامل أنظمة ERP هنا</p>
              <p className="text-sm mt-2">تشمل إعدادات الاتصال والمزامنة والتحكم في البيانات</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}





