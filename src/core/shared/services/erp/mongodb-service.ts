// MongoDB ERP Service
export interface MongoDBConfig {
  connectionString: string;
  database: string;
  collections: {
    customers: string;
    products: string;
    orders: string;
    invoices: string;
    analytics: string;
  };
}

export interface MongoCustomer {
  _id?: string;
  customerId: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: any;
  creditLimit?: number;
  paymentTerms?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoProduct {
  _id?: string;
  productId: string;
  sku: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  minimumStock: number;
  unitOfMeasure: string;
  supplierId?: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoOrder {
  _id?: string;
  orderId: string;
  customerId: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoInvoice {
  _id?: string;
  invoiceId: string;
  customerId: string;
  orderId?: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    total: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

class MongoDBERPService {
  private config: MongoDBConfig;
  private isConnected: boolean = false;

  constructor() {
    this.config = {
      connectionString: process.env.MONGODB_URI || 'mongodb://localhost:27017',
      database: process.env.MONGODB_DATABASE || 'erp_system',
      collections: {
        customers: 'customers',
        products: 'products',
        orders: 'orders',
        invoices: 'invoices',
        analytics: 'analytics'
      }
    };
  }

  // Mock connection methods since we're in a browser environment
  private async connect(): Promise<boolean> {
    try {
      // In a real implementation, this would establish MongoDB connection
      console.log('Connecting to MongoDB:', this.config.database);
      this.isConnected = true;
      return true;
    } catch (error) {
      console.error('MongoDB connection failed:', error);
      return false;
    }
  }

  private async ensureConnection(): Promise<boolean> {
    if (!this.isConnected) {
      return await this.connect();
    }
    return true;
  }

  // Customer operations
  async getCustomers(limit = 50, skip = 0): Promise<MongoCustomer[]> {
    try {
      await this.ensureConnection();
      
      // Mock implementation - in real app would query MongoDB
      const mockCustomers: MongoCustomer[] = [
        {
          customerId: 'CUST001',
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1-555-0123',
          company: 'Acme Corp',
          status: 'active',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-02-10')
        },
        {
          customerId: 'CUST002',
          name: 'Tech Solutions Ltd',
          email: 'info@techsolutions.com',
          phone: '+1-555-0456',
          company: 'Tech Solutions',
          status: 'active',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-02-08')
        }
      ];

      return mockCustomers.slice(skip, skip + limit);
    } catch (error) {
      console.error('Failed to fetch customers from MongoDB:', error);
      return [];
    }
  }

  async getCustomerById(customerId: string): Promise<MongoCustomer | null> {
    try {
      await this.ensureConnection();
      
      // Mock implementation
      const customers = await this.getCustomers();
      return customers.find(c => c.customerId === customerId) || null;
    } catch (error) {
      console.error('Failed to fetch customer by ID:', error);
      return null;
    }
  }

  async createCustomer(customerData: Omit<MongoCustomer, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoCustomer | null> {
    try {
      await this.ensureConnection();
      
      const customer: MongoCustomer = {
        ...customerData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Creating customer in MongoDB:', customer);
      return customer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      return null;
    }
  }

  async updateCustomer(customerId: string, updates: Partial<MongoCustomer>): Promise<MongoCustomer | null> {
    try {
      await this.ensureConnection();
      
      const customer = await this.getCustomerById(customerId);
      if (!customer) return null;

      const updatedCustomer = {
        ...customer,
        ...updates,
        updatedAt: new Date()
      };

      console.log('Updating customer in MongoDB:', updatedCustomer);
      return updatedCustomer;
    } catch (error) {
      console.error('Failed to update customer:', error);
      return null;
    }
  }

  // Product operations
  async getProducts(limit = 50, skip = 0): Promise<MongoProduct[]> {
    try {
      await this.ensureConnection();
      
      const mockProducts: MongoProduct[] = [
        {
          productId: 'PROD001',
          sku: 'WDG-001',
          name: 'Premium Widget',
          description: 'High-quality widget for professional use',
          category: 'Widgets',
          unitPrice: 29.99,
          costPrice: 15.00,
          stockQuantity: 150,
          minimumStock: 25,
          unitOfMeasure: 'piece',
          status: 'active',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-02-05')
        },
        {
          productId: 'PROD002',
          sku: 'CMP-002',
          name: 'Standard Component',
          description: 'Reliable component for various applications',
          category: 'Components',
          unitPrice: 19.99,
          costPrice: 8.50,
          stockQuantity: 75,
          minimumStock: 15,
          unitOfMeasure: 'piece',
          status: 'active',
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-02-03')
        }
      ];

      return mockProducts.slice(skip, skip + limit);
    } catch (error) {
      console.error('Failed to fetch products from MongoDB:', error);
      return [];
    }
  }

  async getProductById(productId: string): Promise<MongoProduct | null> {
    try {
      await this.ensureConnection();
      
      const products = await this.getProducts();
      return products.find(p => p.productId === productId) || null;
    } catch (error) {
      console.error('Failed to fetch product by ID:', error);
      return null;
    }
  }

  async updateProductStock(productId: string, newQuantity: number): Promise<boolean> {
    try {
      await this.ensureConnection();
      
      console.log(`Updating stock for product ${productId} to ${newQuantity}`);
      return true;
    } catch (error) {
      console.error('Failed to update product stock:', error);
      return false;
    }
  }

  // Order operations
  async getOrders(limit = 50, skip = 0): Promise<MongoOrder[]> {
    try {
      await this.ensureConnection();
      
      const mockOrders: MongoOrder[] = [
        {
          orderId: 'ORD001',
          customerId: 'CUST001',
          orderDate: new Date('2024-02-15'),
          status: 'delivered',
          items: [
            { productId: 'PROD001', quantity: 2, unitPrice: 29.99, total: 59.98 },
            { productId: 'PROD002', quantity: 1, unitPrice: 19.99, total: 19.99 }
          ],
          subtotal: 79.97,
          taxAmount: 6.40,
          totalAmount: 86.37,
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-02-20')
        }
      ];

      return mockOrders.slice(skip, skip + limit);
    } catch (error) {
      console.error('Failed to fetch orders from MongoDB:', error);
      return [];
    }
  }

  async createOrder(orderData: Omit<MongoOrder, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoOrder | null> {
    try {
      await this.ensureConnection();
      
      const order: MongoOrder = {
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Creating order in MongoDB:', order);
      return order;
    } catch (error) {
      console.error('Failed to create order:', error);
      return null;
    }
  }

  // Invoice operations
  async getInvoices(limit = 50, skip = 0): Promise<MongoInvoice[]> {
    try {
      await this.ensureConnection();
      
      const mockInvoices: MongoInvoice[] = [
        {
          invoiceId: 'INV001',
          customerId: 'CUST001',
          orderId: 'ORD001',
          invoiceNumber: 'INV-2024-001',
          date: new Date('2024-02-16'),
          dueDate: new Date('2024-03-16'),
          subtotal: 79.97,
          taxAmount: 6.40,
          totalAmount: 86.37,
          status: 'paid',
          items: [
            { productId: 'PROD001', quantity: 2, unitPrice: 29.99, total: 59.98 },
            { productId: 'PROD002', quantity: 1, unitPrice: 19.99, total: 19.99 }
          ],
          createdAt: new Date('2024-02-16'),
          updatedAt: new Date('2024-02-18')
        }
      ];

      return mockInvoices.slice(skip, skip + limit);
    } catch (error) {
      console.error('Failed to fetch invoices from MongoDB:', error);
      return [];
    }
  }

  async createInvoice(invoiceData: Omit<MongoInvoice, '_id' | 'createdAt' | 'updatedAt'>): Promise<MongoInvoice | null> {
    try {
      await this.ensureConnection();
      
      const invoice: MongoInvoice = {
        ...invoiceData,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Creating invoice in MongoDB:', invoice);
      return invoice;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      return null;
    }
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    try {
      await this.ensureConnection();
      
      return {
        totalCustomers: 150,
        totalProducts: 250,
        totalOrders: 89,
        totalRevenue: 125000,
        averageOrderValue: 1404.49,
        topProducts: await this.getTopSellingProducts(),
        recentOrders: await this.getRecentOrders()
      };
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      return null;
    }
  }

  private async getTopSellingProducts(): Promise<any[]> {
    return [
      { productId: 'PROD001', name: 'Premium Widget', totalSold: 450 },
      { productId: 'PROD002', name: 'Standard Component', totalSold: 380 }
    ];
  }

  private async getRecentOrders(): Promise<MongoOrder[]> {
    const orders = await this.getOrders(10);
    return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // Utility methods
  async disconnect(): Promise<void> {
    try {
      console.log('Disconnecting from MongoDB');
      this.isConnected = false;
    } catch (error) {
      console.error('Failed to disconnect from MongoDB:', error);
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.ensureConnection();
      return true;
    } catch (error) {
      console.error('MongoDB ping failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const mongoDBService = new MongoDBERPService();

export default mongoDBService;

// Utility functions
export const initERPService = () => {
  return mongoDBService;
};

export const generateId = () => {
  return 'id_' + Math.random().toString(36).substr(2, 9);
};

export const generateOrderNumber = () => {
  return 'ORD' + Date.now().toString().slice(-6);
};

export const generateInvoiceNumber = () => {
  return 'INV' + Date.now().toString().slice(-6);
};

export const calculateTotal = (subtotal: number, taxRate: number = 0.08) => {
  const taxAmount = subtotal * taxRate;
  return {
    subtotal,
    taxAmount,
    total: subtotal + taxAmount
  };
};


