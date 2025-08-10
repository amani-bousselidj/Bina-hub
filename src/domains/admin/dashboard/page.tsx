'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { platformDataService } from '@/services';
// import { AdminDashboardData } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { 
  Users, 
  Store,
  UserCog,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Shield,
  Calendar
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'analytics'>('overview');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await platformDataService.getAdminDashboard();
        if (data.success && data.data) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">حدث خطأ في تحميل البيانات</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم الإدارة</h1>
            <p className="text-gray-600 mt-2">
              مرحباً {user?.name} - إدارة المنصة والمستخدمين
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.users.total}</p>
                    <p className="text-xs text-green-600">+{dashboardData.users.new} جديد</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">المتاجر</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.stores.total}</p>
                    <p className="text-xs text-green-600">+{dashboardData.stores.new} جديد</p>
                  </div>
                  <Store className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">مقدمو الخدمات</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.serviceProviders.total}</p>
                    <p className="text-xs text-green-600">+{dashboardData.serviceProviders.new} جديد</p>
                  </div>
                  <UserCog className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.platformStats.totalRevenue.toLocaleString()} ر.س
                    </p>
                    <p className="text-xs text-green-600">+{dashboardData.platformStats.monthlyGrowth}%</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الطلبات</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.orders.total}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-yellow-600">
                        {dashboardData.orders.pending} في الانتظار
                      </span>
                      <span className="text-xs text-green-600">
                        {dashboardData.orders.completed} مكتمل
                      </span>
                    </div>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">مطالبات الضمان</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.warrantyClaims.total}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-yellow-600">
                        {dashboardData.warrantyClaims.pending} معلق
                      </span>
                      <span className="text-xs text-green-600">
                        {dashboardData.warrantyClaims.resolved} محلول
                      </span>
                    </div>
                  </div>
                  <Shield className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">حجوزات الخدمات</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.serviceBookings.total}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-yellow-600">
                        {dashboardData.serviceBookings.pending} معلق
                      </span>
                      <span className="text-xs text-green-600">
                        {dashboardData.serviceBookings.completed} مكتمل
                      </span>
                    </div>
                  </div>
                  <Calendar className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 space-x-reverse px-6">
                {[
                  { key: 'overview', label: 'نظرة عامة', icon: BarChart3 },
                  { key: 'users', label: 'إدارة المستخدمين', icon: Users },
                  { key: 'analytics', label: 'التحليلات', icon: TrendingUp }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedTab(tab.key as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      selectedTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {selectedTab === 'overview' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">نظرة عامة على المنصة</h3>
                  
                  {/* Top Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle>أهم الفئات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardData.platformStats.topCategories.map((category: any, index: number) => (
                          <div key={category.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                              <span className="font-medium">{category.name}</span>
                            </div>
                            <Badge variant="secondary">{category.count} منتج</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Active Users */}
                  <Card>
                    <CardHeader>
                      <CardTitle>المستخدمون النشطون</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{dashboardData.users.active}</p>
                          <p className="text-sm text-gray-600">مستخدمون نشطون</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{dashboardData.stores.active}</p>
                          <p className="text-sm text-gray-600">متاجر نشطة</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{dashboardData.serviceProviders.active}</p>
                          <p className="text-sm text-gray-600">مقدمو خدمات نشطون</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Users Tab */}
              {selectedTab === 'users' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">إدارة المستخدمين</h3>
                    <Button>
                      <Users className="h-4 w-4 mr-2" />
                      عرض جميع المستخدمين
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          العملاء
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">المجموع</span>
                            <span className="font-medium">{dashboardData.users.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">النشطون</span>
                            <span className="font-medium text-green-600">{dashboardData.users.active}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">جدد هذا الشهر</span>
                            <span className="font-medium text-blue-600">{dashboardData.users.new}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Store className="h-5 w-5" />
                          المتاجر
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">المجموع</span>
                            <span className="font-medium">{dashboardData.stores.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">النشطة</span>
                            <span className="font-medium text-green-600">{dashboardData.stores.active}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">جديدة هذا الشهر</span>
                            <span className="font-medium text-blue-600">{dashboardData.stores.new}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserCog className="h-5 w-5" />
                          مقدمو الخدمات
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">المجموع</span>
                            <span className="font-medium">{dashboardData.serviceProviders.total}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">النشطون</span>
                            <span className="font-medium text-green-600">{dashboardData.serviceProviders.active}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">جدد هذا الشهر</span>
                            <span className="font-medium text-blue-600">{dashboardData.serviceProviders.new}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {selectedTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">تحليلات المنصة</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>الأداء المالي</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">إجمالي الإيرادات</span>
                            <span className="text-xl font-bold text-green-600">
                              {dashboardData.platformStats.totalRevenue.toLocaleString()} ر.س
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">النمو الشهري</span>
                            <span className="text-lg font-semibold text-blue-600">
                              +{dashboardData.platformStats.monthlyGrowth}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">المستخدمون النشطون</span>
                            <span className="text-lg font-semibold">
                              {dashboardData.platformStats.activeUsers.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>إحصائيات الأنشطة</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">الطلبات اليوم</span>
                            <span className="text-lg font-semibold">
                              {Math.floor(dashboardData.orders.total * 0.1)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">الحجوزات الجديدة</span>
                            <span className="text-lg font-semibold">
                              {Math.floor(dashboardData.serviceBookings.pending * 0.5)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">مطالبات الضمان المعلقة</span>
                            <span className="text-lg font-semibold text-yellow-600">
                              {dashboardData.warrantyClaims.pending}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}




