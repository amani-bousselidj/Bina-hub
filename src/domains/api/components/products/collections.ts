// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"

const COLLECTIONS_QUERY_KEY = ["collections"] as const

// Fetch collections
export const useCollections = (query?: any) => {
  return useQuery({
    queryKey: [...COLLECTIONS_QUERY_KEY, query],
    queryFn: async () => {
      const response = await sdk.admin.productCollection.list(query)
      return response
    },
  })
}

// Fetch single collection
export const useCollection = (id: string) => {
  return useQuery({
    queryKey: [...COLLECTIONS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await sdk.admin.productCollection.retrieve(id)
      return response
    },
    enabled: !!id,
  })
}

// Create collection
export const useCreateCollection = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.productCollection.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEY })
    },
  })
}

// Update collection
export const useUpdateCollection = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.productCollection.update(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEY, id] })
    },
  })
}

// Delete collection
export const useDeleteCollection = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.admin.productCollection.delete(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEY })
    },
  })
}

// Add products to collection
export const useUpdateCollectionProducts = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: { product_ids: string[] }) => {
      const response = await sdk.admin.productCollection.updateProducts(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...COLLECTIONS_QUERY_KEY, id] })
    },
  })
}





