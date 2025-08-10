// @ts-nocheck
// Enhanced Store Dashboard with ERPNext-inspired analytics
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/core/shared/utils';
import ERPIntegrationServiceCore from '@/core/shared/services/erp-integration/service';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  Settings,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Truck,
  CreditCard,
  Target,
  Activity,
  Zap,
  Award,
  Building2,
  Warehouse,
  Globe
} from 'lucide-react';

interface ERPStoreDashboardProps {
  storeId: string;
}

interface DashboardMetrics {
  // Financial Metrics
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  grossProfit: number;
  grossMargin: number;
  
  // Sales Metrics
  totalOrders: number;
  monthlyOrders: number;
  orderGrowth: number;
  averageOrderValue: number;
  orderFulfillmentRate: number;
  
  // Inventory Metrics
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  inventoryValue: number;
  stockTurnoverRatio: number;
  
  // Customer Metrics
  totalCustomers: number;
  newCustomers: number;
  customerRetentionRate: number;
  customerLifetimeValue: number;
  
  // Performance Metrics
  onTimeDeliveryRate: number;
  returnRate: number;
  customerSatisfactionScore: number;
  operatingMargin: number;
}

interface SalesAnalytics {
  dailySales: Array<{ date: string; revenue: number; orders: number; }>;
  monthlySales: Array<{ month: string; revenue: number; growth: number; }>;
  topProducts: Array<{ item_name: string; sales: number; profit: number; }>;
  salesByCategory: Array<{ category: string; sales: number; percentage: number; }>;
  salesByTerritory: Array<{ territory: string; sales: number; customers: number; }>;
}

interface InventoryAnalytics {
  stockLevels: Array<{ item_code: string; item_name: string; current_stock: number; reorder_level: number; }>;
  fastMovingItems: Array<{ item_name: string; turnover_ratio: number; sales_qty: number; }>;
  slowMovingItems: Array<{ item_name: string; days_in_stock: number; stock_value: number; }>;
  stockValuation: Array<{ category: string; value: number; percentage: number; }>;
  expiringItems: Array<{ item_name: string; expiry_date: string; stock_qty: number; }>;
}

interface CustomerAnalytics {
  topCustomers: Array<{ customer_name: string; total_orders: number; total_spent: number; }>;
  customerSegments: Array<{ segment: string; count: number; revenue: number; }>;
  newCustomerTrend: Array<{ month: string; new_customers: number; }>;
  customerRetention: Array<{ cohort: string; retention_rate: number; }>;
  geographicDistribution: Array<{ territory: string; customers: number; revenue: number; }>;
}

export default function ERPStoreDashboard({ storeId }: ERPStoreDashboardProps) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [salesAnalytics, setSalesAnalytics] = useState<SalesAnalytics | null>(null);
  const [inventoryAnalytics, setInventoryAnalytics] = useState<InventoryAnalytics | null>(null);
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalytics | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sales' | 'inventory' | 'customers' | 'reports'>('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const supabase = createClientComponentClient();

  useEffect(() => {
    loadDashboardData();
  }, [storeId, dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all dashboard data in parallel
      const [metricsData, salesData, inventoryData, customerData] = await Promise.all([
        loadMetrics(),
        loadSalesAnalytics(),
        loadInventoryAnalytics(),
        loadCustomerAnalytics()
      ]);

      setMetrics(metricsData);
      setSalesAnalytics(salesData);
      setInventoryAnalytics(inventoryData);
      setCustomerAnalytics(customerData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('خطأ في تحميل بيانات اللوحة');
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async (): Promise<DashboardMetrics> => {
    // This would integrate with your ERP system
    const { data: orders, error } = await supabase
      .from('erp_sales_orders')
      .select(`
        grand_total,
        transaction_date,
        status,
        customer,
        delivery_status,
        billing_status
      `)
      .gte('transaction_date', dateRange.from)
      .lte('transaction_date', dateRange.to);

    if (error) throw error;

    // Calculate metrics from orders data
    const totalRevenue = orders.reduce((sum, order) => sum + order.grand_total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get previous period for comparison
    const previousPeriodStart = new Date(new Date(dateRange.from).getTime() - 30 * 24 * 60 * 60 * 1000);
    const { data: previousOrders } = await supabase
      .from('erp_sales_orders')
      .select('grand_total')
      .gte('transaction_date', previousPeriodStart.toISOString().split('T')[0])
      .lt('transaction_date', dateRange.from);

    const previousRevenue = previousOrders?.reduce((sum, order) => sum + order.grand_total, 0) || 0;
    const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return {
      totalRevenue,
      monthlyRevenue: totalRevenue,
      revenueGrowth,
      grossProfit: totalRevenue * 0.25, // Estimated 25% margin
      grossMargin: 25,
      totalOrders,
      monthlyOrders: totalOrders,
      orderGrowth: 0, // Calculate based on previous period
      averageOrderValue,
      orderFulfillmentRate: 95,
      totalItems: 0, // Load from inventory
      lowStockItems: 0,
      outOfStockItems: 0,
      inventoryValue: 0,
      stockTurnoverRatio: 0,
      totalCustomers: 0,
      newCustomers: 0,
      customerRetentionRate: 85,
      customerLifetimeValue: 0,
      onTimeDeliveryRate: 92,
      returnRate: 3,
      customerSatisfactionScore: 4.2,
      operatingMargin: 15
    };
  };

  const loadSalesAnalytics = async (): Promise<SalesAnalytics> => {
    // Daily sales trend
    const { data: dailySalesData } = await supabase
      .from('erp_sales_orders')
      .select('transaction_date, grand_total')
      .gte('transaction_date', dateRange.from)
      .lte('transaction_date', dateRange.to)
      .order('transaction_date');

    const dailySales = dailySalesData?.reduce((acc, order) => {
      const date = order.transaction_date;
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.revenue += order.grand_total;
        existing.orders += 1;
      } else {
        acc.push({ date, revenue: order.grand_total, orders: 1 });
      }
      return acc;
    }, [] as Array<{ date: string; revenue: number; orders: number; }>) || [];

    // Top products
    const { data: topProductsData } = await supabase
      .from('erp_sales_order_items')
      .select(`
        item_name,
        amount,
        qty,
        erp_sales_orders!inner(transaction_date)
      `)
      .gte('erp_sales_orders.transaction_date', dateRange.from)
      .lte('erp_sales_orders.transaction_date', dateRange.to);

    const topProducts = topProductsData?.reduce((acc, item) => {
      const existing = acc.find(p => p.item_name === item.item_name);
      if (existing) {
        existing.sales += item.amount;
      } else {
        acc.push({
          item_name: item.item_name,
          sales: item.amount,
          profit: item.amount * 0.25 // Estimated profit margin
        });
      }
      return acc;
    }, [] as Array<{ item_name: string; sales: number; profit: number; }>)
      ?.sort((a, b) => b.sales - a.sales)
      ?.slice(0, 10) || [];

    return {
      dailySales,
      monthlySales: [],
      topProducts,
      salesByCategory: [],
      salesByTerritory: []
    };
  };

  const loadInventoryAnalytics = async (): Promise<InventoryAnalytics> => {
    // Stock levels
    const { data: stockData } = await supabase
      .from('stock_balance')
      .select(`
        item_code,
        qty_after_transaction,
        erp_items!inner(item_name, min_order_qty)
      `);

    const stockLevels = stockData?.map(item => ({
      item_code: item.item_code,
      item_name: (item.erp_items as any).item_name,
      current_stock: item.qty_after_transaction,
      reorder_level: (item.erp_items as any).min_order_qty
    })) || [];

    return {
      stockLevels,
      fastMovingItems: [],
      slowMovingItems: [],
      stockValuation: [],
      expiringItems: []
    };
  };

  const loadCustomerAnalytics = async (): Promise<CustomerAnalytics> => {
    // Top customers
    const { data: customerData } = await supabase
      .from('erp_sales_orders')
      .select(`
        customer_name,
        grand_total,
        customer
      `)
      .gte('transaction_date', dateRange.from)
      .lte('transaction_date', dateRange.to);

    const topCustomers = customerData?.reduce((acc, order) => {
      const existing = acc.find(c => c.customer_name === order.customer_name);
      if (existing) {
        existing.total_orders += 1;
        existing.total_spent += order.grand_total;
      } else {
        acc.push({
          customer_name: order.customer_name,
          total_orders: 1,
          total_spent: order.grand_total
        });
      }
      return acc;
    }, [] as Array<{ customer_name: string; total_orders: number; total_spent: number; }>)
      ?.sort((a, b) => b.total_spent - a.total_spent)
      ?.slice(0, 10) || [];

    return {
      topCustomers,
      customerSegments: [],
      newCustomerTrend: [],
      customerRetention: [],
      geographicDistribution: []
    };
  };
  const exportReport = async (type: string) => {
    try {
      const response = await fetch(`/api/erp/reports?type=${type}&storeId=default&format=csv&startDate=${dateRange.from}&endDate=${dateRange.to}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to export report');
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="p-6">
        <LoadingSpinner />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 ml-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم المتجر المتقدمة</h1>
          <p className="text-gray-600">تحليلات شاملة وإدارة متقدمة</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <span className="text-gray-400">إلى</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          
          <button
            onClick={loadDashboardData}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
            { id: 'sales', label: 'المبيعات', icon: TrendingUp },
            { id: 'inventory', label: 'المخزون', icon: Package },
            { id: 'customers', label: 'العملاء', icon: Users },
            { id: 'reports', label: 'التقارير', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 ml-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="إجمالي الإيرادات"
              value={formatCurrency(metrics.totalRevenue)}
              change={metrics.revenueGrowth}
              icon={DollarSign}
              color="green"
            />
            <MetricCard
              title="إجمالي الطلبات"
              value={metrics.totalOrders.toString()}
              change={metrics.orderGrowth}
              icon={ShoppingCart}
              color="blue"
            />
            <MetricCard
              title="متوسط قيمة الطلب"
              value={formatCurrency(metrics.averageOrderValue)}
              change={0}
              icon={Target}
              color="purple"
            />
            <MetricCard
              title="هامش الربح الإجمالي"
              value={`${metrics.grossMargin}%`}
              change={0}
              icon={TrendingUp}
              color="orange"
            />
          </div>

          {/* Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 ml-2" />
                مؤشرات الأداء
              </h3>
              <div className="space-y-4">
                <PerformanceIndicator
                  label="معدل تنفيذ الطلبات"
                  value={metrics.orderFulfillmentRate}
                  target={95}
                  color="green"
                />
                <PerformanceIndicator
                  label="معدل التسليم في الوقت المحدد"
                  value={metrics.onTimeDeliveryRate}
                  target={90}
                  color="blue"
                />
                <PerformanceIndicator
                  label="معدل الاحتفاظ بالعملاء"
                  value={metrics.customerRetentionRate}
                  target={80}
                  color="purple"
                />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Warehouse className="w-5 h-5 ml-2" />
                حالة المخزون
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">إجمالي الأصناف</span>
                  <span className="font-semibold">{metrics.totalItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">مخزون منخفض</span>
                  <span className="font-semibold text-orange-600">{metrics.lowStockItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">نفد المخزون</span>
                  <span className="font-semibold text-red-600">{metrics.outOfStockItems}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">قيمة المخزون</span>
                  <span className="font-semibold">{formatCurrency(metrics.inventoryValue)}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="w-5 h-5 ml-2" />
                رضا العملاء
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500">
                    {metrics.customerSatisfactionScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">من أصل 5</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">معدل الإرجاع</span>
                  <span className="font-semibold">{metrics.returnRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">عملاء جدد</span>
                  <span className="font-semibold text-green-600">{metrics.newCustomers}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Sales Tab */}
      {activeTab === 'sales' && salesAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">اتجاه المبيعات اليومية</h3>
              {/* Add chart component here */}
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">مخطط المبيعات اليومية</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">أفضل المنتجات</h3>
              <div className="space-y-3">
                {salesAnalytics.topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{product.item_name}</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{formatCurrency(product.sales)}</div>
                      <div className="text-sm text-gray-500">ربح: {formatCurrency(product.profit)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && inventoryAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">مستويات المخزون</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {inventoryAnalytics.stockLevels.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{item.item_name}</span>
                      <div className="text-sm text-gray-500">{item.item_code}</div>
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold ${
                        item.current_stock <= item.reorder_level ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {item.current_stock}
                      </div>
                      <div className="text-sm text-gray-500">حد الطلب: {item.reorder_level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">تقييم المخزون</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">مخطط تقييم المخزون</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && customerAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">أفضل العملاء</h3>
              <div className="space-y-3">
                {customerAnalytics.topCustomers.map((customer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{customer.customer_name}</span>
                      <div className="text-sm text-gray-500">{customer.total_orders} طلب</div>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{formatCurrency(customer.total_spent)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">تحليل العملاء</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">مخطط تحليل العملاء</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'تقرير المبيعات', description: 'تقرير شامل عن المبيعات والإيرادات', type: 'sales' },
              { title: 'تقرير المخزون', description: 'حالة المخزون والحركة', type: 'inventory' },
              { title: 'تقرير العملاء', description: 'تحليل سلوك العملاء', type: 'customers' },
              { title: 'تقرير الربحية', description: 'تحليل الهوامش والربحية', type: 'profitability' },
              { title: 'تقرير الأداء', description: 'مؤشرات الأداء الرئيسية', type: 'performance' },
              { title: 'تقرير الضرائب', description: 'ملخص الضرائب والرسوم', type: 'taxes' }
            ].map((report, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                  </div>
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <button
                  onClick={() => exportReport(report.type)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تحميل التقرير
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ComponentType<any>;
  color: 'green' | 'blue' | 'purple' | 'orange';
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {change !== 0 && (
            <div className={`flex items-center mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? <TrendingUp className="w-4 h-4 ml-1" /> : <TrendingDown className="w-4 h-4 ml-1" />}
              <span className="text-sm">{Math.abs(change).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}

interface PerformanceIndicatorProps {
  label: string;
  value: number;
  target: number;
  color: 'green' | 'blue' | 'purple';
}

function PerformanceIndicator({ label, value, target, color }: PerformanceIndicatorProps) {
  const percentage = (value / target) * 100;
  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500'
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}





