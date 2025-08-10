'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { 
  Package, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Download,
  Filter,
  Search,
  Info,
  Plane,
  Ship
} from 'lucide-react';
import { CustomerSearchWidget, type Customer } from '@/components/admin/store/CustomerSearchWidget';
import { toast } from 'sonner';

export default function ShippingPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock shipping data
  const shippingStats = {
    totalShipments: 189,
    inTransit: 34,
    delivered: 145,
    pending: 10,
    averageDeliveryTime: 3.2,
    onTimeDelivery: 94
  };

  const shipments = [
    {
      id: 'SHP001',
      customerName: 'أحمد محمد علي',
      destination: 'الرياض، المملكة العربية السعودية',
      carrier: 'شركة الشحن السريع',
      method: 'شحن بري',
      status: 'في الطريق',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2025-01-27',
      weight: '15 كيلو'
    },
    {
      id: 'SHP002',
      customerName: 'فاطمة حسن',
      destination: 'جدة، المملكة العربية السعودية',
      carrier: 'شركة الطيران للشحن',
      method: 'شحن جوي',
      status: 'تم التسليم',
      trackingNumber: 'TRK123456790',
      estimatedDelivery: '2025-01-25',
      weight: '8 كيلو'
    },
    {
      id: 'SHP003',
      customerName: 'محمد خالد',
      destination: 'الدمام، المملكة العربية السعودية',
      carrier: 'شركة الشحن البحري',
      method: 'شحن بحري',
      status: 'معلق',
      trackingNumber: 'TRK123456791',
      estimatedDelivery: '2025-01-30',
      weight: '50 كيلو'
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
              <h1 className="text-3xl font-bold mb-2">إدارة الشحن واللوجستيات</h1>
              <p className="text-blue-100 text-lg">نظام شامل لإدارة ومتابعة جميع عمليات الشحن والتوصيل</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير التقرير
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Filter className="h-4 w-4 mr-2" />
                تصفية
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                شحنة جديدة
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
              toast.success(`تم اختيار العميل: ${customer.name} للشحن`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي الشحنات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{shippingStats.totalShipments}</span>
                <p className="text-xs text-blue-600 mt-1">شحنة</p>
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
                <span className="text-2xl font-bold text-orange-800">{shippingStats.inTransit}</span>
                <p className="text-xs text-orange-600 mt-1">نشط</p>
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
                <span className="text-2xl font-bold text-green-800">{shippingStats.delivered}</span>
                <p className="text-xs text-green-600 mt-1">مكتمل</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700">معلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-800">{shippingStats.pending}</span>
                <p className="text-xs text-yellow-600 mt-1">انتظار</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">متوسط التسليم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{shippingStats.averageDeliveryTime}</span>
                <p className="text-xs text-purple-600 mt-1">يوم</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-700">التسليم في الوقت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-indigo-800">{shippingStats.onTimeDelivery}%</span>
                <p className="text-xs text-indigo-600 mt-1">دقة</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الشحنات</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الشحنات..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    {shipment.method === 'شحن جوي' && <Plane className="h-6 w-6 text-purple-600" />}
                    {shipment.method === 'شحن بحري' && <Ship className="h-6 w-6 text-purple-600" />}
                    {shipment.method === 'شحن بري' && <Truck className="h-6 w-6 text-purple-600" />}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{shipment.id}</div>
                    <div className="text-sm text-gray-600">{shipment.customerName}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {shipment.trackingNumber} • {shipment.carrier}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">الوجهة</div>
                    <div className="text-sm text-gray-600">{shipment.destination}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">الطريقة</div>
                    <div className="text-sm text-gray-600">{shipment.method}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">الوزن</div>
                    <div className="text-sm text-gray-600">{shipment.weight}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">التسليم المتوقع</div>
                    <div className="text-sm text-gray-600">{shipment.estimatedDelivery}</div>
                  </div>
                  <Badge 
                    variant={
                      shipment.status === 'تم التسليم' ? 'default' : 
                      shipment.status === 'في الطريق' ? 'secondary' : 'secondary'
                    }
                  >
                    {shipment.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    تتبع الشحنة
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





