/**
 * ERP Adapter Interface
 * Defines standard interface for all ERP systems (Medusa, Rawaa, Onyx Pro, Wafeq, Mezan)
 */

export type ERPSystemType = 'medusa' | 'rawaa' | 'onyx-pro' | 'wafeq' | 'mezan' | 'sap' | 'oracle' | 'quickbooks' | 'netsuite' | 'dynamics' | 'odoo';

export interface ERPConnectionConfig {
  baseUrl?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  database?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  environment?: 'sandbox' | 'production';
  timeout?: number;
  retryAttempts?: number;
}

export interface ERPSystemInfo {
  id: string;
  name: string;
  type: ERPSystemType;
  version: string;
  features: string[];
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastSync?: string;
  responseTime?: number;
}

export interface SyncOptions {
  batchSize?: number;
  includeDeleted?: boolean;
  dateFrom?: string;
  dateTo?: string;
  dataTypes?: string[];
}

export interface APIListOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: Record<string, any>;
  search?: string;
}

// Product-related interfaces
export interface ProductAPI {
  list(options?: APIListOptions): Promise<any>;
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  search(query: string, options?: APIListOptions): Promise<any>;
  bulkCreate(products: any[]): Promise<any>;
  bulkUpdate(updates: Array<{id: string, data: any}>): Promise<any>;
  getCategories(): Promise<any>;
  getTags(): Promise<any>;
}

export interface VariantAPI {
  list(productId: string): Promise<any>;
  get(id: string): Promise<any>;
  create(productId: string, data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  getInventory(id: string): Promise<any>;
  updateInventory(id: string, quantity: number): Promise<any>;
}

// Region and Tax interfaces
export interface RegionAPI {
  list(options?: APIListOptions): Promise<any>;
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  getCountries(regionId: string): Promise<any>;
  getCurrencies(regionId: string): Promise<any>;
}

export interface TaxAPI {
  listRegions(options?: APIListOptions): Promise<any>;
  getRates(regionId: string): Promise<any>;
  createRate(data: any): Promise<any>;
  updateRate(id: string, data: any): Promise<any>;
  deleteRate(id: string): Promise<any>;
  calculateTax(amount: number, regionId: string): Promise<any>;
  getProviders(): Promise<any>;
}

// User and Customer interfaces
export interface UserAPI {
  list(options?: APIListOptions): Promise<any>;
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  getRoles(): Promise<any>;
  updateRole(userId: string, role: string): Promise<any>;
  resetPassword(email: string): Promise<any>;
}

export interface CustomerAPI {
  list(options?: APIListOptions): Promise<any>;
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  getOrders(customerId: string): Promise<any>;
  getGroups(): Promise<any>;
}

// Order and Sales interfaces
export interface OrderAPI {
  list(options?: APIListOptions): Promise<any>;
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  updateStatus(id: string, status: string): Promise<any>;
  addPayment(orderId: string, payment: any): Promise<any>;
  refund(orderId: string, amount: number): Promise<any>;
  getInvoice(orderId: string): Promise<any>;
}

export interface SalesChannelAPI {
  list(options?: APIListOptions): Promise<any>;
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  addProducts(channelId: string, productIds: string[]): Promise<any>;
  removeProducts(channelId: string, productIds: string[]): Promise<any>;
}

// Inventory and Warehouse interfaces
export interface InventoryAPI {
  list(options?: APIListOptions): Promise<any>;
  get(id: string): Promise<any>;
  updateQuantity(itemId: string, quantity: number): Promise<any>;
  getStock(productId: string, locationId?: string): Promise<any>;
  adjustStock(adjustments: Array<{itemId: string, quantity: number, reason: string}>): Promise<any>;
  getMovements(itemId: string, options?: APIListOptions): Promise<any>;
}

export interface WarehouseAPI {
  list(options?: APIListOptions): Promise<any>;
  get(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
  getInventory(warehouseId: string): Promise<any>;
  transferStock(from: string, to: string, items: any[]): Promise<any>;
}

// Main ERP Adapter Interface
export interface ERPAdapter {
  // System information
  getSystemInfo(): ERPSystemInfo;
  
  // Connection management
  connect(config: ERPConnectionConfig): Promise<boolean>;
  disconnect(): Promise<boolean>;
  testConnection(): Promise<any>;
  isConnected(): boolean;
  
  // API Services
  products: ProductAPI;
  variants: VariantAPI;
  regions: RegionAPI;
  taxes: TaxAPI;
  users: UserAPI;
  customers: CustomerAPI;
  orders: OrderAPI;
  salesChannels: SalesChannelAPI;
  inventory: InventoryAPI;
  warehouses: WarehouseAPI;
  
  // Data synchronization
  sync(options?: SyncOptions): Promise<any>;
  getSyncStatus(): Promise<any>;
  
  // Webhooks and events
  setupWebhooks?(endpoints: string[]): Promise<any>;
  handleWebhook?(payload: any): Promise<any>;
  
  // Bulk operations
  bulkImport?(dataType: string, data: any[]): Promise<any>;
  bulkExport?(dataType: string, options?: any): Promise<any>;
  
  // Custom endpoints (for system-specific features)
  customRequest?(endpoint: string, method: string, data?: any): Promise<any>;
}

// Base adapter class with common functionality
export abstract class BaseERPAdapter implements ERPAdapter {
  protected config: ERPConnectionConfig = {};
  protected connected: boolean = false;
  protected systemInfo: ERPSystemInfo;

  constructor(systemInfo: ERPSystemInfo) {
    this.systemInfo = systemInfo;
  }

  abstract connect(config: ERPConnectionConfig): Promise<boolean>;
  abstract disconnect(): Promise<boolean>;
  abstract testConnection(): Promise<any>;
  
  getSystemInfo(): ERPSystemInfo {
    return this.systemInfo;
  }
  
  isConnected(): boolean {
    return this.connected;
  }
  
  // Abstract API services - must be implemented by each adapter
  abstract products: ProductAPI;
  abstract variants: VariantAPI;
  abstract regions: RegionAPI;
  abstract taxes: TaxAPI;
  abstract users: UserAPI;
  abstract customers: CustomerAPI;
  abstract orders: OrderAPI;
  abstract salesChannels: SalesChannelAPI;
  abstract inventory: InventoryAPI;
  abstract warehouses: WarehouseAPI;
  
  abstract sync(options?: SyncOptions): Promise<any>;
  abstract getSyncStatus(): Promise<any>;
  
  // Default implementation for optional methods
  async setupWebhooks(endpoints: string[]): Promise<any> {
    throw new Error('Webhooks not supported by this ERP system');
  }
  
  async handleWebhook(payload: any): Promise<any> {
    throw new Error('Webhook handling not implemented');
  }
  
  async bulkImport(dataType: string, data: any[]): Promise<any> {
    throw new Error('Bulk import not supported by this ERP system');
  }
  
  async bulkExport(dataType: string, options?: any): Promise<any> {
    throw new Error('Bulk export not supported by this ERP system');
  }
  
  async customRequest(endpoint: string, method: string, data?: any): Promise<any> {
    throw new Error('Custom requests not supported by this ERP system');
  }
  
  // Utility methods
  protected async makeRequest(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    const url = `${this.config.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.getAuthHeader(),
        ...this.getCustomHeaders()
      },
      ...(data && method !== 'GET' && { body: JSON.stringify(data) })
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }
  
  protected getAuthHeader(): string {
    if (this.config.apiKey) {
      return `Bearer ${this.config.apiKey}`;
    }
    if (this.config.username && this.config.password) {
      return `Basic ${btoa(`${this.config.username}:${this.config.password}`)}`;
    }
    return '';
  }
  
  protected getCustomHeaders(): Record<string, string> {
    return {};
  }
  
  protected handleError(error: any): never {
    console.error(`${this.systemInfo.name} adapter error:`, error);
    throw error;
  }
}


