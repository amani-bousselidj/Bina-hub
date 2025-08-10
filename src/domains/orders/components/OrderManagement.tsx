// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  RefreshCw,
  Calendar,
  User,
  MapPin,
  CreditCard
} from 'lucide-react';

interface MedusaOrder {
  id: string;
  display_id: number;
  email: string;
  customer_id?: string;
  customer?: MedusaCustomer;
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
  shipping_address?: MedusaAddress;
  billing_address?: MedusaAddress;
  region?: MedusaRegion;
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
  variant?: {
    id: string;
    title: string;
    sku?: string;
    product: {
      id: string;
      title: string;
      thumbnail?: string;
    };
  };
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

interface MedusaAddress {
  id: string;
  first_name?: string;
  last_name?: string;
  address_1: string;
  address_2?: string;
  city: string;
  country_code: string;
  province?: string;
  postal_code?: string;
  phone?: string;
}

interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  tax_rate: number;
}

const MedusaOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<MedusaOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<MedusaOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    loadMedusaOrders();
  }, []);

  const loadMedusaOrders = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual Medusa API call
      // const response = await fetch('/api/medusa/orders');
      // const data = await response.json();
      
      // Mock data for now - replace with actual Medusa integration
      const mockOrders: MedusaOrder[] = [
        {
          id: 'order_01HWXYZ123',
          display_id: 1001,
          email: 'ahmad.salem@example.com',
          customer_id: 'cus_01HWXYZ456',
          status: 'completed',
          fulfillment_status: 'fulfilled',
          payment_status: 'captured',
          total: 125000, // 1250.00 SAR in cents
          subtotal: 110000,
          tax_total: 15000,
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
              quantity: 5,
              unit_price: 22000,
              total: 110000,
              variant: {
                id: 'variant_01',
                title: 'كيس 50 كيلو',
                sku: 'CONCRETE-350-50KG',
                product: {
                  id: 'prod_01',
                  title: 'خرسانة جاهزة - درجة 350',
                  thumbnail: '/images/concrete.jpg'
                }
              }
            }
          ],
          customer: {
            id: 'cus_01HWXYZ456',
            email: 'ahmad.salem@example.com',
            first_name: 'أحمد',
            last_name: 'سالم',
            phone: '+966501234567',
            has_account: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          shipping_address: {
            id: 'addr_01',
            first_name: 'أحمد',
            last_name: 'سالم',
            address_1: 'شارع الملك فهد',
            city: 'الرياض',
            country_code: 'SA',
            province: 'الرياض',
            postal_code: '12345',
            phone: '+966501234567'
          },
          region: {
            id: 'reg_01',
            name: 'Saudi Arabia',
            currency_code: 'SAR',
            tax_rate: 15
          }
        },
        {
          id: 'order_01HWXYZ124',
          display_id: 1002,
          email: 'fatima.ahmad@example.com',
          status: 'pending',
          fulfillment_status: 'not_fulfilled',
          payment_status: 'awaiting',
          total: 78000,
          subtotal: 70000,
          tax_total: 8000,
          shipping_total: 0,
          discount_total: 0,
          currency_code: 'SAR',
          created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          items: [
            {
              id: 'item_02',
              title: 'حديد تسليح 16مم',
              variant_id: 'variant_02',
              product_id: 'prod_02',
              quantity: 10,
              unit_price: 7000,
              total: 70000,
              variant: {
                id: 'variant_02',
                title: 'قضيب 12 متر',
                sku: 'REBAR-16MM-12M',
                product: {
                  id: 'prod_02',
                  title: 'حديد تسليح 16مم'
                }
              }
            }
          ],
          customer: {
            id: 'cus_01HWXYZ457',
            email: 'fatima.ahmad@example.com',
            first_name: 'فاطمة',
            last_name: 'أحمد',
            has_account: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading Medusa orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.display_id.toString().includes(searchTerm) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesFulfillment = fulfillmentFilter === 'all' || order.fulfillment_status === fulfillmentFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment_status === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesFulfillment && matchesPayment;
  });

  const formatCurrency = (amount: number, currency: string = 'SAR') => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'requires_action':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFulfillmentStatusColor = (status: string) => {
    switch (status) {
      case 'fulfilled':
      case 'shipped':
        return 'bg-green-100 text-green-800';
      case 'partially_fulfilled':
      case 'partially_shipped':
        return 'bg-blue-100 text-blue-800';
      case 'not_fulfilled':
        return 'bg-gray-100 text-gray-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'captured':
        return 'bg-green-100 text-green-800';
      case 'awaiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_paid':
        return 'bg-gray-100 text-gray-800';
      case 'canceled':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const handleOrderAction = (action: string, orderId: string) => {
    console.log(`Action: ${action} for order: ${orderId}`);
    // TODO: Implement order actions with Medusa API
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading Medusa orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">Powered by Medusa Commerce</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadMedusaOrders}
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
            <option value="requires_action">Requires Action</option>
          </select>
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Fulfillment</option>
            <option value="not_fulfilled">Not Fulfilled</option>
            <option value="partially_fulfilled">Partially Fulfilled</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="shipped">Shipped</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payment</option>
            <option value="not_paid">Not Paid</option>
            <option value="awaiting">Awaiting</option>
            <option value="captured">Captured</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fulfillment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <ShoppingCart className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{order.display_id}</div>
                        <div className="text-sm text-gray-500">{order.items.length} items</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer?.first_name && order.customer?.last_name 
                          ? `${order.customer.first_name} ${order.customer.last_name}`
                          : 'Guest'
                        }
                      </div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getFulfillmentStatusColor(order.fulfillment_status)}`}>
                      {order.fulfillment_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.total, order.currency_code)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-US')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderDetails(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOrderAction('edit', order.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'all' || fulfillmentFilter !== 'all' || paymentFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Orders will appear here when customers make purchases'
            }
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">Order Details - #{selectedOrder.display_id}</h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Order Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span>#{selectedOrder.display_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(selectedOrder.created_at).toLocaleString('en-US')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency:</span>
                      <span>{selectedOrder.currency_code}</span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {selectedOrder.customer && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Name:</span>
                        <span>
                          {selectedOrder.customer.first_name && selectedOrder.customer.last_name
                            ? `${selectedOrder.customer.first_name} ${selectedOrder.customer.last_name}`
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span>{selectedOrder.customer.email}</span>
                      </div>
                      {selectedOrder.customer.phone && (
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span>{selectedOrder.customer.phone}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Account:</span>
                        <span>{selectedOrder.customer.has_account ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                {selectedOrder.shipping_address && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">Shipping Address</h4>
                    <div className="text-sm">
                      <div>{selectedOrder.shipping_address.first_name} {selectedOrder.shipping_address.last_name}</div>
                      <div>{selectedOrder.shipping_address.address_1}</div>
                      {selectedOrder.shipping_address.address_2 && (
                        <div>{selectedOrder.shipping_address.address_2}</div>
                      )}
                      <div>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.province}</div>
                      <div>{selectedOrder.shipping_address.postal_code}</div>
                      {selectedOrder.shipping_address.phone && (
                        <div>{selectedOrder.shipping_address.phone}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items & Totals */}
              <div className="space-y-4">
                {/* Items */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{item.title}</div>
                          {item.variant?.title && (
                            <div className="text-xs text-gray-500">{item.variant.title}</div>
                          )}
                          {item.variant?.sku && (
                            <div className="text-xs text-gray-400">SKU: {item.variant.sku}</div>
                          )}
                          <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(item.total, selectedOrder.currency_code)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Order Totals</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.subtotal, selectedOrder.currency_code)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatCurrency(selectedOrder.tax_total, selectedOrder.currency_code)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{formatCurrency(selectedOrder.shipping_total, selectedOrder.currency_code)}</span>
                    </div>
                    {selectedOrder.discount_total > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-{formatCurrency(selectedOrder.discount_total, selectedOrder.currency_code)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{formatCurrency(selectedOrder.total, selectedOrder.currency_code)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Fulfillment</div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getFulfillmentStatusColor(selectedOrder.fulfillment_status)}`}>
                      {selectedOrder.fulfillment_status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-gray-500 mb-1">Payment</div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                      {selectedOrder.payment_status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedusaOrderManagement;





