// Equipment Rental Provider Dashboard
// Comprehensive dashboard for equipment rental companies

"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Truck, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Settings, 
  Plus,
  TrendingUp,
  Users,
  Package,
  Clock,
  Star,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { equipmentRentalService } from '@/services';

export default function EquipmentRentalProviderDashboard() {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'bookings' | 'analytics' | 'settings'>('overview');
  const [equipment, setEquipment] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load provider-specific data
      const [equipmentData, bookingsData, analyticsData] = await Promise.all([
        equipmentRentalService.getProviderEquipment('current-provider-id'),
        equipmentRentalService.getProviderBookings('current-provider-id'),
        equipmentRentalService.getProviderAnalytics('current-provider-id')
      ]);
      
      setEquipment(equipmentData);
      setBookings(bookingsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('فشل في تحميل بيانات اللوحة');
    } finally {
      setLoading(false);
    }
  };

  const getBookingStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-500',
      'confirmed': 'bg-blue-500',
      'in-progress': 'bg-orange-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getEquipmentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'available': 'bg-green-500',
      'rented': 'bg-blue-500',
      'maintenance': 'bg-orange-500',
      'out-of-service': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-600" />
            لوحة تحكم مزود المعدات
          </h1>
          <p className="text-gray-600">إدارة شاملة لمعداتك وحجوزاتك</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            الإعدادات
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة معدة جديدة
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة معدة جديدة</DialogTitle>
                <DialogDescription>
                  أضف معدة جديدة إلى مخزونك
                </DialogDescription>
              </DialogHeader>
              {/* Add Equipment Form would go here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="bookings">الحجوزات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">إجمالي المعدات</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{equipment.length}</div>
                <p className="text-xs text-muted-foreground">
                  {equipment.filter(e => e.status === 'available').length} متاحة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الحجوزات النشطة</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => ['confirmed', 'in-progress'].includes(b.status)).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {bookings.filter(b => b.status === 'pending').length} في الانتظار
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.monthlyRevenue?.toLocaleString() || '0'} ر.س
                </div>
                <p className="text-xs text-muted-foreground">
                  +{analytics?.revenueGrowth || 0}% من الشهر الماضي
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">التقييم</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center gap-1">
                  {analytics?.averageRating || 0}
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalReviews || 0} تقييم
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                الحجوزات الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Truck className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{booking.equipmentName}</h4>
                        <p className="text-sm text-gray-600">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.startDate).toLocaleDateString('ar-SA')} - 
                          {new Date(booking.endDate).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <Badge className={getBookingStatusColor(booking.status)}>
                        {booking.status === 'pending' && 'في الانتظار'}
                        {booking.status === 'confirmed' && 'مؤكد'}
                        {booking.status === 'in-progress' && 'جاري التنفيذ'}
                        {booking.status === 'completed' && 'مكتمل'}
                        {booking.status === 'cancelled' && 'ملغي'}
                      </Badge>
                      <p className="text-sm font-medium mt-1">{booking.totalCost.toLocaleString()} ر.س</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                مخزون المعدات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.type}</p>
                      </div>
                      <Badge className={getEquipmentStatusColor(item.status)}>
                        {item.status === 'available' && 'متاح'}
                        {item.status === 'rented' && 'مؤجر'}
                        {item.status === 'maintenance' && 'صيانة'}
                        {item.status === 'out-of-service' && 'خارج الخدمة'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">السعر اليومي:</span>
                        <span className="font-medium">{item.dailyRate.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">الموقع:</span>
                        <span>{item.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">آخر صيانة:</span>
                        <span>{new Date(item.lastMaintenance).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        عرض
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Settings className="h-3 w-3 mr-1" />
                        تعديل
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                إدارة الحجوزات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">حجز #{booking.id}</h4>
                          <Badge className={getBookingStatusColor(booking.status)}>
                            {booking.status === 'pending' && 'في الانتظار'}
                            {booking.status === 'confirmed' && 'مؤكد'}
                            {booking.status === 'in-progress' && 'جاري التنفيذ'}
                            {booking.status === 'completed' && 'مكتمل'}
                            {booking.status === 'cancelled' && 'ملغي'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">المعدة:</span>
                            <div className="font-medium">{booking.equipmentName}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">العميل:</span>
                            <div className="font-medium">{booking.customerName}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">الفترة:</span>
                            <div className="font-medium">
                              {new Date(booking.startDate).toLocaleDateString('ar-SA')} - 
                              {new Date(booking.endDate).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">التكلفة:</span>
                            <div className="font-medium">{booking.totalCost.toLocaleString()} ر.س</div>
                          </div>
                        </div>

                        {booking.deliveryAddress && (
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4" />
                              <span className="font-medium">عنوان التوصيل:</span>
                              {booking.deliveryAddress}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              قبول
                            </Button>
                            <Button variant="destructive" size="sm">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              رفض
                            </Button>
                          </>
                        )}
                        {['confirmed', 'in-progress'].includes(booking.status) && (
                          <Button variant="outline" size="sm">
                            <Navigation className="h-3 w-3 mr-1" />
                            تتبع
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          تفاصيل
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  أداء الإيرادات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي الإيرادات:</span>
                    <span className="font-bold text-lg">{analytics?.totalRevenue?.toLocaleString() || '0'} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>متوسط الحجز:</span>
                    <span className="font-medium">{analytics?.averageBookingValue?.toLocaleString() || '0'} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>معدل الإشغال:</span>
                    <span className="font-medium">{analytics?.occupancyRate || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  إحصائيات العملاء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي العملاء:</span>
                    <span className="font-bold text-lg">{analytics?.totalCustomers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>عملاء جدد هذا الشهر:</span>
                    <span className="font-medium">{analytics?.newCustomersThisMonth || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>معدل الاحتفاظ:</span>
                    <span className="font-medium">{analytics?.customerRetentionRate || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Equipment */}
          <Card>
            <CardHeader>
              <CardTitle>المعدات الأكثر طلباً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.popularEquipment?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">{item.type}</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{item.bookingCount} حجز</div>
                      <div className="text-sm text-gray-600">{item.revenue.toLocaleString()} ر.س</div>
                    </div>
                  </div>
                )) || []}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                إعدادات الحساب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>اسم الشركة</Label>
                    <Input placeholder="اسم شركة تأجير المعدات" />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input placeholder="05xxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" placeholder="info@company.com" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>المدينة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="riyadh">الرياض</SelectItem>
                        <SelectItem value="jeddah">جدة</SelectItem>
                        <SelectItem value="dammam">الدمام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>نطاق الخدمة (كم)</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <div className="space-y-2">
                    <Label>ساعات العمل</Label>
                    <div className="flex gap-2">
                      <Input placeholder="من" />
                      <Input placeholder="إلى" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline">إلغاء</Button>
                <Button>حفظ التغييرات</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}




