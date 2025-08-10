'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/Progress';
import { 
  Truck, 
  Package, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  Phone,
  Mail,
  FileText,
  Star,
  Thermometer,
  CloudRain
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  volume: number;
  grade: string;
  deliveryAddress: string;
  deliveryDate: Date;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'in_production' | 'dispatched' | 'delivered' | 'completed' | 'cancelled';
  totalAmount: number;
  specialInstructions?: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

interface ProductionSchedule {
  id: string;
  batchNumber: string;
  grade: string;
  volume: number;
  orders: string[];
  productionDate: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'quality_check';
  qualityTests: QualityTest[];
}

interface QualityTest {
  id: string;
  testType: string;
  result: string;
  passed: boolean;
  testDate: Date;
  technician: string;
}

interface DeliveryTruck {
  id: string;
  plateNumber: string;
  capacity: number;
  currentLocation?: { lat: number; lng: number; };
  status: 'available' | 'loading' | 'in_transit' | 'unloading' | 'maintenance';
  driver: {
    name: string;
    phone: string;
    license: string;
  };
  currentOrder?: string;
  lastMaintenance: Date;
  nextMaintenance: Date;
}

interface PerformanceMetrics {
  totalOrders: number;
  totalVolume: number;
  revenue: number;
  onTimeDelivery: number;
  qualityScore: number;
  customerSatisfaction: number;
  averageOrderValue: number;
  monthlyGrowth: number;
}

export default function ConcreteSupplierDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [productionSchedule, setProductionSchedule] = useState<ProductionSchedule[]>([]);
  const [trucks, setTrucks] = useState<DeliveryTruck[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [weatherAlert, setWeatherAlert] = useState<{
    type: 'warning' | 'danger';
    message: string;
  } | null>(null);

  // Filters
  const [orderFilter, setOrderFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    checkWeatherConditions();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load real orders from Supabase
      const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
      const supabase = createClientComponentClient();
      const { data: ordersData, error: ordersError } = await supabase
        .from('concrete_orders')
        .select('*')
        .order('createdAt', { ascending: false });
      if (ordersError) throw ordersError;
      setOrders((ordersData || []).map((o: any) => ({
        ...o,
        deliveryDate: new Date(o.deliveryDate),
        createdAt: new Date(o.createdAt)
      })));
      // You can similarly load productionSchedule, trucks, metrics from Supabase if available
      // setProductionSchedule(...)
      // setTrucks(...)
      // setMetrics(...)
    } catch (error) {
      setError('فشل في تحميل بيانات اللوحة');
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkWeatherConditions = async () => {
    try {
      // Mock weather check
      const temperature = 28;
      const precipitation = 0;
      const windSpeed = 12;

      if (temperature > 35) {
        setWeatherAlert({
          type: 'warning',
          message: `درجة الحرارة مرتفعة (${temperature}°م) - قد تحتاج إضافات خاصة للخرسانة`
        });
      } else if (precipitation > 5) {
        setWeatherAlert({
          type: 'danger',
          message: `توقع هطول أمطار (${precipitation}مم) - تجنب عمليات الصب`
        });
      }
    } catch (error) {
      console.error('Error checking weather:', error);
    }
  };

  // Order management functions
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      // Here you would make an API call to update the status
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      setError('فشل في تحديث حالة الطلب');
    }
  };

  const acceptOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'confirmed');
  };

  const rejectOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const dispatchTruck = async (orderId: string, truckId: string) => {
    try {
      // Update order status
      updateOrderStatus(orderId, 'dispatched');
      
      // Update truck status
      setTrucks(prev => prev.map(truck => 
        truck.id === truckId 
          ? { ...truck, status: 'in_transit', currentOrder: orderId }
          : truck
      ));
    } catch (error) {
      setError('فشل في إرسال الشاحنة');
    }
  };

  // Get filtered orders
  const getFilteredOrders = () => {
    let filtered = orders;

    if (orderFilter !== 'all') {
      filtered = filtered.filter(order => order.status === orderFilter);
    }

    if (dateFilter === 'today') {
      const today = new Date();
      filtered = filtered.filter(order => 
        order.deliveryDate.toDateString() === today.toDateString()
      );
    } else if (dateFilter === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      filtered = filtered.filter(order => 
        order.deliveryDate.toDateString() === tomorrow.toDateString()
      );
    }

    return filtered;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'in_production': 'bg-purple-100 text-purple-800',
      'dispatched': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    } as { [key: string]: string };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get status text
  const getStatusText = (status: string) => {
    const statusTexts = {
      'pending': 'في الانتظار',
      'confirmed': 'مؤكد',
      'in_production': 'قيد الإنتاج',
      'dispatched': 'في الطريق',
      'delivered': 'تم التسليم',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    } as { [key: string]: string };
    return statusTexts[status] || status;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  // Mock data functions
  const getMockOrders = (): Order[] => {
    return [
      {
        id: 'ORD-001',
        customerName: 'شركة البناء المتطور',
        customerPhone: '+966501234567',
        volume: 25,
        grade: 'C30',
        deliveryAddress: 'مشروع الواحة، الرياض',
        deliveryDate: new Date(),
        timeSlot: '08:00-12:00',
        status: 'pending',
        totalAmount: 10500,
        specialInstructions: 'يتطلب مضخة خرسانة',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        priority: 'high'
      },
      {
        id: 'ORD-002',
        customerName: 'محمد أحمد العتيبي',
        customerPhone: '+966502345678',
        volume: 15,
        grade: 'C25',
        deliveryAddress: 'فيلا الأمير، حي النرجس',
        deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        timeSlot: '10:00-14:00',
        status: 'confirmed',
        totalAmount: 5700,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        priority: 'medium'
      },
      {
        id: 'ORD-003',
        customerName: 'مؤسسة الإنشاءات الحديثة',
        customerPhone: '+966503456789',
        volume: 50,
        grade: 'C35',
        deliveryAddress: 'برج التجارة، وسط الرياض',
        deliveryDate: new Date(),
        timeSlot: '14:00-18:00',
        status: 'in_production',
        totalAmount: 23000,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        priority: 'high'
      }
    ];
  };

  const getMockProductionSchedule = (): ProductionSchedule[] => {
    return [
      {
        id: 'PROD-001',
        batchNumber: 'B-2024-001',
        grade: 'C30',
        volume: 100,
        orders: ['ORD-001', 'ORD-004'],
        productionDate: new Date(),
        status: 'in_progress',
        qualityTests: [
          {
            id: 'QT-001',
            testType: 'اختبار الانهيار',
            result: '75mm',
            passed: true,
            testDate: new Date(),
            technician: 'أحمد المهندس'
          }
        ]
      },
      {
        id: 'PROD-002',
        batchNumber: 'B-2024-002',
        grade: 'C25',
        volume: 75,
        orders: ['ORD-002'],
        productionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        status: 'scheduled',
        qualityTests: []
      }
    ];
  };

  const getMockTrucks = (): DeliveryTruck[] => {
    return [
      {
        id: 'TRK-001',
        plateNumber: 'ر س ص 1234',
        capacity: 10,
        currentLocation: { lat: 24.7136, lng: 46.6753 },
        status: 'in_transit',
        driver: {
          name: 'عبدالله السعيد',
          phone: '+966501111111',
          license: 'LIC123456'
        },
        currentOrder: 'ORD-003',
        lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'TRK-002',
        plateNumber: 'ر س ص 5678',
        capacity: 8,
        status: 'available',
        driver: {
          name: 'محمد الأحمد',
          phone: '+966502222222',
          license: 'LIC789012'
        },
        lastMaintenance: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'TRK-003',
        plateNumber: 'ر س ص 9012',
        capacity: 12,
        status: 'maintenance',
        driver: {
          name: 'سالم العتيبي',
          phone: '+966503333333',
          license: 'LIC345678'
        },
        lastMaintenance: new Date(),
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    ];
  };

  const getMockMetrics = (): PerformanceMetrics => {
    return {
      totalOrders: 156,
      totalVolume: 2340,
      revenue: 987600,
      onTimeDelivery: 94.5,
      qualityScore: 4.8,
      customerSatisfaction: 4.6,
      averageOrderValue: 6330,
      monthlyGrowth: 12.3
    };
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            لوحة تحكم مورد الخرسانة
          </h1>
          <p className="text-gray-600">
            إدارة الطلبات والإنتاج والتسليم
          </p>
        </div>

        {/* Weather Alert */}
        {weatherAlert && (
          <Alert className={`mb-6 ${
            weatherAlert.type === 'danger' 
              ? 'border-red-200 bg-red-50' 
              : 'border-yellow-200 bg-yellow-50'
          }`}>
            {weatherAlert.type === 'danger' ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : (
              <Thermometer className="h-4 w-4 text-yellow-600" />
            )}
            <AlertDescription className={
              weatherAlert.type === 'danger' ? 'text-red-800' : 'text-yellow-800'
            }>
              {weatherAlert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">الإيرادات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(metrics.revenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Truck className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">التسليم في الوقت</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.onTimeDelivery}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">تقييم الجودة</p>
                    <p className="text-2xl font-bold text-gray-900">{metrics.qualityScore}/5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="orders">إدارة الطلبات</TabsTrigger>
            <TabsTrigger value="production">الإنتاج</TabsTrigger>
            <TabsTrigger value="fleet">الأسطول</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    الطلبات الحديثة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-semibold">{order.customerName}</p>
                          <p className="text-sm text-gray-600">
                            {order.volume} م³ - {order.grade}
                          </p>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold">{formatCurrency(order.totalAmount)}</p>
                          <p className="text-sm text-gray-600">
                            {order.deliveryDate.toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Production Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    حالة الإنتاج
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productionSchedule.slice(0, 3).map((batch) => (
                      <div key={batch.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{batch.batchNumber}</span>
                          <Badge className={getStatusColor(batch.status)}>
                            {getStatusText(batch.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{batch.grade} - {batch.volume} م³</p>
                          <p>{batch.productionDate.toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  إدارة الطلبات
                </CardTitle>
                <div className="flex gap-4 mt-4">
                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">جميع الطلبات</option>
                    <option value="pending">في الانتظار</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="in_production">قيد الإنتاج</option>
                    <option value="dispatched">في الطريق</option>
                  </select>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="all">جميع التواريخ</option>
                    <option value="today">اليوم</option>
                    <option value="tomorrow">غداً</option>
                    <option value="week">هذا الأسبوع</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredOrders().map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{order.customerName}</h4>
                          <p className="text-sm text-gray-600">طلب رقم: {order.id}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Phone className="w-4 h-4" />
                            <span className="text-sm">{order.customerPhone}</span>
                          </div>
                        </div>
                        <div className="text-left">
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                          {order.priority === 'high' && (
                            <Badge className="bg-red-100 text-red-800 mt-1">
                              عالي الأولوية
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <strong>الكمية:</strong> {order.volume} م³
                        </div>
                        <div>
                          <strong>الدرجة:</strong> {order.grade}
                        </div>
                        <div>
                          <strong>التاريخ:</strong> {order.deliveryDate.toLocaleDateString('ar-SA')}
                        </div>
                        <div>
                          <strong>المبلغ:</strong> {formatCurrency(order.totalAmount)}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{order.timeSlot}</span>
                        </div>
                      </div>

                      {order.specialInstructions && (
                        <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                          <strong>تعليمات خاصة:</strong> {order.specialInstructions}
                        </div>
                      )}

                      {order.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => acceptOrder(order.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            قبول
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectOrder(order.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            رفض
                          </Button>
                        </div>
                      )}

                      {order.status === 'confirmed' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'in_production')}
                          >
                            بدء الإنتاج
                          </Button>
                        </div>
                      )}

                      {order.status === 'in_production' && (
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                dispatchTruck(order.id, e.target.value);
                              }
                            }}
                            className="px-3 py-1 border rounded"
                          >
                            <option value="">اختر الشاحنة</option>
                            {trucks
                              .filter(truck => truck.status === 'available')
                              .map(truck => (
                                <option key={truck.id} value={truck.id}>
                                  {truck.plateNumber} - {truck.driver.name}
                                </option>
                              ))
                            }
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Production Tab */}
          <TabsContent value="production" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  جدولة الإنتاج
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productionSchedule.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{batch.batchNumber}</h4>
                          <p className="text-sm text-gray-600">
                            {batch.grade} - {batch.volume} م³
                          </p>
                        </div>
                        <Badge className={getStatusColor(batch.status)}>
                          {getStatusText(batch.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                        <div>
                          <strong>تاريخ الإنتاج:</strong> {batch.productionDate.toLocaleDateString('ar-SA')}
                        </div>
                        <div>
                          <strong>الطلبات المرتبطة:</strong> {batch.orders.join(', ')}
                        </div>
                      </div>

                      {batch.qualityTests.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-semibold mb-2">اختبارات الجودة:</h5>
                          <div className="space-y-2">
                            {batch.qualityTests.map((test) => (
                              <div key={test.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm">{test.testType}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm">{test.result}</span>
                                  {test.passed ? (
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fleet Tab */}
          <TabsContent value="fleet" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  إدارة الأسطول
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trucks.map((truck) => (
                    <div key={truck.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{truck.plateNumber}</h4>
                          <p className="text-sm text-gray-600">سعة: {truck.capacity} م³</p>
                        </div>
                        <Badge className={getStatusColor(truck.status)}>
                          {getStatusText(truck.status)}
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{truck.driver.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{truck.driver.phone}</span>
                        </div>
                        {truck.currentLocation && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {truck.currentLocation.lat.toFixed(4)}, {truck.currentLocation.lng.toFixed(4)}
                            </span>
                          </div>
                        )}
                      </div>

                      {truck.currentOrder && (
                        <div className="mt-3 p-2 bg-blue-50 rounded">
                          <span className="text-sm font-semibold">طلب حالي: {truck.currentOrder}</span>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                        <p>آخر صيانة: {truck.lastMaintenance.toLocaleDateString('ar-SA')}</p>
                        <p>الصيانة التالية: {truck.nextMaintenance.toLocaleDateString('ar-SA')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    مؤشرات الأداء
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {metrics && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>متوسط قيمة الطلب</span>
                        <span className="font-semibold">{formatCurrency(metrics.averageOrderValue)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>النمو الشهري</span>
                        <span className="font-semibold text-green-600">+{metrics.monthlyGrowth}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>رضا العملاء</span>
                        <span className="font-semibold">{metrics.customerSatisfaction}/5</span>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span>التسليم في الوقت المحدد</span>
                          <span className="font-semibold">{metrics.onTimeDelivery}%</span>
                        </div>
                        <Progress value={metrics.onTimeDelivery} className="h-2" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    الإنتاج والمبيعات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {metrics && (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {metrics.totalVolume.toLocaleString('ar')}
                        </div>
                        <div className="text-sm text-gray-600">إجمالي المتر المكعب المباع</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(metrics.revenue)}
                        </div>
                        <div className="text-sm text-gray-600">إجمالي الإيرادات</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}




