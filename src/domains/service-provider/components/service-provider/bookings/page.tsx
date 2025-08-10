'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Calendar, MapPin, Clock, DollarSign, User, Star } from 'lucide-react';

export default function ServiceProviderBookingsPage() {
  const bookings = [
    {
      id: '1',
      customerName: 'أحمد محمد',
      projectTitle: 'بناء فيلا سكنية',
      location: 'الرياض - حي النرجس',
      date: '2025-08-01',
      time: '09:00',
      duration: '3 ساعات',
      price: '5000 ر.س',
      status: 'confirmed',
      rating: 5
    },
    {
      id: '2',
      customerName: 'فاطمة الزهراني',
      projectTitle: 'استشارة هندسية',
      location: 'جدة - حي الزهراء',
      date: '2025-07-30',
      time: '14:00',
      duration: '2 ساعة',
      price: '2000 ر.س',
      status: 'pending',
      rating: null
    },
    {
      id: '3',
      customerName: 'خالد العتيبي',
      projectTitle: 'فحص موقع البناء',
      location: 'الدمام - حي الشاطئ',
      date: '2025-08-05',
      time: '11:00',
      duration: '4 ساعات',
      price: '3500 ر.س',
      status: 'completed',
      rating: 4
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'confirmed': 'bg-green-500',
      'pending': 'bg-yellow-500',
      'completed': 'bg-blue-500',
      'cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      'confirmed': 'مؤكد',
      'pending': 'في الانتظار',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    };
    return texts[status] || status;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            إدارة الحجوزات
          </h1>
          <p className="text-gray-600">
            إدارة وتتبع جميع حجوزاتك وخدماتك
          </p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          إضافة حجز جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الحجوزات</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حجوزات مؤكدة</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">قادمة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125,000 ر.س</div>
            <p className="text-xs text-muted-foreground">هذا الشهر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط التقييم</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-1">
              4.8
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-xs text-muted-foreground">من 15 تقييم</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card>
        <CardHeader>
          <CardTitle>جميع الحجوزات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{booking.projectTitle}</h3>
                    <div className="flex items-center gap-1 text-gray-600">
                      <User className="h-4 w-4" />
                      {booking.customerName}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusText(booking.status)}
                    </Badge>
                    {booking.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{booking.rating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      الموقع
                    </div>
                    <div className="font-medium">{booking.location}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      التاريخ والوقت
                    </div>
                    <div className="font-medium">{booking.date} في {booking.time}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      المدة
                    </div>
                    <div className="font-medium">{booking.duration}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <DollarSign className="h-4 w-4" />
                      السعر
                    </div>
                    <div className="font-medium">{booking.price}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  {booking.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm">
                        رفض
                      </Button>
                      <Button size="sm">
                        قبول
                      </Button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <Button variant="outline" size="sm">
                      تعديل
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    عرض التفاصيل
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



