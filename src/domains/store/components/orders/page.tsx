'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui/Button';
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
  Receipt,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Customer {
  id: string;
  customerCode: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  type: 'individual' | 'business';
  category: string;
}

interface OrderItem {
  id: string;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: Customer;
  orderDate: string;
  deliveryDate?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string;
  shippingAddress: string;
  notes?: string;
  createdBy: string;
  createdDate: string;
}

export default function OrderManagementPage() {
const supabase = createClientComponentClient();

  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);;

  const [orders, setOrders] = useState<any[]>([]);;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'processing': return 'قيد المعالجة';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'في الانتظار';
      case 'paid': return 'مدفوع';
      case 'failed': return 'فشل الدفع';
      case 'refunded': return 'مسترد';
      default: return status;
    }
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageOrderValue = totalRevenue / totalOrders;

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

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*,customer:customers(*),order_items(*)')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }
      
      if (data) {
        setOrders(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة الطلبات المتقدمة</h1>
          <p className="text-gray-600">نظام إدارة شامل للطلبات مع تتبع الحالة والدفع</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            تصدير التقارير
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            استيراد طلبات
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            طلب جديد
          </Button>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">{totalOrders}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">طلب</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">في الانتظار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold text-yellow-600">{pendingOrders}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">طلب منتظر</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">قيد المعالجة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{processingOrders}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">طلب قيد المعالجة</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">تم التسليم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{deliveredOrders}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">طلب مُسلم</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">إجمالي المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">متوسط قيمة الطلب</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{averageOrderValue.toFixed(0)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">ريال سعودي</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>قائمة الطلبات</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الطلبات..."
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
                <option value="pending">في الانتظار</option>
                <option value="processing">قيد المعالجة</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغي</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">جميع حالات الدفع</option>
                <option value="pending">في الانتظار</option>
                <option value="paid">مدفوع</option>
                <option value="failed">فشل الدفع</option>
                <option value="refunded">مسترد</option>
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
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {getPaymentStatusText(order.paymentStatus)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{order.customer.name} - {order.customer.category}</p>
                      <p className="text-sm text-blue-600">تم بواسطة: {order.createdBy}</p>
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
                      <span>تاريخ الطلب: {new Date(order.orderDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                    {order.deliveryDate && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>التسليم: {new Date(order.deliveryDate).toLocaleDateString('ar-SA')}</span>
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
                      <span className="font-medium">{order.taxAmount.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الشحن:</span>
                      <span className="font-medium">{order.shippingCost.toLocaleString()} ريال</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الإجمالي:</span>
                      <span className="font-medium text-green-600">{order.totalAmount.toLocaleString()} ريال</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">طريقة الدفع:</span>
                      <span className="font-medium">{order.paymentMethod}</span>
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
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{order.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{order.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{order.customer.city}</span>
                    </div>
                  </div>
                </div>

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
                    تتبع الشحن
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
              تفاصيل الطلب {selectedOrder.orderNumber}
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
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {item.totalPrice.toLocaleString()} ريال
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">الكمية:</span>
                        <span className="font-medium ml-1">{item.quantity} {item.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">سعر الوحدة:</span>
                        <span className="font-medium ml-1">{item.unitPrice.toLocaleString()} ريال</span>
                      </div>
                      <div>
                        <span className="text-gray-600">الإجمالي:</span>
                        <span className="font-medium ml-1">{item.totalPrice.toLocaleString()} ريال</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">ملخص الطلب</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">المجموع الفرعي:</span>
                    <span className="font-medium">{selectedOrder.subtotal.toLocaleString()} ريال</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">الضريبة:</span>
                    <span className="font-medium">{selectedOrder.taxAmount.toLocaleString()} ريال</span>
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

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-gray-900">معلومات العميل</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الاسم:</span>
                      <span className="font-medium">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">رقم العميل:</span>
                      <span className="font-medium">{selectedOrder.customer.customerCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="font-medium">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">البريد الإلكتروني:</span>
                      <span className="font-medium">{selectedOrder.customer.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium text-gray-900">عنوان الشحن</h3>
                  <p className="text-sm text-gray-700">{selectedOrder.shippingAddress}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}



