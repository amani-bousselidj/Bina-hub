// Waste Management Provider Dashboard
// Comprehensive dashboard for waste management companies

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
  Trash2, 
  Truck, 
  Calendar, 
  MapPin, 
  Route, 
  BarChart3,
  Plus,
  Settings,
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  Navigation,
  Leaf,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { wasteManagementService } from '@/services';

export default function WasteManagementProviderDashboard() {
  
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'schedules' | 'routes' | 'analytics' | 'settings'>('overview');
  const [collections, setCollections] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
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
      const [collectionsData, vehiclesData, routesData, analyticsData] = await Promise.all([
        wasteManagementService.getProviderCollections('current-provider-id'),
        wasteManagementService.getProviderVehicles('current-provider-id'),
        wasteManagementService.getProviderRoutes('current-provider-id'),
        wasteManagementService.getProviderAnalytics('current-provider-id')
      ]);
      
      setCollections(collectionsData);
      setVehicles(vehiclesData);
      setRoutes(routesData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('فشل في تحميل بيانات اللوحة');
    } finally {
      setLoading(false);
    }
  };

  const getCollectionStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-500',
      'pin-delivered': 'bg-yellow-500',
      'collecting': 'bg-orange-500',
      'completed': 'bg-green-500',
      'cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getVehicleStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'available': 'bg-green-500',
      'on-route': 'bg-blue-500',
      'collecting': 'bg-orange-500',
      'maintenance': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trash2 className="h-8 w-8 text-green-600" />
            لوحة تحكم إدارة النفايات
          </h1>
          <p className="text-gray-600">إدارة شاملة لعمليات جمع النفايات والمسارات</p>
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
                إضافة مسار جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة مسار جمع جديد</DialogTitle>
                <DialogDescription>
                  قم بإنشاء مسار جديد لجمع النفايات
                </DialogDescription>
              </DialogHeader>
              {/* Add Route Form would go here */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="schedules">الجدولة</TabsTrigger>
          <TabsTrigger value="routes">المسارات</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="settings">الإعدادات</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">عمليات الجمع اليوم</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {collections.filter(c => 
                    new Date(c.scheduledDate).toDateString() === new Date().toDateString()
                  ).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {collections.filter(c => c.status === 'completed').length} مكتملة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">المركبات النشطة</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {vehicles.filter(v => ['on-route', 'collecting'].includes(v.status)).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  من أصل {vehicles.length} مركبة
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الكمية المجمعة اليوم</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.todayVolume?.toFixed(1) || '0'} م³
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.todayWeight?.toFixed(1) || '0'} طن
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">الأثر البيئي</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analytics?.recyclingRate || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  معدل إعادة التدوير
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                جدول اليوم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collections
                  .filter(c => new Date(c.scheduledDate).toDateString() === new Date().toDateString())
                  .slice(0, 5)
                  .map((collection, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Trash2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">جمع #{collection.id}</h4>
                          <p className="text-sm text-gray-600">{collection.collectionAddress}</p>
                          <p className="text-xs text-gray-500">
                            {collection.wasteTypes.join(', ')} - {collection.estimatedVolume} م³
                          </p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge className={getCollectionStatusColor(collection.status)}>
                          {collection.status === 'scheduled' && 'مجدولة'}
                          {collection.status === 'pin-delivered' && 'تم التوصيل'}
                          {collection.status === 'collecting' && 'جاري الجمع'}
                          {collection.status === 'completed' && 'مكتملة'}
                          {collection.status === 'cancelled' && 'ملغية'}
                        </Badge>
                        <p className="text-sm font-medium mt-1">
                          {new Date(collection.scheduledDate).toLocaleTimeString('ar-SA')}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Vehicles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                المركبات النشطة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vehicles
                  .filter(v => ['on-route', 'collecting'].includes(v.status))
                  .map((vehicle, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{vehicle.plateNumber}</h4>
                          <p className="text-sm text-gray-600">{vehicle.type}</p>
                        </div>
                        <Badge className={getVehicleStatusColor(vehicle.status)}>
                          {vehicle.status === 'on-route' && 'في الطريق'}
                          {vehicle.status === 'collecting' && 'جاري الجمع'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">السائق:</span>
                          <span>{vehicle.driverName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">الحمولة:</span>
                          <span>{vehicle.currentLoad}% ({vehicle.loadCapacity} م³)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">المسار:</span>
                          <span>{vehicle.currentRoute}</span>
                        </div>
                      </div>

                      <Button variant="outline" size="sm" className="w-full mt-3">
                        <Navigation className="h-3 w-3 mr-1" />
                        تتبع المركبة
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedules Tab */}
        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                إدارة الجدولة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collections.map((collection, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium">جمع #{collection.id}</h4>
                          <Badge className={getCollectionStatusColor(collection.status)}>
                            {collection.status === 'scheduled' && 'مجدولة'}
                            {collection.status === 'pin-delivered' && 'تم التوصيل'}
                            {collection.status === 'collecting' && 'جاري الجمع'}
                            {collection.status === 'completed' && 'مكتملة'}
                            {collection.status === 'cancelled' && 'ملغية'}
                          </Badge>
                          {collection.urgency === 'high' && (
                            <Badge variant="destructive">عاجل</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">العنوان:</span>
                            <div className="font-medium">{collection.collectionAddress}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">نوع النفايات:</span>
                            <div className="font-medium">{collection.wasteTypes.join(', ')}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">الكمية المتوقعة:</span>
                            <div className="font-medium">{collection.estimatedVolume} م³</div>
                          </div>
                          <div>
                            <span className="text-gray-500">تاريخ الجمع:</span>
                            <div className="font-medium">
                              {new Date(collection.scheduledDate).toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                        </div>

                        {collection.specialInstructions && (
                          <div className="mt-3 p-3 bg-yellow-50 rounded">
                            <div className="text-sm">
                              <span className="font-medium">تعليمات خاصة:</span>
                              <p className="mt-1">{collection.specialInstructions}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {collection.status === 'scheduled' && (
                          <Button size="sm">
                            <Truck className="h-3 w-3 mr-1" />
                            تعيين مركبة
                          </Button>
                        )}
                        {collection.status === 'pin-delivered' && (
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            بدء الجمع
                          </Button>
                        )}
                        {collection.status === 'collecting' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            إتمام الجمع
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MapPin className="h-3 w-3 mr-1" />
                          عرض الموقع
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                إدارة المسارات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{route.name}</h4>
                        <p className="text-sm text-gray-600">{route.district}</p>
                      </div>
                      <Badge variant={route.isActive ? 'default' : 'secondary'}>
                        {route.isActive ? 'نشط' : 'غير نشط'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">عدد النقاط:</span>
                        <span className="font-medium">{route.collectionPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">المسافة:</span>
                        <span className="font-medium">{route.distance} كم</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">الوقت المتوقع:</span>
                        <span className="font-medium">{route.estimatedTime} ساعة</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">المركبة المخصصة:</span>
                        <span className="font-medium">{route.assignedVehicle}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        عرض المسار
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  إحصائيات الجمع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>إجمالي الكمية المجمعة:</span>
                    <span className="font-bold text-lg">{analytics?.totalVolumeCollected?.toFixed(1) || '0'} م³</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>إجمالي الوزن:</span>
                    <span className="font-medium">{analytics?.totalWeightCollected?.toFixed(1) || '0'} طن</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>معدل الجمع اليومي:</span>
                    <span className="font-medium">{analytics?.dailyAverageVolume?.toFixed(1) || '0'} م³</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5" />
                  الأثر البيئي
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>معدل إعادة التدوير:</span>
                    <span className="font-bold text-lg text-green-600">{analytics?.recyclingRate || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>الكمية المعاد تدويرها:</span>
                    <span className="font-medium">{analytics?.recycledVolume?.toFixed(1) || '0'} م³</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>توفير في الانبعاثات:</span>
                    <span className="font-medium">{analytics?.co2Savings?.toFixed(1) || '0'} كجم CO₂</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                مؤشرات الأداء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics?.onTimePerformance || 0}%
                  </div>
                  <div className="text-sm text-gray-600">الأداء في الوقت المحدد</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics?.customerSatisfaction || 0}%
                  </div>
                  <div className="text-sm text-gray-600">رضا العملاء</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {analytics?.fuelEfficiency || 0} لتر/100كم
                  </div>
                  <div className="text-sm text-gray-600">كفاءة الوقود</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Waste Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>توزيع أنواع النفايات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.wasteTypesDistribution?.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <div>
                        <div className="font-medium">{item.type}</div>
                        <div className="text-sm text-gray-600">{item.volume.toFixed(1)} م³</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{item.percentage}%</div>
                      <div className="text-sm text-gray-600">{item.collections} عملية</div>
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
                إعدادات الشركة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>اسم الشركة</Label>
                    <Input placeholder="شركة إدارة النفايات" />
                  </div>
                  <div className="space-y-2">
                    <Label>رقم الهاتف</Label>
                    <Input placeholder="05xxxxxxxx" />
                  </div>
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" placeholder="info@wastecompany.com" />
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
                    <Label>رخصة التشغيل</Label>
                    <Input placeholder="رقم الرخصة" />
                  </div>
                  <div className="space-y-2">
                    <Label>أنواع النفايات المعتمدة</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الأنواع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="construction">إنشائية</SelectItem>
                        <SelectItem value="concrete">خرسانة</SelectItem>
                        <SelectItem value="metal">معادن</SelectItem>
                        <SelectItem value="wood">أخشاب</SelectItem>
                      </SelectContent>
                    </Select>
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




