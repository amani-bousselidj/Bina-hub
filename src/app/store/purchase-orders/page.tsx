'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState } from 'react';
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
  Info
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Vendor {
  id: string;
  vendorCode: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  paymentTerms: number;
  creditLimit: number;
  taxNumber?: string;
  category: VendorCategory;
  status: 'active' | 'inactive' | 'blocked';
  performanceScore: number;
  totalOrders: number;
  totalSpent: number;
  averageDeliveryTime: number;
  qualityRating: number;
  lastOrderDate?: string;
  registrationDate: string;
}

interface VendorCategory {
  id: string;
  name: string;
  color: string;
}

interface PurchaseOrderItem {
  id: string;
  productCode: string;
  productName: string;
  description?: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  taxRate: number;
  taxAmount: number;
  expectedDeliveryDate?: string;
  specifications?: string;
  notes?: string;
}

interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendor: Vendor;
  orderDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;
  requestedBy: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'confirmed' | 'partially_received' | 'completed' | 'cancelled';
  approvalWorkflow: ApprovalStep[];
  items: PurchaseOrderItem[];
  subtotal: number;
  totalTax: number;
  shippingCost: number;
  discountAmount: number;
  totalAmount: number;
  paymentTerms: string;
  deliveryTerms: string;
  notes?: string;
  attachments: string[];
  createdDate: string;
  lastModifiedDate: string;
}

interface ApprovalStep {
  id: string;
  stepName: string;
  approver: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  date?: string;
  requiredAmount?: number;
}

export default function EnhancedPurchaseOrdersPage() {
const supabase = createClientComponentClient();

  // Customer selection state
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [vendors] = useState<Vendor[]>([
    {
      id: '1',
      vendorCode: 'VEN-001',
      name: 'شركة مواد البناء المتطورة',
      contactPerson: 'أحمد محمد الشمري',
      email: 'ahmed@advanced-building.com',
      phone: '+966501234567',
      address: 'المنطقة الصناعية الثالثة',
      city: 'الرياض',
      region: 'منطقة الرياض',
      country: 'المملكة العربية السعودية',
      paymentTerms: 30,
      creditLimit: 500000,
      taxNumber: '123456789',
      category: { id: '1', name: 'مواد البناء', color: 'blue' },
      status: 'active',
      performanceScore: 95,
      totalOrders: 45,
      totalSpent: 1250000,
      averageDeliveryTime: 5,
      qualityRating: 4.8,
      lastOrderDate: '2025-01-20',
      registrationDate: '2024-01-15'
    },
    {
      id: '2',
      vendorCode: 'VEN-002',
      name: 'مصنع الحديد والصلب الوطني',
      contactPerson: 'سالم عبدالله العتيبي',
      email: 'salem@national-steel.com',
      phone: '+966512345678',
      address: 'المدينة الصناعية الثانية',
      city: 'الدمام',
      region: 'المنطقة الشرقية',
      country: 'المملكة العربية السعودية',
      paymentTerms: 45,
      creditLimit: 1000000,
      taxNumber: '987654321',
      category: { id: '2', name: 'المعادن والحديد', color: 'gray' },
      status: 'active',
      performanceScore: 88,
      totalOrders: 32,
      totalSpent: 2100000,
      averageDeliveryTime: 7,
      qualityRating: 4.5,
      lastOrderDate: '2025-01-18',
      registrationDate: '2023-08-20'
    }
  ]);

  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: '1',
      orderNumber: 'PO-2025-001',
      vendor: vendors[0],
      orderDate: '2025-01-23',
      expectedDeliveryDate: '2025-01-30',
      requestedBy: 'محمد أحمد السعيد',
      department: 'إدارة المشاريع',
      priority: 'high',
      status: 'pending_approval',
      approvalWorkflow: [
        {
          id: '1',
          stepName: 'موافقة مدير القسم',
          approver: 'أحمد الطيب',
          approverRole: 'مدير المشاريع',
          status: 'approved',
          comments: 'موافق على الطلب',
          date: '2025-01-23'
        },
        {
          id: '2',
          stepName: 'موافقة المدير المالي',
          approver: 'فاطمة السليم',
          approverRole: 'المديرة المالية',
          status: 'pending'
        },
        {
          id: '3',
          stepName: 'موافقة المدير العام',
          approver: 'خالد الراشد',
          approverRole: 'المدير العام',
          status: 'pending',
          requiredAmount: 100000
        }
      ],
      items: [
        {
          id: '1',
          productCode: 'CEM-001',
          productName: 'أسمنت عادي',
          description: 'أسمنت بورتلاندي عادي 42.5',
          category: 'مواد البناء',
          quantity: 500,
          unitPrice: 25.50,
          totalPrice: 12750,
          taxRate: 15,
          taxAmount: 1912.50,
          expectedDeliveryDate: '2025-01-30',
          specifications: 'حسب المواصفات السعودية SASO 2847',
          notes: 'يجب التأكد من تاريخ الإنتاج'
        },
        {
          id: '2',
          productCode: 'STL-002',
          productName: 'حديد تسليح',
          description: 'حديد تسليح عالي القوة 16 مم',
          category: 'حديد ومعادن',
          quantity: 200,
          unitPrice: 3.20,
          totalPrice: 640,
          taxRate: 15,
          taxAmount: 96,
          expectedDeliveryDate: '2025-02-01',
          specifications: 'حسب المواصفة ASTM A615',
          notes: 'فحص الجودة مطلوب عند الاستلام'
        }
      ],
      subtotal: 13390,
      totalTax: 2008.50,
      shippingCost: 500,
      discountAmount: 0,
      totalAmount: 15898.50,
      paymentTerms: '30 يوم من تاريخ الاستلام',
      deliveryTerms: 'FOB المصنع',
      notes: 'هذا الطلب عاجل ومطلوب للمشروع رقم PRJ-2025-15',
      attachments: ['مواصفات_فنية.pdf', 'رسم_تقني.dwg'],
      createdDate: '2025-01-23',
      lastModifiedDate: '2025-01-23'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      case 'confirmed': return 'bg-indigo-100 text-indigo-800';
      case 'partially_received': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'مسودة';
      case 'pending_approval': return 'في انتظار الموافقة';
      case 'approved': return 'معتمد';
      case 'sent': return 'مُرسل';
      case 'confirmed': return 'مؤكد';
      case 'partially_received': return 'مستلم جزئياً';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'pending_approval': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'sent': return <Mail className="h-4 w-4" />;
      case 'confirmed': return <Clipboard className="h-4 w-4" />;
      case 'partially_received': return <Package className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
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

  const getApprovalStepStatus = (step: ApprovalStep) => {
    switch (step.status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const totalOrders = purchaseOrders.length;
  const pendingApproval = purchaseOrders.filter(o => o.status === 'pending_approval').length;
  const approvedOrders = purchaseOrders.filter(o => o.status === 'approved' || o.status === 'sent' || o.status === 'confirmed').length;
  const completedOrders = purchaseOrders.filter(o => o.status === 'completed').length;
  const totalValue = purchaseOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageOrderValue = totalValue / totalOrders;

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">إدارة أوامر الشراء المتقدمة</h1>
              <p className="text-blue-100 text-lg">نظام إدارة مشتريات متقدم مع سير عمل الموافقات وتتبع الأداء</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Download className="h-4 w-4 mr-2" />
                تصدير التقارير
              </Button>
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <Upload className="h-4 w-4 mr-2" />
                استيراد طلبات
              </Button>
              <Button className="bg-white text-purple-600 hover:bg-gray-50">
                <Plus className="h-4 w-4 mr-2" />
                طلب شراء جديد
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Search Section */}
      <Card className="border-l-4 border-l-purple-500 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-purple-700">البحث عن معلومات العملاء والمشاريع</CardTitle>
              <p className="text-sm text-purple-600 mt-1">
                يمكن للمتاجر رؤية معلومات المشاريع لتحديد أو تعريف المشروع للتسليم
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <CustomerSearchWidget
            onCustomerSelect={(customer) => {
              setSelectedCustomer(customer);
              toast.success(`تم اختيار ${customer.name} بنجاح`);
            }}
          />
        </CardContent>
      </Card>

      {/* Enhanced Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{totalOrders}</span>
                <p className="text-xs text-blue-600 mt-1">طلب شراء</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-yellow-700">في انتظار الموافقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-yellow-800">{pendingApproval}</span>
                <p className="text-xs text-yellow-600 mt-1">طلب معلق</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">طلبات معتمدة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-blue-800">{approvedOrders}</span>
                <p className="text-xs text-blue-600 mt-1">طلب معتمد</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">طلبات مكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <Package className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-green-800">{completedOrders}</span>
                <p className="text-xs text-green-600 mt-1">طلب مكتمل</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-700">إجمالي القيمة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-800">{totalValue.toLocaleString()}</span>
                <p className="text-xs text-emerald-600 mt-1">ريال سعودي</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">متوسط قيمة الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-purple-800">{averageOrderValue.toFixed(0)}</span>
                <p className="text-xs text-purple-600 mt-1">ريال سعودي</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة أوامر الشراء</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في أوامر الشراء..."
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
                <option value="draft">مسودة</option>
                <option value="pending_approval">في انتظار الموافقة</option>
                <option value="approved">معتمد</option>
                <option value="sent">مُرسل</option>
                <option value="confirmed">مؤكد</option>
                <option value="completed">مكتمل</option>
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
                      </div>
                      <p className="text-sm text-gray-600">{order.vendor.name}</p>
                      <p className="text-sm text-blue-600">المطلوب بواسطة: {order.requestedBy} - {order.department}</p>
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
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>تاريخ الطلب: {new Date(order.orderDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                    {order.expectedDeliveryDate && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>التسليم المتوقع: {new Date(order.expectedDeliveryDate).toLocaleDateString('ar-SA')}</span>
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
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الضريبة:</span>
                      <span className="font-medium">{order.totalTax.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الإجمالي:</span>
                      <span className="font-medium text-green-600">{order.totalAmount.toLocaleString()} ريال</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">شروط الدفع:</span>
                      <span className="font-medium">{order.vendor.paymentTerms} يوم</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">شروط التسليم:</span>
                      <span className="font-medium">{order.deliveryTerms}</span>
                    </div>
                  </div>
                </div>

                {/* Approval Workflow */}
                {order.approvalWorkflow.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                      <Workflow className="h-4 w-4" />
                      سير عمل الموافقات
                    </h4>
                    <div className="flex gap-2">
                      {order.approvalWorkflow.map((step, index) => (
                        <div key={step.id} className="flex-1">
                          <div className={`p-2 rounded text-xs text-center ${getApprovalStepStatus(step)}`}>
                            <div className="font-medium">{step.stepName}</div>
                            <div>{step.approver}</div>
                            {step.status === 'approved' && step.date && (
                              <div className="text-xs opacity-75">
                                {new Date(step.date).toLocaleDateString('ar-SA')}
                              </div>
                            )}
                          </div>
                          {index < order.approvalWorkflow.length - 1 && (
                            <div className="text-center mt-1">
                              <span className="text-gray-400">→</span>
                            </div>
                          )}
                        </div>
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

                {/* Attachments */}
                {order.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {order.attachments.map((attachment, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {attachment}
                      </span>
                    ))}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Button size="sm" variant="outline">
                    <Workflow className="h-4 w-4 mr-2" />
                    معالجة الموافقة
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    إرسال للمورد
                  </Button>
                  <Button size="sm" variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    طباعة أمر الشراء
                  </Button>
                  <Button size="sm" variant="outline">
                    <Activity className="h-4 w-4 mr-2" />
                    تتبع الحالة
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
              تفاصيل أمر الشراء {selectedOrder.orderNumber}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">أصناف الطلب</h3>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-gray-600">{item.productCode}</p>
                        {item.description && (
                          <p className="text-sm text-gray-500">{item.description}</p>
                        )}
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {item.totalPrice.toLocaleString()} ريال
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">الكمية:</span>
                        <span className="font-medium ml-1">{item.quantity}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">سعر الوحدة:</span>
                        <span className="font-medium ml-1">{item.unitPrice.toLocaleString()} ريال</span>
                      </div>
                      <div>
                        <span className="text-gray-600">الضريبة:</span>
                        <span className="font-medium ml-1">{item.taxRate}%</span>
                      </div>
                    </div>

                    {item.expectedDeliveryDate && (
                      <div className="mt-2 text-sm">
                        <span className="text-gray-600">التسليم المتوقع:</span>
                        <span className="font-medium ml-1">
                          {new Date(item.expectedDeliveryDate).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    )}

                    {item.specifications && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <span className="text-gray-600 font-medium">المواصفات:</span>
                        <p className="text-gray-700">{item.specifications}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Order Summary and Vendor Info */}
              <div className="space-y-4">
                {/* Vendor Information */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    معلومات المورد
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{selectedOrder.vendor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>الشخص المسؤول: {selectedOrder.vendor.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.vendor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.vendor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedOrder.vendor.address}, {selectedOrder.vendor.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span>تقييم الأداء: {selectedOrder.vendor.performanceScore}/100</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Receipt className="h-4 w-4" />
                    ملخص الطلب
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">المجموع الفرعي:</span>
                      <span className="font-medium">{selectedOrder.subtotal.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الضريبة:</span>
                      <span className="font-medium">{selectedOrder.totalTax.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن:</span>
                      <span className="font-medium">{selectedOrder.shippingCost.toLocaleString()} ريال</span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">الخصم:</span>
                        <span className="font-medium text-red-600">-{selectedOrder.discountAmount.toLocaleString()} ريال</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold text-lg">
                        <span>الإجمالي:</span>
                        <span className="text-green-600">{selectedOrder.totalAmount.toLocaleString()} ريال</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment and Delivery Terms */}
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    الشروط والأحكام
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600 font-medium">شروط الدفع:</span>
                      <p className="text-gray-700">{selectedOrder.paymentTerms}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">شروط التسليم:</span>
                      <p className="text-gray-700">{selectedOrder.deliveryTerms}</p>
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
