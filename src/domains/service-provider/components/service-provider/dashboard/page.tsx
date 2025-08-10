'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { platformDataService } from '@/services';
// import { ServiceProviderDashboardData, ServiceBooking } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { 
  Calendar,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Award,
  Eye,
  Edit,
  Users,
  Wrench,
  AlertTriangle,
  DollarSign
} from 'lucide-react';

export default function ServiceProviderDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'bookings' | 'profile'>('bookings');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await platformDataService.getServiceProviderDashboard(user?.id || '');
        if (data.success && data.data) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error('Error fetching service provider dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleUpdateBookingStatus = async (bookingId: string, newStatus: 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      await platformDataService.updateBookingStatus(bookingId, newStatus);
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          bookings: dashboardData.bookings.map((booking: any) =>
            booking.id === bookingId ? { ...booking, status: newStatus } : booking
          )
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status: string, type: 'booking' | 'warranty') => {
    const colors = {
      booking: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-purple-100 text-purple-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      warranty: {
        submitted: 'bg-yellow-100 text-yellow-800',
        under_review: 'bg-blue-100 text-blue-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800'
      }
    };
    return colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string, type: 'booking' | 'warranty') => {
    const texts = {
      booking: {
        pending: 'في الانتظار',
        confirmed: 'مؤكد',
        in_progress: 'قيد التنفيذ',
        completed: 'مكتمل',
        cancelled: 'ملغي'
      },
      warranty: {
        submitted: 'مُقدم',
        under_review: 'قيد المراجعة',
        approved: 'موافق عليه',
        rejected: 'مرفوض'
      }
    };
    return texts[type][status as keyof typeof texts[typeof type]] || status;
  };

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
            <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم مقدم الخدمة</h1>
            <p className="text-gray-600 mt-2">
              مرحباً {user?.name} - إدارة خدماتك وحجوزاتك
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الحجوزات</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.bookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">الحجوزات الجديدة</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.bookings.filter((b: any) => b.status === 'requested').length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.bookings
                        .filter((b: any) => b.status === 'completed')
                        .reduce((sum: number, booking: any) => sum + (booking.serviceDetails.estimatedCost || 0), 0)
                        .toLocaleString()} ر.س
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">معدل التقييم</p>
                    <p className="text-2xl font-bold text-gray-900">4.8</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 space-x-reverse px-6">
                {[
                  { key: 'bookings', label: 'الحجوزات', icon: Calendar, count: dashboardData?.bookings?.length || 0 },
                  { key: 'profile', label: 'الملف الشخصي', icon: Users, count: 0 }
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
                    {tab.count > 0 && <Badge variant="secondary">{tab.count}</Badge>}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Bookings Tab */}
              {selectedTab === 'bookings' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">حجوزات الخدمات</h3>
                  
                  {dashboardData.bookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">لا توجد حجوزات حتى الآن</p>
                    </div>
                  ) : (
                    dashboardData.bookings.map((booking: any) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-medium">{booking.serviceDetails.title}</h4>
                                <Badge className={getStatusColor(booking.status, 'booking')}>
                                  {getStatusText(booking.status, 'booking')}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                العميل: {booking.userName}
                              </p>
                              <p className="text-sm text-gray-600 mb-1">
                                السعر: {(booking.serviceDetails.estimatedCost || 0).toLocaleString()} ر.س
                              </p>
                              <div className="text-xs text-gray-500">
                                موعد الحجز: {new Date(booking.scheduledDate).toLocaleDateString('ar-SA')}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {booking.status === 'requested' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'confirmed')}
                                >
                                  تأكيد
                                </Button>
                              )}
                              {booking.status === 'confirmed' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'in_progress')}
                                >
                                  بدء العمل
                                </Button>
                              )}
                              {booking.status === 'in_progress' && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                >
                                  إنهاء
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {selectedTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">الملف الشخصي</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          معلومات أساسية
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">الاسم</label>
                          <p className="text-gray-900">{user?.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                          <p className="text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">نوع الخدمة</label>
                          <p className="text-gray-900">خدمات تقنية</p>
                        </div>
                        <Button className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          تعديل المعلومات
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          إحصائيات الأداء
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الخدمات المكتملة</span>
                          <span className="font-medium">
                            {dashboardData.bookings.filter((b: any) => b.status === 'completed').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">معدل التقييم</span>
                          <span className="font-medium flex items-center gap-1">
                            4.8 <Star className="h-4 w-4 text-yellow-500" />
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">مدة الاستجابة</span>
                          <span className="font-medium">2 ساعة</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">معدل الإكمال</span>
                          <span className="font-medium">95%</span>
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





