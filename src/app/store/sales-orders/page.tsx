'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CustomerSearchWidget, Customer } from '@/components/store/CustomerSearchWidget';
import { toast } from 'sonner';
import { 
  ShoppingCart, 
  Plus, 
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Calendar,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  FileText,
  User,
  Building,
  TrendingUp,
  BarChart3,
  Workflow,
  Timer,
  Star,
  Target,
  Activity,
  CreditCard,
  Receipt,
  Clipboard,
  Mail,
  Phone,
  MapPin,
  Hash,
  Percent,
  Calculator,
  PieChart,
  Users,
  Award,
  BookOpen,
  Layers,
  Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface SalesCustomer {
  id: string;
  customerCode: string;
  name: string;
  type: 'individual' | 'business';
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  creditLimit: number;
  currentBalance: number;
  paymentTerms: number;
  discountPercentage: number;
  category: string;
  loyaltyPoints: number;
}

interface Product {
  id: string;
  productCode: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  discountPrice?: number;
  taxRate: number;
  stockQuantity: number;
  minStockLevel: number;
  unit: string;
  weight?: number;
  dimensions?: string;
  manufacturer?: string;
}

interface SalesOrderItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  discountAmount: number;
  netPrice: number;
  taxAmount: number;
  totalAmount: number;
  notes?: string;
  deliveryDate?: string;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  customer: SalesCustomer;
  orderDate: string;
  requiredDate?: string;
  promisedDate?: string;
  salesperson: string;
  salesTeam: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'quotation' | 'confirmed' | 'in_progress' | 'ready_to_ship' | 'shipped' | 'delivered' | 'invoiced' | 'cancelled';
  items: SalesOrderItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  paymentTerms: string;
  shippingMethod: string;
  shippingAddress: string;
  billingAddress: string;
  notes?: string;
  internalNotes?: string;
  tags: string[];
  source: 'website' | 'phone' | 'email' | 'walk_in' | 'referral';
  currency: string;
  exchangeRate: number;
  createdBy: string;
  approvedBy?: string;
  createdDate: string;
  lastModifiedDate: string;
}

export default function SalesOrderManagementPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);;

  const [products, setProducts] = useState<any[]>([]);;

  const [salesOrders] = useState<SalesOrder[]>([
    {
      id: '1',
      orderNumber: 'SO-2025-001',
      customer: customers[0],
      orderDate: '2025-01-23',
      requiredDate: '2025-01-30',
      promisedDate: '2025-01-28',
      salesperson: 'محمد أحمد الطيب',
      salesTeam: 'فريق المبيعات الرئيسي',
      priority: 'high',
      status: 'confirmed',
      items: [
        {
          id: '1',
          product: products[0],
          quantity: 100,
          unitPrice: 25.50,
          discountPercentage: 10,
          discountAmount: 255,
          netPrice: 2295,
          taxAmount: 344.25,
          totalAmount: 2639.25,
          notes: 'عميل VIP - خصم خاص',
          deliveryDate: '2025-01-28'
        },
        {
          id: '2',
          product: products[1],
          quantity: 50,
          unitPrice: 3.20,
          discountPercentage: 5,
          discountAmount: 8,
          netPrice: 152,
          taxAmount: 22.80,
          totalAmount: 174.80,
          deliveryDate: '2025-01-30'
        }
      ],
      subtotal: 2550,
      totalDiscount: 263,
      totalTax: 367.05,
      shippingCost: 150,
      totalAmount: 2804.05,
      paymentMethod: 'bank_transfer',
      paymentTerms: '30 يوم من تاريخ الفاتورة',
      shippingMethod: 'شحن مجاني',
      shippingAddress: 'شارع الملك فهد، حي العليا، الرياض',
      billingAddress: 'شارع الملك فهد، حي العليا، الرياض',
      notes: 'طلب عاجل للمشروع الجديد',
      internalNotes: 'عميل مهم - متابعة خاصة',
      tags: ['VIP', 'مشروع كبير', 'عاجل'],
      source: 'phone',
      currency: 'SAR',
      exchangeRate: 1,
      createdBy: 'سالم الأحمد',
      approvedBy: 'مدير المبيعات',
      createdDate: '2025-01-23T10:30:00',
      lastModifiedDate: '2025-01-23T14:15:00'
    },
    {
      id: '2',
      orderNumber: 'SO-2025-002',
      customer: customers[1],
      orderDate: '2025-01-22',
      requiredDate: '2025-01-29',
      salesperson: 'فاطمة السليم',
      salesTeam: 'فريق المبيعات النسائي',
      priority: 'medium',
      status: 'in_progress',
      items: [
        {
          id: '3',
          product: products[2],
          quantity: 1000,
          unitPrice: 0.45,
          discountPercentage: 0,
          discountAmount: 0,
          netPrice: 450,
          taxAmount: 67.50,
          totalAmount: 517.50
        }
      ],
      subtotal: 450,
      totalDiscount: 0,
      totalTax: 67.50,
      shippingCost: 75,
      totalAmount: 592.50,
      paymentMethod: 'cash',
      paymentTerms: '15 يوم من تاريخ التسليم',
      shippingMethod: 'توصيل عادي',
      shippingAddress: 'شارع التحلية، حي الحمراء، جدة',
      billingAddress: 'شارع التحلية، حي الحمراء، جدة',
      notes: 'عميلة جديدة - أول طلب',
      tags: ['عميل جديد', 'طلب صغير'],
      source: 'website',
      currency: 'SAR',
      exchangeRate: 1,
      createdBy: 'أحمد الراشد',
      createdDate: '2025-01-22T15:45:00',
      lastModifiedDate: '2025-01-22T15:45:00'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sourceFiler, setSourceFilter] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredOrders = salesOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.salesperson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    const matchesSource = sourceFiler === 'all' || order.source === sourceFiler;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quotation': return 'bg-gray-100 text-gray-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'ready_to_ship': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'invoiced': return 'bg-teal-100 text-teal-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'quotation': return 'عرض سعر';
      case 'confirmed': return 'مؤكد';
      case 'in_progress': return 'قيد التنفيذ';
      case 'ready_to_ship': return 'جاهز للشحن';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'invoiced': return 'تم إصدار الفاتورة';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'quotation': return <FileText className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'ready_to_ship': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'invoiced': return <Receipt className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'منخفضة';
      case 'medium': return 'متوسطة';
      case 'high': return 'عالية';
      case 'urgent': return 'عاجلة';
      default: return priority;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-purple-100 text-purple-800';
      case 'walk_in': return 'bg-orange-100 text-orange-800';
      case 'referral': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceText = (source: string) => {
    switch (source) {
      case 'website': return 'الموقع الإلكتروني';
      case 'phone': return 'اتصال هاتفي';
      case 'email': return 'بريد إلكتروني';
      case 'walk_in': return 'زيارة مباشرة';
      case 'referral': return 'إحالة';
      default: return source;
    }
  };

  // Calculate statistics
  const totalOrders = salesOrders.length;
  const confirmedOrders = salesOrders.filter(o => o.status === 'confirmed').length;
  const inProgressOrders = salesOrders.filter(o => o.status === 'in_progress').length;
  const deliveredOrders = salesOrders.filter(o => o.status === 'delivered').length;
  const completedOrders = salesOrders.filter(o => o.status === 'delivered' || o.status === 'invoiced').length;
  const pendingOrders = salesOrders.filter(o => o.status === 'quotation' || o.status === 'confirmed').length;
  const totalRevenue = salesOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalSales = totalRevenue;
  const averageOrderValue = totalRevenue / totalOrders;

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*,store:stores(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        return;
      }
      
      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers from Supabase
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customers:', error);
        return;
      }
      
      if (data) {
        setCustomers(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Enhanced Header with Gradient Background */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">إدارة أوامر البيع المتقدمة</h1>
            <p className="text-green-100">نظام إدارة مبيعات شامل مع تتبع الطلبات وإدارة العملاء والمشاريع</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              تصدير التقارير
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Upload className="h-4 w-4 mr-2" />
              استيراد أوامر
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              أمر بيع جديد
            </Button>
          </div>
        </div>
        
        {/* Statistics Cards in Header */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 text-green-200" />
              <div>
                <p className="text-green-100 text-sm">إجمالي الأوامر</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-200" />
              <div>
                <p className="text-green-100 text-sm">أوامر مكتملة</p>
                <p className="text-2xl font-bold">{completedOrders}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-200" />
              <div>
                <p className="text-green-100 text-sm">إجمالي المبيعات</p>
                <p className="text-2xl font-bold">{totalSales.toLocaleString('ar-SA')} ر.س</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-200" />
              <div>
                <p className="text-green-100 text-sm">أوامر معلقة</p>
                <p className="text-2xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <User className="h-5 w-5" />
            البحث عن العملاء والمشاريع للطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerSearchWidget
            onCustomerSelect={(customer: Customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار العميل: ${customer.name}`);
            }}
            placeholder="البحث عن عميل أو مشروع لإنشاء أمر بيع..."
          />
          
          {selectedCustomer && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">العميل المحدد للطلب</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">الاسم:</span>
                  <span className="font-medium mr-2">{selectedCustomer.name}</span>
                </div>
                {selectedCustomer.phone && (
                  <div>
                    <span className="text-gray-600">الهاتف:</span>
                    <span className="font-medium mr-2">{selectedCustomer.phone}</span>
                  </div>
                )}
                {selectedCustomer.email && (
                  <div>
                    <span className="text-gray-600">البريد:</span>
                    <span className="font-medium mr-2">{selectedCustomer.email}</span>
                  </div>
                )}
                {selectedCustomer.address && (
                  <div className="col-span-2">
                    <span className="text-gray-600">عنوان التوريد:</span>
                    <span className="font-medium mr-2">{selectedCustomer.address}</span>
                  </div>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-1" />
                  إنشاء أمر بيع جديد
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  عرض أوامر العميل
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Sales Orders List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">قائمة أوامر البيع</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في أوامر البيع..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الحالات</option>
                <option value="quotation">عرض سعر</option>
                <option value="confirmed">مؤكد</option>
                <option value="in_progress">قيد التنفيذ</option>
                <option value="ready_to_ship">جاهز للشحن</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التسليم</option>
                <option value="invoiced">تم إصدار الفاتورة</option>
                <option value="cancelled">ملغي</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع الأولويات</option>
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="urgent">عاجلة</option>
              </select>

              <select
                value={sourceFiler}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع المصادر</option>
                <option value="website">الموقع الإلكتروني</option>
                <option value="phone">اتصال هاتفي</option>
                <option value="email">بريد إلكتروني</option>
                <option value="walk_in">زيارة مباشرة</option>
                <option value="referral">إحالة</option>
              </select>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                تصفية متقدمة
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className={`p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer ${
                  selectedOrder?.id === order.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {getPriorityText(order.priority)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(order.source)}`}>
                          {getSourceText(order.source)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer.name} - {order.customer.category}</p>
                      <p className="text-sm text-blue-600">مندوب المبيعات: {order.salesperson} - {order.salesTeam}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Receipt className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>تاريخ الأمر: {new Date(order.orderDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                    {order.requiredDate && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>التاريخ المطلوب: {new Date(order.requiredDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    )}
                    {order.promisedDate && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Target className="h-4 w-4" />
                        <span>التاريخ الموعود: {new Date(order.promisedDate).toLocaleDateString('ar-SA')}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">عدد الأصناف:</span>
                      <span className="font-medium">{order.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي:</span>
                      <span className="font-medium">{order.subtotal.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي الخصم:</span>
                      <span className="font-medium text-red-600">-{order.totalDiscount.toLocaleString()} ريال</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الضريبة:</span>
                      <span className="font-medium">{order.totalTax.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن:</span>
                      <span className="font-medium">{order.shippingCost.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الإجمالي:</span>
                      <span className="font-medium text-green-600">{order.totalAmount.toLocaleString()} ريال</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">طريقة الدفع:</span>
                      <span className="font-medium">{order.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' : order.paymentMethod === 'cash' ? 'نقداً' : order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">شروط الدفع:</span>
                      <span className="font-medium">{order.customer.paymentTerms} يوم</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن:</span>
                      <span className="font-medium">{order.shippingMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    معلومات العميل
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{order.customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{order.customer.email}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">حد الائتمان:</span>
                        <span className="font-medium">{order.customer.creditLimit.toLocaleString()} ريال</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">الرصيد الحالي:</span>
                        <span className={`font-medium ${order.customer.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {order.customer.currentBalance.toLocaleString()} ريال
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">نقاط الولاء:</span>
                        <span className="font-medium text-blue-600">{order.customer.loyaltyPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">خصم العميل:</span>
                        <span className="font-medium text-green-600">{order.customer.discountPercentage}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {order.tags.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {order.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div className="p-3 bg-blue-50 rounded-lg mb-3">
                    <p className="text-sm text-blue-900">
                      <FileText className="h-4 w-4 inline mr-1" />
                      <span className="font-medium">ملاحظات:</span> {order.notes}
                    </p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    تحديث الحالة
                  </Button>
                  <Button size="sm" variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    إنشاء فاتورة
                  </Button>
                  <Button size="sm" variant="outline">
                    <Truck className="h-4 w-4 mr-2" />
                    ترتيب الشحن
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    اتصال بالعميل
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Order Details Panel */}
      {selectedOrder && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              تفاصيل أمر البيع {selectedOrder.orderNumber}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">أصناف الأمر</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.productCode}</p>
                        {item.product.description && (
                          <p className="text-sm text-gray-500">{item.product.description}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {item.totalAmount.toLocaleString()} ريال
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">الكمية:</span>
                        <span className="font-medium ml-1">{item.quantity} {item.product.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">سعر الوحدة:</span>
                        <span className="font-medium ml-1">{item.unitPrice.toLocaleString()} ريال</span>
                      </div>
                      <div>
                        <span className="text-gray-600">الخصم:</span>
                        <span className="font-medium ml-1">{item.discountPercentage}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                      <div>
                        <span className="text-gray-600">الضريبة:</span>
                        <span className="font-medium ml-1">{item.taxAmount.toLocaleString()} ريال</span>
                      </div>
                      <div>
                        <span className="text-gray-600">الصافي:</span>
                        <span className="font-medium ml-1">{item.netPrice.toLocaleString()} ريال</span>
                      </div>
                    </div>

                    {item.deliveryDate && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">تاريخ التسليم:</span>
                        <span className="font-medium ml-1">
                          {new Date(item.deliveryDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    )}

                    {item.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-600 font-medium">ملاحظات:</span>
                        <p className="text-gray-700">{item.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Order Summary and Customer Info */}
              <div className="space-y-4">
                {/* Customer Information */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    معلومات العميل
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{selectedOrder.customer.name}</span>
                      <span className="text-xs px-1 py-0.5 bg-blue-100 text-blue-700 rounded">{selectedOrder.customer.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      <span>رقم العميل: {selectedOrder.customer.customerCode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.customer.address}, {selectedOrder.customer.city}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    ملخص الأمر
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي:</span>
                      <span className="font-medium">{selectedOrder.subtotal.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">إجمالي الخصم:</span>
                      <span className="font-medium text-red-600">-{selectedOrder.totalDiscount.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الضريبة:</span>
                      <span className="font-medium">{selectedOrder.totalTax.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن:</span>
                      <span className="font-medium">{selectedOrder.shippingCost.toLocaleString()} ريال</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>الإجمالي:</span>
                        <span className="text-green-600">{selectedOrder.totalAmount.toLocaleString()} ريال</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales Information */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    معلومات المبيعات
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">مندوب المبيعات:</span>
                      <span className="font-medium">{selectedOrder.salesperson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">فريق المبيعات:</span>
                      <span className="font-medium">{selectedOrder.salesTeam}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">مصدر الأمر:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSourceColor(selectedOrder.source)}`}>
                        {getSourceText(selectedOrder.source)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">تم الإنشاء بواسطة:</span>
                      <span className="font-medium">{selectedOrder.createdBy}</span>
                    </div>
                    {selectedOrder.approvedBy && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">تم الاعتماد بواسطة:</span>
                        <span className="font-medium">{selectedOrder.approvedBy}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    معلومات الشحن والفوترة
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600 font-medium">طريقة الشحن:</span>
                      <p className="text-gray-700">{selectedOrder.shippingMethod}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">عنوان الشحن:</span>
                      <p className="text-gray-700">{selectedOrder.shippingAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">عنوان الفاتورة:</span>
                      <p className="text-gray-700">{selectedOrder.billingAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
