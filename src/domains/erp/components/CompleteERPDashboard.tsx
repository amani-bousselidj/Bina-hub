// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  FileText,
  Building,
  User,
  Mail,
  Printer,
  BarChart3
} from 'lucide-react';

// Custom UI Components
const Card = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`bg-white rounded-lg border shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: 'default' | 'ghost'; 
  size?: 'default' | 'sm';
  [key: string]: any;
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'hover:bg-gray-100 hover:text-gray-900'
  };
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm'
  };
  
  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props} onClick={() => alert('Button clicked')}>
      {children}
    </button>
  );
};

const Badge = ({ children, className = '', ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`} {...props}>
    {children}
  </span>
);

// Types
interface DashboardStats {
  total_revenue: number;
  monthly_revenue: number;
  revenue_growth: number;
  total_orders: number;
  pending_orders: number;
  total_customers: number;
  active_customers: number;
  total_products: number;
  low_stock_products: number;
  total_invoices: number;
  pending_invoices: number;
  overdue_invoices: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  status: 'active' | 'inactive';
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive';
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_date: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issue_date: string;
  due_date: string;
}

const CompleteERPDashboard = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isRTL] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    total_revenue: 0,
    monthly_revenue: 0,
    revenue_growth: 0,
    total_orders: 0,
    pending_orders: 0,
    total_customers: 0,
    active_customers: 0,
    total_products: 0,
    low_stock_products: 0,
    total_invoices: 0,
    pending_invoices: 0,
    overdue_invoices: 0
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Mock data
  useEffect(() => {
    // Simulate loading data
    setStats({
      total_revenue: 125000,
      monthly_revenue: 45000,
      revenue_growth: 12.5,
      total_orders: 245,
      pending_orders: 23,
      total_customers: 156,
      active_customers: 134,
      total_products: 89,
      low_stock_products: 12,
      total_invoices: 67,
      pending_invoices: 15,
      overdue_invoices: 8
    });

    setCustomers([
      { id: '1', name: 'أحمد محمد', email: 'ahmed@example.com', phone: '+966501234567', total_orders: 12, total_spent: 25000, status: 'active' },
      { id: '2', name: 'فاطمة علي', email: 'fatima@example.com', phone: '+966507654321', total_orders: 8, total_spent: 18000, status: 'active' }
    ]);

    setProducts([
      { id: '1', name: 'منتج A', sku: 'SKU001', price: 150, stock: 45, category: 'الفئة الأولى', status: 'active' },
      { id: '2', name: 'منتج B', sku: 'SKU002', price: 250, stock: 12, category: 'الفئة الثانية', status: 'active' }
    ]);

    setOrders([
      { id: '1', order_number: 'ORD-001', customer_name: 'أحمد محمد', total: 1500, status: 'pending', payment_status: 'pending', order_date: '2024-01-15' },
      { id: '2', order_number: 'ORD-002', customer_name: 'فاطمة علي', total: 2500, status: 'confirmed', payment_status: 'paid', order_date: '2024-01-14' }
    ]);

    setInvoices([
      { id: '1', invoice_number: 'INV-001', customer_name: 'أحمد محمد', total: 1500, status: 'sent', issue_date: '2024-01-15', due_date: '2024-02-15' },
      { id: '2', invoice_number: 'INV-002', customer_name: 'فاطمة علي', total: 2500, status: 'paid', issue_date: '2024-01-14', due_date: '2024-02-14' }
    ]);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return 'غير نشط';
      case 'pending': return 'في الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'paid': return 'مدفوع';
      case 'overdue': return 'متأخر';
      default: return status;
    }
  };

  const chartData = [
    { month: 'يناير', revenue: 15000, orders: 45 },
    { month: 'فبراير', revenue: 23000, orders: 52 },
    { month: 'مارس', revenue: 18000, orders: 38 },
    { month: 'أبريل', revenue: 32000, orders: 65 },
    { month: 'مايو', revenue: 28000, orders: 58 },
    { month: 'يونيو', revenue: 45000, orders: 78 }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold">{stats.total_orders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold">{stats.total_customers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المنتجات</p>
                <p className="text-2xl font-bold">{stats.total_products}</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>الإيرادات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>عدد الطلبات الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>الطلبات الأخيرة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-right p-3">رقم الطلب</th>
                  <th className="text-right p-3">العميل</th>
                  <th className="text-right p-3">المبلغ</th>
                  <th className="text-right p-3">الحالة</th>
                  <th className="text-right p-3">تاريخ الطلب</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{order.order_number}</td>
                    <td className="p-3">{order.customer_name}</td>
                    <td className="p-3">{formatCurrency(order.total)}</td>
                    <td className="p-3">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="p-3">{order.order_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return renderDashboard();
      case 'customers':
        return (
          <Card>
            <CardHeader>
              <CardTitle>إدارة العملاء</CardTitle>
            </CardHeader>
            <CardContent>
              <p>قائمة العملاء ستظهر هنا</p>
            </CardContent>
          </Card>
        );
      case 'products':
        return (
          <Card>
            <CardHeader>
              <CardTitle>إدارة المنتجات</CardTitle>
            </CardHeader>
            <CardContent>
              <p>قائمة المنتجات ستظهر هنا</p>
            </CardContent>
          </Card>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Building className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold">نظام إدارة الأعمال المتكامل</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => alert('Button clicked')}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="flex space-x-8 px-6">
          {[
            { key: 'dashboard', label: 'لوحة التحكم', icon: BarChart3 },
            { key: 'customers', label: 'العملاء', icon: Users },
            { key: 'products', label: 'المنتجات', icon: Package },
            { key: 'orders', label: 'الطلبات', icon: ShoppingCart },
            { key: 'invoices', label: 'الفواتير', icon: FileText },
            { key: 'reports', label: 'التقارير', icon: BarChart3 },
            { key: 'settings', label: 'الإعدادات', icon: Settings }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveModule(key)}
              className={`flex items-center px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeModule === key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6">
        {renderModuleContent()}
      </main>
    </div>
  );
};

export default CompleteERPDashboard;





