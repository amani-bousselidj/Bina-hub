/**
 * Wafeq ERP Adapter Implementation  
 * Cloud-based accounting and business management platform
 */

import { 
  BaseERPAdapter, 
  ERPAdapter, 
  ERPConnectionConfig,
  ERPSystemInfo,
  ProductAPI,
  VariantAPI,
  RegionAPI,
  TaxAPI,
  UserAPI,
  CustomerAPI,
  OrderAPI,
  SalesChannelAPI,
  InventoryAPI,
  WarehouseAPI,
  SyncOptions
} from '../erp-adapter-interface';

export interface WafeqConfig extends ERPConnectionConfig {
  apiKey: string;
  tenantId: string;
  environment: 'sandbox' | 'production';
}

export class WafeqERPAdapter extends BaseERPAdapter implements ERPAdapter {
  constructor(systemInfo: ERPSystemInfo, config: WafeqConfig) {
    super(systemInfo);
    this.config = config;
  }

  async connect(config: ERPConnectionConfig): Promise<boolean> {
    try {
      this.config = { ...this.config, ...config };
      const wafeqConfig = this.config as WafeqConfig;
      
      // Test Wafeq API connection
      const response = await fetch(`${wafeqConfig.baseUrl}/api/v1/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${wafeqConfig.apiKey}`,
          'X-Company-ID': wafeqConfig.tenantId
        }
      });

      this.connected = response.ok;
      return this.connected;
    } catch (error) {
      this.connected = false;
      throw error;
    }
  }

  async disconnect(): Promise<boolean> {
    this.connected = false;
    return true;
  }

  async testConnection(): Promise<any> {
    try {
      const wafeqConfig = this.config as WafeqConfig;
      const response = await fetch(`${wafeqConfig.baseUrl}/api/v1/health`, {
        headers: {
          'Authorization': `Bearer ${wafeqConfig.apiKey}`,
          'X-Company-ID': wafeqConfig.tenantId
        }
      });
      return { success: response.ok, status: response.status };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  protected getAuthHeader(): string {
    return `Bearer ${(this.config as WafeqConfig).apiKey}`;
  }

  protected getCustomHeaders(): Record<string, string> {
    return {
      'X-Company-ID': (this.config as WafeqConfig).tenantId || ''
    };
  }

  // Simple API implementations - basic CRUD operations
  products: ProductAPI = {
    list: async (options?: any) => {
      const response = await this.makeRequest('/api/v1/items');
      return response.data?.map((item: any) => ({
        id: item.id,
        title: item.name,
        description: item.description,
        status: item.is_active ? 'published' : 'draft',
        handle: item.code,
        price: item.selling_price
      })) || [];
    },
    get: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/items/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await this.makeRequest('/api/v1/items', 'POST', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/items/${id}`, 'PUT', data);
      return response.data;
    },
    delete: async (id: string) => {
      await this.makeRequest(`/api/v1/items/${id}`, 'DELETE');
    },
    search: async (query: string) => {
      const response = await this.makeRequest(`/api/v1/items/search?q=${query}`);
      return response.data || [];
    },
    bulkCreate: async (data: any[]) => {
      const response = await this.makeRequest('/api/v1/items/bulk', 'POST', { items: data });
      return response.data;
    },
    bulkUpdate: async (data: any[]) => {
      const response = await this.makeRequest('/api/v1/items/bulk', 'PUT', { items: data });
      return response.data;
    },
    getCategories: async () => {
      const response = await this.makeRequest('/api/v1/categories');
      return response.data || [];
    },
    getTags: async () => {
      return []; // Wafeq doesn't support tags
    }
  };

  variants: VariantAPI = {
    list: async (productId: string) => {
      const response = await this.makeRequest(`/api/v1/items/${productId}/variants`);
      return response.data || [];
    },
    get: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/variants/${id}`);
      return response.data;
    },
    create: async (productId: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/items/${productId}/variants`, 'POST', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/variants/${id}`, 'PUT', data);
      return response.data;
    },
    delete: async (id: string) => {
      await this.makeRequest(`/api/v1/variants/${id}`, 'DELETE');
    },
    getInventory: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/variants/${id}/inventory`);
      return response.data;
    },
    updateInventory: async (id: string, quantity: number) => {
      const response = await this.makeRequest(`/api/v1/variants/${id}/inventory`, 'PUT', { quantity });
      return response.data;
    }
  };

  regions: RegionAPI = {
    list: async () => {
      const response = await this.makeRequest('/api/v1/locations');
      return response.data || [];
    },
    get: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/locations/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await this.makeRequest('/api/v1/locations', 'POST', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/locations/${id}`, 'PUT', data);
      return response.data;
    },
    delete: async (id: string) => {
      await this.makeRequest(`/api/v1/locations/${id}`, 'DELETE');
    },
    getCountries: async () => {
      const response = await this.makeRequest('/api/v1/countries');
      return response.data || [];
    },
    getCurrencies: async () => {
      const response = await this.makeRequest('/api/v1/currencies');
      return response.data || [];
    }
  };

  taxes: TaxAPI = {
    listRegions: async () => {
      const response = await this.makeRequest('/api/v1/tax-regions');
      return response.data || [];
    },
    getRates: async (regionId: string) => {
      const response = await this.makeRequest(`/api/v1/tax-rates?region=${regionId}`);
      return response.data || [];
    },
    createRate: async (data: any) => {
      const response = await this.makeRequest('/api/v1/tax-rates', 'POST', data);
      return response.data;
    },
    updateRate: async (id: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/tax-rates/${id}`, 'PUT', data);
      return response.data;
    },
    deleteRate: async (id: string) => {
      await this.makeRequest(`/api/v1/tax-rates/${id}`, 'DELETE');
    },
    calculateTax: async (amount: number, regionId: string) => {
      const response = await this.makeRequest('/api/v1/tax/calculate', 'POST', { amount, region_id: regionId });
      return response.data;
    },
    getProviders: async () => {
      const response = await this.makeRequest('/api/v1/tax-providers');
      return response.data || [];
    }
  };

  users: UserAPI = {
    list: async () => {
      const response = await this.makeRequest('/api/v1/users');
      return response.data || [];
    },
    get: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/users/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await this.makeRequest('/api/v1/users', 'POST', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/users/${id}`, 'PUT', data);
      return response.data;
    },
    delete: async (id: string) => {
      await this.makeRequest(`/api/v1/users/${id}`, 'DELETE');
    },
    getRoles: async () => {
      const response = await this.makeRequest('/api/v1/roles');
      return response.data || [];
    },
    updateRole: async (userId: string, roleId: string) => {
      const response = await this.makeRequest(`/api/v1/users/${userId}/role`, 'PUT', { role_id: roleId });
      return response.data;
    },
    resetPassword: async (userId: string) => {
      const response = await this.makeRequest(`/api/v1/users/${userId}/reset-password`, 'POST');
      return response.data;
    }
  };

  customers: CustomerAPI = {
    list: async () => {
      const response = await this.makeRequest('/api/v1/contacts');
      return response.data || [];
    },
    get: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/contacts/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await this.makeRequest('/api/v1/contacts', 'POST', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/contacts/${id}`, 'PUT', data);
      return response.data;
    },
    delete: async (id: string) => {
      await this.makeRequest(`/api/v1/contacts/${id}`, 'DELETE');
    },
    getOrders: async (customerId: string) => {
      const response = await this.makeRequest(`/api/v1/contacts/${customerId}/invoices`);
      return response.data || [];
    },
    getGroups: async () => {
      const response = await this.makeRequest('/api/v1/contact-groups');
      return response.data || [];
    }
  };

  orders: OrderAPI = {
    list: async () => {
      const response = await this.makeRequest('/api/v1/invoices');
      return response.data || [];
    },
    get: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/invoices/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await this.makeRequest('/api/v1/invoices', 'POST', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/invoices/${id}`, 'PUT', data);
      return response.data;
    },
    delete: async (id: string) => {
      await this.makeRequest(`/api/v1/invoices/${id}`, 'DELETE');
    },
    updateStatus: async (id: string, status: string) => {
      const response = await this.makeRequest(`/api/v1/invoices/${id}/status`, 'PUT', { status });
      return response.data;
    },
    addPayment: async (orderId: string, paymentData: any) => {
      const response = await this.makeRequest(`/api/v1/invoices/${orderId}/payments`, 'POST', paymentData);
      return response.data;
    },
    refund: async (orderId: string, amount: number) => {
      const response = await this.makeRequest(`/api/v1/invoices/${orderId}/refund`, 'POST', { amount });
      return response.data;
    },
    getInvoice: async (orderId: string) => {
      const response = await this.makeRequest(`/api/v1/invoices/${orderId}/pdf`);
      return response.data;
    }
  };

  salesChannels: SalesChannelAPI = {
    list: async () => {
      return []; // Wafeq doesn't have sales channels concept
    },
    get: async (id: string) => {
      return null;
    },
    create: async (data: any) => {
      throw new Error('Sales channels not supported by Wafeq');
    },
    update: async (id: string, data: any) => {
      throw new Error('Sales channels not supported by Wafeq');
    },
    delete: async (id: string) => {
      throw new Error('Sales channels not supported by Wafeq');
    },
    addProducts: async (channelId: string, productIds: string[]) => {
      throw new Error('Sales channels not supported by Wafeq');
    },
    removeProducts: async (channelId: string, productIds: string[]) => {
      throw new Error('Sales channels not supported by Wafeq');
    }
  };

  inventory: InventoryAPI = {
    list: async () => {
      const response = await this.makeRequest('/api/v1/inventory');
      return response.data || [];
    },
    get: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/inventory/${id}`);
      return response.data;
    },
    updateQuantity: async (itemId: string, quantity: number) => {
      const response = await this.makeRequest(`/api/v1/inventory/${itemId}/quantity`, 'PUT', { quantity });
      return response.data;
    },
    getStock: async (productId: string, locationId?: string) => {
      const url = locationId 
        ? `/api/v1/inventory/stock/${productId}?location=${locationId}`
        : `/api/v1/inventory/stock/${productId}`;
      const response = await this.makeRequest(url);
      return response.data;
    },
    adjustStock: async (adjustments: Array<{itemId: string, quantity: number, reason: string}>) => {
      const response = await this.makeRequest('/api/v1/inventory/adjustments', 'POST', { adjustments });
      return response.data;
    },
    getMovements: async (itemId: string, options?: any) => {
      const response = await this.makeRequest(`/api/v1/inventory/${itemId}/movements`);
      return response.data || [];
    }
  };

  warehouses: WarehouseAPI = {
    list: async () => {
      const response = await this.makeRequest('/api/v1/warehouses');
      return response.data || [];
    },
    get: async (id: string) => {
      const response = await this.makeRequest(`/api/v1/warehouses/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await this.makeRequest('/api/v1/warehouses', 'POST', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await this.makeRequest(`/api/v1/warehouses/${id}`, 'PUT', data);
      return response.data;
    },
    delete: async (id: string) => {
      await this.makeRequest(`/api/v1/warehouses/${id}`, 'DELETE');
    },
    getInventory: async (warehouseId: string) => {
      const response = await this.makeRequest(`/api/v1/warehouses/${warehouseId}/inventory`);
      return response.data;
    },
    transferStock: async (from: string, to: string, items: any[]) => {
      const response = await this.makeRequest('/api/v1/stock-transfers', 'POST', { from, to, items });
      return response.data;
    }
  };

  async sync(options?: SyncOptions): Promise<any> {
    const response = await this.makeRequest('/api/v1/sync', 'POST', options);
    return response.data;
  }

  async getSyncStatus(): Promise<any> {
    const response = await this.makeRequest('/api/v1/sync/status');
    return response.data;
  }
}


