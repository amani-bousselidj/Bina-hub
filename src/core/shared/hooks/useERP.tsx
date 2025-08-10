// @ts-nocheck
import { useState, useEffect } from 'react';

// Types
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  country: string;
  total_orders: number;
  total_spent: number;
  created_at: string;
  status: 'active' | 'inactive';
  vat_number?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  category: string;
  stock: number;
  min_stock: number;
  unit: string;
  description: string;
  supplier?: string;
  barcode?: string;
  status: 'active' | 'inactive';
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  order_date: string;
  delivery_date?: string;
  items: OrderItem[];
  vat_amount: number;
  discount: number;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  total: number;
  vat_amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issue_date: string;
  due_date: string;
  payment_date?: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  vat_rate: number;
  total: number;
}

interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  newCustomers: number;
  lowStockItems: number;
  totalInvoices: number;
  overdueInvoices: number;
}

// API functions
const api = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await fetch('/api/erp/dashboard');
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  // Customers
  getCustomers: async (params: { limit?: number; skip?: number; search?: string; status?: string } = {}): Promise<Customer[]> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, value.toString());
    });
    
    const response = await fetch(`/api/erp/customers?${searchParams}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  createCustomer: async (customer: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'created_at' | 'status'>): Promise<Customer> => {
    const response = await fetch('/api/erp/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  // Products
  getProducts: async (params: { limit?: number; skip?: number; search?: string; category?: string } = {}): Promise<Product[]> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, value.toString());
    });
    
    const response = await fetch(`/api/erp/products?${searchParams}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  createProduct: async (product: Omit<Product, 'id' | 'created_at' | 'status'>): Promise<Product> => {
    const response = await fetch('/api/erp/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  // Orders
  getOrders: async (params: { limit?: number; skip?: number; status?: string; customer_id?: string } = {}): Promise<Order[]> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, value.toString());
    });
    
    const response = await fetch(`/api/erp/orders?${searchParams}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  createOrder: async (order: { customer_id: string; customer_name: string; items: OrderItem[]; discount?: number }): Promise<Order> => {
    const response = await fetch('/api/erp/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  // Invoices
  getInvoices: async (params: { limit?: number; skip?: number; status?: string; customer_id?: string } = {}): Promise<Invoice[]> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) searchParams.set(key, value.toString());
    });
    
    const response = await fetch(`/api/erp/invoices?${searchParams}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  },

  createInvoice: async (invoice: { customer_id: string; customer_name: string; items: InvoiceItem[]; discount?: number }): Promise<Invoice> => {
    const response = await fetch('/api/erp/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result.data;
  }
};

// Custom hooks
export function useERPDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStats();
  }, []);

  return { stats, loading, error, refreshStats };
}

export function useERPCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCustomers = async (params: { search?: string; status?: string } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCustomers(params);
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customer: Omit<Customer, 'id' | 'total_orders' | 'total_spent' | 'created_at' | 'status'>) => {
    try {
      const newCustomer = await api.createCustomer(customer);
      setCustomers(prev => [newCustomer, ...prev]);
      return newCustomer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return { customers, loading, error, loadCustomers, addCustomer };
}

export function useERPProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async (params: { search?: string; category?: string } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProducts(params);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'status'>) => {
    try {
      const newProduct = await api.createProduct(product);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return { products, loading, error, loadProducts, addProduct };
}

export function useERPOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async (params: { status?: string; customer_id?: string } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getOrders(params);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async (order: { customer_id: string; customer_name: string; items: OrderItem[]; discount?: number }) => {
    try {
      const newOrder = await api.createOrder(order);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return { orders, loading, error, loadOrders, addOrder };
}

export function useERPInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = async (params: { status?: string; customer_id?: string } = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getInvoices(params);
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addInvoice = async (invoice: { customer_id: string; customer_name: string; items: InvoiceItem[]; discount?: number }) => {
    try {
      const newInvoice = await api.createInvoice(invoice);
      setInvoices(prev => [newInvoice, ...prev]);
      return newInvoice;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  return { invoices, loading, error, loadInvoices, addInvoice };
}

// Export the API functions as well
export { api as erpApi };




