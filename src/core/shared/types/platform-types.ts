// Platform-wide type definitions
export interface AdminDashboardData {
  users: {
    total: number;
    active: number;
    new: number;
  };
  stores: {
    total: number;
    active: number;
    new: number;
  };
  serviceProviders: {
    total: number;
    active: number;
    new: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
  };
  warrantyClaims: {
    total: number;
    pending: number;
    resolved: number;
  };
  serviceBookings: {
    total: number;
    pending: number;
    completed: number;
  };
  platformStats: {
    totalRevenue: number;
    monthlyGrowth: number;
    activeUsers: number;
    topCategories: Array<{ name: string; count: number }>;
  };
}

export interface ServiceProviderDashboardData {
  bookings: any[];
  analytics: {
    totalBookings: number;
    completedServices: number;
    upcomingBookings: number;
    averageRating: number;
    monthlyRevenue: number;
  };
}

export interface StoreDashboardData {
  products: any[];
  orders: any[];
  warrantyClaims: any[];
  analytics: {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingWarranties: number;
    monthlyStats: {
      orders: number;
      revenue: number;
      newCustomers: number;
    };
  };
}

export interface UserDashboardData {
  orders: any[];
  warrantyClaims: any[];
  serviceBookings: any[];
  analytics: {
    totalOrders: number;
    activeWarranties: number;
    upcomingBookings: number;
    totalSpent: number;
  };
}

export interface PlatformUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user' | 'service_provider' | 'store_owner';
  created_at: string;
  updated_at: string;
}

export interface ServiceBooking {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  serviceId?: string;
  serviceProviderId?: string;
  serviceProviderName?: string;
  serviceType?: string;
  serviceDetails?: {
    title: string;
    description: string;
    requirements?: string[];
    estimatedDuration: string;
    estimatedCost: number;
  };
  scheduledDate: string;
  scheduledTime?: string;
  location?: {
    address: string;
    city: string;
    district: string;
    coordinates: { lat: number; lng: number };
  };
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  providerNotes?: string;
  price?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WarrantyClaim {
  id: string;
  userId: string;
  userName?: string;
  productId: string;
  productName?: string;
  orderId: string;
  storeId?: string;
  storeName?: string;
  description: string;
  issueDescription?: string;
  adminNotes?: string;
  issueType?: string;
  images?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'resolved' | 'under_review';
  submittedAt: Date;
  resolvedAt?: Date;
  attachments?: string[];
  comments?: string;
}

export interface PlatformProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  storeId: string;
  storeName?: string;
  stockQuantity?: number;
  images: string[];
  inStock: boolean;
  warrantyPeriod?: string;
  specifications?: { [key: string]: string };
  createdAt?: Date;
  updatedAt?: Date;
  warranty: {
    duration: number;
    type: string;
  };
}

// Alias for compatibility
export type Product = PlatformProduct;

export interface PlatformOrder {
  id: string;
  userId: string;
  storeId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveryAddress: string;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  storeId?: string;
  storeName?: string;
  products?: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'confirmed';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address?: string;
  shippingAddress?: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
    phone?: string;
  };
  warrantyPeriod?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type BookingService = 'equipment-rental' | 'waste-management' | 'concrete-supply' | 'design-office' | 'insurance';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderStatus {
  pending: string;
  confirmed: string;
  in_production: string;
  dispatched: string;
  delivered: string;
  completed: string;
  cancelled: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  services: Array<{
    id: string;
    category: string;
    name: string;
    description?: string;
    price?: number;
  }>;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  rating?: number;
  status: 'active' | 'inactive';
}

// Project Types
export interface ProjectLevel {
  id: string;
  name: string;
  description: string;
  arabicTitle: string;
  requirements: string[];
  dependencies?: string[];
  documentationFiles: string[];
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface ConstructionLevel extends ProjectLevel {
  type: 'basic' | 'advanced';
  estimatedDuration: number;
  estimatedCost: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  budget: number;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  level: string;
  picture?: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt?: Date;
}


