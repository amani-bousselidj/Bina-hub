// Waste Management Service with Real Data Integration
// Handles construction waste collection, pin delivery, and tracking

import { BaseService } from './base-service';

export interface WasteType {
  id: string;
  name: string;
  nameAr: string;
  category: 'construction' | 'concrete' | 'metal' | 'wood' | 'mixed' | 'hazardous' | 'recyclable';
  description: string;
  descriptionAr: string;
  image: string;
  density: number; // kg/m³
  disposalCost: number; // per ton
  recyclingValue?: number; // per ton if recyclable
  environmentalImpact: 'low' | 'medium' | 'high';
  specialHandling: boolean;
  requirements: string[];
}

export interface ContainerSize {
  id: string;
  name: string;
  nameAr: string;
  capacity: number; // m³
  maxWeight: number; // tons
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  rentalCost: number; // per day
  deliveryCost: number;
  pickupCost: number;
  image: string;
  suitableFor: string[]; // waste type IDs
}

export interface WasteProvider {
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
  serviceAreas: string[];
  wasteTypes: string[]; // waste type IDs they handle
  containerSizes: string[]; // container size IDs they offer
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isEcoFriendly: boolean;
  certifications: string[];
  operatingHours: {
    weekdays: { open: string; close: string };
    weekends: { open: string; close: string };
  };
  emergencyService: boolean;
  pricing: {
    baseRate: number;
    distanceRate: number; // per km
    weightRate: number; // per ton
    expediteRate: number; // percentage for urgent requests
  };
}

export interface WasteCollectionSchedule {
  id: string;
  projectId: string;
  providerId: string;
  userId: string;
  wasteTypes: string[];
  estimatedVolume: number; // m³
  estimatedWeight: number; // tons
  containerSize: string;
  containerQuantity: number;
  collectionAddress: string;
  coordinates: { lat: number; lng: number };
  scheduledDate: Date;
  preferredTimeSlot: 'morning' | 'afternoon' | 'evening' | 'flexible';
  status: 'scheduled' | 'pin-delivered' | 'collecting' | 'completed' | 'cancelled';
  totalCost: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  specialInstructions?: string;
  accessRequirements?: string;
  contactPerson: {
    name: string;
    phone: string;
  };
  
  // Pin/Container tracking
  pinDelivery?: {
    scheduledDate: Date;
    actualDate?: Date;
    driverName?: string;
    driverPhone?: string;
    pinNumbers: string[];
    deliveryNotes?: string;
  };
  
  // Collection tracking
  collectionInfo?: {
    startTime?: Date;
    completionTime?: Date;
    actualVolume?: number;
    actualWeight?: number;
    wasteCondition: string;
    photos: string[];
    certificate?: string; // disposal certificate
    recyclingReport?: {
      recycledAmount: number;
      recyclingFacility: string;
      environmentalBenefit: string;
    };
  };
  
  // Real-time tracking
  trackingInfo?: {
    vehicleLocation: { lat: number; lng: number };
    driverName: string;
    driverPhone: string;
    eta: Date;
    status: string;
    lastUpdate: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface VolumeEstimation {
  wasteType: string;
  estimatedVolume: number;
  estimatedWeight: number;
  recommendedContainer: string;
  containerQuantity: number;
  estimatedCost: number;
  environmentalTips: string[];
}

class WasteManagementService extends BaseService {
  private static instance: WasteManagementService;

  static getInstance(): WasteManagementService {
    if (!WasteManagementService.instance) {
      WasteManagementService.instance = new WasteManagementService();
    }
    return WasteManagementService.instance;
  }

  // Get available waste types
  async getWasteTypes(): Promise<WasteType[]> {
    try {
      const { data: wasteTypes, error } = await this.supabase
        .from('waste_types')
        .select('*')
        .eq('is_active', true)
        .order('category');

      if (error) throw error;
      return wasteTypes.map(this.mapToWasteType);
    } catch (error) {
      console.error('Error fetching waste types:', error);
      return [];
    }
  }

  // Get available container sizes
  async getContainerSizes(): Promise<ContainerSize[]> {
    try {
      const { data: containers, error } = await this.supabase
        .from('waste_containers')
        .select('*')
        .eq('is_available', true)
        .order('capacity');

      if (error) throw error;
      return containers.map(this.mapToContainerSize);
    } catch (error) {
      console.error('Error fetching container sizes:', error);
      return [];
    }
  }

  // Calculate volume estimation based on project details
  async calculateVolumeEstimation(projectData: {
    area: number;
    floors: number;
    projectType: string;
    constructionPhase: string;
    wasteTypes: string[];
  }): Promise<VolumeEstimation[]> {
    try {
      const wasteTypes = await this.getWasteTypes();
      const containerSizes = await this.getContainerSizes();
      
      return projectData.wasteTypes.map(wasteTypeId => {
        const wasteType = wasteTypes.find(wt => wt.id === wasteTypeId);
        if (!wasteType) return null;

        // Calculate estimated volume based on construction data
        let volumeMultiplier = 0;
        switch (wasteType.category) {
          case 'construction':
            volumeMultiplier = projectData.area * 0.15; // 0.15 m³ per m² of construction
            break;
          case 'concrete':
            volumeMultiplier = projectData.area * 0.1 * projectData.floors;
            break;
          case 'metal':
            volumeMultiplier = projectData.area * 0.02;
            break;
          case 'wood':
            volumeMultiplier = projectData.area * 0.05;
            break;
          default:
            volumeMultiplier = projectData.area * 0.08;
        }

        const estimatedVolume = volumeMultiplier;
        const estimatedWeight = estimatedVolume * wasteType.density / 1000; // convert to tons

        // Find suitable container
        const suitableContainers = containerSizes.filter(cs => 
          cs.suitableFor.includes(wasteTypeId) && cs.capacity >= estimatedVolume
        );
        
        const recommendedContainer = suitableContainers[0];
        const containerQuantity = recommendedContainer ? 
          Math.ceil(estimatedVolume / recommendedContainer.capacity) : 1;

        const estimatedCost = estimatedWeight * wasteType.disposalCost + 
          (recommendedContainer ? recommendedContainer.rentalCost * containerQuantity : 0);

        return {
          wasteType: wasteTypeId,
          estimatedVolume,
          estimatedWeight,
          recommendedContainer: recommendedContainer?.id || '',
          containerQuantity,
          estimatedCost,
          environmentalTips: this.getEnvironmentalTips(wasteType.category)
        };
      }).filter(Boolean) as VolumeEstimation[];

    } catch (error) {
      console.error('Error calculating volume estimation:', error);
      return [];
    }
  }

  // Schedule waste collection
  async scheduleWasteCollection(scheduleData: Omit<WasteCollectionSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<WasteCollectionSchedule> {
    try {
      const { data: schedule, error } = await this.supabase
        .from('waste_collection_schedules')
        .insert({
          project_id: scheduleData.projectId,
          provider_id: scheduleData.providerId,
          user_id: scheduleData.userId,
          waste_types: scheduleData.wasteTypes,
          estimated_volume: scheduleData.estimatedVolume,
          estimated_weight: scheduleData.estimatedWeight,
          container_size: scheduleData.containerSize,
          container_quantity: scheduleData.containerQuantity,
          collection_address: scheduleData.collectionAddress,
          coordinates: scheduleData.coordinates,
          scheduled_date: scheduleData.scheduledDate.toISOString(),
          preferred_time_slot: scheduleData.preferredTimeSlot,
          status: 'scheduled',
          total_cost: scheduleData.totalCost,
          payment_status: 'pending',
          special_instructions: scheduleData.specialInstructions,
          access_requirements: scheduleData.accessRequirements,
          contact_person: scheduleData.contactPerson,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification to provider
      await this.notifyProvider(scheduleData.providerId, schedule.id, 'new_collection_request');

      // Schedule pin delivery automatically
      await this.schedulePinDelivery(schedule.id);

      return this.mapToSchedule(schedule);
    } catch (error) {
      console.error('Error scheduling waste collection:', error);
      throw new Error('Failed to schedule waste collection');
    }
  }

  // Schedule pin/container delivery
  async schedulePinDelivery(scheduleId: string): Promise<boolean> {
    try {
      const { data: schedule } = await this.supabase
        .from('waste_collection_schedules')
        .select('*')
        .eq('id', scheduleId)
        .single();

      if (!schedule) return false;

      // Schedule pin delivery 1-2 days before collection
      const deliveryDate = new Date(schedule.scheduled_date);
      deliveryDate.setDate(deliveryDate.getDate() - 1);

      const pinNumbers = Array.from({ length: schedule.container_quantity }, (_, i) => 
        `PIN-${Date.now()}-${i + 1}`
      );

      const { error } = await this.supabase
        .from('waste_collection_schedules')
        .update({
          pin_delivery: {
            scheduled_date: deliveryDate.toISOString(),
            pin_numbers: pinNumbers
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', scheduleId);

      if (error) throw error;

      // Send notification about pin delivery
      await this.notifyCustomer(schedule.user_id, scheduleId, 'pin_delivery_scheduled');

      return true;
    } catch (error) {
      console.error('Error scheduling pin delivery:', error);
      return false;
    }
  }

  // Track waste collection
  async trackWasteCollection(scheduleId: string): Promise<WasteCollectionSchedule | null> {
    try {
      const { data: schedule, error } = await this.supabase
        .from('waste_collection_schedules')
        .select(`
          *,
          waste_providers!inner(
            name, name_ar, contact_phone, contact_email
          )
        `)
        .eq('id', scheduleId)
        .single();

      if (error) throw error;

      // Get latest tracking update if collection is in progress
      if (['pin-delivered', 'collecting'].includes(schedule.status)) {
        const { data: tracking } = await this.supabase
          .from('waste_collection_tracking')
          .select('*')
          .eq('schedule_id', scheduleId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (tracking) {
          schedule.tracking_info = {
            vehicle_location: tracking.vehicle_location,
            driver_name: tracking.driver_name,
            driver_phone: tracking.driver_phone,
            eta: tracking.eta,
            status: tracking.status,
            last_update: tracking.created_at
          };
        }
      }

      return this.mapToSchedule(schedule);
    } catch (error) {
      console.error('Error tracking waste collection:', error);
      return null;
    }
  }

  // Get waste providers by location
  async getProvidersByLocation(city: string, wasteTypes: string[]): Promise<WasteProvider[]> {
    try {
      const { data: providers, error } = await this.supabase
        .from('waste_providers')
        .select('*')
        .or(`city.eq.${city},service_areas.cs.{${city}}`)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      // Filter providers that handle the required waste types
      const filteredProviders = providers.filter(provider => 
        wasteTypes.some(wasteType => provider.waste_types.includes(wasteType))
      );

      return filteredProviders.map(this.mapToProvider);
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  }

  // Update collection status (for providers)
  async updateCollectionStatus(
    scheduleId: string, 
    status: WasteCollectionSchedule['status'], 
    additionalData?: any
  ): Promise<boolean> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (additionalData) {
        if (additionalData.pinDelivery) {
          updateData.pin_delivery = additionalData.pinDelivery;
        }
        if (additionalData.collectionInfo) {
          updateData.collection_info = additionalData.collectionInfo;
        }
        if (additionalData.trackingInfo) {
          updateData.tracking_info = additionalData.trackingInfo;
        }
      }

      const { error } = await this.supabase
        .from('waste_collection_schedules')
        .update(updateData)
        .eq('id', scheduleId);

      if (error) throw error;

      // Send notification to customer
      const { data: schedule } = await this.supabase
        .from('waste_collection_schedules')
        .select('user_id')
        .eq('id', scheduleId)
        .single();

      if (schedule) {
        await this.notifyCustomer(schedule.user_id, scheduleId, 'status_update', status);
      }

      return true;
    } catch (error) {
      console.error('Error updating collection status:', error);
      return false;
    }
  }

  // Get user's scheduled collections
  async getUserCollections(userId: string): Promise<WasteCollectionSchedule[]> {
    try {
      const { data: schedules, error } = await this.supabase
        .from('waste_collection_schedules')
        .select(`
          *,
          waste_providers!inner(
            name, name_ar, contact_phone, rating
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return schedules.map(this.mapToSchedule);
    } catch (error) {
      console.error('Error fetching user collections:', error);
      return [];
    }
  }

  // Generate disposal certificate
  async generateDisposalCertificate(scheduleId: string): Promise<string | null> {
    try {
      const { data: schedule } = await this.supabase
        .from('waste_collection_schedules')
        .select(`
          *,
          waste_providers!inner(name, name_ar, certifications)
        `)
        .eq('id', scheduleId)
        .single();

      if (!schedule || schedule.status !== 'completed') return null;

      // Generate certificate data
      const certificateData = {
        certificateId: `CERT-${Date.now()}`,
        scheduleId,
        customerName: schedule.contact_person.name,
        providerName: schedule.waste_providers.name,
        collectionDate: schedule.collection_info?.completion_time,
        wasteTypes: schedule.waste_types,
        actualWeight: schedule.collection_info?.actual_weight,
        disposalMethod: 'Environmentally compliant disposal',
        facilityLicense: 'ENV-2024-001',
        generatedAt: new Date().toISOString()
      };

      // Store certificate
      const { data: certificate, error } = await this.supabase
        .from('disposal_certificates')
        .insert(certificateData)
        .select()
        .single();

      if (error) throw error;

      return certificate.certificate_id;
    } catch (error) {
      console.error('Error generating disposal certificate:', error);
      return null;
    }
  }

  // Private helper methods
  private getEnvironmentalTips(category: string): string[] {
    const tips: Record<string, string[]> = {
      construction: [
        'فصل المواد القابلة لإعادة التدوير',
        'تجنب خلط المواد الخطرة',
        'استخدم الحاويات المناسبة لكل نوع'
      ],
      concrete: [
        'يمكن إعادة تدوير الخرسانة لاستخدامها في الطرق',
        'فصل حديد التسليح عن الخرسانة',
        'تجنب تلوث الخرسانة بمواد أخرى'
      ],
      metal: [
        'المعادن قابلة لإعادة التدوير بنسبة 100%',
        'فصل أنواع المعادن المختلفة',
        'تنظيف المعادن من الزيوت والدهون'
      ],
      wood: [
        'الخشب الطبيعي قابل لإعادة التدوير',
        'تجنب الخشب المعالج كيميائياً',
        'يمكن استخدام نشارة الخشب في أغراض أخرى'
      ]
    };
    return tips[category] || ['اتبع التوجيهات البيئية للتخلص الآمن'];
  }

  private async notifyProvider(providerId: string, scheduleId: string, type: string): Promise<void> {
    await this.supabase
      .from('notifications')
      .insert({
        recipient_id: providerId,
        type: `waste_${type}`,
        title: 'طلب جمع نفايات جديد',
        message: 'لديك طلب جمع نفايات جديد يتطلب المراجعة',
        data: { scheduleId },
        created_at: new Date().toISOString()
      });
  }

  private async notifyCustomer(userId: string, scheduleId: string, type: string, status?: string): Promise<void> {
    const titles: Record<string, string> = {
      pin_delivery_scheduled: 'تم جدولة توصيل الحاويات',
      status_update: 'تحديث حالة جمع النفايات'
    };

    const messages: Record<string, string> = {
      pin_delivery_scheduled: 'سيتم توصيل الحاويات خلال 24 ساعة',
      status_update: `تم تحديث حالة جمع النفايات إلى: ${this.getStatusInArabic(status || '')}`
    };

    await this.supabase
      .from('notifications')
      .insert({
        recipient_id: userId,
        type: `waste_${type}`,
        title: titles[type],
        message: messages[type],
        data: { scheduleId, status },
        created_at: new Date().toISOString()
      });
  }

  private getStatusInArabic(status: string): string {
    const statusMap: Record<string, string> = {
      'scheduled': 'مجدول',
      'pin-delivered': 'تم توصيل الحاويات',
      'collecting': 'جاري الجمع',
      'completed': 'مكتمل',
      'cancelled': 'ملغي'
    };
    return statusMap[status] || status;
  }

  private mapToWasteType(data: any): WasteType {
    return {
      id: data.id,
      name: data.name,
      nameAr: data.name_ar,
      category: data.category,
      description: data.description,
      descriptionAr: data.description_ar,
      image: data.image,
      density: data.density,
      disposalCost: data.disposal_cost,
      recyclingValue: data.recycling_value,
      environmentalImpact: data.environmental_impact,
      specialHandling: data.special_handling,
      requirements: data.requirements || []
    };
  }

  private mapToContainerSize(data: any): ContainerSize {
    return {
      id: data.id,
      name: data.name,
      nameAr: data.name_ar,
      capacity: data.capacity,
      maxWeight: data.max_weight,
      dimensions: data.dimensions,
      rentalCost: data.rental_cost,
      deliveryCost: data.delivery_cost,
      pickupCost: data.pickup_cost,
      image: data.image,
      suitableFor: data.suitable_for || []
    };
  }

  private mapToProvider(data: any): WasteProvider {
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
      serviceAreas: data.service_areas || [],
      wasteTypes: data.waste_types || [],
      containerSizes: data.container_sizes || [],
      rating: data.rating,
      reviewCount: data.review_count,
      isVerified: data.is_verified,
      isEcoFriendly: data.is_eco_friendly,
      certifications: data.certifications || [],
      operatingHours: data.operating_hours,
      emergencyService: data.emergency_service,
      pricing: data.pricing
    };
  }

  private mapToSchedule(data: any): WasteCollectionSchedule {
    return {
      id: data.id,
      projectId: data.project_id,
      providerId: data.provider_id,
      userId: data.user_id,
      wasteTypes: data.waste_types,
      estimatedVolume: data.estimated_volume,
      estimatedWeight: data.estimated_weight,
      containerSize: data.container_size,
      containerQuantity: data.container_quantity,
      collectionAddress: data.collection_address,
      coordinates: data.coordinates,
      scheduledDate: new Date(data.scheduled_date),
      preferredTimeSlot: data.preferred_time_slot,
      status: data.status,
      totalCost: data.total_cost,
      paymentStatus: data.payment_status,
      specialInstructions: data.special_instructions,
      accessRequirements: data.access_requirements,
      contactPerson: data.contact_person,
      pinDelivery: data.pin_delivery,
      collectionInfo: data.collection_info,
      trackingInfo: data.tracking_info,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  // Provider-specific methods
  async getProviderCollections(providerId: string): Promise<WasteCollectionSchedule[]> {
    try {
      const { data, error } = await this.supabase
        .from('waste_collection_schedules')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data?.map(this.mapToSchedule) || [];
    } catch (error) {
      console.error('Error fetching provider collections:', error);
      return [];
    }
  }

  async getProviderVehicles(providerId: string): Promise<any[]> {
    try {
      //  - in real implementation, fetch from vehicles table
      return [
        { id: '1', type: 'truck', capacity: '20m³', status: 'available', location: 'الرياض' },
        { id: '2', type: 'compMock dataactor', capacity: '15m³', status: 'in_use', location: 'جدة' }
      ];
    } catch (error) {
      console.error('Error fetching provider vehicles:', error);
      return [];
    }
  }

  async getProviderRoutes(providerId: string): Promise<any[]> {
    try {
      // Mock data - in real implementation, calculate optimal routes
      return [
        { id: '1', name: 'الرياض - شمال', stops: 5, distance: '45km', status: 'active' },
        { id: '2', name: 'الرياض - جنوب', stops: 3, distance: '32km', status: 'completed' }
      ];
    } catch (error) {
      console.error('Error fetching provider routes:', error);
      return [];
    }
  }

  async getProviderAnalytics(providerId: string): Promise<any> {
    try {
      // Mock analytics data
      return {
        totalCollections: 156,
        activeRoutes: 4,
        totalRevenue: 85000,
        monthlyRevenue: 12000,
        averageRating: 4.5,
        efficiency: 92,
        popularServices: ['construction', 'mixed', 'concrete']
      };
    } catch (error) {
      console.error('Error fetching provider analytics:', error);
      return {};
    }
  }
}

export const wasteManagementService = WasteManagementService.getInstance();

// Default export the wasteManagementService instance
export default wasteManagementService;
