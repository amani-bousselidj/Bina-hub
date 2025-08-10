// Store domain type exports
export type { 
  Store, 
  StoreCategory, 
  StoreLocation, 
  StoreSettings, 
  StoreMetrics,
  InventoryItem,
  POSTransaction,
  POSTransactionItem,
  WorkingHours,
  PaymentMethod,
  DeliveryOption
} from '../models/Store';
import type { Store, StoreMetrics, POSTransaction, InventoryItem } from '../models/Store';

// Store service types
export interface StoreDashboardData {
  store: Store;
  metrics: StoreMetrics;
  recentTransactions: POSTransaction[];
  lowStockItems: InventoryItem[];
  todaysSales: SalesSummary;
}

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  averageOrderValue: number;
  topSellingItems: TopSellingItem[];
}

export interface TopSellingItem {
  itemId: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface InventoryAlert {
  itemId: string;
  name: string;
  currentStock: number;
  minQuantity: number;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock';
}



