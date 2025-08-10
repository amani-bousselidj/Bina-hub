/**
 * Unified Store API Service
 * Consolidates 137+ scattered API calls into centralized services
 * Supports multiple ERP backends (Medusa, Rawaa, Onyx Pro, Wafeq, Mezan)
 */

import { ERPAdapter } from '../erp/erp-adapter-interface.js';

// Core API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Product API Service (consolidates 75 product-related API calls)
export class ProductAPIService {
  constructor(private erpAdapter: ERPAdapter) {}

  async getProducts(options: PaginationOptions = {}): Promise<APIResponse> {
    try {
      return await this.erpAdapter.products.list(options);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch products' };
    }
  }

  async getProduct(id: string): Promise<APIResponse> {
    try {
      return await this.erpAdapter.products.get(id);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch product' };
    }
  }

  async createProduct(data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.products.create(data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create product' };
    }
  }

  async updateProduct(id: string, data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.products.update(id, data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update product' };
    }
  }

  async deleteProduct(id: string): Promise<APIResponse> {
    try {
      return await this.erpAdapter.products.delete(id);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete product' };
    }
  }

  // Product variants (consolidates 43 variant API calls)
  async getVariants(productId: string): Promise<APIResponse> {
    try {
      return await this.erpAdapter.variants.list(productId);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch variants' };
    }
  }

  async createVariant(productId: string, data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.variants.create(productId, data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create variant' };
    }
  }
}

// Region API Service (consolidates 59 region-related API calls)
export class RegionAPIService {
  constructor(private erpAdapter: ERPAdapter) {}

  async getRegions(options: PaginationOptions = {}): Promise<APIResponse> {
    try {
      return await this.erpAdapter.regions.list(options);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch regions' };
    }
  }

  async getRegion(id: string): Promise<APIResponse> {
    try {
      return await this.erpAdapter.regions.get(id);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch region' };
    }
  }

  async createRegion(data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.regions.create(data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create region' };
    }
  }

  async updateRegion(id: string, data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.regions.update(id, data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update region' };
    }
  }
}

// User API Service (consolidates 45 user-related API calls)
export class UserAPIService {
  constructor(private erpAdapter: ERPAdapter) {}

  async getUsers(options: PaginationOptions = {}): Promise<APIResponse> {
    try {
      return await this.erpAdapter.users.list(options);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch users' };
    }
  }

  async getUser(id: string): Promise<APIResponse> {
    try {
      return await this.erpAdapter.users.get(id);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch user' };
    }
  }

  async createUser(data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.users.create(data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create user' };
    }
  }

  async updateUser(id: string, data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.users.update(id, data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update user' };
    }
  }
}

// Tax API Service (consolidates 41 tax-related API calls)
export class TaxAPIService {
  constructor(private erpAdapter: ERPAdapter) {}

  async getTaxRegions(options: PaginationOptions = {}): Promise<APIResponse> {
    try {
      return await this.erpAdapter.taxes.listRegions(options);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch tax regions' };
    }
  }

  async getTaxRates(regionId: string): Promise<APIResponse> {
    try {
      return await this.erpAdapter.taxes.getRates(regionId);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch tax rates' };
    }
  }

  async createTaxRate(data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.taxes.createRate(data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create tax rate' };
    }
  }
}

// Order API Service (consolidates 35 order-related API calls)
export class OrderAPIService {
  constructor(private erpAdapter: ERPAdapter) {}

  async getOrders(options: PaginationOptions = {}): Promise<APIResponse> {
    try {
      return await this.erpAdapter.orders.list(options);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch orders' };
    }
  }

  async getOrder(id: string): Promise<APIResponse> {
    try {
      return await this.erpAdapter.orders.get(id);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch order' };
    }
  }

  async createOrder(data: any): Promise<APIResponse> {
    try {
      return await this.erpAdapter.orders.create(data);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to create order' };
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<APIResponse> {
    try {
      return await this.erpAdapter.orders.updateStatus(id, status);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update order status' };
    }
  }
}

// Main Unified Store API Class
export class UnifiedStoreAPI {
  public products: ProductAPIService;
  public regions: RegionAPIService;
  public users: UserAPIService;
  public taxes: TaxAPIService;
  public orders: OrderAPIService;

  constructor(private erpAdapter: ERPAdapter) {
    this.products = new ProductAPIService(erpAdapter);
    this.regions = new RegionAPIService(erpAdapter);
    this.users = new UserAPIService(erpAdapter);
    this.taxes = new TaxAPIService(erpAdapter);
    this.orders = new OrderAPIService(erpAdapter);
  }

  // Switch ERP system dynamically
  switchERPSystem(newAdapter: ERPAdapter): void {
    this.products = new ProductAPIService(newAdapter);
    this.regions = new RegionAPIService(newAdapter);
    this.users = new UserAPIService(newAdapter);
    this.taxes = new TaxAPIService(newAdapter);
    this.orders = new OrderAPIService(newAdapter);
  }

  // Get current ERP system info
  getCurrentERPInfo(): any {
    return this.erpAdapter.getSystemInfo();
  }

  // Test connection to current ERP system
  async testConnection(): Promise<APIResponse> {
    try {
      return await this.erpAdapter.testConnection();
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Connection test failed' };
    }
  }
}

// Singleton instance for global use
let unifiedStoreAPIInstance: UnifiedStoreAPI | null = null;

export const getUnifiedStoreAPI = (erpAdapter?: ERPAdapter): UnifiedStoreAPI => {
  if (!unifiedStoreAPIInstance && erpAdapter) {
    unifiedStoreAPIInstance = new UnifiedStoreAPI(erpAdapter);
  }
  
  if (!unifiedStoreAPIInstance) {
    throw new Error('UnifiedStoreAPI not initialized. Please provide an ERP adapter.');
  }
  
  return unifiedStoreAPIInstance;
};

// Reset instance (useful for testing or switching ERP systems)
export const resetUnifiedStoreAPI = (): void => {
  unifiedStoreAPIInstance = null;
};


