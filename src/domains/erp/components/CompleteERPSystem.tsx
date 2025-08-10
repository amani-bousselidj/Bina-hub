// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  Settings,
  Calendar,
  Clock,
  Star,
  Award,
  Target,
  Activity,
  Zap,
  Building2,
  Warehouse,
  Truck,
  CreditCard,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Globe,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Home,
  Menu,
  X
} from 'lucide-react';

// Types for our ERP system
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
  zatca_qr?: string;
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
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth: number;
  total_orders: number;
  pending_orders: number;
  total_customers: number;
  new_customers: number;
  low_stock_items: number;
  total_invoices: number;
  overdue_invoices: number;
}

// Main ERP Dashboard Component
export default function CompleteERPSystem() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // State for different modules
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_revenue: 0,
    monthly_revenue: 0,
    revenue_growth: 0,
    total_orders: 0,
    pending_orders: 0,
    total_customers: 0,
    new_customers: 0,
    low_stock_items: 0,
    total_invoices: 0,
    overdue_invoices: 0
  });

  // Initialize with mock data
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Mock customers
    const mockCustomers: Customer[] = [
      {
        id: '1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        company: 'شركة البناء الحديث',
        address: 'شارع الملك فهد',
        city: 'الرياض',
        country: 'السعودية',
        total_orders: 15,
        total_spent: 45000,
        created_at: '2024-01-15',
        status: 'active',
        vat_number: '300123456700003'
      },
      {
        id: '2',
        name: 'فاطمة العلي',
        email: 'fatima@example.com',
        phone: '+966507654321',
        company: 'مؤسسة التجارة المتقدمة',
        address: 'شارع العليا',
        city: 'جدة',
        country: 'السعودية',
        total_orders: 8,
        total_spent: 32000,
        created_at: '2024-02-01',
        status: 'active',
        vat_number: '300123456700004'
      }
    ];

    // Mock products
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'أسمنت بورتلاندي',
        sku: 'CEM-001',
        price: 25.00,
        cost: 18.00,
        category: 'مواد البناء',
        stock: 500,
        min_stock: 100,
        unit: 'كيس',
        description: 'أسمنت بورتلاندي عالي الجودة',
        supplier: 'مصنع الأسمنت السعودي',
        barcode: '1234567890123',
        status: 'active',
        created_at: '2024-01-01'
      },
      {
        id: '2',
        name: 'حديد تسليح 12 مم',
        sku: 'REB-012',
        price: 2800.00,
        cost: 2500.00,
        category: 'الحديد والمعادن',
        stock: 50,
        min_stock: 20,
        unit: 'طن',
        description: 'حديد تسليح عالي الكربون',
        supplier: 'مصنع الحديد والصلب',
        barcode: '1234567890124',
        status: 'active',
        created_at: '2024-01-01'
      }
    ];

    // Mock orders
    const mockOrders: Order[] = [
      {
        id: '1',
        order_number: 'ORD-2024-001',
        customer_id: '1',
        customer_name: 'أحمد محمد',
        total: 3750.00,
        status: 'confirmed',
        payment_status: 'paid',
        order_date: '2024-01-20',
        delivery_date: '2024-01-25',
        vat_amount: 562.50,
        discount: 0,
        items: [
          {
            product_id: '1',
            product_name: 'أسمنت بورتلاندي',
            quantity: 150,
            price: 25.00,
            total: 3750.00
          }
        ]
      }
    ];

    // Mock invoices
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoice_number: 'INV-2024-001',
        customer_id: '1',
        customer_name: 'أحمد محمد',
        total: 4312.50,
        vat_amount: 562.50,
        status: 'paid',
        issue_date: '2024-01-20',
        due_date: '2024-02-20',
        payment_date: '2024-01-22',
        zatca_qr: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
        items: [
          {
            description: 'أسمنت بورتلاندي',
            quantity: 150,
            price: 25.00,
            vat_rate: 15,
            total: 3750.00
          }
        ]
      }
    ];

    // Mock stats
    const mockStats: DashboardStats = {
      total_revenue: 125000,
      monthly_revenue: 45000,
      revenue_growth: 12.5,
      total_orders: 156,
      pending_orders: 23,
      total_customers: 89,
      new_customers: 12,
      low_stock_items: 5,
      total_invoices: 134,
      overdue_invoices: 8
    };

    setCustomers(mockCustomers);
    setProducts(mockProducts);
    setOrders(mockOrders);
    setInvoices(mockInvoices);
    setStats(mockStats);
  };

  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: Home },
    { id: 'customers', label: 'العملاء', icon: Users },
    { id: 'products', label: 'المنتجات', icon: Package },
    { id: 'orders', label: 'الطلبات', icon: ShoppingCart },
    { id: 'invoices', label: 'الفواتير', icon: FileText },
    { id: 'inventory', label: 'المخزون', icon: Warehouse },
    { id: 'pos', label: 'نقطة البيع', icon: CreditCard },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ];

  // Chart data
  const revenueData = [
    { month: 'يناير', revenue: 35000, orders: 45 },
    { month: 'فبراير', revenue: 42000, orders: 52 },
    { month: 'مارس', revenue: 45000, orders: 58 },
    { month: 'أبريل', revenue: 38000, orders: 48 },
    { month: 'مايو', revenue: 51000, orders: 62 },
    { month: 'يونيو', revenue: 47000, orders: 55 }
  ];

  const categoryData = [
    { name: 'مواد البناء', value: 35, color: '#3B82F6' },
    { name: 'الحديد والمعادن', value: 28, color: '#EF4444' },
    { name: 'الأدوات', value: 20, color: '#10B981' },
    { name: 'الكهرباء', value: 17, color: '#F59E0B' }
  ];

  // Render functions for different views
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.total_revenue.toLocaleString('en-US')} ر.س
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +{stats.revenue_growth}% من الشهر الماضي
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
              <p className="text-sm text-orange-600 flex items-center mt-1">
                <Clock className="w-4 h-4 mr-1" />
                {stats.pending_orders} طلب معلق
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <ShoppingCart className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">العملاء</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_customers}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <Users className="w-4 h-4 mr-1" />
                +{stats.new_customers} عميل جديد
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">المنتجات</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                {stats.low_stock_items} منتج مخزونه منخفض
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">الإيرادات الشهرية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} ر.س`, 'الإيرادات']} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">المبيعات حسب الفئة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">الإجراءات السريعة</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setCurrentView('customers')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium">إضافة عميل</p>
          </button>
          <button
            onClick={() => setCurrentView('products')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Package className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium">إضافة منتج</p>
          </button>
          <button
            onClick={() => setCurrentView('orders')}
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
          >
            <ShoppingCart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm font-medium">طلب جديد</p>
          </button>
          <button
            onClick={() => setCurrentView('invoices')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium">فاتورة جديدة</p>
          </button>
        </div>
      </Card>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة العملاء</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center" onClick={() => alert('Button clicked')}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة عميل جديد
        </button>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن العملاء..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center" onClick={() => alert('Button clicked')}>
              <Filter className="w-4 h-4 mr-2" />
              تصفية
            </button>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center" onClick={() => alert('Button clicked')}>
            <Download className="w-4 h-4 mr-2" />
            تصدير
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الشركة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الهاتف</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المدينة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي الطلبات</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجمالي المبلغ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.total_orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.total_spent.toLocaleString('en-US')} ر.س
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => alert('Button clicked')}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" onClick={() => alert('Button clicked')}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" onClick={() => alert('Button clicked')}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center" onClick={() => alert('Button clicked')}>
          <Plus className="w-4 h-4 mr-2" />
          إضافة منتج جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.sku}</p>
                <p className="text-sm text-gray-500">{product.description}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-900" onClick={() => alert('Button clicked')}>
                  <Edit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-900" onClick={() => alert('Button clicked')}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">السعر:</span>
                <span className="font-semibold">{product.price} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">المخزون:</span>
                <span className={`font-semibold ${
                  product.stock <= product.min_stock ? 'text-red-600' : 'text-green-600'
                }`}>
                  {product.stock} {product.unit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">الفئة:</span>
                <span className="text-sm">{product.category}</span>
              </div>
            </div>

            {product.stock <= product.min_stock && (
              <div className="mt-4 p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm text-red-700">مخزون منخفض</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الطلبات</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center" onClick={() => alert('Button clicked')}>
          <Plus className="w-4 h-4 mr-2" />
          طلب جديد
        </button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الطلب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التاريخ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">حالة الطلب</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">حالة الدفع</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.order_date).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.total.toLocaleString('en-US')} ر.س
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'confirmed' ? 'مؤكد' :
                       order.status === 'pending' ? 'معلق' :
                       order.status === 'shipped' ? 'مشحون' :
                       order.status === 'delivered' ? 'مُسلم' : 'ملغي'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.payment_status === 'paid' ? 'مدفوع' :
                       order.payment_status === 'pending' ? 'معلق' : 'فشل'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => alert('Button clicked')}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" onClick={() => alert('Button clicked')}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" onClick={() => alert('Button clicked')}>
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">إدارة الفواتير</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center" onClick={() => alert('Button clicked')}>
          <Plus className="w-4 h-4 mr-2" />
          فاتورة جديدة
        </button>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الفاتورة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العميل</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإصدار</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الاستحقاق</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المبلغ</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoice_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.issue_date).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.due_date).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.total.toLocaleString('en-US')} ر.س
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      invoice.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status === 'paid' ? 'مدفوعة' :
                       invoice.status === 'sent' ? 'مُرسلة' :
                       invoice.status === 'draft' ? 'مسودة' : 'متأخرة'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" onClick={() => alert('Button clicked')}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" onClick={() => alert('Button clicked')}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-purple-600 hover:text-purple-900" onClick={() => alert('Button clicked')}>
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderPOS = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">نقطة البيع</h2>
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" onClick={() => alert('Button clicked')}>
            إنهاء البيع
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700" onClick={() => alert('Button clicked')}>
            إلغاء
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="البحث عن المنتجات..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
                 onClick={() => alert('Button clicked')}>
                  <h4 className="font-medium text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.sku}</p>
                  <p className="font-bold text-lg mt-2">{product.price} ر.س</p>
                  <p className="text-xs text-gray-500">المخزون: {product.stock}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">سلة المشتريات</h3>
            <div className="space-y-4">
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                <p>السلة فارغة</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>المجموع الفرعي:</span>
                  <span>0.00 ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>الضريبة (15%):</span>
                  <span>0.00 ر.س</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>الإجمالي:</span>
                  <span>0.00 ر.س</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" onClick={() => alert('Button clicked')}>
                  الدفع نقداً
                </button>
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700" onClick={() => alert('Button clicked')}>
                  الدفع بالبطاقة
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'customers':
        return renderCustomers();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'invoices':
        return renderInvoices();
      case 'pos':
        return renderPOS();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl text-gray-800 ${!sidebarOpen && 'hidden'}`}>
              نظام إدارة المتجر
            </h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="mt-8">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center px-4 py-3 text-right hover:bg-gray-100 transition-colors ${
                  currentView === item.id ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 ml-3" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {navigationItems.find(item => item.id === currentView)?.label}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600" onClick={() => alert('Button clicked')}>
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600" onClick={() => alert('Button clicked')}>
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">م</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            renderCurrentView()
          )}
        </main>
      </div>
    </div>
  );
}





