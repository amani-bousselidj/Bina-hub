// Comprehensive service interfaces for TypeScript consistency

export interface ConcreteType {
  id: string;
  grade: string;
  name: string;
  description: string;
  compressive_strength: number;
  suitable_for: string[];
  price_per_cubic_meter: number;
  min_order_quantity: number;
  curing_time_hours: number;
  additives_available: string[];
  strength?: number;
}

export interface ConcreteOrder {
  id: string;
  project_id?: string;
  concrete_type_id: string;
  quantity_cubic_meters?: number;
  delivery_address: string;
  delivery_date?: Date;
  status: 'pending' | 'confirmed' | 'in_production' | 'dispatched' | 'delivered' | 'completed';
  special_requirements?: string[];
  contact_person?: string;
  contact_phone?: string;
  total_cost?: number;
  projectType?: string;
}

export interface ConcreteRequirement {
  project_id?: string;
  concrete_grade?: string;
  total_volume_cubic_meters?: number;
  delivery_date?: Date;
  delivery_address?: string;
  special_requirements?: string[];
  quality_certificates?: string[];
  delivery_schedule?: DeliveryWindow[];
  estimated_cost?: number;
  recommended_grade?: string;
  volume?: number;
}

export interface DeliveryWindow {
  date: Date;
  time_slot: string;
  availability: 'available' | 'limited' | 'unavailable';
  price_modifier: number;
}

export interface DeliveryStatus {
  order_id: string;
  current_status: 'pending' | 'confirmed' | 'in_production' | 'dispatched' | 'delivered';
  truck_location?: {
    latitude: number;
    longitude: number;
  };
  estimated_arrival?: Date;
  delivery_progress?: number;
  quality_checks?: QualityCheck[];
  completion_photos?: string[];
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
  rating: number;
  certifications: string[];
}


