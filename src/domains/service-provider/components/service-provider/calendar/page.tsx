'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { Calendar as CalendarIcon, Clock, MapPin, User, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ServiceProviderCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const appointments = [
    {
      id: '1',
      title: 'استشارة هندسية',
      customer: 'أحمد محمد',
      date: '2025-07-28',
      time: '09:00',
      duration: '2 ساعة',
      location: 'الرياض - حي النرجس',
      status: 'confirmed',
      type: 'consultation'
    },
    {
      id: '2',
      title: 'فحص موقع البناء',
      customer: 'فاطمة عبدالله',
      date: '2025-07-28',
      time: '14:00',
      duration: '3 ساعات',
      location: 'جدة - حي الزهراء',
      status: 'confirmed',
      type: 'inspection'
    },
    {
      id: '3',
      title: 'اجتماع مع العميل',
      customer: 'خالد العتيبي',
      date: '2025-07-29',
      time: '10:30',
      duration: '1 ساعة',
      location: 'الدمام - مكتب العميل',
      status: 'pending',
      type: 'meeting'
    },
    {
      id: '4',
      title: 'متابعة المشروع',
      customer: 'سارة الأحمد',
      date: '2025-07-30',
      time: '11:00',
      duration: '4 ساعات',
      location: 'الرياض - موقع البناء',
      status: 'confirmed',
      type: 'supervision'
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

  const getTypeText = (type: string) => {
    const texts: Record<string, string> = {
      'consultation': 'استشارة',
      'inspection': 'فحص',
      'meeting': 'اجتماع',
      'supervision': 'إشراف'
    };
    return texts[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'consultation': 'bg-blue-100 text-blue-800',
      'inspection': 'bg-green-100 text-green-800',
      'meeting': 'bg-purple-100 text-purple-800',
      'supervision': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Simple calendar grid
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonthYear = (date: Date) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            التقويم والمواعيد
          </h1>
          <p className="text-gray-600">
            إدارة مواعيدك وجدولة المهام
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          إضافة موعد جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{formatMonthYear(currentDate)}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={previousMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }, (_, index) => (
                  <div key={`empty-${index}`} className="p-2 h-16"></div>
                ))}
                
                {/* Days of the month */}
                {Array.from({ length: daysInMonth }, (_, index) => {
                  const day = index + 1;
                  const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const dayAppointments = appointments.filter(apt => apt.date === dateStr);
                  const isToday = 
                    day === today.getDate() && 
                    currentDate.getMonth() === today.getMonth() && 
                    currentDate.getFullYear() === today.getFullYear();
                  
                  return (
                    <div
                      key={day}
                      className={`p-2 h-16 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                        isToday ? 'bg-blue-50 border-blue-300' : 'border-gray-200'
                      }`}
                    >
                      <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                        {day}
                      </div>
                      {dayAppointments.length > 0 && (
                        <div className="mt-1">
                          {dayAppointments.slice(0, 2).map((apt, idx) => (
                            <div key={idx} className="text-xs bg-blue-100 text-blue-800 rounded px-1 mb-1 truncate">
                              {apt.time} {apt.title}
                            </div>
                          ))}
                          {dayAppointments.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{dayAppointments.length - 2} أخرى
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>مواعيد اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments
                  .filter(apt => apt.date === today.toISOString().split('T')[0])
                  .map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{appointment.title}</h4>
                        <Badge className={getStatusColor(appointment.status)} size="sm">
                          {getStatusText(appointment.status)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time} ({appointment.duration})
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {appointment.customer}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {appointment.location}
                        </div>
                      </div>
                    </div>
                  ))}
                {appointments.filter(apt => apt.date === today.toISOString().split('T')[0]).length === 0 && (
                  <p className="text-gray-500 text-center py-4">لا توجد مواعيد اليوم</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>المواعيد القادمة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold">{appointment.title}</h3>
                    <p className="text-gray-600">{appointment.customer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(appointment.type)} variant="secondary">
                      {getTypeText(appointment.type)}
                    </Badge>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <CalendarIcon className="h-4 w-4" />
                      التاريخ والوقت
                    </div>
                    <div className="font-medium">
                      {new Date(appointment.date).toLocaleDateString('ar-SA')} في {appointment.time}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-4 w-4" />
                      المدة
                    </div>
                    <div className="font-medium">{appointment.duration}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="h-4 w-4" />
                      الموقع
                    </div>
                    <div className="font-medium">{appointment.location}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  {appointment.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm">
                        رفض
                      </Button>
                      <Button size="sm">
                        قبول
                      </Button>
                    </>
                  )}
                  {appointment.status === 'confirmed' && (
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



