// @ts-nocheck
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useNotificationActions } from '@/contexts/NotificationContext'
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';

interface Order {
  id: string
  order_number: string
  customer_name: string
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
  updated_at: string
  items_count: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  items: any[] // JSONB array of order items
}

interface RealtimeOrderTrackingProps {
  userId: string
  maxOrders?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

const RealtimeOrderTracking: React.FC<RealtimeOrderTrackingProps> = ({
  userId,
  maxOrders = 10,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const supabase = createClientComponentClient()
  const { notifyInfo, notifySuccess } = useNotificationActions()
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <TruckIcon className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-500" />
      case 'delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
      case 'refunded':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('erp_orders')
        .select(`
          id,
          order_number,
          customer_name,
          total,
          status,
          payment_status,
          created_at,
          updated_at,
          items
        `)
        .order('created_at', { ascending: false })
        .limit(maxOrders)

      if (error || !Array.isArray(data)) {
        console.error('Error fetching orders:', error, 'Data:', data)
        console.error('Error details:', {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code
        })
        notifyInfo(
          'Order Fetch Failed',
          error?.message || 'Unable to fetch orders. Please check your database schema and API keys.'
        )
        return
      }

      // Transform data to include items count
      const transformedOrders = data?.map(order => ({
        ...order,
        items_count: Array.isArray(order.items) ? order.items.length : 0
      })) || []

      // Check for new orders
      if (orders.length > 0) {
        const newOrders = transformedOrders.filter(
          order => !orders.some(existing => existing.id === order.id)
        )
        
        // Notify about new orders
        newOrders.forEach(order => {
          notifyInfo(
            'New Order Received',
            `Order #${order.order_number} from ${order.customer_name}`,
            {
              label: 'View Order',
              onClick: () => {
                window.location.href = `/store/orders/${order.id}`
              }
            }
          )
        })

        // Check for status changes
        orders.forEach(existingOrder => {
          const updatedOrder = transformedOrders.find(o => o.id === existingOrder.id)
          if (updatedOrder && updatedOrder.status !== existingOrder.status) {
            notifySuccess(
              'Order Status Updated',
              `Order #${updatedOrder.order_number} status changed to ${updatedOrder.status}`
            )
          }
        })
      }

      setOrders(transformedOrders)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error in fetchOrders:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchOrders, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, orders])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTimeAgo = (dateString: string) => {
    const now = new Date()
    const orderDate = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <span className="text-xs text-gray-500">
            Updated {getTimeAgo(lastUpdate.toISOString())}
          </span>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <TruckIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No recent orders</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      #{order.order_number}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      window.location.href = `/store/orders/${order.id}`
                    }}
                    className="text-blue-600 hover:text-blue-700 p-1 rounded"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Customer: </span>
                    <span className="font-medium">{order.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount: </span>
                    <span className="font-medium">{formatCurrency(order.total)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment: </span>
                    <span className={`font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                      {order.payment_status}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Items: </span>
                    <span className="font-medium">{order.items_count}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {formatDate(order.created_at)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {getTimeAgo(order.created_at)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {orders.length === maxOrders && (
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  window.location.href = '/store/orders'
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all orders →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default RealtimeOrderTracking





