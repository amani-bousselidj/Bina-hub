import { supabase } from '@/lib/supabase/client';

export type BookingService = 'equipment-rental' | 'waste-management' | 'concrete-supply' | 'design-office' | 'insurance';

export interface BookingDetails {
  service_type: BookingService;
  project_id: string;
  provider_id: string;
  service_details: any;
  scheduled_date: Date;
  scheduled_time: string;
  duration_hours?: number;
  location: string;
  special_instructions?: string;
  estimated_cost: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Booking {
  id: string;
  project_id: string;
  service_type: BookingService;
  provider_id: string;
  provider_name: string;
  service_details: any;
  scheduled_date: Date;
  scheduled_time: string;
  duration_hours: number;
  location: string;
  special_instructions?: string;
  estimated_cost: number;
  actual_cost?: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
  completion_notes?: string;
  rating?: number;
  review?: string;
}

export interface ConflictResolution {
  conflict_id: string;
  conflicting_bookings: Booking[];
  suggested_alternatives: {
    booking_id: string;
    alternative_date: Date;
    alternative_time: string;
    reason: string;
  }[];
  resolution_type: 'reschedule' | 'provider_change' | 'service_split';
  impact_assessment: string;
}

export interface TimelineSync {
  project_id: string;
  synchronized_bookings: Booking[];
  timeline_adjustments: {
    phase: string;
    original_date: Date;
    new_date: Date;
    reason: string;
  }[];
  dependencies: {
    booking_id: string;
    depends_on: string[];
    blocks: string[];
  }[];
}

export interface SchedulingRecommendation {
  project_id: string;
  recommended_schedule: {
    service_type: BookingService;
    recommended_date: Date;
    recommended_time: string;
    priority: 'high' | 'medium' | 'low';
    reasoning: string;
    dependencies: string[];
  }[];
  optimization_benefits: {
    cost_savings: number;
    time_savings_days: number;
    efficiency_improvement: number;
  };
  weather_considerations: {
    service_type: BookingService;
    weather_impact: string;
    recommended_adjustments: string[];
  }[];
}

export interface BookingCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  service_type: BookingService;
  status: string;
  provider: string;
  location: string;
  cost: number;
  color: string;
}

class UnifiedBookingService {
  private getServiceColor(serviceType: BookingService): string {
    const colors = {
      'equipment-rental': '#f59e0b',
      'waste-management': '#10b981',
      'concrete-supply': '#6b7280',
      'design-office': '#3b82f6',
      'insurance': '#8b5cf6'
    };
    return colors[serviceType] || '#6b7280';
  }

  async createBooking(details: BookingDetails): Promise<Booking> {
    try {
      // Check for conflicts before creating
      const conflicts = await this.checkBookingConflicts(details);
      if (conflicts.length > 0) {
        throw new Error('Booking conflicts detected. Please resolve conflicts first.');
      }

      const bookingData = {
        ...details,
        id: `booking_${Date.now()}`,
        provider_name: await this.getProviderName(details.provider_id),
        duration_hours: details.duration_hours || this.getDefaultDuration(details.service_type),
        created_at: new Date(),
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from('unified_bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

      // Update project timeline
      await this.updateProjectTimeline(details.project_id);

      return data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookingsByProject(projectId: string): Promise<Booking[]> {
    try {
      const { data, error } = await supabase
        .from('unified_bookings')
        .select('*')
        .eq('project_id', projectId)
        .order('scheduled_date');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  }

  async getBookingsForCalendar(projectId: string): Promise<BookingCalendarEvent[]> {
    try {
      const bookings = await this.getBookingsByProject(projectId);
      
      return bookings.map(booking => ({
        id: booking.id,
        title: `${this.getServiceDisplayName(booking.service_type)} - ${booking.provider_name}`,
        start: new Date(`${booking.scheduled_date}T${booking.scheduled_time}`),
        end: new Date(new Date(`${booking.scheduled_date}T${booking.scheduled_time}`).getTime() + 
                     (booking.duration_hours * 60 * 60 * 1000)),
        service_type: booking.service_type,
        status: booking.status,
        provider: booking.provider_name,
        location: booking.location,
        cost: booking.estimated_cost,
        color: this.getServiceColor(booking.service_type)
      }));
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }

  private getServiceDisplayName(serviceType: BookingService): string {
    const names = {
      'equipment-rental': 'تأجير معدات',
      'waste-management': 'إدارة النفايات',
      'concrete-supply': 'توريد خرسانة',
      'design-office': 'مكتب هندسي',
      'insurance': 'تأمين'
    };
    return names[serviceType] || serviceType;
  }

  private getDefaultDuration(serviceType: BookingService): number {
    const durations = {
      'equipment-rental': 8,
      'waste-management': 4,
      'concrete-supply': 6,
      'design-office': 2,
      'insurance': 1
    };
    return durations[serviceType] || 4;
  }

  private async getProviderName(providerId: string): Promise<string> {
    try {
      // This would typically fetch from the providers table
      // For now, returning a placeholder
      return `مقدم خدمة ${providerId.slice(-4)}`;
    } catch (error) {
      return 'مقدم خدمة غير معروف';
    }
  }

  async checkBookingConflicts(newBooking: BookingDetails): Promise<Booking[]> {
    try {
      const startTime = new Date(`${newBooking.scheduled_date}T${newBooking.scheduled_time}`);
      const endTime = new Date(startTime.getTime() + ((newBooking.duration_hours || 4) * 60 * 60 * 1000));

      const { data: existingBookings, error } = await supabase
        .from('unified_bookings')
        .select('*')
        .eq('project_id', newBooking.project_id)
        .eq('scheduled_date', newBooking.scheduled_date.toISOString().split('T')[0])
        .not('status', 'eq', 'cancelled');

      if (error) throw error;

      const conflicts = (existingBookings || []).filter(booking => {
        const bookingStart = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
        const bookingEnd = new Date(bookingStart.getTime() + (booking.duration_hours * 60 * 60 * 1000));

        // Check for time overlap
        return (startTime < bookingEnd && endTime > bookingStart);
      });

      return conflicts;
    } catch (error) {
      console.error('Error checking conflicts:', error);
      return [];
    }
  }

  async manageBookingConflicts(projectId: string): Promise<ConflictResolution[]> {
    try {
      const bookings = await this.getBookingsByProject(projectId);
      const conflicts: ConflictResolution[] = [];

      // Group bookings by date
      const bookingsByDate = bookings.reduce((acc, booking) => {
        const date = booking.scheduled_date.toISOString().split('T')[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(booking);
        return acc;
      }, {} as Record<string, Booking[]>);

      // Check each date for conflicts
      for (const [date, dayBookings] of Object.entries(bookingsByDate)) {
        const sortedBookings = dayBookings.sort((a, b) => 
          a.scheduled_time.localeCompare(b.scheduled_time)
        );

        for (let i = 0; i < sortedBookings.length - 1; i++) {
          const current = sortedBookings[i];
          const next = sortedBookings[i + 1];

          const currentEnd = new Date(`${current.scheduled_date}T${current.scheduled_time}`);
          currentEnd.setHours(currentEnd.getHours() + current.duration_hours);

          const nextStart = new Date(`${next.scheduled_date}T${next.scheduled_time}`);

          if (currentEnd > nextStart) {
            // Conflict detected
            const conflictId = `conflict_${Date.now()}_${i}`;
            const suggestedAlternatives = await this.generateAlternatives([current, next]);

            conflicts.push({
              conflict_id: conflictId,
              conflicting_bookings: [current, next],
              suggested_alternatives: suggestedAlternatives,
              resolution_type: 'reschedule',
              impact_assessment: this.assessConflictImpact([current, next])
            });
          }
        }
      }

      return conflicts;
    } catch (error) {
      console.error('Error managing conflicts:', error);
      throw error;
    }
  }

  private async generateAlternatives(conflictingBookings: Booking[]): Promise<ConflictResolution['suggested_alternatives']> {
    // Generate alternative scheduling options
    const alternatives: ConflictResolution['suggested_alternatives'] = [];
    const baseDate = new Date(conflictingBookings[0].scheduled_date);

    for (let dayOffset = 1; dayOffset <= 7; dayOffset++) {
      const alternativeDate = new Date(baseDate);
      alternativeDate.setDate(alternativeDate.getDate() + dayOffset);

      alternatives.push({
        booking_id: conflictingBookings[1].id,
        alternative_date: alternativeDate,
        alternative_time: '08:00',
        reason: `تجنب التعارض مع ${conflictingBookings[0].service_type}`
      });
    }

    return alternatives;
  }

  private assessConflictImpact(bookings: Booking[]): string {
    const totalCost = bookings.reduce((sum, booking) => sum + booking.estimated_cost, 0);
    const services = bookings.map(b => this.getServiceDisplayName(b.service_type)).join(', ');
    
    return `تعارض بين ${services} بتكلفة إجمالية ${totalCost.toLocaleString()} ريال`;
  }

  async syncWithProjectTimeline(projectId: string): Promise<TimelineSync> {
    try {
      const bookings = await this.getBookingsByProject(projectId);
      const dependencies = this.calculateDependencies(bookings);
      const timelineAdjustments = await this.calculateTimelineAdjustments(projectId, bookings);

      return {
        project_id: projectId,
        synchronized_bookings: bookings,
        timeline_adjustments: timelineAdjustments,
        dependencies: dependencies
      };
    } catch (error) {
      console.error('Error syncing timeline:', error);
      throw error;
    }
  }

  private calculateDependencies(bookings: Booking[]) {
    // Calculate service dependencies
    const dependencies = bookings.map(booking => {
      const dependsOn: string[] = [];
      const blocks: string[] = [];

      // Equipment rental typically comes first
      if (booking.service_type === 'concrete-supply') {
        const equipmentBooking = bookings.find(b => 
          b.service_type === 'equipment-rental' && 
          b.scheduled_date <= booking.scheduled_date
        );
        if (equipmentBooking) {
          dependsOn.push(equipmentBooking.id);
        }
      }

      // Waste management typically comes after construction work
      if (booking.service_type === 'waste-management') {
        const constructionBookings = bookings.filter(b => 
          ['equipment-rental', 'concrete-supply'].includes(b.service_type) &&
          b.scheduled_date < booking.scheduled_date
        );
        dependsOn.push(...constructionBookings.map(b => b.id));
      }

      return {
        booking_id: booking.id,
        depends_on: dependsOn,
        blocks: blocks
      };
    });

    return dependencies;
  }

  private async calculateTimelineAdjustments(projectId: string, bookings: Booking[]) {
    // This would integrate with the existing project timeline system
    // For now, returning empty adjustments
    return [];
  }

  async recommendOptimalScheduling(projectId: string): Promise<SchedulingRecommendation> {
    try {
      const existingBookings = await this.getBookingsByProject(projectId);
      const recommendations: SchedulingRecommendation['recommended_schedule'] = [];

      // Optimal scheduling logic
      const services: BookingService[] = ['design-office', 'equipment-rental', 'concrete-supply', 'waste-management', 'insurance'];
      let currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 2); // Start 2 days from now

      for (const serviceType of services) {
        const existingBooking = existingBookings.find(b => b.service_type === serviceType);
        if (!existingBooking) {
          recommendations.push({
            service_type: serviceType,
            recommended_date: new Date(currentDate),
            recommended_time: this.getOptimalTimeForService(serviceType),
            priority: this.getServicePriority(serviceType),
            reasoning: this.getSchedulingReasoning(serviceType),
            dependencies: this.getServiceDependencies(serviceType)
          });

          // Add buffer time between services
          currentDate.setDate(currentDate.getDate() + this.getServiceBuffer(serviceType));
        }
      }

      const optimization = this.calculateOptimizationBenefits(recommendations);
      const weatherConsiderations = await this.getWeatherConsiderations(recommendations);

      return {
        project_id: projectId,
        recommended_schedule: recommendations,
        optimization_benefits: optimization,
        weather_considerations: weatherConsiderations
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  private getOptimalTimeForService(serviceType: BookingService): string {
    const optimalTimes = {
      'design-office': '10:00',
      'equipment-rental': '07:00',
      'concrete-supply': '06:00',
      'waste-management': '14:00',
      'insurance': '09:00'
    };
    return optimalTimes[serviceType] || '09:00';
  }

  private getServicePriority(serviceType: BookingService): 'high' | 'medium' | 'low' {
    const priorities = {
      'design-office': 'high' as const,
      'equipment-rental': 'high' as const,
      'concrete-supply': 'high' as const,
      'waste-management': 'medium' as const,
      'insurance': 'low' as const
    };
    return priorities[serviceType] || 'medium';
  }

  private getSchedulingReasoning(serviceType: BookingService): string {
    const reasoning = {
      'design-office': 'يجب إكمال التصاميم قبل بدء العمل',
      'equipment-rental': 'المعدات مطلوبة لبدء أعمال البناء',
      'concrete-supply': 'يتم جدولتها بناءً على مراحل البناء',
      'waste-management': 'تتم بعد انتهاء أعمال البناء',
      'insurance': 'يمكن ترتيبها في أي وقت مناسب'
    };
    return reasoning[serviceType] || 'جدولة عادية';
  }

  private getServiceDependencies(serviceType: BookingService): string[] {
    const dependencies = {
      'design-office': [],
      'equipment-rental': ['design-office'],
      'concrete-supply': ['design-office', 'equipment-rental'],
      'waste-management': ['equipment-rental', 'concrete-supply'],
      'insurance': []
    };
    return dependencies[serviceType] || [];
  }

  private getServiceBuffer(serviceType: BookingService): number {
    const buffers = {
      'design-office': 7,
      'equipment-rental': 1,
      'concrete-supply': 2,
      'waste-management': 1,
      'insurance': 0
    };
    return buffers[serviceType] || 1;
  }

  private calculateOptimizationBenefits(recommendations: any[]) {
    return {
      cost_savings: recommendations.length * 500, // Estimated savings per optimized booking
      time_savings_days: recommendations.length * 0.5,
      efficiency_improvement: 85 // Percentage
    };
  }

  private async getWeatherConsiderations(recommendations: any[]) {
    return recommendations.map(rec => ({
      service_type: rec.service_type,
      weather_impact: 'متوسط',
      recommended_adjustments: ['تجنب الأيام الممطرة', 'تفضيل الساعات الباردة']
    }));
  }

  private async updateProjectTimeline(projectId: string) {
    // This would update the main project timeline
    // Integration with existing timeline system
    try {
      const { error } = await supabase
        .from('projects')
        .update({ updated_at: new Date() })
        .eq('id', projectId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating project timeline:', error);
    }
  }

  async updateBookingStatus(bookingId: string, status: Booking['status'], notes?: string): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date()
      };

      if (notes) {
        updateData.completion_notes = notes;
      }

      const { error } = await supabase
        .from('unified_bookings')
        .update(updateData)
        .eq('id', bookingId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId: string, reason: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('unified_bookings')
        .update({
          status: 'cancelled',
          completion_notes: `ملغي: ${reason}`,
          updated_at: new Date()
        })
        .eq('id', bookingId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async addBookingReview(bookingId: string, rating: number, review: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('unified_bookings')
        .update({
          rating,
          review,
          updated_at: new Date()
        })
        .eq('id', bookingId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }
}

export const unifiedBookingService = new UnifiedBookingService();

// Default export the unifiedBookingService instance
export default unifiedBookingService;
