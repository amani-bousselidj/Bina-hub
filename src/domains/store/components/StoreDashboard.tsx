// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

interface MedusaOrder {
  id: string;
  display_id: number;
  email: string;
  customer_id?: string;
  status: 'pending' | 'completed' | 'archived' | 'canceled' | 'requires_action';
  fulfillment_status: 'not_fulfilled' | 'partially_fulfilled' | 'fulfilled' | 'partially_shipped' | 'shipped' | 'partially_returned' | 'returned' | 'canceled' | 'requires_action';
  payment_status: 'not_paid' | 'awaiting' | 'captured' | 'partially_refunded' | 'refunded' | 'canceled' | 'requires_action';
  total: number;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  currency_code: string;
  created_at: string;
  updated_at: string;
  items: MedusaLineItem[];
}

interface MedusaLineItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  variant_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface MedusaCustomer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  has_account: boolean;
  created_at: string;
  updated_at: string;
}

interface MedusaProduct {
  id: string;
  title: string;
  handle: string;
  status: 'draft' | 'published' | 'proposed' | 'rejected';
  thumbnail?: string;
  variants: Array<{
    id: string;
    title: string;
    inventory_quantity: number;
  }>;
}

interface MedusaAnalytics {
  revenue: {
    total: number;
    today: number;
    growth_rate: number;
    currency: string;
  };
  orders: {
    total: number;
    today: number;
    pending: number;
    completed: number;
    growth_rate: number;
  };
  customers: {
    total: number;
    new_today: number;
    returning_customers: number;
    growth_rate: number;
  };
  products: {
    total: number;
    published: number;
    low_stock: number;
    out_of_stock: number;
  };
  top_products: Array<{
    id: string;
    title: string;
    sales_count: number;
    revenue: number;
  }>;
  recent_orders: MedusaOrder[];
}

const MedusaDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<MedusaAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadMedusaAnalytics();
  }, [timeframe]);

  const loadMedusaAnalytics = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual Medusa API calls
      // const response = await fetch(`/api/medusa/analytics?timeframe=${timeframe}`);
      // const data = await response.json();
      
      // Mock data for now - replace with actual Medusa integration
      const mockAnalytics: MedusaAnalytics = {
        revenue: {
          total: 285600,
          today: 12400,
          growth_rate: 12.5,
          currency: 'SAR'
        },
        orders: {
          total: 1247,
          today: 23,
          pending: 45,
          completed: 1180,
          growth_rate: 8.3
        },
        customers: {
          total: 892,
          new_today: 7,
          returning_customers: 456,
          growth_rate: 15.2
        },
        products: {
          total: 156,
          published: 134,
          low_stock: 12,
          out_of_stock: 3
        },
        top_products: [
          {
            id: 'prod_01',
            title: 'خرسانة جاهزة - درجة 350',
            sales_count: 45,
            revenue: 67500
          },
          {
            id: 'prod_02',
            title: 'حديد تسليح 16مم',
            sales_count: 38,
            revenue: 45600
          },
          {
            id: 'prod_03',
            title: 'أنابيب PVC قطر 110مم',
            sales_count: 29,
            revenue: 23400
          }
        ],
        recent_orders: [
          {
            id: 'order_01HWXYZ123',
            display_id: 1001,
            email: 'customer@example.com',
            status: 'completed',
            fulfillment_status: 'fulfilled',
            payment_status: 'captured',
            total: 25000,
            subtotal: 22000,
            tax_total: 3000,
            shipping_total: 0,
            discount_total: 0,
            currency_code: 'SAR',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            items: [
              {
                id: 'item_01',
                title: 'خرسانة جاهزة - درجة 350',
                variant_id: 'variant_01',
                product_id: 'prod_01',
                quantity: 10,
                unit_price: 2200,
                total: 22000
              }
            ]
          }
        ]
      };
      
      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Error loading Medusa analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const getGrowthIcon = (rate: number) => {
    return rate > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getGrowthColor = (rate: number) => {
    return rate > 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading Medusa dashboard...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <Activity className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Unable to load analytics</h3>
        <p className="mt-1 text-sm text-gray-500">Please check your Medusa connection</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Dashboard</h1>
          <p className="text-gray-600">Powered by Medusa Commerce</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={loadMedusaAnalytics}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={() => alert('Button clicked')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.revenue.total, analytics.revenue.currency)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(analytics.revenue.growth_rate)}
            <span className={`ml-1 text-sm font-medium ${getGrowthColor(analytics.revenue.growth_rate)}`}>
              {Math.abs(analytics.revenue.growth_rate)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last {timeframe}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.orders.total.toLocaleString('en-US')}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(analytics.orders.growth_rate)}
            <span className={`ml-1 text-sm font-medium ${getGrowthColor(analytics.orders.growth_rate)}`}>
              {Math.abs(analytics.orders.growth_rate)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last {timeframe}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.customers.total.toLocaleString('en-US')}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {getGrowthIcon(analytics.customers.growth_rate)}
            <span className={`ml-1 text-sm font-medium ${getGrowthColor(analytics.customers.growth_rate)}`}>
              {Math.abs(analytics.customers.growth_rate)}%
            </span>
            <span className="ml-2 text-sm text-gray-500">vs last {timeframe}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.products.total}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500">
              {analytics.products.published} published, {analytics.products.low_stock} low stock
            </span>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.top_products.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{product.title}</div>
                    <div className="text-sm text-gray-500">{product.sales_count} sales</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(product.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.recent_orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    Order #{order.display_id}
                  </div>
                  <div className="text-sm text-gray-500">{order.email}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('en-US')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(order.total, order.currency_code)}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'canceled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{analytics.orders.total}</div>
            <div className="text-sm text-gray-500">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{analytics.orders.completed}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{analytics.orders.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{analytics.orders.today}</div>
            <div className="text-sm text-gray-500">Today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedusaDashboard;





