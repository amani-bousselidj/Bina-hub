import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);







export interface DeliverySchedule {
  id: string;
  order_id: string;
  truck_id: string;
  driver_info: {
    name: string;
    phone: string;
    license_number: string;
  };
  scheduled_departure: Date;
  estimated_arrival: Date;
  actual_arrival?: Date;
  status: 'scheduled' | 'en_route' | 'arrived' | 'unloading' | 'completed';
  gps_tracking: {
    latitude: number;
    longitude: number;
    last_updated: Date;
  };
}

export interface DeliveryStatusInfo {
  order_id: string;
  current_status: string;
  truck_location: {
    latitude: number;
    longitude: number;
  };
  estimated_arrival: Date;
  delivery_progress: number;
  quality_checks: QualityCheck[];
  completion_photos?: string[];
}

export interface DeliveryWindow {
  date: Date;
  time_slot: string;
  availability: 'available' | 'limited' | 'unavailable';
  price_modifier: number;
}

export interface QualityCheck {
  id: string;
  check_type: 'slump_test' | 'temperature' | 'visual_inspection' | 'consistency';
  result: 'pass' | 'fail' | 'warning';
  value: string;
  checked_at: Date;
  inspector: string;
}

export interface ConcreteSupplier {
  id: string;
  company_name: string;
  contact_info: {
    phone: string;
    email: string;
    address: string;
  };
  service_areas: string[];
  concrete_types: string[];
  certifications: string[];
  rating: number;
  delivery_capacity_per_day: number;
  truck_fleet_size: number;
  quality_standards: string[];
}

export class ConcreteSupplyService {
  async getConcreteTypes(): Promise<ConcreteType[]> {
    try {
      const { data, error } = await supabase
        .from('concrete_types')
        .select('*')
        .order('grade');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching concrete types:', error);
      throw error;
    }
  }

  async getSuppliersByLocation(city: string, district?: string): Promise<ConcreteSupplier[]> {
    try {
      let query = supabase
        .from('concrete_suppliers')
        .select('*')
        .contains('service_areas', [city]);

      if (district) {
        query = query.contains('service_areas', [district]);
      }

      const { data, error } = await query.order('rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }

  async calculateRequirements(projectSpecs: {
    area: number;
    floors: number;
    structure_type: 'residential' | 'commercial' | 'industrial';
    foundation_type: 'slab' | 'strip' | 'pile';
    special_requirements?: string[];
  }): Promise<ConcreteRequirement> {
    try {
      // Calculate volume based on structure type and area
      let foundationVolume = 0;
      let floorVolume = 0;
      let columnBeamVolume = 0;

      // Foundation calculations
      switch (projectSpecs.foundation_type) {
        case 'slab':
          foundationVolume = projectSpecs.area * 0.15; // 15cm thick slab
          break;
        case 'strip':
          foundationVolume = projectSpecs.area * 0.08; // Strip foundation
          break;
        case 'pile':
          foundationVolume = projectSpecs.area * 0.12; // Pile foundation
          break;
      }

      // Floor slab calculations
      if (projectSpecs.floors > 1) {
        floorVolume = projectSpecs.area * (projectSpecs.floors - 1) * 0.12; // 12cm thick floors
      }

      // Column and beam calculations
      const structureMultiplier = projectSpecs.structure_type === 'commercial' ? 1.3 : 
                                 projectSpecs.structure_type === 'industrial' ? 1.5 : 1.0;
      columnBeamVolume = projectSpecs.area * projectSpecs.floors * 0.05 * structureMultiplier;

      const totalVolume = foundationVolume + floorVolume + columnBeamVolume;

      // Determine recommended grade
      let recommendedGrade = 'C25';
      if (projectSpecs.structure_type === 'industrial' || projectSpecs.floors > 5) {
        recommendedGrade = 'C30';
      } else if (projectSpecs.structure_type === 'commercial' || projectSpecs.floors > 3) {
        recommendedGrade = 'C28';
      }

      // Get concrete type for pricing
      const concreteTypes = await this.getConcreteTypes();
      const selectedType = concreteTypes.find(type => type.name === recommendedGrade);
      const estimatedCost = totalVolume * (selectedType?.price || 350);

      // Generate delivery schedule
      const deliverySchedule = this.generateDeliverySchedule(totalVolume);

      return {
        volume: Math.ceil(totalVolume * 1.1), // Add 10% waste factor
        recommended_grade: recommendedGrade,
        estimated_cost: estimatedCost,
        delivery_schedule: deliverySchedule,
        special_requirements: projectSpecs.special_requirements || [],
        quality_certificates: ['SASO', 'ARAMCO', 'SABIC']
      };
    } catch (error) {
      console.error('Error calculating requirements:', error);
      throw error;
    }
  }

  private generateDeliverySchedule(totalVolume: number): DeliveryWindow[] {
    const schedule: DeliveryWindow[] = [];
    const maxDailyVolume = 50; // cubic meters per day
    const deliveryDays = Math.ceil(totalVolume / maxDailyVolume);
    
    for (let i = 0; i < deliveryDays; i++) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + i + 2); // Start 2 days from now
      
      // Morning and afternoon slots
      schedule.push({
        date: new Date(deliveryDate),
        time_slot: '07:00-11:00',
        availability: 'available',
        price_modifier: 1.0
      });
      
      schedule.push({
        date: new Date(deliveryDate),
        time_slot: '13:00-17:00',
        availability: 'available',
        price_modifier: 1.0
      });
    }
    
    return schedule;
  }

  async scheduleDelivery(order: ConcreteOrder): Promise<DeliverySchedule> {
    try {
      // Create order record
      const { data: orderData, error: orderError } = await supabase
        .from('concrete_orders')
        .insert([order])
        .select()
        .single();

      if (orderError) throw orderError;

      // Schedule delivery
      const deliverySchedule: DeliverySchedule = {
        id: `del_${Date.now()}`,
        order_id: orderData.id,
        truck_id: `truck_${Math.floor(Math.random() * 100)}`,
        driver_info: {
          name: 'أحمد محمد',
          phone: '+966501234567',
          license_number: 'DL123456789'
        },
        scheduled_departure: new Date(order.deliveryDate || new Date().getTime() - 60 * 60 * 1000), // 1 hour before
        estimated_arrival: order.deliveryDate || new Date(),
        status: 'scheduled',
        gps_tracking: {
          latitude: 24.7136,
          longitude: 46.6753,
          last_updated: new Date()
        }
      };

      // Save delivery schedule
      const { error: scheduleError } = await supabase
        .from('concrete_deliveries')
        .insert([deliverySchedule]);

      if (scheduleError) throw scheduleError;

      return deliverySchedule;
    } catch (error) {
      console.error('Error scheduling delivery:', error);
      throw error;
    }
  }

  async trackDelivery(orderId: string): Promise<DeliveryStatusInfo> {
    try {
      const { data: delivery, error } = await supabase
        .from('concrete_deliveries')
        .select(`
          *,
          concrete_orders (*)
        `)
        .eq('order_id', orderId)
        .single();

      if (error) throw error;

      // Simulate real-time tracking data
      const status: DeliveryStatusInfo = {
        order_id: orderId,
        current_status: delivery.status,
        truck_location: {
          latitude: delivery.gps_tracking.latitude,
          longitude: delivery.gps_tracking.longitude
        },
        estimated_arrival: new Date(delivery.estimated_arrival),
        delivery_progress: this.calculateDeliveryProgress(delivery.status),
        quality_checks: [
          {
            id: 'qc1',
            check_type: 'slump_test',
            result: 'pass',
            value: '75mm',
            checked_at: new Date(),
            inspector: 'فني الجودة'
          }
        ]
      };

      return status;
    } catch (error) {
      console.error('Error tracking delivery:', error);
      throw error;
    }
  }

  private calculateDeliveryProgress(status: string): number {
    switch (status) {
      case 'scheduled': return 0;
      case 'en_route': return 30;
      case 'arrived': return 70;
      case 'unloading': return 90;
      case 'completed': return 100;
      default: return 0;
    }
  }

  async getWeatherBasedRecommendations(city: string, deliveryDate: Date): Promise<{
    weather_concerns: string[];
    recommended_additives: string[];
    timing_adjustments: string[];
  }> {
    try {
      // Simulate weather API integration
      const temperature = 35; // Celsius
      const humidity = 60; // Percentage
      const windSpeed = 15; // km/h

      const recommendations: {
        weather_concerns: string[];
        recommended_additives: string[];
        timing_adjustments: string[];
      } = {
        weather_concerns: [],
        recommended_additives: [],
        timing_adjustments: []
      };

      if (temperature > 30) {
        recommendations.weather_concerns.push('درجة حرارة عالية قد تؤثر على وقت الشك');
        recommendations.recommended_additives.push('مؤخر الشك (Retarder)');
        recommendations.timing_adjustments.push('تفضيل التوصيل في الصباح الباكر');
      }

      if (humidity < 30) {
        recommendations.weather_concerns.push('رطوبة منخفضة قد تسبب تشقق سطحي');
        recommendations.recommended_additives.push('مواد تقليل التبخر');
        recommendations.timing_adjustments.push('رش الماء على السطح بعد الصب');
      }

      if (windSpeed > 20) {
        recommendations.weather_concerns.push('رياح قوية قد تؤثر على عملية الصب');
        recommendations.timing_adjustments.push('استخدام حواجز الرياح حول موقع الصب');
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting weather recommendations:', error);
      throw error;
    }
  }

  async confirmDeliveryCompletion(orderId: string, completionData: {
    photos: string[];
    quality_test_results: QualityCheck[];
    customer_signature: string;
    notes?: string;
  }): Promise<boolean> {
    try {
      // Update order status
      const { error: orderError } = await supabase
        .from('concrete_orders')
        .update({ 
          status: 'delivered',
          completion_photos: completionData.photos,
          completion_notes: completionData.notes
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Update delivery status
      const { error: deliveryError } = await supabase
        .from('concrete_deliveries')
        .update({ 
          status: 'completed',
          actual_arrival: new Date()
        })
        .eq('order_id', orderId);

      if (deliveryError) throw deliveryError;

      // Save quality checks
      const qualityChecksWithOrderId = completionData.quality_test_results.map(check => ({
        ...check,
        order_id: orderId
      }));

      const { error: qualityError } = await supabase
        .from('concrete_quality_checks')
        .insert(qualityChecksWithOrderId);

      if (qualityError) throw qualityError;

      return true;
    } catch (error) {
      console.error('Error confirming delivery completion:', error);
      throw error;
    }
  }

  async calculatePrice(order: ConcreteOrder): Promise<number> {
    // Mock calculation based on quantity and type
    const basePrice = 150; // per cubic meter
    return order.quantity * basePrice;
  }
  
  async submitOrder(order: ConcreteOrder): Promise<boolean> {
    try {
      // Mock order submission
      console.log('Submitting concrete order:', order);
      return true;
    } catch (error) {
      console.error('Error submitting order:', error);
      return false;
    }
  }
}

// Consolidated instance export for ConcreteSupplyService
export const concreteSupplyService = new ConcreteSupplyService();
export default concreteSupplyService;

// Service interfaces
export interface ConcreteType {
  id: string;
  name: string;
  strength: string;
  description?: string;
  grade?: string;
  compressive_strength?: number;
  price?: number;
}

export interface ConcreteOrder {
  id: string;
  type: string;
  quantity: number;
  strength: string;
  delivery_date?: Date;
  project_id?: string;
  status: string;
  supplier_id?: string;
  deliveryDate?: Date;
}

export interface ConcreteRequirement {
  projectType?: string;
  volume: number;
  strength?: string;
  deliveryDate?: Date;
  location?: string;
  total_volume_cubic_meters?: number;
  estimated_cost?: number;
  recommended_grade?: string;
  delivery_date?: Date;
  delivery_schedule?: DeliveryWindow[];
  special_requirements?: string[];
  quality_certificates?: string[];
}

export enum DeliveryStatus {
  SCHEDULED = 'scheduled',
  IN_TRANSIT = 'in_transit', 
  DELIVERED = 'delivered',
  DELAYED = 'delayed'
}



