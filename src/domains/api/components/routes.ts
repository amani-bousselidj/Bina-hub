// Example API routes for the Binna platform
import { NextRequest } from 'next/server';
import { apiLayer, APIResponse, createHandler } from './core/unified-api';
import { commonSchemas } from './middleware/validation';
import { AuthenticatedRequest } from './middleware/auth';

// Products API Routes
apiLayer.registerRoute({
  method: 'GET',
  path: '/api/v1/products',
  handler: createHandler(async (request: AuthenticatedRequest) => {
    // Mock product data
    const products = [
      {
        id: '1',
        name: 'أسمنت بورتلاندي',
        price: 25.50,
        category: 'مواد البناء',
        store: 'متجر البناء السعودي',
      },
      {
        id: '2',
        name: 'حديد تسليح',
        price: 3200.00,
        category: 'مواد البناء',
        store: 'شركة الحديد المتطور',
      },
    ];
    
    return APIResponse.success(products, 'Products retrieved successfully');
  }),
  rateLimit: 'api',
  validation: {
    query: commonSchemas.search.merge(commonSchemas.pagination),
  },
});

apiLayer.registerRoute({
  method: 'POST',
  path: '/api/v1/products',
  handler: createHandler(async (request: AuthenticatedRequest) => {
    const body = await request.json();
    
    // Mock product creation
    const product = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    return APIResponse.success(product, 'Product created successfully');
  }),
  auth: true,
  role: 'store_owner',
  rateLimit: 'api',
  validation: {
    body: commonSchemas.createProduct,
  },
});

// Orders API Routes
apiLayer.registerRoute({
  method: 'GET',
  path: '/api/v1/orders',
  handler: createHandler(async (request: AuthenticatedRequest) => {
    // Mock order data
    const orders = [
      {
        id: '1',
        orderNumber: 'ORD-2025-001',
        status: 'pending',
        total: 1250.00,
        items: [
          { productId: '1', quantity: 2, price: 25.50 },
          { productId: '2', quantity: 1, price: 3200.00 },
        ],
        customer: {
          name: 'محمد أحمد',
          email: 'mohamed@example.com',
        },
        createdAt: new Date().toISOString(),
      },
    ];
    
    return APIResponse.success(orders, 'Orders retrieved successfully');
  }),
  auth: true,
  rateLimit: 'api',
  validation: {
    query: commonSchemas.pagination,
  },
});

apiLayer.registerRoute({
  method: 'POST',
  path: '/api/v1/orders',
  handler: createHandler(async (request: AuthenticatedRequest) => {
    const body = await request.json();
    
    // Mock order creation
    const order = {
      id: Date.now().toString(),
      orderNumber: `ORD-${Date.now()}`,
      status: 'pending',
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    return APIResponse.success(order, 'Order created successfully');
  }),
  auth: true,
  rateLimit: 'api',
  validation: {
    body: commonSchemas.createOrder,
  },
});

// Stores API Routes
apiLayer.registerRoute({
  method: 'GET',
  path: '/api/v1/stores',
  handler: createHandler(async (request: AuthenticatedRequest) => {
    // Fetch real store data from Supabase
    const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs');
    const supabase = createClientComponentClient();
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      return APIResponse.error('Failed to fetch stores', '500');
    }
    return APIResponse.success(data || [], 'Stores retrieved successfully');
  }),
  rateLimit: 'public',
  validation: {
    query: commonSchemas.search.merge(commonSchemas.pagination),
  },
});

// Analytics API Routes
apiLayer.registerRoute({
  method: 'GET',
  path: '/api/v1/analytics/sales',
  handler: createHandler(async (request: AuthenticatedRequest) => {
    // Mock analytics data
    const analytics = {
      totalSales: 125000.00,
      totalOrders: 450,
      averageOrderValue: 277.78,
      growthRate: 15.5,
      topProducts: [
        { name: 'أسمنت بورتلاندي', sales: 15000.00 },
        { name: 'حديد تسليح', sales: 12000.00 },
      ],
      monthlySales: [
        { month: 'يناير', sales: 45000.00 },
        { month: 'فبراير', sales: 50000.00 },
        { month: 'مارس', sales: 30000.00 },
      ],
    };
    
    return APIResponse.success(analytics, 'Analytics retrieved successfully');
  }),
  auth: true,
  role: 'store_owner',
  rateLimit: 'api',
});

// Authentication API Routes
apiLayer.registerRoute({
  method: 'POST',
  path: '/api/v1/auth/login',
  handler: createHandler(async (request: AuthenticatedRequest) => {
    const body = await request.json();
    
    // Mock authentication
    const user = {
      id: '1',
      email: body.email,
      role: 'store_owner',
      firstName: 'محمد',
      lastName: 'أحمد',
    };
    
    // Mock JWT token
    const token = 'mock-jwt-token';
    
    return APIResponse.success({ user, token }, 'Login successful');
  }),
  rateLimit: 'auth',
  validation: {
    body: commonSchemas.createUser.pick({ email: true, password: true }),
  },
});

export { apiLayer };



