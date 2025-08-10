// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"

const SHIPPING_PROFILES_QUERY_KEY = ["shipping-profiles"] as const

// Fetch shipping profiles
export const useShippingProfiles = (query?: any) => {
  return useQuery({
    queryKey: [...SHIPPING_PROFILES_QUERY_KEY, query],
    queryFn: async () => {
      const response = await sdk.admin.shippingProfile.list(query)
      return response
    },
  })
}

// Fetch single shipping profile
export const useShippingProfile = (id: string) => {
  return useQuery({
    queryKey: [...SHIPPING_PROFILES_QUERY_KEY, id],
    queryFn: async () => {
      const response = await sdk.admin.shippingProfile.retrieve(id)
      return response
    },
    enabled: !!id,
  })
}

// Create shipping profile
export const useCreateShippingProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.shippingProfile.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPING_PROFILES_QUERY_KEY })
    },
  })
}

// Update shipping profile
export const useUpdateShippingProfile = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.shippingProfile.update(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPING_PROFILES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...SHIPPING_PROFILES_QUERY_KEY, id] })
    },
  })
}

// Delete shipping profile
export const useDeleteShippingProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.admin.shippingProfile.delete(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPING_PROFILES_QUERY_KEY })
    },
  })
}





