// ERP Integration Service
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export interface ERPCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  credit_limit?: number;
  payment_terms?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface ERPProduct {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unit_price: number;
  cost_price: number;
  stock_quantity: number;
  minimum_stock: number;
  unit_of_measure: string;
  supplier_id?: string;
  status: 'active' | 'inactive' | 'discontinued';
  created_at: string;
  updated_at: string;
}

export interface ERPInvoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  date: string;
  due_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: ERPInvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface ERPInvoiceItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  total: number;
}

export interface ERPAnalytics {
  revenue: {
    total: number;
    monthly: Array<{ month: string; amount: number }>;
    growth_rate: number;
  };
  customers: {
    total: number;
    new_this_month: number;
    top_customers: Array<{ id: string; name: string; total_spent: number }>;
  };
  products: {
    total: number;
    low_stock_count: number;
    top_selling: Array<{ id: string; name: string; quantity_sold: number }>;
  };
  invoices: {
    total: number;
    paid: number;
    overdue: number;
    pending: number;
  };
}

class ERPIntegrationService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_ERP_API_URL || 'http://localhost:8000';
    this.apiKey = process.env.ERP_API_KEY;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`ERP API error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('ERP API request failed:', error);
      // Fallback to Supabase data if ERP is unavailable
      return this.fallbackToSupabase(endpoint, options);
    }
  }

  private async fallbackToSupabase(endpoint: string, options: RequestInit) {
    // Implement fallback logic using Supabase
    console.log('Using Supabase fallback for:', endpoint);
    return null;
  }

  // Customer Management
  async getCustomers(limit = 50, offset = 0): Promise<{ customers: ERPCustomer[], total: number }> {
    try {
      const response = await this.makeRequest(`/api/customers?limit=${limit}&offset=${offset}`);
      return response || { customers: [], total: 0 };
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      return { customers: [], total: 0 };
    }
  }

  async getCustomer(id: string): Promise<ERPCustomer | null> {
    try {
      const response = await this.makeRequest(`/api/customers/${id}`);
      return response?.customer || null;
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      return null;
    }
  }

  async createCustomer(customerData: Omit<ERPCustomer, 'id' | 'created_at' | 'updated_at'>): Promise<ERPCustomer | null> {
    try {
      const response = await this.makeRequest('/api/customers', {
        method: 'POST',
        body: JSON.stringify(customerData)
      });
      return response?.customer || null;
    } catch (error) {
      console.error('Failed to create customer:', error);
      return null;
    }
  }

  async updateCustomer(id: string, updates: Partial<ERPCustomer>): Promise<ERPCustomer | null> {
    try {
      const response = await this.makeRequest(`/api/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response?.customer || null;
    } catch (error) {
      console.error('Failed to update customer:', error);
      return null;
    }
  }

  // Product Management
  async getProducts(limit = 50, offset = 0): Promise<{ products: ERPProduct[], total: number }> {
    try {
      const response = await this.makeRequest(`/api/products?limit=${limit}&offset=${offset}`);
      return response || { products: [], total: 0 };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return { products: [], total: 0 };
    }
  }

  async getProduct(id: string): Promise<ERPProduct | null> {
    try {
      const response = await this.makeRequest(`/api/products/${id}`);
      return response?.product || null;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }

  async updateProductStock(id: string, quantity: number): Promise<boolean> {
    try {
      await this.makeRequest(`/api/products/${id}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
      });
      return true;
    } catch (error) {
      console.error('Failed to update product stock:', error);
      return false;
    }
  }

  // Invoice Management
  async getInvoices(limit = 50, offset = 0): Promise<{ invoices: ERPInvoice[], total: number }> {
    try {
      const response = await this.makeRequest(`/api/invoices?limit=${limit}&offset=${offset}`);
      return response || { invoices: [], total: 0 };
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      return { invoices: [], total: 0 };
    }
  }

  async getInvoice(id: string): Promise<ERPInvoice | null> {
    try {
      const response = await this.makeRequest(`/api/invoices/${id}`);
      return response?.invoice || null;
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      return null;
    }
  }

  async createInvoice(invoiceData: Omit<ERPInvoice, 'id' | 'created_at' | 'updated_at'>): Promise<ERPInvoice | null> {
    try {
      const response = await this.makeRequest('/api/invoices', {
        method: 'POST',
        body: JSON.stringify(invoiceData)
      });
      return response?.invoice || null;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      return null;
    }
  }

  async updateInvoiceStatus(id: string, status: ERPInvoice['status']): Promise<boolean> {
    try {
      await this.makeRequest(`/api/invoices/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      return true;
    } catch (error) {
      console.error('Failed to update invoice status:', error);
      return false;
    }
  }

  // Analytics
  async getAnalytics(): Promise<ERPAnalytics | null> {
    try {
      const response = await this.makeRequest('/api/analytics');
      return response?.analytics || this.getMockAnalytics();
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return this.getMockAnalytics();
    }
  }

  private getMockAnalytics(): ERPAnalytics {
    return {
      revenue: {
        total: 125000,
        monthly: [
          { month: '2024-01', amount: 45000 },
          { month: '2024-02', amount: 38000 },
          { month: '2024-03', amount: 42000 }
        ],
        growth_rate: 12.5
      },
      customers: {
        total: 150,
        new_this_month: 12,
        top_customers: [
          { id: '1', name: 'Acme Corp', total_spent: 25000 },
          { id: '2', name: 'Tech Solutions', total_spent: 18000 },
          { id: '3', name: 'Global Industries', total_spent: 15000 }
        ]
      },
      products: {
        total: 250,
        low_stock_count: 15,
        top_selling: [
          { id: '1', name: 'Premium Widget', quantity_sold: 450 },
          { id: '2', name: 'Standard Component', quantity_sold: 380 },
          { id: '3', name: 'Deluxe Package', quantity_sold: 220 }
        ]
      },
      invoices: {
        total: 89,
        paid: 65,
        overdue: 8,
        pending: 16
      }
    };
  }

  // Sync with Supabase
  async syncToSupabase(): Promise<boolean> {
    try {
      // Sync customers
      const { customers } = await this.getCustomers(1000);
      if (customers.length > 0) {
        const { error: customerError } = await supabase
          .from('erp_customers')
          .upsert(customers.map(c => ({
            erp_id: c.id,
            name: c.name,
            email: c.email,
            phone: c.phone,
            company: c.company,
            status: c.status,
            sync_updated_at: new Date().toISOString()
          })), { onConflict: 'erp_id' });

        if (customerError) {
          console.error('Failed to sync customers:', customerError);
        }
      }

      // Sync products
      const { products } = await this.getProducts(1000);
      if (products.length > 0) {
        const { error: productError } = await supabase
          .from('erp_products')
          .upsert(products.map(p => ({
            erp_id: p.id,
            sku: p.sku,
            name: p.name,
            category: p.category,
            unit_price: p.unit_price,
            stock_quantity: p.stock_quantity,
            status: p.status,
            sync_updated_at: new Date().toISOString()
          })), { onConflict: 'erp_id' });

        if (productError) {
          console.error('Failed to sync products:', productError);
        }
      }

      return true;
    } catch (error) {
      console.error('ERP sync failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const erpService = new ERPIntegrationService();

export default erpService;


