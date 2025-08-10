export interface Store {
  id: string;
  name: string;
  description?: string;
  category: StoreCategory;
  location: StoreLocation;
  settings: StoreSettings;
  metrics: StoreMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
}

export interface StoreLocation {
  address: string;
  city: string;
  region: string;
  postalCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface StoreSettings {
  isActive: boolean;
  acceptsOnlineOrders: boolean;
  workingHours: WorkingHours[];
  paymentMethods: PaymentMethod[];
  deliveryOptions: DeliveryOption[];
}

export interface WorkingHours {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'digital';
  isActive: boolean;
}

export interface DeliveryOption {
  id: string;
  name: string;
  cost: number;
  estimatedTime: string;
}

export interface StoreMetrics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  customerCount: number;
  inventoryValue: number;
}

export interface InventoryItem {
  id: string;
  storeId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  minQuantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: Date;
}

export interface POSTransaction {
  id: string;
  storeId: string;
  customerId?: string;
  items: POSTransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
}

export interface POSTransactionItem {
  itemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}



