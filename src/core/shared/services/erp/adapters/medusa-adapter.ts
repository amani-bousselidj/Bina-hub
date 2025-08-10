/**
 * Medusa ERP Adapter
 * Integrates with existing Medusa.js e-commerce framework
 */

import { 
  BaseERPAdapter, 
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
  APIListOptions,
  SyncOptions
} from '../erp-adapter-interface';

export class MedusaERPAdapter extends BaseERPAdapter {
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

  constructor() {
    const systemInfo: ERPSystemInfo = {
      id: 'medusa-main',
      name: 'Medusa.js E-commerce',
      type: 'medusa',
      version: '2.8.7',
      features: [
        'products',
        'variants',
        'customers',
        'orders',
        'inventory',
        'regions',
        'taxes',
        'sales_channels',
        'promotions',
        'users',
        'payments',
        'fulfillment'
      ],
      status: 'disconnected'
    };
    
    super(systemInfo);
    this.initializeAPIServices();
  }

  async connect(config: ERPConnectionConfig): Promise<boolean> {
    try {
      this.config = {
        baseUrl: config.baseUrl || process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000',
        apiKey: config.apiKey || process.env.MEDUSA_API_KEY,
        ...config
      };

      // Test connection
      const testResult = await this.testConnection();
      this.connected = testResult.success;
      this.systemInfo.status = this.connected ? 'connected' : 'error';
      this.systemInfo.responseTime = testResult.responseTime;
      
      return this.connected;
    } catch (error) {
      this.systemInfo.status = 'error';
      this.handleError(error);
    }
  }

  async disconnect(): Promise<boolean> {
    this.connected = false;
    this.systemInfo.status = 'disconnected';
    return true;
  }

  async testConnection(): Promise<any> {
    const startTime = Date.now();
    try {
      const response = await this.makeRequest('/admin/auth/token', 'POST', {
        email: this.config.username || 'admin@medusa-test.com',
        password: this.config.password || 'supersecret'
      });
      
      const responseTime = Date.now() - startTime;
      return {
        success: true,
        responseTime,
        message: 'Medusa connection successful',
        version: response.user?.metadata?.version || '2.8.7'
      };
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  async sync(options?: SyncOptions): Promise<any> {
    try {
      const syncResult = {
        syncId: `medusa_sync_${Date.now()}`,
        startTime: new Date().toISOString(),
        status: 'running',
        dataTypes: options?.dataTypes || ['products', 'customers', 'orders'],
        recordsProcessed: 0,
        recordsFailed: 0,
        errors: [] as string[]
      };

      // Simulate sync process
      for (const dataType of syncResult.dataTypes) {
        try {
          const count = await this.syncDataType(dataType, options);
          syncResult.recordsProcessed += count;
        } catch (error) {
          syncResult.recordsFailed++;
          syncResult.errors.push(`${dataType}: ${error instanceof Error ? error.message : 'Sync failed'}`);
        }
      }

      syncResult.status = syncResult.errors.length > 0 ? 'partial' : 'completed';
      this.systemInfo.lastSync = new Date().toISOString();
      
      return syncResult;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSyncStatus(): Promise<any> {
    return {
      lastSync: this.systemInfo.lastSync,
      status: this.systemInfo.status,
      nextSync: null // Medusa typically uses real-time updates
    };
  }

  private async syncDataType(dataType: string, options?: SyncOptions): Promise<number> {
    switch (dataType) {
      case 'products':
        const products = await this.products.list({ limit: options?.batchSize || 100 });
        return products.data?.products?.length || 0;
      
      case 'customers':
        const customers = await this.customers.list({ limit: options?.batchSize || 100 });
        return customers.data?.customers?.length || 0;
      
      case 'orders':
        const orders = await this.orders.list({ limit: options?.batchSize || 100 });
        return orders.data?.orders?.length || 0;
      
      default:
        return 0;
    }
  }

  private initializeAPIServices(): void {
    // Products API
    this.products = {
      list: async (options?: APIListOptions) => {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.page) params.append('offset', ((options.page - 1) * (options.limit || 20)).toString());
        if (options?.search) params.append('q', options.search);
        
        return await this.makeRequest(`/admin/products?${params.toString()}`);
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/products/${id}`);
      },

      create: async (data: any) => {
        return await this.makeRequest('/admin/products', 'POST', data);
      },

      update: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/products/${id}`, 'POST', data);
      },

      delete: async (id: string) => {
        return await this.makeRequest(`/admin/products/${id}`, 'DELETE');
      },

      search: async (query: string, options?: APIListOptions) => {
        return await this.products.list({ ...options, search: query });
      },

      bulkCreate: async (products: any[]) => {
        const results: any[] = [];
        for (const product of products) {
          try {
            const result = await this.products.create(product);
            results.push(result);
          } catch (error) {
            results.push({ error: error instanceof Error ? error.message : 'Failed to create product' });
          }
        }
        return { data: results };
      },

      bulkUpdate: async (updates: Array<{id: string, data: any}>) => {
        const results: any[] = [];
        for (const update of updates) {
          try {
            const result = await this.products.update(update.id, update.data);
            results.push(result);
          } catch (error) {
            results.push({ error: error instanceof Error ? error.message : 'Failed to update product' });
          }
        }
        return { data: results };
      },

      getCategories: async () => {
        return await this.makeRequest('/admin/product-categories');
      },

      getTags: async () => {
        return await this.makeRequest('/admin/product-tags');
      }
    };

    // Variants API
    this.variants = {
      list: async (productId: string) => {
        const product = await this.makeRequest(`/admin/products/${productId}`);
        return { data: { variants: product.data?.product?.variants || [] } };
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/product-variants/${id}`);
      },

      create: async (productId: string, data: any) => {
        return await this.makeRequest(`/admin/products/${productId}/variants`, 'POST', data);
      },

      update: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/product-variants/${id}`, 'POST', data);
      },

      delete: async (id: string) => {
        return await this.makeRequest(`/admin/product-variants/${id}`, 'DELETE');
      },

      getInventory: async (id: string) => {
        return await this.makeRequest(`/admin/inventory-items?variant_id=${id}`);
      },

      updateInventory: async (id: string, quantity: number) => {
        return await this.makeRequest(`/admin/inventory-items/${id}/location-levels`, 'POST', {
          quantity
        });
      }
    };

    // Regions API
    this.regions = {
      list: async (options?: APIListOptions) => {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.page) params.append('offset', ((options.page - 1) * (options.limit || 20)).toString());
        
        return await this.makeRequest(`/admin/regions?${params.toString()}`);
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/regions/${id}`);
      },

      create: async (data: any) => {
        return await this.makeRequest('/admin/regions', 'POST', data);
      },

      update: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/regions/${id}`, 'POST', data);
      },

      delete: async (id: string) => {
        return await this.makeRequest(`/admin/regions/${id}`, 'DELETE');
      },

      getCountries: async (regionId: string) => {
        const region = await this.makeRequest(`/admin/regions/${regionId}`);
        return { data: { countries: region.data?.region?.countries || [] } };
      },

      getCurrencies: async (regionId: string) => {
        const region = await this.makeRequest(`/admin/regions/${regionId}`);
        return { data: { currency: region.data?.region?.currency_code } };
      }
    };

    // Initialize other API services with similar patterns...
    this.taxes = this.createTaxAPI();
    this.users = this.createUserAPI();
    this.customers = this.createCustomerAPI();
    this.orders = this.createOrderAPI();
    this.salesChannels = this.createSalesChannelAPI();
    this.inventory = this.createInventoryAPI();
    this.warehouses = this.createWarehouseAPI();
  }

  private createTaxAPI(): TaxAPI {
    return {
      listRegions: async (options?: APIListOptions) => {
        return await this.makeRequest('/admin/tax-regions');
      },

      getRates: async (regionId: string) => {
        return await this.makeRequest(`/admin/tax-regions/${regionId}/tax-rates`);
      },

      createRate: async (data: any) => {
        return await this.makeRequest('/admin/tax-rates', 'POST', data);
      },

      updateRate: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/tax-rates/${id}`, 'POST', data);
      },

      deleteRate: async (id: string) => {
        return await this.makeRequest(`/admin/tax-rates/${id}`, 'DELETE');
      },

      calculateTax: async (amount: number, regionId: string) => {
        // Medusa handles tax calculation automatically
        return { data: { calculated_tax: amount * 0.1 } }; // Mock 10% tax
      },

      getProviders: async () => {
        return await this.makeRequest('/admin/tax-providers');
      }
    };
  }

  private createUserAPI(): UserAPI {
    return {
      list: async (options?: APIListOptions) => {
        return await this.makeRequest('/admin/users');
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/users/${id}`);
      },

      create: async (data: any) => {
        return await this.makeRequest('/admin/users', 'POST', data);
      },

      update: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/users/${id}`, 'POST', data);
      },

      delete: async (id: string) => {
        return await this.makeRequest(`/admin/users/${id}`, 'DELETE');
      },

      getRoles: async () => {
        return { data: { roles: ['admin', 'member', 'developer'] } }; // Medusa default roles
      },

      updateRole: async (userId: string, role: string) => {
        return await this.makeRequest(`/admin/users/${userId}`, 'POST', { role });
      },

      resetPassword: async (email: string) => {
        return await this.makeRequest('/admin/auth/reset-password', 'POST', { email });
      }
    };
  }

  private createCustomerAPI(): CustomerAPI {
    return {
      list: async (options?: APIListOptions) => {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.page) params.append('offset', ((options.page - 1) * (options.limit || 20)).toString());
        
        return await this.makeRequest(`/admin/customers?${params.toString()}`);
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/customers/${id}`);
      },

      create: async (data: any) => {
        return await this.makeRequest('/admin/customers', 'POST', data);
      },

      update: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/customers/${id}`, 'POST', data);
      },

      delete: async (id: string) => {
        return await this.makeRequest(`/admin/customers/${id}`, 'DELETE');
      },

      getOrders: async (customerId: string) => {
        return await this.makeRequest(`/admin/orders?customer_id=${customerId}`);
      },

      getGroups: async () => {
        return await this.makeRequest('/admin/customer-groups');
      }
    };
  }

  private createOrderAPI(): OrderAPI {
    return {
      list: async (options?: APIListOptions) => {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', options.limit.toString());
        if (options?.page) params.append('offset', ((options.page - 1) * (options.limit || 20)).toString());
        
        return await this.makeRequest(`/admin/orders?${params.toString()}`);
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/orders/${id}`);
      },

      create: async (data: any) => {
        return await this.makeRequest('/admin/orders', 'POST', data);
      },

      update: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/orders/${id}`, 'POST', data);
      },

      delete: async (id: string) => {
        return await this.makeRequest(`/admin/orders/${id}`, 'DELETE');
      },

      updateStatus: async (id: string, status: string) => {
        return await this.makeRequest(`/admin/orders/${id}`, 'POST', { status });
      },

      addPayment: async (orderId: string, payment: any) => {
        return await this.makeRequest(`/admin/orders/${orderId}/payment`, 'POST', payment);
      },

      refund: async (orderId: string, amount: number) => {
        return await this.makeRequest(`/admin/orders/${orderId}/refund`, 'POST', { amount });
      },

      getInvoice: async (orderId: string) => {
        return await this.makeRequest(`/admin/orders/${orderId}/invoice`);
      }
    };
  }

  private createSalesChannelAPI(): SalesChannelAPI {
    return {
      list: async (options?: APIListOptions) => {
        return await this.makeRequest('/admin/sales-channels');
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/sales-channels/${id}`);
      },

      create: async (data: any) => {
        return await this.makeRequest('/admin/sales-channels', 'POST', data);
      },

      update: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/sales-channels/${id}`, 'POST', data);
      },

      delete: async (id: string) => {
        return await this.makeRequest(`/admin/sales-channels/${id}`, 'DELETE');
      },

      addProducts: async (channelId: string, productIds: string[]) => {
        return await this.makeRequest(`/admin/sales-channels/${channelId}/products/batch`, 'POST', {
          product_ids: productIds
        });
      },

      removeProducts: async (channelId: string, productIds: string[]) => {
        return await this.makeRequest(`/admin/sales-channels/${channelId}/products/batch`, 'DELETE', {
          product_ids: productIds
        });
      }
    };
  }

  private createInventoryAPI(): InventoryAPI {
    return {
      list: async (options?: APIListOptions) => {
        return await this.makeRequest('/admin/inventory-items');
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/inventory-items/${id}`);
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        return await this.makeRequest(`/admin/inventory-items/${itemId}/location-levels`, 'POST', {
          quantity
        });
      },

      getStock: async (productId: string, locationId?: string) => {
        const params = locationId ? `?location_id=${locationId}` : '';
        return await this.makeRequest(`/admin/inventory-items?variant_id=${productId}${params}`);
      },

      adjustStock: async (adjustments: Array<{itemId: string, quantity: number, reason: string}>) => {
        const results: any[] = [];
        for (const adj of adjustments) {
          try {
            const result = await this.makeRequest(`/admin/inventory-items/${adj.itemId}/location-levels`, 'POST', {
              quantity: adj.quantity,
              reason: adj.reason
            });
            results.push(result);
          } catch (error) {
            results.push({ error: error instanceof Error ? error.message : 'Adjustment failed' });
          }
        }
        return { data: results };
      },

      getMovements: async (itemId: string, options?: APIListOptions) => {
        return await this.makeRequest(`/admin/inventory-items/${itemId}/movements`);
      }
    };
  }

  private createWarehouseAPI(): WarehouseAPI {
    return {
      list: async (options?: APIListOptions) => {
        return await this.makeRequest('/admin/stock-locations');
      },

      get: async (id: string) => {
        return await this.makeRequest(`/admin/stock-locations/${id}`);
      },

      create: async (data: any) => {
        return await this.makeRequest('/admin/stock-locations', 'POST', data);
      },

      update: async (id: string, data: any) => {
        return await this.makeRequest(`/admin/stock-locations/${id}`, 'POST', data);
      },

      delete: async (id: string) => {
        return await this.makeRequest(`/admin/stock-locations/${id}`, 'DELETE');
      },

      getInventory: async (warehouseId: string) => {
        return await this.makeRequest(`/admin/inventory-items?location_id=${warehouseId}`);
      },

      transferStock: async (from: string, to: string, items: any[]) => {
        // Medusa doesn't have direct transfer API, so we'll do individual adjustments
        const results: any[] = [];
        for (const item of items) {
          try {
            // Decrease from source
            await this.makeRequest(`/admin/inventory-items/${item.itemId}/location-levels/${from}`, 'POST', {
              quantity: -item.quantity
            });
            // Increase at destination
            await this.makeRequest(`/admin/inventory-items/${item.itemId}/location-levels/${to}`, 'POST', {
              quantity: item.quantity
            });
            results.push({ success: true, item: item.itemId });
          } catch (error) {
            results.push({ success: false, item: item.itemId, error: error instanceof Error ? error.message : 'Transfer failed' });
          }
        }
        return { data: results };
      }
    };
  }

  protected getCustomHeaders(): Record<string, string> {
    return {
      'x-medusa-access-token': this.config.apiKey || ''
    };
  }
}


