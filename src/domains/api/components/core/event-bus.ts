// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const eventBusQueryKeys = {
  all: ["event-bus"] as const,
  events: () => [...eventBusQueryKeys.all, "events"] as const,
  subscribers: () => [...eventBusQueryKeys.all, "subscribers"] as const,
  history: () => [...eventBusQueryKeys.all, "history"] as const,
  config: () => [...eventBusQueryKeys.all, "config"] as const,
}

// Event publishing
export const usePublishEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      eventName, 
      data, 
      options 
    }: { 
      eventName: string
      data: any
      options?: {
        delay?: number
        priority?: number
        attempts?: number
      }
    }) => {
      const response = await fetch('/api/store/events/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventName, data, options }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to publish event')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventBusQueryKeys.history() })
    },
  })
}

// Event subscription management
export const useEventSubscribers = (eventName?: string) => {
  return useQuery({
    queryKey: [...eventBusQueryKeys.subscribers(), eventName],
    queryFn: async () => {
      const params = eventName ? `?eventName=${encodeURIComponent(eventName)}` : ''
      const response = await fetch(`/api/store/events/subscribers${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch event subscribers')
      }
      return response.json()
    },
  })
}

export const useSubscribeToEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      eventName, 
      subscriberUrl, 
      config 
    }: { 
      eventName: string
      subscriberUrl: string
      config?: {
        retryAttempts?: number
        timeout?: number
        headers?: Record<string, string>
      }
    }) => {
      const response = await fetch('/api/store/events/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventName, subscriberUrl, config }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to subscribe to event')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventBusQueryKeys.subscribers() })
    },
  })
}

export const useUnsubscribeFromEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      eventName, 
      subscriberId 
    }: { 
      eventName: string
      subscriberId: string
    }) => {
      const response = await fetch('/api/store/events/unsubscribe', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventName, subscriberId }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to unsubscribe from event')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventBusQueryKeys.subscribers() })
    },
  })
}

// Event history and monitoring
export const useEventHistory = (filters?: {
  eventName?: string
  from?: Date
  to?: Date
  status?: 'success' | 'failed' | 'pending'
  limit?: number
}) => {
  return useQuery({
    queryKey: [...eventBusQueryKeys.history(), filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.eventName) params.append('eventName', filters.eventName)
      if (filters?.from) params.append('from', filters.from.toISOString())
      if (filters?.to) params.append('to', filters.to.toISOString())
      if (filters?.status) params.append('status', filters.status)
      if (filters?.limit) params.append('limit', filters.limit.toString())
      
      const response = await fetch(`/api/store/events/history?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch event history')
      }
      return response.json()
    },
  })
}

// Event bus configuration
export const useEventBusConfig = () => {
  return useQuery({
    queryKey: eventBusQueryKeys.config(),
    queryFn: async () => {
      const response = await fetch('/api/store/events/config')
      if (!response.ok) {
        throw new Error('Failed to fetch event bus config')
      }
      return response.json()
    },
  })
}

export const useUpdateEventBusConfig = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (config: {
      maxRetries?: number
      defaultTimeout?: number
      batchSize?: number
      enableDeadLetterQueue?: boolean
    }) => {
      const response = await fetch('/api/store/events/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update event bus config')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventBusQueryKeys.config() })
    },
  })
}

// Marketplace-specific event helpers
export const marketplaceEvents = {
  // Order events
  orderCreated: (orderId: string, customerId: string, storeId: string) => ({
    eventName: 'order.created',
    data: {
      orderId,
      customerId,
      storeId,
      timestamp: new Date().toISOString(),
    },
  }),

  orderPaid: (orderId: string, amount: number, paymentMethod: string) => ({
    eventName: 'order.paid',
    data: {
      orderId,
      amount,
      paymentMethod,
      timestamp: new Date().toISOString(),
    },
  }),

  orderShipped: (orderId: string, trackingNumber: string, storeId: string) => ({
    eventName: 'order.shipped',
    data: {
      orderId,
      trackingNumber,
      storeId,
      timestamp: new Date().toISOString(),
    },
  }),

  // Product events
  productCreated: (productId: string, storeId: string) => ({
    eventName: 'product.created',
    data: {
      productId,
      storeId,
      timestamp: new Date().toISOString(),
    },
  }),

  productOutOfStock: (productId: string, storeId: string, variantId?: string) => ({
    eventName: 'product.out_of_stock',
    data: {
      productId,
      storeId,
      variantId,
      timestamp: new Date().toISOString(),
    },
  }),

  // Store/vendor events
  storeCreated: (storeId: string, ownerId: string) => ({
    eventName: 'store.created',
    data: {
      storeId,
      ownerId,
      timestamp: new Date().toISOString(),
    },
  }),

  storeApproved: (storeId: string, approvedBy: string) => ({
    eventName: 'store.approved',
    data: {
      storeId,
      approvedBy,
      timestamp: new Date().toISOString(),
    },
  }),

  // Customer events
  customerRegistered: (customerId: string, email: string) => ({
    eventName: 'customer.registered',
    data: {
      customerId,
      email,
      timestamp: new Date().toISOString(),
    },
  }),

  // Payment events
  paymentFailed: (orderId: string, reason: string, amount: number) => ({
    eventName: 'payment.failed',
    data: {
      orderId,
      reason,
      amount,
      timestamp: new Date().toISOString(),
    },
  }),
} as const

// Hook to publish marketplace events easily
export const usePublishMarketplaceEvent = () => {
  const publishEvent = usePublishEvent()
  
  return {
    publishOrderCreated: (orderId: string, customerId: string, storeId: string) =>
      publishEvent.mutateAsync(marketplaceEvents.orderCreated(orderId, customerId, storeId)),
    
    publishOrderPaid: (orderId: string, amount: number, paymentMethod: string) =>
      publishEvent.mutateAsync(marketplaceEvents.orderPaid(orderId, amount, paymentMethod)),
    
    publishOrderShipped: (orderId: string, trackingNumber: string, storeId: string) =>
      publishEvent.mutateAsync(marketplaceEvents.orderShipped(orderId, trackingNumber, storeId)),
    
    publishProductCreated: (productId: string, storeId: string) =>
      publishEvent.mutateAsync(marketplaceEvents.productCreated(productId, storeId)),
    
    publishProductOutOfStock: (productId: string, storeId: string, variantId?: string) =>
      publishEvent.mutateAsync(marketplaceEvents.productOutOfStock(productId, storeId, variantId)),
    
    publishStoreCreated: (storeId: string, ownerId: string) =>
      publishEvent.mutateAsync(marketplaceEvents.storeCreated(storeId, ownerId)),
    
    publishStoreApproved: (storeId: string, approvedBy: string) =>
      publishEvent.mutateAsync(marketplaceEvents.storeApproved(storeId, approvedBy)),
    
    publishCustomerRegistered: (customerId: string, email: string) =>
      publishEvent.mutateAsync(marketplaceEvents.customerRegistered(customerId, email)),
    
    publishPaymentFailed: (orderId: string, reason: string, amount: number) =>
      publishEvent.mutateAsync(marketplaceEvents.paymentFailed(orderId, reason, amount)),
  }
}





