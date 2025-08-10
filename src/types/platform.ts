// Core data models for real platform connections
export interface Product {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  warrantyPeriod: number; // in months
  specifications: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  storeId: string;
  storeName: string;
  products: OrderProduct[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    district: string;
    postalCode: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deliveredAt?: Date;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface WarrantyClaim {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  storeId: string;
  storeName: string;
  issueDescription: string;
  issueType: 'defect' | 'damage' | 'malfunction' | 'other';
  images: string[];
  status: 'submitted' | 'under_review' | 'approved' | 'rejected' | 'resolved';
  submittedAt: Date;
  reviewedAt?: Date;
  resolvedAt?: Date;
  adminNotes?: string;
  storeResponse?: string;
}

export interface ServiceBooking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  serviceProviderId: string;
  serviceProviderName: string;
  serviceType: 'concrete_supply' | 'construction' | 'equipment_rental' | 'consultation' | 'other';
  serviceDetails: {
    title: string;
    description: string;
    requirements: string[];
    estimatedDuration: string;
    estimatedCost?: number;
  };
  scheduledDate: Date;
  scheduledTime: string;
  location: {
    address: string;
    city: string;
    district: string;
    coordinates?: { lat: number; lng: number };
  };
  status: 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  providerNotes?: string;
  userRating?: number;
  userReview?: string;
}

export interface Notification {
  id: string;
  userId: string;
  userType: 'user' | 'store' | 'service_provider' | 'admin';
  title: string;
  message: string;
  type: 'order' | 'warranty' | 'booking' | 'system' | 'payment';
  isRead: boolean;
  relatedId?: string; // orderId, warrantyId, bookingId, etc.
  createdAt: Date;
}

export interface Analytics {
  id: string;
  type: 'order' | 'warranty' | 'booking' | 'user_activity';
  entityId: string;
  userId?: string;
  storeId?: string;
  serviceProviderId?: string;
  action: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard data types
export interface StoreDashboardData {
  products: Product[];
  orders: Order[];
  warrantyClaims: WarrantyClaim[];
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
  orders: Order[];
  warrantyClaims: WarrantyClaim[];
  serviceBookings: ServiceBooking[];
  analytics: {
    totalOrders: number;
    activeWarranties: number;
    upcomingBookings: number;
    totalSpent: number;
  };
}

export interface ServiceProviderDashboardData {
  bookings: ServiceBooking[];
  analytics: {
    totalBookings: number;
    completedServices: number;
    upcomingBookings: number;
    averageRating: number;
    monthlyRevenue: number;
  };
}

export interface AdminDashboardData {
  users: { total: number; active: number; new: number };
  stores: { total: number; active: number; new: number };
  serviceProviders: { total: number; active: number; new: number };
  orders: { total: number; pending: number; completed: number };
  warrantyClaims: { total: number; pending: number; resolved: number };
  serviceBookings: { total: number; pending: number; completed: number };
  platformStats: {
    totalRevenue: number;
    monthlyGrowth: number;
    activeUsers: number;
    topCategories: { name: string; count: number }[];
  };
} 


