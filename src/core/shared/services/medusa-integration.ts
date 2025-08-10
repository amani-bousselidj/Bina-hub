// Medusa Integration Service
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export interface MedusaProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  images: string[];
  variants: MedusaVariant[];
  categories: string[];
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface MedusaVariant {
  id: string;
  title: string;
  sku?: string;
  price: number;
  inventory_quantity: number;
  options: Record<string, string>;
  product_id: string;
}

export interface MedusaCustomer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  billing_address?: any;
  shipping_addresses?: any[];
  created_at: string;
}

export interface MedusaOrder {
  id: string;
  email: string;
  status: 'pending' | 'completed' | 'cancelled' | 'requires_action';
  total: number;
  items: MedusaOrderItem[];
  customer_id?: string;
  shipping_address?: any;
  billing_address?: any;
  created_at: string;
}

export interface MedusaOrderItem {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  total: number;
  variant_id?: string;
  product_id: string;
}

class MedusaIntegrationService {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000';
    this.apiKey = process.env.MEDUSA_API_KEY;
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Medusa API request failed:', error);
      throw error;
    }
  }

  // Products
  async getProducts(limit = 50, offset = 0): Promise<{ products: MedusaProduct[], count: number }> {
    try {
      const response = await this.makeRequest(`/store/products?limit=${limit}&offset=${offset}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return { products: [], count: 0 };
    }
  }

  async getProduct(id: string): Promise<MedusaProduct | null> {
    try {
      const response = await this.makeRequest(`/store/products/${id}`);
      return response.product;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }

  async searchProducts(query: string): Promise<MedusaProduct[]> {
    try {
      const response = await this.makeRequest(`/store/products?q=${encodeURIComponent(query)}`);
      return response.products || [];
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
  }

  // Cart Management
  async createCart(): Promise<{ cart: any } | null> {
    try {
      const response = await this.makeRequest('/store/carts', {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Failed to create cart:', error);
      return null;
    }
  }

  async addToCart(cartId: string, variantId: string, quantity: number): Promise<any> {
    try {
      const response = await this.makeRequest(`/store/carts/${cartId}/line-items`, {
        method: 'POST',
        body: JSON.stringify({
          variant_id: variantId,
          quantity
        })
      });
      return response;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  }

  async updateCartItem(cartId: string, lineItemId: string, quantity: number): Promise<any> {
    try {
      const response = await this.makeRequest(`/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: 'POST',
        body: JSON.stringify({ quantity })
      });
      return response;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  }

  async removeFromCart(cartId: string, lineItemId: string): Promise<any> {
    try {
      const response = await this.makeRequest(`/store/carts/${cartId}/line-items/${lineItemId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  }

  // Customer Management
  async createCustomer(customerData: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  }): Promise<MedusaCustomer | null> {
    try {
      const response = await this.makeRequest('/store/customers', {
        method: 'POST',
        body: JSON.stringify(customerData)
      });
      return response.customer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      return null;
    }
  }

  async authenticateCustomer(email: string, password: string): Promise<{ customer: MedusaCustomer, token: string } | null> {
    try {
      const response = await this.makeRequest('/store/auth', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      return response;
    } catch (error) {
      console.error('Failed to authenticate customer:', error);
      return null;
    }
  }

  // Orders
  async getOrders(customerId?: string): Promise<MedusaOrder[]> {
    try {
      const endpoint = customerId ? `/store/customers/me/orders` : '/admin/orders';
      const response = await this.makeRequest(endpoint);
      return response.orders || [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      return [];
    }
  }

  async getOrder(id: string): Promise<MedusaOrder | null> {
    try {
      const response = await this.makeRequest(`/store/orders/${id}`);
      return response.order;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      return null;
    }
  }

  // Sync with Supabase
  async syncProductsToSupabase(): Promise<boolean> {
    try {
      const { products } = await this.getProducts(100);
      
      const supabaseProducts = products.map(product => ({
        medusa_id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        status: product.status,
        created_at: product.created_at,
        updated_at: product.updated_at
      }));

      const { error } = await supabase
        .from('products')
        .upsert(supabaseProducts, { onConflict: 'medusa_id' });

      if (error) {
        console.error('Failed to sync products to Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to sync products:', error);
      return false;
    }
  }

  async syncOrdersToSupabase(customerId?: string): Promise<boolean> {
    try {
      const orders = await this.getOrders(customerId);
      
      const supabaseOrders = orders.map(order => ({
        medusa_id: order.id,
        email: order.email,
        status: order.status,
        total: order.total,
        customer_id: order.customer_id,
        created_at: order.created_at
      }));

      const { error } = await supabase
        .from('orders')
        .upsert(supabaseOrders, { onConflict: 'medusa_id' });

      if (error) {
        console.error('Failed to sync orders to Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Failed to sync orders:', error);
      return false;
    }
  }
}

// Export singleton instance
export const medusaService = new MedusaIntegrationService();

export default medusaService;

// Utility function for user sync
export const syncUserWithMedusa = async (userData: { email: string; name: string; password?: string }) => {
  try {
    return await medusaService.createCustomer({
      email: userData.email,
      password: userData.password || 'temp_password_' + Math.random().toString(36).slice(-8),
      first_name: userData.name.split(' ')[0] || userData.name,
      last_name: userData.name.split(' ').slice(1).join(' ') || '',
      phone: ''
    });
  } catch (error) {
    console.error('Failed to sync user with Medusa:', error);
    return null;
  }
};


