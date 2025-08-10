/**
 * Simplified Rawaa ERP Adapter Implementation
 * Provides all required API methods with basic implementations
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
  SyncOptions,
  APIListOptions
} from '../erp-adapter-interface';

export interface RawaaConfig extends ERPConnectionConfig {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  environment: 'sandbox' | 'production';
}

export class RawaaERPAdapter extends BaseERPAdapter implements ERPAdapter {
  // API service properties
  products!: ProductAPI;
  variants!: VariantAPI;
  regions!: RegionAPI;
  taxes!: TaxAPI;
  users!: UserAPI;
  customers!: CustomerAPI;
  orders!: OrderAPI;
  salesChannels!: SalesChannelAPI;
  inventory!: InventoryAPI;
  warehouses!: WarehouseAPI;

  private authToken?: string;
  private tokenExpiry?: Date;

  constructor(systemInfo: ERPSystemInfo, config: RawaaConfig) {
    super(systemInfo);
    this.config = config;
    this.initializeAPIServices();
  }

  async connect(config: ERPConnectionConfig): Promise<boolean> {
    try {
      this.config = { ...this.config, ...config };
      const rawaaConfig = this.config as RawaaConfig;
      
      // Authenticate with Rawaa OAuth2
      const authResponse = await fetch(`${rawaaConfig.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: rawaaConfig.clientId,
          client_secret: rawaaConfig.clientSecret,
          tenant_id: rawaaConfig.tenantId
        })
      });

      if (!authResponse.ok) {
        throw new Error(`Authentication failed: ${authResponse.statusText}`);
      }

      const authData = await authResponse.json();
      this.authToken = authData.access_token;
      this.tokenExpiry = new Date(Date.now() + authData.expires_in * 1000);
      this.connected = true;

      return true;
    } catch (error) {
      this.connected = false;
      throw error;
    }
  }

  async disconnect(): Promise<boolean> {
    this.authToken = undefined;
    this.tokenExpiry = undefined;
    this.connected = false;
    return true;
  }

  async testConnection(): Promise<any> {
    try {
      const rawaaConfig = this.config as RawaaConfig;
      const response = await fetch(`${rawaaConfig.baseUrl}/api/v1/health`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'X-Tenant-ID': rawaaConfig.tenantId
        }
      });
      return { success: response.ok, status: response.status };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  protected getAuthHeader(): string {
    return this.authToken ? `Bearer ${this.authToken}` : '';
  }

  protected getCustomHeaders(): Record<string, string> {
    const rawaaConfig = this.config as RawaaConfig;
    return {
      'X-Tenant-ID': rawaaConfig.tenantId || ''
    };
  }

  private initializeAPIServices(): void {
    this.products = {
      list: async (options?: APIListOptions) => {
        const response = await this.makeRequest('/api/v1/products');
        return response.data || [];
      },
      get: async (id: string) => {
        const response = await this.makeRequest(`/api/v1/products/${id}`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await this.makeRequest('/api/v1/products', 'POST', data);
        return response.data;
      },
      update: async (id: string, data: any) => {
        const response = await this.makeRequest(`/api/v1/products/${id}`, 'PUT', data);
        return response.data;
      },
      delete: async (id: string) => {
        await this.makeRequest(`/api/v1/products/${id}`, 'DELETE');
      },
      search: async (query: string, options?: APIListOptions) => {
        const response = await this.makeRequest(`/api/v1/products/search?q=${query}`);
        return response.data || [];
      },
      bulkCreate: async (data: any[]) => {
        const response = await this.makeRequest('/api/v1/products/bulk', 'POST', { items: data });
        return response.data;
      },
      bulkUpdate: async (data: any[]) => {
        const response = await this.makeRequest('/api/v1/products/bulk', 'PUT', { items: data });
        return response.data;
      },
      getCategories: async () => {
        const response = await this.makeRequest('/api/v1/categories');
        return response.data || [];
      },
      getTags: async () => {
        const response = await this.makeRequest('/api/v1/product-tags');
        return response.data || [];
      }
    };

    this.variants = {
      list: async (productId: string) => {
        const response = await this.makeRequest(`/api/v1/products/${productId}/variants`);
        return response.data || [];
      },
      get: async (id: string) => {
        const response = await this.makeRequest(`/api/v1/variants/${id}`);
        return response.data;
      },
      create: async (productId: string, data: any) => {
        const response = await this.makeRequest(`/api/v1/products/${productId}/variants`, 'POST', data);
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

    this.regions = {
      list: async () => {
        const response = await this.makeRequest('/api/v1/regions');
        return response.data || [];
      },
      get: async (id: string) => {
        const response = await this.makeRequest(`/api/v1/regions/${id}`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await this.makeRequest('/api/v1/regions', 'POST', data);
        return response.data;
      },
      update: async (id: string, data: any) => {
        const response = await this.makeRequest(`/api/v1/regions/${id}`, 'PUT', data);
        return response.data;
      },
      delete: async (id: string) => {
        await this.makeRequest(`/api/v1/regions/${id}`, 'DELETE');
      },
      getCountries: async (regionId: string) => {
        const response = await this.makeRequest(`/api/v1/regions/${regionId}/countries`);
        return response.data || [];
      },
      getCurrencies: async (regionId: string) => {
        const response = await this.makeRequest(`/api/v1/regions/${regionId}/currencies`);
        return response.data || [];
      }
    };

    this.taxes = {
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

    this.users = {
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
      resetPassword: async (email: string) => {
        const response = await this.makeRequest('/api/v1/users/reset-password', 'POST', { email });
        return response.data;
      }
    };

    this.customers = {
      list: async () => {
        const response = await this.makeRequest('/api/v1/customers');
        return response.data || [];
      },
      get: async (id: string) => {
        const response = await this.makeRequest(`/api/v1/customers/${id}`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await this.makeRequest('/api/v1/customers', 'POST', data);
        return response.data;
      },
      update: async (id: string, data: any) => {
        const response = await this.makeRequest(`/api/v1/customers/${id}`, 'PUT', data);
        return response.data;
      },
      delete: async (id: string) => {
        await this.makeRequest(`/api/v1/customers/${id}`, 'DELETE');
      },
      getOrders: async (customerId: string) => {
        const response = await this.makeRequest(`/api/v1/customers/${customerId}/orders`);
        return response.data || [];
      },
      getGroups: async () => {
        const response = await this.makeRequest('/api/v1/customer-groups');
        return response.data || [];
      }
    };

    this.orders = {
      list: async () => {
        const response = await this.makeRequest('/api/v1/orders');
        return response.data || [];
      },
      get: async (id: string) => {
        const response = await this.makeRequest(`/api/v1/orders/${id}`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await this.makeRequest('/api/v1/orders', 'POST', data);
        return response.data;
      },
      update: async (id: string, data: any) => {
        const response = await this.makeRequest(`/api/v1/orders/${id}`, 'PUT', data);
        return response.data;
      },
      delete: async (id: string) => {
        await this.makeRequest(`/api/v1/orders/${id}`, 'DELETE');
      },
      updateStatus: async (id: string, status: string) => {
        const response = await this.makeRequest(`/api/v1/orders/${id}/status`, 'PUT', { status });
        return response.data;
      },
      addPayment: async (orderId: string, payment: any) => {
        const response = await this.makeRequest(`/api/v1/orders/${orderId}/payments`, 'POST', payment);
        return response.data;
      },
      refund: async (orderId: string, amount: number) => {
        const response = await this.makeRequest(`/api/v1/orders/${orderId}/refund`, 'POST', { amount });
        return response.data;
      },
      getInvoice: async (orderId: string) => {
        const response = await this.makeRequest(`/api/v1/orders/${orderId}/invoice`);
        return response.data;
      }
    };

    this.salesChannels = {
      list: async () => {
        const response = await this.makeRequest('/api/v1/sales-channels');
        return response.data || [];
      },
      get: async (id: string) => {
        const response = await this.makeRequest(`/api/v1/sales-channels/${id}`);
        return response.data;
      },
      create: async (data: any) => {
        const response = await this.makeRequest('/api/v1/sales-channels', 'POST', data);
        return response.data;
      },
      update: async (id: string, data: any) => {
        const response = await this.makeRequest(`/api/v1/sales-channels/${id}`, 'PUT', data);
        return response.data;
      },
      delete: async (id: string) => {
        await this.makeRequest(`/api/v1/sales-channels/${id}`, 'DELETE');
      },
      addProducts: async (channelId: string, productIds: string[]) => {
        const response = await this.makeRequest(`/api/v1/sales-channels/${channelId}/products`, 'POST', { product_ids: productIds });
        return response.data;
      },
      removeProducts: async (channelId: string, productIds: string[]) => {
        const response = await this.makeRequest(`/api/v1/sales-channels/${channelId}/products`, 'DELETE', { product_ids: productIds });
        return response.data;
      }
    };

    this.inventory = {
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
      getMovements: async (itemId: string, options?: APIListOptions) => {
        const response = await this.makeRequest(`/api/v1/inventory/${itemId}/movements`);
        return response.data || [];
      }
    };

    this.warehouses = {
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
  }

  async sync(options?: SyncOptions): Promise<any> {
    const response = await this.makeRequest('/api/v1/sync', 'POST', options);
    return response.data;
  }

  async getSyncStatus(): Promise<any> {
    const response = await this.makeRequest('/api/v1/sync/status');
    return response.data;
  }
}


