// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"
import { HttpTypes, TrackAnalyticsEventDTO, IdentifyAnalyticsEventDTO } from "@medusajs/types"

const analyticsQueryKeys = {
  all: ["analytics"] as const,
  dashboard: () => [...analyticsQueryKeys.all, "dashboard"] as const,
  sales: () => [...analyticsQueryKeys.all, "sales"] as const,
  orders: () => [...analyticsQueryKeys.all, "orders"] as const,
  customers: () => [...analyticsQueryKeys.all, "customers"] as const,
  products: () => [...analyticsQueryKeys.all, "products"] as const,
  vendors: () => [...analyticsQueryKeys.all, "vendors"] as const,
  revenue: () => [...analyticsQueryKeys.all, "revenue"] as const,
  performance: () => [...analyticsQueryKeys.all, "performance"] as const,
}

// Dashboard overview analytics
export const useDashboardAnalytics = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: [...analyticsQueryKeys.dashboard(), dateRange],
    queryFn: async () => {
      // Get aggregated dashboard data
      const [orders, customers, products, revenue] = await Promise.all([
        sdk.admin.order.list({
          created_at: dateRange ? {
            $gte: dateRange.from.toISOString(),
            $lte: dateRange.to.toISOString(),
          } : undefined,
        }),
        sdk.admin.customer.list({
          created_at: dateRange ? {
            $gte: dateRange.from.toISOString(),
            $lte: dateRange.to.toISOString(),
          } : undefined,
        }),
        sdk.admin.product.list(),
        sdk.admin.order.list({
          created_at: dateRange ? {
            $gte: dateRange.from.toISOString(),
            $lte: dateRange.to.toISOString(),
          } : undefined,
        }),
      ])

      // Calculate metrics
      const totalOrders = orders.orders?.length || 0
      const totalCustomers = customers.customers?.length || 0
      const totalProducts = products.products?.length || 0
      const totalRevenue = orders.orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      return {
        totalOrders,
        totalCustomers,
        totalProducts,
        totalRevenue,
        averageOrderValue,
        ordersGrowth: 0, // Calculate growth compared to previous period
        customersGrowth: 0,
        revenueGrowth: 0,
      }
    },
  })
}

// Sales analytics
export const useSalesAnalytics = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: [...analyticsQueryKeys.sales(), dateRange],
    queryFn: async () => {
      const orders = await sdk.admin.order.list({
        created_at: dateRange ? {
          $gte: dateRange.from.toISOString(),
          $lte: dateRange.to.toISOString(),
        } : undefined,
      })

      // Group by date for time series data
      const salesByDate = orders.orders?.reduce((acc, order) => {
        const date = new Date(order.created_at!).toDateString()
        acc[date] = (acc[date] || 0) + (order.total || 0)
        return acc
      }, {} as Record<string, number>) || {}

      return {
        totalSales: orders.orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0,
        salesByDate: Object.entries(salesByDate).map(([date, amount]) => ({
          date,
          amount,
        })),
        orderCount: orders.orders?.length || 0,
      }
    },
  })
}

// Customer analytics
export const useCustomerAnalytics = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: [...analyticsQueryKeys.customers(), dateRange],
    queryFn: async () => {
      const [customers, orders] = await Promise.all([
        sdk.admin.customer.list({
          created_at: dateRange ? {
            $gte: dateRange.from.toISOString(),
            $lte: dateRange.to.toISOString(),
          } : undefined,
        }),
        sdk.admin.order.list({
          created_at: dateRange ? {
            $gte: dateRange.from.toISOString(),
            $lte: dateRange.to.toISOString(),
          } : undefined,
        }),
      ])

      // Calculate customer metrics
      const newCustomers = customers.customers?.length || 0
      const returningCustomers = orders.orders?.filter(order => 
        orders.orders?.filter(o => o.customer_id === order.customer_id).length > 1
      ).length || 0
      
      const customersByDate = customers.customers?.reduce((acc, customer) => {
        const date = new Date(customer.created_at!).toDateString()
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {} as Record<string, number>) || {}

      return {
        newCustomers,
        returningCustomers,
        customerRetentionRate: newCustomers > 0 ? (returningCustomers / newCustomers) * 100 : 0,
        customersByDate: Object.entries(customersByDate).map(([date, count]) => ({
          date,
          count,
        })),
      }
    },
  })
}

// Product analytics
export const useProductAnalytics = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: [...analyticsQueryKeys.products(), dateRange],
    queryFn: async () => {
      const [products, orders] = await Promise.all([
        sdk.admin.product.list(),
        sdk.admin.order.list({
          created_at: dateRange ? {
            $gte: dateRange.from.toISOString(),
            $lte: dateRange.to.toISOString(),
          } : undefined,
        }),
      ])

      // Calculate product performance
      const productSales = new Map<string, { sales: number; quantity: number; title: string }>()
      
      orders.orders?.forEach(order => {
        order.items?.forEach(item => {
          const existing = productSales.get(item.product_id!) || { sales: 0, quantity: 0, title: item.title || '' }
          existing.sales += item.total || 0
          existing.quantity += item.quantity || 0
          productSales.set(item.product_id!, existing)
        })
      })

      const topProducts = Array.from(productSales.entries())
        .map(([productId, data]) => ({ productId, ...data }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 10)

      return {
        totalProducts: products.products?.length || 0,
        topProducts,
        lowStockProducts: products.products?.filter(product => 
          product.variants?.some(variant => (variant.inventory_quantity || 0) < 10)
        ).length || 0,
      }
    },
  })
}

// Vendor analytics (marketplace-specific)
export const useVendorAnalytics = (vendorId?: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: [...analyticsQueryKeys.vendors(), vendorId, dateRange],
    queryFn: async () => {
      // This would need to be implemented based on your vendor data structure
      const orders = await sdk.admin.order.list({
        created_at: dateRange ? {
          $gte: dateRange.from.toISOString(),
          $lte: dateRange.to.toISOString(),
        } : undefined,
      })

      // Filter orders by vendor if specified
      const vendorOrders = vendorId 
        ? orders.orders?.filter(order => 
            order.items?.some(item => item.metadata?.vendor_id === vendorId)
          ) || []
        : orders.orders || []

      const vendorRevenue = vendorOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      const vendorOrderCount = vendorOrders.length

      return {
        vendorRevenue,
        vendorOrderCount,
        averageOrderValue: vendorOrderCount > 0 ? vendorRevenue / vendorOrderCount : 0,
        // Add more vendor-specific metrics
      }
    },
    enabled: !!vendorId,
  })
}

// Performance analytics
export const usePerformanceAnalytics = (dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: [...analyticsQueryKeys.performance(), dateRange],
    queryFn: async () => {
      const orders = await sdk.admin.order.list({
        created_at: dateRange ? {
          $gte: dateRange.from.toISOString(),
          $lte: dateRange.to.toISOString(),
        } : undefined,
      })

      // Calculate conversion metrics
      const totalOrders = orders.orders?.length || 0
      const completedOrders = orders.orders?.filter(order => order.status === 'completed').length || 0
      const cancelledOrders = orders.orders?.filter(order => order.status === 'cancelled').length || 0
      
      const conversionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
      const cancellationRate = totalOrders > 0 ? (cancelledOrders / totalOrders) * 100 : 0

      return {
        conversionRate,
        cancellationRate,
        totalOrders,
        completedOrders,
        cancelledOrders,
        // Add more performance metrics
      }
    },
  })
}

// Real analytics tracking functions using Medusa Analytics Service
export const useTrackAnalyticsEvent = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TrackAnalyticsEventDTO) => {
      const response = await fetch('/api/store/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to track analytics event')
      }
      
      return response.json()
    },
    onSuccess: () => {
      // Invalidate analytics queries to refresh data
      queryClient.invalidateQueries({ queryKey: analyticsQueryKeys.all })
    },
  })
}

export const useIdentifyUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: IdentifyAnalyticsEventDTO) => {
      const response = await fetch('/api/store/analytics/identify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        throw new Error('Failed to identify user')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: analyticsQueryKeys.customers() })
    },
  })
}

// Analytics event tracking helpers
export const analyticsEvents = {
  // E-commerce events
  productView: (productId: string, userId?: string) => ({
    event: 'product_viewed',
    actor_id: userId || 'anonymous',
    object_id: productId,
    object_type: 'product',
    properties: {
      timestamp: new Date().toISOString(),
      page: 'product_detail',
    },
  }),

  productAddedToCart: (productId: string, quantity: number, userId?: string) => ({
    event: 'product_added_to_cart',
    actor_id: userId || 'anonymous',
    object_id: productId,
    object_type: 'product',
    properties: {
      quantity,
      timestamp: new Date().toISOString(),
    },
  }),

  orderPlaced: (orderId: string, total: number, userId?: string) => ({
    event: 'order_placed',
    actor_id: userId || 'anonymous',
    object_id: orderId,
    object_type: 'order',
    properties: {
      total_amount: total,
      timestamp: new Date().toISOString(),
    },
  }),

  checkoutStarted: (cartId: string, userId?: string) => ({
    event: 'checkout_started',
    actor_id: userId || 'anonymous',
    object_id: cartId,
    object_type: 'cart',
    properties: {
      timestamp: new Date().toISOString(),
    },
  }),

  // User events
  userRegistered: (userId: string) => ({
    event: 'user_registered',
    actor_id: userId,
    object_id: userId,
    object_type: 'user',
    properties: {
      timestamp: new Date().toISOString(),
    },
  }),

  userLogin: (userId: string) => ({
    event: 'user_login',
    actor_id: userId,
    object_id: userId,
    object_type: 'user',
    properties: {
      timestamp: new Date().toISOString(),
    },
  }),

  // Store/vendor events
  storeVisited: (storeId: string, userId?: string) => ({
    event: 'store_visited',
    actor_id: userId || 'anonymous',
    object_id: storeId,
    object_type: 'store',
    properties: {
      timestamp: new Date().toISOString(),
    },
  }),

  searchPerformed: (query: string, resultsCount: number, userId?: string) => ({
    event: 'search_performed',
    actor_id: userId || 'anonymous',
    object_id: 'search',
    object_type: 'search',
    properties: {
      query,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
    },
  }),
} as const





