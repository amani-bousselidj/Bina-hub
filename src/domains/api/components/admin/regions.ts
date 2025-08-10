// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "@/domains/shared/services/client"
import { queryKeysFactory } from "@/domains/shared/services/query-key-factory"

export const regionsQueryKeys = queryKeysFactory("regions")

export const useRegions = (query?: any, options?: any) => {
  return useQuery({
    queryKey: regionsQueryKeys.list(query),
    queryFn: () => sdk.admin.region.list(query),
    ...options,
  })
}

export const useRegion = (id: string, options?: any) => {
  return useQuery({
    queryKey: regionsQueryKeys.detail(id),
    queryFn: () => sdk.admin.region.retrieve(id),
    enabled: !!id,
    ...options,
  })
}

export const useCreateRegion = (options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (regionData: any) => sdk.admin.region.create(regionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.list() })
    },
    ...options,
  })
}

export const useUpdateRegion = (id: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (regionData: any) => sdk.admin.region.update(id, regionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.detail(id) })
    },
    ...options,
  })
}

export const useDeleteRegion = (id: string, options?: any) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => sdk.admin.region.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionsQueryKeys.list() })
    },
    ...options,
  })
}





