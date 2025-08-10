'use client';

import React, { useState, useEffect } from 'react';
import { equipmentRentalService } from '@/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover } from '@/components/ui/popover';
import { EquipmentType, EquipmentBooking, BookingFilters } from '@/services';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Truck, 
  Calendar as CalendarIcon,
  MapPin, 
  DollarSign, 
  Clock,
  Settings,
  Phone,
  Star,
  Shield,
  QrCode,
  Navigation,
  Fuel,
  Weight,
  Ruler,
  User,
  AlertCircle,
  CheckCircle,
  Filter
} from 'lucide-react';

// Simple geocoding function for address to coordinates
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  try {
    // In a real implementation, you would use Google Maps Geocoding API or similar
    // For now, return default Riyadh coordinates with some random offset based on address
    const hash = address.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const latOffset = (hash % 100) / 10000; // Small random offset
    const lngOffset = ((hash * 17) % 100) / 10000;
    
    return {
      lat: 24.7136 + latOffset,
      lng: 46.6753 + lngOffset
    };
  } catch (error) {
    console.error('Geocoding failed:', error);
    return { lat: 24.7136, lng: 46.6753 }; // Default Riyadh coordinates
  }
};

interface EquipmentRentalIntegrationProps {
  projectId: string;
  onEquipmentBooked?: (booking: EquipmentBooking) => void;
}

export default function EquipmentRentalIntegration({ projectId, onEquipmentBooked }: EquipmentRentalIntegrationProps) {
  const { user, session, isLoading, error } = useAuth();
  const [equipment, setEquipment] = useState<EquipmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userBookings, setUserBookings] = useState<EquipmentBooking[]>([]);

  const [filters, setFilters] = useState<BookingFilters>({
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    city: 'الرياض' // Default city since user doesn't have city property
  });

  const [bookingForm, setBookingForm] = useState({
    deliveryAddress: '',
    operatorRequired: false,
    specialInstructions: '',
    accessRequirements: ''
  });

  // Equipment categories with Arabic names
  const equipmentCategories = [
    { value: 'crane', label: 'رافعات', icon: '🏗️' },
    { value: 'truck', label: 'شاحنات', icon: '🚛' },
    { value: 'excavator', label: 'حفارات', icon: '🚜' },
    { value: 'mixer', label: 'خلاطات خرسانة', icon: '🚧' },
    { value: 'generator', label: 'مولدات كهرباء', icon: '⚡' },
    { value: 'forklift', label: 'رافعات شوكية', icon: '🏭' },
    { value: 'pump', label: 'مضخات', icon: '🌊' },
    { value: 'compactor', label: 'ضاغطات', icon: '🔨' }
  ];

  useEffect(() => {
    searchEquipment();
    if (user?.id) {
      loadUserBookings();
    }
  }, [user]);

  const searchEquipment = async () => {
    try {
      setLoading(true);
      const results = await equipmentRentalService.searchEquipment(filters);
      setEquipment(results);
    } catch (error) {
      console.error('Error searching equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserBookings = async () => {
    if (user?.id) {
      try {
        const bookings = await equipmentRentalService.getUserBookings(user.id);
        setUserBookings(bookings);
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    }
  };

  const handleBookEquipment = async () => {
    if (!selectedEquipment || !user?.id || !filters.startDate || !filters.endDate) {
      alert('يرجى تحديد تاريخ البداية وتاريخ النهاية قبل الحجز');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate operator cost if required
      const operatorCost = bookingForm.operatorRequired ? selectedEquipment.dailyRate * 0.3 : 0;

      const booking = await equipmentRentalService.bookEquipment({
        equipmentId: selectedEquipment.id,
        providerId: selectedEquipment.providerId || 'default-provider',
        projectId,
        userId: user.id,
        startDate: filters.startDate!,
        endDate: filters.endDate!,
        deliveryAddress: bookingForm.deliveryAddress,
        coordinates: bookingForm.deliveryAddress 
          ? await geocodeAddress(bookingForm.deliveryAddress)
          : { lat: 24.7136, lng: 46.6753 }, // Default Riyadh coordinates
        totalCost: 0, // Will be calculated in service
        status: 'pending',
        bookingDetails: {
          operatorRequired: bookingForm.operatorRequired,
          operatorCost,
          specialInstructions: bookingForm.specialInstructions,
          accessRequirements: bookingForm.accessRequirements
        }
      });

      setShowBookingDialog(false);
      setSelectedEquipment(null);
      loadUserBookings();
      
      if (onEquipmentBooked) {
        onEquipmentBooked(booking);
      }

    } catch (error) {
      console.error('Error booking equipment:', error);
      alert('حدث خطأ في حجز المعدة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalCost = (equipment: EquipmentType): number => {
    const start = filters.startDate!;
    const end = filters.endDate!;
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const equipmentCost = equipment.dailyRate * days;
    const operatorCost = bookingForm.operatorRequired ? equipment.dailyRate * 0.3 * days : 0;
    return equipmentCost + operatorCost + equipment.deliveryFee;
  };

  return (
    <div className="space-y-6">
      {/* Integration Header */}
      <Card className="border-l-4 border-l-orange-500 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Truck className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">خدمة تأجير المعدات والمركبات</h3>
                <p className="text-sm text-orange-600">احجز المعدات اللازمة لمشروعك مع التتبع المباشر</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              فلترة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              معايير البحث
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Equipment Type */}
              <div>
                <label className="text-sm font-medium">نوع المعدة</label>
                <Select
                  value={filters.equipmentType || ''}
                  onValueChange={(value: string) => setFilters(prev => ({ ...prev, equipmentType: value || undefined }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="جميع الأنواع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">جميع الأنواع</SelectItem>
                    {equipmentCategories.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div>
                <label className="text-sm font-medium">المدينة</label>
                <Select
                  value={filters.city || ''}
                  onValueChange={(value: string) => setFilters(prev => ({ ...prev, city: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المدينة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="الرياض">الرياض</SelectItem>
                    <SelectItem value="جدة">جدة</SelectItem>
                    <SelectItem value="الدمام">الدمام</SelectItem>
                    <SelectItem value="مكة المكرمة">مكة المكرمة</SelectItem>
                    <SelectItem value="المدينة المنورة">المدينة المنورة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div>
                <label className="text-sm font-medium">تاريخ البداية</label>
                <Popover
                  content={
                    <div className="w-auto p-0">
                      <Calendar
                        selected={filters.startDate}
                        onSelect={(date) => {
                          if (date) {
                            setFilters(prev => ({ ...prev, startDate: date! }));
                          }
                        }}
                        disabled={(date: Date) => date < new Date()}
                      />
                    </div>
                  }
                >
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? format(filters.startDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </Popover>
              </div>

              {/* End Date */}
              <div>
                <label className="text-sm font-medium">تاريخ النهاية</label>
                <Popover
                  content={
                    <div className="w-auto p-0">
                      <Calendar
                        selected={filters.endDate}
                        onSelect={(date) => {
                          if (date) {
                            setFilters(prev => ({ ...prev, endDate: date! }));
                          }
                        }}
                        disabled={(date: Date) => date < (filters.startDate || new Date())}
                      />
                    </div>
                  }
                >
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? format(filters.endDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </Popover>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="needsOperator"
                checked={filters.needsOperator}
                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, needsOperator: checked as boolean }))}
              />
              <label htmlFor="needsOperator" className="text-sm">احتاج إلى مشغل</label>
            </div>

            <Button onClick={searchEquipment} disabled={loading} className="w-full">
              {loading ? 'جاري البحث...' : 'بحث عن المعدات'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={item.images[0] || '/api/placeholder/300/200'}
                alt={item.nameAr}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-orange-600">
                {equipmentCategories.find(cat => cat.value === item.category)?.label || item.category}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.nameAr}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.name}</p>
              
              {/* Specifications */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Weight className="w-4 h-4 text-gray-500" />
                  <span>الحمولة: {item.specifications.maxLoad} طن</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Fuel className="w-4 h-4 text-gray-500" />
                  <span>نوع الوقود: {item.specifications.fuelType === 'diesel' ? 'ديزل' : item.specifications.fuelType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Ruler className="w-4 h-4 text-gray-500" />
                  <span>الأبعاد: {item.specifications.dimensions.length}×{item.specifications.dimensions.width}×{item.specifications.dimensions.height} م</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span>السعر اليومي:</span>
                  <span className="font-semibold text-green-600">{item.dailyRate.toLocaleString('en-US')} {item.currency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>رسوم التوصيل:</span>
                  <span>{item.deliveryFee.toLocaleString('en-US')} {item.currency}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>التكلفة الإجمالية:</span>
                  <span className="text-green-600">{calculateTotalCost(item).toLocaleString('en-US')} {item.currency}</span>
                </div>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {item.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{item.features.length - 3} المزيد
                  </Badge>
                )}
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  setSelectedEquipment(item);
                  setShowBookingDialog(true);
                }}
              >
                احجز الآن
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {!loading && equipment.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <Truck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد معدات متاحة</h3>
            <p className="text-gray-500 mb-4">لم نجد معدات تطابق معايير البحث المحددة</p>
            <Button variant="outline" onClick={() => setFilters({
              startDate: new Date(),
              endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              city: 'الرياض' // Default city
            })}>
              إعادة تعيين البحث
            </Button>
          </CardContent>
        </Card>
      )}

      {/* User Bookings */}
      {userBookings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              حجوزاتي الحالية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userBookings.slice(0, 3).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">حجز رقم: {booking.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      {format(booking.startDate, "PPP", { locale: ar })} - {format(booking.endDate, "PPP", { locale: ar })}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      booking.status === 'confirmed' ? 'default' :
                      booking.status === 'pending' ? 'secondary' :
                      booking.status === 'in-transit' ? 'outline' :
                      'destructive'
                    }>
                      {booking.status === 'pending' && 'في الانتظار'}
                      {booking.status === 'confirmed' && 'مؤكد'}
                      {booking.status === 'in-transit' && 'في الطريق'}
                      {booking.status === 'delivered' && 'تم التوصيل'}
                      {booking.status === 'completed' && 'مكتمل'}
                      {booking.status === 'cancelled' && 'ملغي'}
                    </Badge>
                    <p className="text-sm font-semibold text-green-600">
                      {booking.totalCost.toLocaleString('en-US')} ر.س
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>حجز {selectedEquipment?.nameAr}</DialogTitle>
          </DialogHeader>
          
          {selectedEquipment && (
            <div className="space-y-6">
              {/* Equipment Summary */}
              <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={selectedEquipment.images[0] || '/api/placeholder/120/80'}
                  alt={selectedEquipment.nameAr}
                  className="w-20 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedEquipment.nameAr}</h4>
                  <p className="text-sm text-gray-600">{selectedEquipment.name}</p>
                  <p className="text-sm font-semibold text-green-600">
                    {selectedEquipment.dailyRate.toLocaleString('en-US')} ر.س / يوم
                  </p>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">عنوان التوصيل</label>
                  <Input
                    value={bookingForm.deliveryAddress}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, deliveryAddress: e.target.value }))}
                    placeholder="أدخل عنوان موقع المشروع"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="operatorRequired"
                    checked={bookingForm.operatorRequired}
                    onCheckedChange={(checked) => setBookingForm(prev => ({ ...prev, operatorRequired: checked as boolean }))}
                  />
                  <label htmlFor="operatorRequired" className="text-sm">
                    احتاج إلى مشغل (إضافة {(selectedEquipment.dailyRate * 0.3).toLocaleString('en-US')} ر.س / يوم)
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium">تعليمات خاصة</label>
                  <Input
                    value={bookingForm.specialInstructions}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, specialInstructions: e.target.value }))}
                    placeholder="أي تعليمات خاصة للمزود"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">متطلبات الوصول</label>
                  <Input
                    value={bookingForm.accessRequirements}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, accessRequirements: e.target.value }))}
                    placeholder="مثل: مدخل واسع، رافعة، إلخ"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold mb-3">تفاصيل التكلفة</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>تكلفة المعدة ({Math.ceil((filters.endDate.getTime() - filters.startDate.getTime()) / (1000 * 60 * 60 * 24))} أيام):</span>
                    <span>{(selectedEquipment.dailyRate * Math.ceil((filters.endDate.getTime() - filters.startDate.getTime()) / (1000 * 60 * 60 * 24))).toLocaleString('en-US')} ر.س</span>
                  </div>
                  {bookingForm.operatorRequired && (
                    <div className="flex justify-between">
                      <span>تكلفة المشغل:</span>
                      <span>{(selectedEquipment.dailyRate * 0.3 * Math.ceil((filters.endDate.getTime() - filters.startDate.getTime()) / (1000 * 60 * 60 * 24))).toLocaleString('en-US')} ر.س</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>رسوم التوصيل:</span>
                    <span>{selectedEquipment.deliveryFee.toLocaleString('en-US')} ر.س</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>الإجمالي:</span>
                    <span className="text-green-600">{calculateTotalCost(selectedEquipment).toLocaleString('en-US')} ر.س</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowBookingDialog(false)}
                >
                  إلغاء
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleBookEquipment}
                  disabled={loading || !bookingForm.deliveryAddress}
                >
                  {loading ? 'جاري الحجز...' : 'تأكيد الحجز'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}







