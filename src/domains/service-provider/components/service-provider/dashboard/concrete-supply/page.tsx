'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { 
  Truck,
  Calendar,
  Clock,
  MapPin,
  Package,
  Building,
  User,
  Phone,
  CheckCircle,
  AlertTriangle,
  Plus
} from 'lucide-react';

// Type definition for concrete order
interface ConcreteOrder {
  id: number;
  clientName: string;
  contactPerson: string;
  phone: string;
  concreteType: string;
  quantity: number;
  unit: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  status: string;
  totalAmount: number;
  specialRequirements: string;
}

export const dynamic = 'force-dynamic';

export default function ConcreteSuppliers() {
  return (
    <ErrorBoundary>
      <ConcreteSuppliersContent />
    </ErrorBoundary>
  );
}

function ConcreteSuppliersContent() {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();
  const [orders, setOrders] = useState<ConcreteOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      loadOrders();
    }
  }, [isClient]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      // Simulate loading concrete supply orders
      const mockOrders = [
        {
          id: 1,
          clientName: 'شركة النهضة للمقاولات',
          contactPerson: 'م. أحمد العلي',
          phone: '+966501234567',
          concreteType: 'خرسانة مسلحة C30',
          quantity: 150,
          unit: 'متر مكعب',
          deliveryAddress: 'الرياض، حي العليا، مشروع برج التجارة',
          deliveryDate: '2025-07-28',
          deliveryTime: '06:00',
          status: 'pending',
          totalAmount: 22500,
          specialRequirements: 'يجب التوريد في الصباح الباكر'
        },
        {
          id: 2,
          clientName: 'مؤسسة البناء الحديث',
          contactPerson: 'م. سارة محمد',
          phone: '+966501234568',
          concreteType: 'خرسانة عادية C25',
          quantity: 80,
          unit: 'متر مكعب',
          deliveryAddress: 'جدة، حي الصفا، فيلا سكنية',
          deliveryDate: '2025-07-29',
          deliveryTime: '08:00',
          status: 'confirmed',
          totalAmount: 11200,
          specialRequirements: 'توفير مضخة خرسانة'
        },
        {
          id: 3,
          clientName: 'شركة الإنشاء المتطور',
          contactPerson: 'م. محمد السعد',
          phone: '+966501234569',
          concreteType: 'خرسانة عالية المقاومة C40',
          quantity: 200,
          unit: 'متر مكعب',
          deliveryAddress: 'الدمام، الكورنيش، مجمع تجاري',
          deliveryDate: '2025-07-25',
          deliveryTime: '05:30',
          status: 'delivered',
          totalAmount: 32000,
          specialRequirements: 'توريد على دفعات'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'معلق';
      case 'confirmed': return 'مؤكد';
      case 'delivered': return 'تم التوريد';
      case 'cancelled': return 'ملغي';
      default: return 'غير محدد';
    }
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  لوحة موردي الخرسانة
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  إدارة طلبات توريد الخرسانة ومتابعة العمليات
                </p>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  طلب جديد
                </Button>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {pendingOrders} طلب معلق
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">طلبات معلقة</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">طلبات مؤكدة</p>
                  <p className="text-2xl font-bold text-green-600">{confirmedOrders}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()} ر.س</p>
                </div>
                <Truck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>طلبات التوريد الحديثة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{order.clientName}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <User className="w-4 h-4 ml-1" />
                          {order.contactPerson}
                          <Phone className="w-4 h-4 mr-3 ml-1" />
                          {order.phone}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">تفاصيل الخرسانة</h5>
                      <p className="text-sm text-gray-600">{order.concreteType}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {order.quantity} {order.unit}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">موعد التوريد</h5>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 ml-1" />
                        {order.deliveryDate}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4 ml-1" />
                        {order.deliveryTime}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-2">المبلغ الإجمالي</h5>
                      <p className="text-lg font-bold text-green-600">
                        {order.totalAmount.toLocaleString()} ر.س
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">عنوان التوريد</h5>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 ml-1 mt-0.5 flex-shrink-0" />
                      {order.deliveryAddress}
                    </div>
                  </div>

                  {order.specialRequirements && (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-1">متطلبات خاصة</h5>
                      <p className="text-sm text-yellow-700">{order.specialRequirements}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 space-x-reverse mt-4">
                    <Button variant="outline" size="sm">
                      عرض التفاصيل
                    </Button>
                    {order.status === 'pending' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        تأكيد الطلب
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        تحديث الحالة
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




