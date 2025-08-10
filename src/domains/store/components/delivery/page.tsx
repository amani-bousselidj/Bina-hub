'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { 
  Truck, 
  MapPin, 
  Clock, 
  Package, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Filter,
  Download,
  Search,
  Info,
  Route,
  User
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function DeliveryPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const deliveryStats = {
    totalDeliveries: 45,
    inTransit: 12,
    delivered: 28,
    pending: 5,
    averageTime: 35,
    completionRate: 89
  };

  const deliveries = [
    {
      id: 'DEL001',
      customerName: 'أحمد محمد',
      address: 'الرياض، حي النخيل',
      items: 3,
      status: 'في الطريق',
      driver: 'محمد علي',
      estimatedTime: '30 دقيقة',
      priority: 'عالية'
    },
    {
      id: 'DEL002', 
      customerName: 'فاطمة أحمد',
      address: 'جدة، حي الصفا',
      items: 2,
      status: 'تم التسليم',
      driver: 'علي حسن',
      estimatedTime: 'مكتمل',
      priority: 'متوسطة'
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
              <h1 className="text-3xl font-bold mb-2">إدارة التوصيل المتقدمة</h1>
              <p className="text-blue-100 text-lg">نظام إدارة شامل للتوصيل وتتبع الطلبات</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير التقارير
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                طلب توصيل جديد
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
              toast.success(`تم اختيار العميل: ${customer.name} للتوصيل`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي التوصيلات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{deliveryStats.totalDeliveries}</span>
                <p className="text-xs text-blue-600 mt-1">طلب توصيل</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700">في الطريق</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-orange-800">{deliveryStats.inTransit}</span>
                <p className="text-xs text-orange-600 mt-1">توصيل نشط</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">تم التسليم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{deliveryStats.delivered}</span>
                <p className="text-xs text-green-600 mt-1">مكتمل</p>
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
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-800">{deliveryStats.pending}</span>
                <p className="text-xs text-yellow-600 mt-1">معلق</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">متوسط الوقت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Route className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{deliveryStats.averageTime}</span>
                <p className="text-xs text-purple-600 mt-1">دقيقة</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-700">معدل الإنجاز</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-indigo-800">{deliveryStats.completionRate}%</span>
                <p className="text-xs text-indigo-600 mt-1">نسبة النجاح</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deliveries List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة التوصيلات</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في التوصيلات..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deliveries.map((delivery) => (
              <div key={delivery.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{delivery.id}</span>
                    <span className="text-sm text-gray-600">{delivery.customerName}</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{delivery.address}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">السائق: {delivery.driver}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={delivery.status === 'تم التسليم' ? 'default' : 'secondary'}>
                    {delivery.status}
                  </Badge>
                  <div className="text-sm text-gray-600">
                    {delivery.estimatedTime}
                  </div>
                  <Badge variant={delivery.priority === 'عالية' ? 'destructive' : 'outline'}>
                    {delivery.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}





