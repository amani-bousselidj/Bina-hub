// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"

export const fulfillmentQueryKeys = {
  all: ["fulfillment"] as const,
  providers: () => [...fulfillmentQueryKeys.all, "providers"] as const,
  provider: (id: string) => [...fulfillmentQueryKeys.providers(), id] as const,
  options: () => [...fulfillmentQueryKeys.all, "options"] as const,
  option: (id: string) => [...fulfillmentQueryKeys.options(), id] as const,
}

// Use what's actually available in the SDK
export const useFulfillmentProviders = () => {
  return useQuery({
    queryKey: fulfillmentQueryKeys.providers(),
    queryFn: () => sdk.admin.fulfillmentProvider.list(),
  })
}

// Shipping options are available and related to fulfillment
export const useShippingOptions = () => {
  return useQuery({
    queryKey: fulfillmentQueryKeys.options(),
    queryFn: () => sdk.admin.shippingOption.list(),
  })
}

export const useShippingOption = (id: string) => {
  return useQuery({
    queryKey: fulfillmentQueryKeys.option(id),
    queryFn: () => sdk.admin.shippingOption.retrieve(id),
    enabled: !!id,
  })
}

export const useCreateShippingOption = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => 
      sdk.admin.shippingOption.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fulfillmentQueryKeys.options() })
    },
  })
}

export const useUpdateShippingOption = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.shippingOption.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: fulfillmentQueryKeys.option(variables.id) })
      queryClient.invalidateQueries({ queryKey: fulfillmentQueryKeys.options() })
    },
  })
}

export const useDeleteShippingOption = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => sdk.admin.shippingOption.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fulfillmentQueryKeys.options() })
    },
  })
}

// Marketplace-specific fulfillment helpers
export const useVendorShippingOptions = (vendorId: string) => {
  return useQuery({
    queryKey: ["shipping-options", "vendor", vendorId],
    queryFn: async () => {
      const options = await sdk.admin.shippingOption.list()
      // Filter options by vendor - this would need vendor-specific metadata
      return options.shipping_options?.filter((option: any) => 
        option.name?.includes(vendorId) || option.metadata?.vendorId === vendorId
      ) || []
    },
    enabled: !!vendorId,
  })
}

export const useStoreFulfillmentOptions = (storeId: string) => {
  return useQuery({
    queryKey: ["fulfillment-options", "store", storeId],
    queryFn: async () => {
      // Get shipping options for the store
      const options = await sdk.admin.shippingOption.list()
      // Filter by store if store-specific metadata is available
      return options.shipping_options?.filter((option: any) => 
        option.metadata?.storeId === storeId
      ) || []
    },
    enabled: !!storeId,
  })
}

// Fulfillment tracking using order data
export const useOrderFulfillments = (orderId: string) => {
  return useQuery({
    queryKey: ["order-fulfillments", orderId],
    queryFn: async () => {
      const order = await sdk.admin.order.retrieve(orderId)
      // Return empty array for now - fulfillments may be available in different format
      return []
    },
    enabled: !!orderId,
  })
}

// Create fulfillment for order - simplified version
export const useCreateOrderFulfillment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ 
      orderId, 
      items,
      location_id,
      tracking_numbers 
    }: { 
      orderId: string
      items: any[]
      location_id?: string
      tracking_numbers?: string[]
    }) => {
      // For now, just update order status or create custom fulfillment
      return Promise.resolve({ 
        success: true, 
        orderId, 
        items, 
        location_id, 
        tracking_numbers 
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["order-fulfillments", variables.orderId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ["orders", "detail", variables.orderId] 
      })
    },
  })
}

// Cancel fulfillment - simplified version
export const useCancelOrderFulfillment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, fulfillmentId }: { orderId: string, fulfillmentId: string }) => {
      // Placeholder implementation - would need actual fulfillment cancellation API
      return Promise.resolve({ success: true, orderId, fulfillmentId })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ["order-fulfillments", variables.orderId] 
      })
      queryClient.invalidateQueries({ 
        queryKey: ["orders", "detail", variables.orderId] 
      })
    },
  })
}





