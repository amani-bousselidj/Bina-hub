// Equipment Rental Service with Real Data Integration
// Integrates with construction equipment rental providers

import { BaseService } from './base-service';

export interface EquipmentType {
  id: string;
  name: string;
  nameAr: string;
  providerId: string;
  category: 'crane' | 'truck' | 'excavator' | 'mixer' | 'generator' | 'forklift' | 'pump' | 'compactor';
  specifications: {
    capacity: string;
    maxLoad: number;
    fuelType: 'diesel' | 'electric' | 'hybrid';
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  deliveryFee: number;
  currency: string;
  images: string[];
  features: string[];
  requirements: string[];
}

export interface EquipmentProvider {
  id: string;
  name: string;
  nameAr: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  equipment: EquipmentType[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  operatingHours: {
    weekdays: { open: string; close: string };
    weekends: { open: string; close: string };
  };
  serviceAreas: string[];
  certifications: string[];
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  providerId: string;
  projectId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  deliveryAddress: string;
  coordinates: { lat: number; lng: number };
  totalCost: number;
  status: 'pending' | 'confirmed' | 'in-transit' | 'delivered' | 'in-use' | 'returned' | 'completed' | 'cancelled';
  bookingDetails: {
    operatorRequired: boolean;
    operatorCost?: number;
    specialInstructions?: string;
    accessRequirements?: string;
  };
  deliveryInfo?: {
    estimatedDelivery: Date;
    actualDelivery?: Date;
    driverName?: string;
    driverPhone?: string;
    vehicleInfo?: string;
  };
  trackingInfo?: {
    currentLocation: { lat: number; lng: number };
    lastUpdate: Date;
    eta?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingFilters {
  equipmentType?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  maxBudget?: number;
  requiredCapacity?: string;
  needsOperator?: boolean;
  city?: string;
}

class EquipmentRentalService extends BaseService {
  private static instance: EquipmentRentalService;

  static getInstance(): EquipmentRentalService {
    if (!EquipmentRentalService.instance) {
      EquipmentRentalService.instance = new EquipmentRentalService();
    }
    return EquipmentRentalService.instance;
  }

  // Search available equipment based on filters
  async searchEquipment(filters: BookingFilters): Promise<EquipmentType[]> {
    try {
      const { data: equipment, error } = await this.supabase
        .from('equipment_inventory')
        .select(`
          *,
          equipment_providers!inner(
            id, name, name_ar, city, service_areas, rating, is_verified
          )
        `)
        .eq('is_available', true)
        .gte('daily_rate', 0);

      if (error) throw error;

      // Filter by location if specified
      let filteredEquipment = equipment;
      if (filters.city) {
        filteredEquipment = equipment.filter(item => 
          item.equipment_providers.city === filters.city ||
          item.equipment_providers.service_areas.includes(filters.city)
        );
      }

      // Filter by equipment type
      if (filters.equipmentType) {
        filteredEquipment = filteredEquipment.filter(item => 
          item.category === filters.equipmentType
        );
      }

      // Filter by budget
      if (filters.maxBudget) {
        filteredEquipment = filteredEquipment.filter(item => 
          item.daily_rate <= filters.maxBudget!
        );
      }

      // Check availability for date range
      if (!filters.startDate || !filters.endDate) {
        throw new Error('Start date and end date are required');
      }
      const availableEquipment = await this.checkAvailability(
        filteredEquipment.map(item => item.id),
        filters.startDate!,
        filters.endDate!
      );

      return filteredEquipment
        .filter(item => availableEquipment.includes(item.id))
        .map(item => this.mapToEquipmentType({
          ...item,
          provider_id: item.equipment_providers.id
        }));

    } catch (error) {
      console.error('Error searching equipment:', error);
      throw new Error('Failed to search equipment');
    }
  }

  // Check equipment availability for specific date range
  async checkAvailability(equipmentIds: string[], startDate: Date, endDate: Date): Promise<string[]> {
    try {
      const { data: bookings, error } = await this.supabase
        .from('equipment_bookings')
        .select('equipment_id')
        .in('equipment_id', equipmentIds)
        .in('status', ['confirmed', 'in-transit', 'delivered', 'in-use'])
        .or(`start_date.lte.${endDate.toISOString()},end_date.gte.${startDate.toISOString()}`);

      if (error) throw error;

      const bookedEquipmentIds = bookings.map(booking => booking.equipment_id);
      return equipmentIds.filter(id => !bookedEquipmentIds.includes(id));

    } catch (error) {
      console.error('Error checking availability:', error);
      return [];
    }
  }

  // Create a new equipment booking
  async bookEquipment(bookingData: Omit<EquipmentBooking, 'id' | 'createdAt' | 'updatedAt'>): Promise<EquipmentBooking> {
    try {
      // Calculate total cost
      const equipment = await this.getEquipmentById(bookingData.equipmentId);
      const days = Math.ceil((bookingData.endDate.getTime() - bookingData.startDate.getTime()) / (1000 * 60 * 60 * 24));
      const equipmentCost = equipment.dailyRate * days;
      const operatorCost = bookingData.bookingDetails.operatorRequired ? (bookingData.bookingDetails.operatorCost || 0) * days : 0;
      const totalCost = equipmentCost + operatorCost + equipment.deliveryFee;

      const { data: booking, error } = await this.supabase
        .from('equipment_bookings')
        .insert({
          equipment_id: bookingData.equipmentId,
          provider_id: bookingData.providerId,
          project_id: bookingData.projectId,
          user_id: bookingData.userId,
          start_date: bookingData.startDate.toISOString(),
          end_date: bookingData.endDate.toISOString(),
          delivery_address: bookingData.deliveryAddress,
          coordinates: bookingData.coordinates,
          total_cost: totalCost,
          status: 'pending',
          booking_details: bookingData.bookingDetails,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification to provider
      await this.notifyProvider(bookingData.providerId, booking.id);

      return this.mapToBooking(booking);

    } catch (error) {
      console.error('Error creating booking:', error);
      throw new Error('Failed to create equipment booking');
    }
  }

  // Track equipment location and status
  async trackEquipment(bookingId: string): Promise<EquipmentBooking | null> {
    try {
      const { data: booking, error } = await this.supabase
        .from('equipment_bookings')
        .select(`
          *,
          equipment_inventory!inner(
            name, name_ar, category, specifications, images
          ),
          equipment_providers!inner(
            name, name_ar, contact_phone, contact_email
          )
        `)
        .eq('id', bookingId)
        .single();

      if (error) throw error;

      // Get latest tracking update if equipment is in transit
      if (['confirmed', 'in-transit', 'delivered'].includes(booking.status)) {
        const { data: tracking } = await this.supabase
          .from('equipment_tracking')
          .select('*')
          .eq('booking_id', bookingId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (tracking) {
          booking.tracking_info = {
            current_location: tracking.current_location,
            last_update: tracking.created_at,
            eta: tracking.estimated_arrival
          };
        }
      }

      return this.mapToBooking(booking);

    } catch (error) {
      console.error('Error tracking equipment:', error);
      return null;
    }
  }

  // Get equipment providers by city/area
  async getProvidersByLocation(city: string): Promise<EquipmentProvider[]> {
    try {
      const { data: providers, error } = await this.supabase
        .from('equipment_providers')
        .select(`
          *,
          equipment_inventory(*)
        `)
        .or(`city.eq.${city},service_areas.cs.{${city}}`)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      return providers.map(this.mapToProvider);

    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  }

  // Update booking status (for providers)
  async updateBookingStatus(bookingId: string, status: EquipmentBooking['status'], additionalData?: any): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (additionalData) {
        if (additionalData.deliveryInfo) {
          updateData.delivery_info = additionalData.deliveryInfo;
        }
        if (additionalData.trackingInfo) {
          updateData.tracking_info = additionalData.trackingInfo;
        }
      }

      const { error } = await this.supabase
        .from('equipment_bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;

      // Send notification to customer
      await this.notifyCustomer(bookingId, status);

      return true;

    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  }

  // Cancel booking
  async cancelBooking(bookingId: string, reason?: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('equipment_bookings')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (error) throw error;

      return true;

    } catch (error) {
      console.error('Error cancelling booking:', error);
      return false;
    }
  }

  // Get user's bookings
  async getUserBookings(userId: string): Promise<EquipmentBooking[]> {
    try {
      const { data: bookings, error } = await this.supabase
        .from('equipment_bookings')
        .select(`
          *,
          equipment_inventory!inner(
            name, name_ar, category, images
          ),
          equipment_providers!inner(
            name, name_ar, contact_phone
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return bookings.map(this.mapToBooking);

    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }

  // Add provider-specific methods
  async getProviderEquipment(providerId: string): Promise<EquipmentType[]> {
    const { data, error } = await this.supabase
      .from('equipment_inventory')
      .select('*')
      .eq('provider_id', providerId);
    if (error) throw error;
    return data as EquipmentType[];
  }

  async getProviderBookings(providerId: string): Promise<EquipmentBooking[]> {
    const { data, error } = await this.supabase
      .from('equipment_bookings')
      .select('*')
      .eq('provider_id', providerId);
    if (error) throw error;
    return data as EquipmentBooking[];
  }

  async getProviderAnalytics(providerId: string): Promise<any> {
    // Example analytics: count of bookings
    const { data, error } = await this.supabase
      .from('equipment_bookings')
      .select('id', { count: 'exact' })
      .eq('provider_id', providerId);
    if (error) throw error;
    return { totalBookings: data.length };
  }

  // Private helper methods
  private async getEquipmentById(equipmentId: string): Promise<EquipmentType> {
    const { data: equipment, error } = await this.supabase
      .from('equipment_inventory')
      .select('*')
      .eq('id', equipmentId)
      .single();

    if (error) throw error;
    return this.mapToEquipmentType(equipment);
  }

  private async notifyProvider(providerId: string, bookingId: string): Promise<void> {
    // Send real-time notification to provider
    await this.supabase
      .from('notifications')
      .insert({
        recipient_id: providerId,
        type: 'equipment_booking_request',
        title: 'طلب حجز معدات جديد',
        message: 'لديك طلب حجز معدات جديد يتطلب المراجعة',
        data: { bookingId },
        created_at: new Date().toISOString()
      });
  }

  private async notifyCustomer(bookingId: string, status: string): Promise<void> {
    const { data: booking } = await this.supabase
      .from('equipment_bookings')
      .select('user_id')
      .eq('id', bookingId)
      .single();

    if (booking) {
      await this.supabase
        .from('notifications')
        .insert({
          recipient_id: booking.user_id,
          type: 'equipment_booking_update',
          title: 'تحديث حالة حجز المعدات',
          message: `تم تحديث حالة حجز المعدات إلى: ${this.getStatusInArabic(status)}`,
          data: { bookingId, status },
          created_at: new Date().toISOString()
        });
    }
  }

  private getStatusInArabic(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'في الانتظار',
      'confirmed': 'مؤكد',
      'in-transit': 'في الطريق',
      'delivered': 'تم التوصيل',
      'in-use': 'قيد الاستخدام',
      'returned': 'تم الإرجاع',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  }

  private mapToEquipmentType(data: any): EquipmentType {
    return {
      id: data.id,
      name: data.name,
      nameAr: data.name_ar,
      providerId: data.provider_id,
      category: data.category,
      specifications: data.specifications,
      hourlyRate: data.hourly_rate,
      dailyRate: data.daily_rate,
      weeklyRate: data.weekly_rate,
      monthlyRate: data.monthly_rate,
      deliveryFee: data.delivery_fee,
      currency: data.currency || 'SAR',
      images: data.images || [],
      features: data.features || [],
      requirements: data.requirements || []
    };
  }

  private mapToProvider(data: any): EquipmentProvider {
    return {
      id: data.id,
      name: data.name,
      nameAr: data.name_ar,
      contactInfo: {
        phone: data.contact_phone,
        email: data.contact_email,
        address: data.address,
        city: data.city,
        coordinates: data.coordinates
      },
      equipment: data.equipment_inventory?.map(this.mapToEquipmentType) || [],
      rating: data.rating,
      reviewCount: data.review_count,
      isVerified: data.is_verified,
      operatingHours: data.operating_hours,
      serviceAreas: data.service_areas,
      certifications: data.certifications || []
    };
  }

  private mapToBooking(data: any): EquipmentBooking {
    return {
      id: data.id,
      equipmentId: data.equipment_id,
      providerId: data.provider_id,
      projectId: data.project_id,
      userId: data.user_id,
      startDate: new Date(data.start_date),
      endDate: new Date(data.end_date),
      deliveryAddress: data.delivery_address,
      coordinates: data.coordinates,
      totalCost: data.total_cost,
      status: data.status,
      bookingDetails: data.booking_details,
      deliveryInfo: data.delivery_info,
      trackingInfo: data.tracking_info,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }
}

// Added instance and default export for EquipmentRentalService
export const equipmentRentalService = new EquipmentRentalService();
export default equipmentRentalService;




