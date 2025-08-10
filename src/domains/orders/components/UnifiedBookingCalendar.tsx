'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Calendar } from '@/components/ui/core/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle,
  Plus,
  Eye,
  Settings,
  TrendingUp
} from 'lucide-react';
import { format, addDays, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  unifiedBookingService,
  BookingService as UnifiedBookingService,
  Booking as UnifiedBooking,
  BookingCalendarEvent as UnifiedBookingCalendarEvent,
  ConflictResolution as UnifiedConflictResolution,
  SchedulingRecommendation as UnifiedSchedulingRecommendation
} from '@/services';

// Type definitions for the calendar
export type BookingService = 'equipment-rental' | 'waste-management' | 'concrete-supply' | 'design-office' | 'insurance';

export interface BookingCalendarEvent {
  id: string;
  title: string;
  service_type: BookingService;
  provider: string;
  start: string;
  end: string;
  location: string;
  cost: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  color: string;
}

// Component props interface
interface UnifiedBookingCalendarProps {
  projectId: string;
  onBookingClick?: (booking: UnifiedBooking) => void;
  onNewBooking?: () => void;
}export default function UnifiedBookingCalendar({ 
  projectId, 
  onBookingClick, 
  onNewBooking 
}: UnifiedBookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<UnifiedBookingCalendarEvent[]>([]);
  const [bookings, setBookings] = useState<UnifiedBooking[]>([]);
  const [conflicts, setConflicts] = useState<UnifiedConflictResolution[]>([]);
  const [recommendations, setRecommendations] = useState<UnifiedSchedulingRecommendation | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<UnifiedBookingCalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [filterService, setFilterService] = useState<BookingService | 'all'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCalendarData();
  }, [projectId]);

  const loadCalendarData = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      // Load calendar events
      const events = await unifiedBookingService.getBookingsForCalendar(projectId);
      // Convert dates to Date objects to match imported interface
      const localEvents: UnifiedBookingCalendarEvent[] = events.map(event => ({
        ...event,
        start: typeof event.start === 'string' ? new Date(event.start) : event.start,
        end: typeof event.end === 'string' ? new Date(event.end) : event.end
      }));
      setCalendarEvents(localEvents);

      // Load detailed bookings
      const bookingData = await unifiedBookingService.getBookingsByProject(projectId);
      setBookings(bookingData);

      // Check for conflicts
      const conflictData = await unifiedBookingService.manageBookingConflicts(projectId);
      setConflicts(conflictData);

      // Get recommendations
      const recommendationData = await unifiedBookingService.recommendOptimalScheduling(projectId);
      setRecommendations(recommendationData);

    } catch (error) {
      toast("خطأ في تحميل بيانات التقويم");
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = filterService === 'all' 
    ? calendarEvents 
    : calendarEvents.filter(event => event.service_type === filterService);

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 6 }); // Saturday start
    const end = endOfWeek(currentDate, { weekStartsOn: 6 });
    return eachDayOfInterval({ start, end });
  };

  const getEventsForDay = (date: Date) => {
    return filteredEvents.filter(event => 
      isSameDay(new Date(event.start), date)
    );
  };

  const getServiceIcon = (serviceType: BookingService) => {
    const icons = {
      'equipment-rental': '🚚',
      'waste-management': '♻️',
      'concrete-supply': '🏗️',
      'design-office': '📐',
      'insurance': '🛡️'
    } as { [key: string]: string };
    return icons[serviceType] || '📅';
  };

  const getServiceName = (serviceType: BookingService) => {
    const names = {
      'equipment-rental': 'تأجير معدات',
      'waste-management': 'إدارة النفايات',
      'concrete-supply': 'توريد خرسانة',
      'design-office': 'مكتب هندسي',
      'insurance': 'تأمين'
    } as { [key: string]: string };
    return names[serviceType] || serviceType;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'confirmed': 'bg-blue-100 text-blue-800 border-blue-200',
      'in_progress': 'bg-orange-100 text-orange-800 border-orange-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200'
    } as { [key: string]: string };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      'pending': 'في انتظار التأكيد',
      'confirmed': 'مؤكد',
      'in_progress': 'قيد التنفيذ',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    } as { [key: string]: string };
    return texts[status] || status;
  };

  const renderWeekView = () => {
    const weekDays = getWeekDays();
    const timeSlots = Array.from({ length: 14 }, (_, i) => i + 6); // 6 AM to 8 PM

    return (
      <div className="bg-white rounded-lg border">
        {/* Week header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 border-r">
            <span className="text-sm font-medium text-gray-600">الوقت</span>
          </div>
          {weekDays.map((day, index) => (
            <div key={index} className="p-4 text-center border-r last:border-r-0">
              <div className="text-sm font-medium text-gray-900">
                {format(day, 'EEEE', { locale: ar })}
              </div>
              <div className="text-lg font-bold text-blue-600">
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots grid */}
        <div className="grid grid-cols-8 divide-y">
          {timeSlots.map(hour => (
            <React.Fragment key={hour}>
              <div className="p-2 border-r bg-gray-50 text-center text-sm text-gray-600">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {weekDays.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day).filter(event => {
                  const eventHour = new Date(event.start).getHours();
                  return eventHour === hour;
                });

                return (
                  <div 
                    key={`${hour}-${dayIndex}`} 
                    className="p-1 border-r last:border-r-0 min-h-[60px] relative"
                  >
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className="mb-1 p-2 rounded text-xs cursor-pointer hover:shadow-md transition-shadow"
                        style={{ backgroundColor: event.color + '20', borderLeft: `3px solid ${event.color}` }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="font-medium truncate">
                          {getServiceIcon(event.service_type)} {event.title}
                        </div>
                        <div className="text-gray-600 truncate">
                          {event.provider}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(event.status)}`}
                        >
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="grid grid-cols-7 gap-1 bg-white rounded-lg border p-4">
        {/* Calendar implementation would go here */}
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date: Date | undefined) => {
            if (date instanceof Date) {
              setCurrentDate(date);
            }
          }}
          className="rounded-md"
        />
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDay(currentDate);
    const timeSlots = Array.from({ length: 14 }, (_, i) => i + 6);

    return (
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">
            {format(currentDate, 'EEEE، d MMMM yyyy', { locale: ar })}
          </h2>
        </div>
        <div className="divide-y">
          {timeSlots.map(hour => {
            const hourEvents = dayEvents.filter(event => {
              const eventHour = new Date(event.start).getHours();
              return eventHour === hour;
            });

            return (
              <div key={hour} className="flex border-b">
                <div className="w-20 p-4 text-center text-sm text-gray-600 bg-gray-50">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-4 min-h-[80px]">
                  {hourEvents.map(event => (
                    <div
                      key={event.id}
                      className="mb-2 p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                      style={{ backgroundColor: event.color + '20', borderLeft: `4px solid ${event.color}` }}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            {getServiceIcon(event.service_type)} {event.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {event.provider} • {event.location}
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            {event.cost.toLocaleString()} ريال
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">تقويم الحجوزات الموحد</h1>
          <p className="text-gray-600">إدارة جميع الحجوزات والخدمات في مكان واحد</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={filterService} onValueChange={(value: any) => setFilterService(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="فلترة حسب الخدمة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الخدمات</SelectItem>
              <SelectItem value="equipment-rental">تأجير معدات</SelectItem>
              <SelectItem value="waste-management">إدارة النفايات</SelectItem>
              <SelectItem value="concrete-supply">توريد خرسانة</SelectItem>
              <SelectItem value="design-office">مكتب هندسي</SelectItem>
              <SelectItem value="insurance">تأمين</SelectItem>
            </SelectContent>
          </Select>

          <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">يوم</SelectItem>
              <SelectItem value="week">أسبوع</SelectItem>
              <SelectItem value="month">شهر</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onNewBooking}>
            <Plus className="mr-2 h-4 w-4" />
            حجز جديد
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <div className="text-sm text-gray-600">إجمالي الحجوزات</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">مكتملة</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{conflicts.length}</div>
                <div className="text-sm text-gray-600">تعارضات</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {bookings.reduce((sum, b) => sum + b.estimated_cost, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">إجمالي التكلفة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              تعارضات في الجدولة ({conflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.slice(0, 3).map(conflict => (
                <div key={conflict.conflict_id} className="bg-white p-3 rounded border">
                  <div className="text-sm">
                    {conflict.impact_assessment}
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    حل التعارض
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <Button 
          variant="outline" 
          onClick={() => setCurrentDate(addDays(currentDate, -7))}
        >
          السابق
        </Button>
        
        <div className="text-lg font-semibold">
          {viewMode === 'week' && `أسبوع ${format(currentDate, 'w، yyyy', { locale: ar })}`}
          {viewMode === 'month' && format(currentDate, 'MMMM yyyy', { locale: ar })}
          {viewMode === 'day' && format(currentDate, 'EEEE، d MMMM yyyy', { locale: ar })}
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setCurrentDate(addDays(currentDate, 7))}
        >
          التالي
        </Button>
      </div>

      {/* Calendar View */}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'day' && renderDayView()}

      {/* Event Details Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل الحجز</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">الخدمة</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span>{getServiceIcon(selectedEvent.service_type)}</span>
                    <span>{getServiceName(selectedEvent.service_type)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">الحالة</Label>
                  <Badge className={`mt-1 ${getStatusColor(selectedEvent.status)}`}>
                    {getStatusText(selectedEvent.status)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">التاريخ والوقت</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {format(selectedEvent.start, 'dd/MM/yyyy HH:mm', { locale: ar })}
                    </span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">المكان</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">مقدم الخدمة</Label>
                  <div className="mt-1">{selectedEvent.provider}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">التكلفة</Label>
                  <div className="mt-1 font-semibold text-green-600">
                    {selectedEvent.cost.toLocaleString()} ريال
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  عرض التفاصيل
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  إدارة الحجز
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recommendations Panel */}
      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              توصيات الجدولة المثلى
            </CardTitle>
            <CardDescription>
              نصائح لتحسين جدولة الخدمات وتوفير التكاليف
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {recommendations.optimization_benefits.cost_savings.toLocaleString()}
                </div>
                <div className="text-sm text-green-700">توفير متوقع (ريال)</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {recommendations.optimization_benefits.time_savings_days}
                </div>
                <div className="text-sm text-blue-700">توفير في الوقت (أيام)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {recommendations.optimization_benefits.efficiency_improvement}%
                </div>
                <div className="text-sm text-purple-700">تحسن في الكفاءة</div>
              </div>
            </div>

            <div className="space-y-3">
              {recommendations.recommended_schedule.slice(0, 3).map((rec: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span>{getServiceIcon(rec.service_type)}</span>
                    <div>
                      <div className="font-medium">{getServiceName(rec.service_type)}</div>
                      <div className="text-sm text-gray-600">{rec.reasoning}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="font-medium">
                      {format(rec.recommended_date, 'dd/MM', { locale: ar })}
                    </div>
                    <div className="text-sm text-gray-600">{rec.recommended_time}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              تطبيق التوصيات
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}



