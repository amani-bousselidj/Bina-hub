// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"

const CUSTOMER_GROUPS_QUERY_KEY = ["customer-groups"] as const

// Fetch customer groups
export const useCustomerGroups = (query?: any) => {
  return useQuery({
    queryKey: [...CUSTOMER_GROUPS_QUERY_KEY, query],
    queryFn: async () => {
      const response = await sdk.admin.customerGroup.list(query)
      return response
    },
  })
}

// Fetch single customer group
export const useCustomerGroup = (id: string) => {
  return useQuery({
    queryKey: [...CUSTOMER_GROUPS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await sdk.admin.customerGroup.retrieve(id)
      return response
    },
    enabled: !!id,
  })
}

// Create customer group
export const useCreateCustomerGroup = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.customerGroup.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_GROUPS_QUERY_KEY })
    },
  })
}

// Update customer group
export const useUpdateCustomerGroup = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.customerGroup.update(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_GROUPS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...CUSTOMER_GROUPS_QUERY_KEY, id] })
    },
  })
}

// Delete customer group
export const useDeleteCustomerGroup = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.admin.customerGroup.delete(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_GROUPS_QUERY_KEY })
    },
  })
}

// Add customers to group
export const useAddCustomersToGroup = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { customer_ids: string[] }) => {
      const response = await sdk.admin.customerGroup.addCustomers(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_GROUPS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...CUSTOMER_GROUPS_QUERY_KEY, id] })
    },
  })
}

// Remove customers from group
export const useRemoveCustomersFromGroup = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { customer_ids: string[] }) => {
      const response = await sdk.admin.customerGroup.removeCustomers(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_GROUPS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...CUSTOMER_GROUPS_QUERY_KEY, id] })
    },
  })
}





