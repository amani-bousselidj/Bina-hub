// @ts-nocheck
import { queryKeysFactory } from "@/domains/shared/services/query-key-factory"
import { sdk } from "@/domains/shared/services/client"
import { useQuery, useMutation } from "@tanstack/react-query"
import { queryClient } from "@/domains/shared/services/query-client"

const RETURN_REASONS_QUERY_KEY = "return_reasons" as const
export const returnReasonsQueryKeys = queryKeysFactory(RETURN_REASONS_QUERY_KEY)

export const useReturnReasons = (query?: any, options?: any) => {
  return useQuery({
    queryKey: returnReasonsQueryKeys.list(query),
    queryFn: async () => {
      const data = await sdk.admin.returnReason?.list(query) || { return_reasons: [] }
      return data
    },
    ...options,
  })
}

export const useReturnReason = (id: string, query?: any, options?: any) => {
  return useQuery({
    queryKey: returnReasonsQueryKeys.detail(id, query),
    queryFn: async () => {
      const data = await sdk.admin.returnReason?.retrieve(id, query) || { return_reason: {} }
      return data
    },
    enabled: !!id,
    ...options,
  })
}

export const useCreateReturnReason = (options?: any) => {
  return useMutation({
    mutationFn: async (data: any) => {
      return sdk.admin.returnReason?.create(data) || { return_reason: data }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: returnReasonsQueryKeys.list() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useUpdateReturnReason = (id: string, options?: any) => {
  return useMutation({
    mutationFn: async (data: any) => {
      return sdk.admin.returnReason?.update(id, data) || { return_reason: { ...data, id } }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: returnReasonsQueryKeys.list() })
      queryClient.invalidateQueries({ queryKey: returnReasonsQueryKeys.detail(id) })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

export const useDeleteReturnReason = (id: string, options?: any) => {
  return useMutation({
    mutationFn: async () => {
      return sdk.admin.returnReason?.delete(id) || { deleted: true, id }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: returnReasonsQueryKeys.list() })
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}





