export interface Store {
  id: string;
  name: string;
  description: string;
  user_id: string;
  category: string;
  logo_url?: string;
  banner_url?: string;
  location: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  rating: {
    average: number;
    count: number;
  };
  status: 'active' | 'inactive' | 'pending_approval';
  settings: StoreSettings;
  created_at: string;
  updated_at: string;
}

export interface StoreSettings {
  payment_methods: string[];
  delivery_options: string[];
  business_hours: BusinessHours;
  notifications: NotificationSettings;
  display_preferences: DisplayPreferences;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  is_closed: boolean;
}

export interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  order_updates: boolean;
  promotional_messages: boolean;
}

export interface DisplayPreferences {
  theme: 'light' | 'dark' | 'auto';
  layout: 'grid' | 'list';
  currency: string;
  language: string;
}

export interface StoreProduct {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specifications: Record<string, any>;
  inventory: {
    stock: number;
    sku: string;
    low_stock_threshold: number;
  };
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

export interface StoreAnalytics {
  store_id: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  metrics: {
    total_orders: number;
    total_revenue: number;
    average_order_value: number;
    returning_customers: number;
    new_customers: number;
    top_products: TopProduct[];
    revenue_trend: RevenueDataPoint[];
  };
  generated_at: string;
}

export interface TopProduct {
  product_id: string;
  name: string;
  sales_count: number;
  revenue: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface StoreFilters {
  category?: string;
  city?: string;
  rating?: number;
  search?: string;
  status?: Store['status'];
}

export interface StoreSearchResult {
  data: Store[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}


