"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { Package, Search, Filter, Calendar, MapPin, CreditCard, Truck, Eye, RotateCcw, MessageSquare } from 'lucide-react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic'

export default function OrdersPage() {
  const { user, session, isLoading, error } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders(user.id);
    }
  }, [user]);

  const fetchOrders = async (userId: string) => {
    try {
      // Use our new API endpoint that calls the RPC function
      const response = await fetch('/api/user/orders');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }
      
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <Typography variant="body" className="text-gray-600">
                جاري تحميل الطلبات...
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Typography variant="heading" className="text-red-600 mb-2">
                خطأ في تحميل الطلبات
              </Typography>
              <Typography variant="body" className="text-gray-600">
                {error}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.store?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items?.some((item: any) => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Package className="w-5 h-5 text-orange-600" />;
      case 'confirmed': return <Package className="w-5 h-5 text-blue-600" />;
      case 'shipped': return <Truck className="w-5 h-5 text-purple-600" />;
      case 'delivered': return <Package className="w-5 h-5 text-green-600" />;
      case 'cancelled': return <Package className="w-5 h-5 text-red-600" />;
      case 'returned': return <RotateCcw className="w-5 h-5 text-gray-600" />;
      default: return <Package className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'في الانتظار';
      case 'confirmed': return 'مؤكد';
      case 'shipped': return 'تم الشحن';
      case 'delivered': return 'تم التسليم';
      case 'cancelled': return 'ملغي';
      case 'returned': return 'مرتجع';
      default: return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTrackOrder = (trackingNumber: string) => {
    // Implementation for order tracking
    console.log('Tracking order:', trackingNumber);
  };

  const handleRequestReturn = (orderId: string) => {
    // Implementation for return request
    console.log('Requesting return for order:', orderId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <Package className="w-8 h-8 text-blue-600" />
          طلباتي
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          تتبع وإدارة جميع طلباتك ومراحل التسليم
        </Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <EnhancedCard className="p-4">
          <div className="text-center">
            <Typography variant="subheading" size="xl" weight="bold" className="text-orange-600">
              {orders.filter(o => o.status === 'pending').length}
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">في الانتظار</Typography>
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-4">
          <div className="text-center">
            <Typography variant="subheading" size="xl" weight="bold" className="text-blue-600">
              {orders.filter(o => o.status === 'confirmed').length}
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">مؤكد</Typography>
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-4">
          <div className="text-center">
            <Typography variant="subheading" size="xl" weight="bold" className="text-purple-600">
              {orders.filter(o => o.status === 'shipped').length}
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">تم الشحن</Typography>
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-4">
          <div className="text-center">
            <Typography variant="subheading" size="xl" weight="bold" className="text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">تم التسليم</Typography>
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-4">
          <div className="text-center">
            <Typography variant="subheading" size="xl" weight="bold" className="text-red-600">
              {orders.filter(o => o.status === 'cancelled').length}
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">ملغي</Typography>
          </div>
        </EnhancedCard>

        <EnhancedCard className="p-4">
          <div className="text-center">
            <Typography variant="subheading" size="xl" weight="bold" className="text-gray-600">
              {orders.filter(o => o.status === 'returned').length}
            </Typography>
            <Typography variant="caption" size="sm" className="text-gray-600">مرتجع</Typography>
          </div>
        </EnhancedCard>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="البحث في الطلبات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">جميع الطلبات</option>
          <option value="pending">في الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="shipped">تم الشحن</option>
          <option value="delivered">تم التسليم</option>
          <option value="cancelled">ملغي</option>
          <option value="returned">مرتجع</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="grid gap-6">
        {filteredOrders.map((order) => (
          <EnhancedCard key={order.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(order.status)}
                  <div className="flex-1">
                    <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-900">
                      {order.orderNumber}
                    </Typography>
                    <Typography variant="caption" size="sm" className="text-gray-600">{order.store}</Typography>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="mb-4">
                  <Typography variant="caption" size="sm" className="text-gray-600 mb-2">المنتجات:</Typography>
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div className="flex-1">
                          <Typography variant="body" size="lg" weight="medium">{item.name}</Typography>
                          <Typography variant="caption" size="sm" className="text-gray-600">الكمية: {item.quantity}</Typography>
                        </div>
                        <Typography variant="body" size="lg" weight="semibold" className="text-blue-600">
                          {(item.quantity * item.price).toLocaleString('en-US')} ر.س
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">تاريخ الطلب</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.orderDate).toLocaleDateString('en-US')}
                    </Typography>
                  </div>
                  
                  {order.expectedDelivery && (
                    <div>
                      <Typography variant="caption" size="sm" className="text-gray-600 mb-1">التسليم المتوقع</Typography>
                      <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.expectedDelivery).toLocaleDateString('en-US')}
                      </Typography>
                    </div>
                  )}
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">عنوان التسليم</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {order.shippingAddress}
                    </Typography>
                  </div>
                  
                  <div>
                    <Typography variant="caption" size="sm" className="text-gray-600 mb-1">طريقة الدفع</Typography>
                    <Typography variant="body" size="lg" weight="medium" className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4" />
                      {order.paymentMethod}
                    </Typography>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <Typography variant="caption" size="sm" weight="medium" className="text-blue-800">
                      رقم التتبع: {order.trackingNumber}
                    </Typography>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 lg:w-48">
                <div className="text-left lg:text-right mb-4">
                  <Typography variant="subheading" size="2xl" weight="bold" className="text-blue-600">
                    {order.total.toLocaleString('en-US')} ر.س
                  </Typography>
                  <Typography variant="caption" size="sm" className="text-gray-600">الإجمالي</Typography>
                </div>

                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2 justify-center"
                 onClick={() => alert('Button clicked')}>
                  <Eye className="w-4 h-4" />
                  عرض التفاصيل
                </Button>

                {order.trackingNumber && (
                  <Button
                    onClick={() => handleTrackOrder(order.trackingNumber!)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 justify-center"
                  >
                    <Truck className="w-4 h-4" />
                    تتبع الطلب
                  </Button>
                )}

                {order.status === 'delivered' && (
                  <Button
                    onClick={() => handleRequestReturn(order.id)}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center gap-2 justify-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                    طلب إرجاع
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2 justify-center"
                 onClick={() => alert('Button clicked')}>
                  <MessageSquare className="w-4 h-4" />
                  تواصل مع المتجر
                </Button>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
            لا توجد طلبات
          </Typography>
          <Typography variant="body" size="lg" className="text-gray-500">
            {searchTerm || statusFilter !== 'all' ? 'لم يتم العثور على طلبات تطابق البحث' : 'لم تقم بأي طلبات بعد'}
          </Typography>
          <Link href="/stores" className="inline-block mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => alert('Button clicked')}>
              تصفح المتاجر
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

