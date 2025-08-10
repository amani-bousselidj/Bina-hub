// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const stockLocationsQueryKeys = {
  all: ["stock-locations"] as const,
  lists: () => [...stockLocationsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...stockLocationsQueryKeys.lists(), params] as const,
  details: () => [...stockLocationsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...stockLocationsQueryKeys.details(), id] as const,
};

export const useStockLocations = (params?: any) => {
  return useQuery({
    queryKey: stockLocationsQueryKeys.list(params),
    queryFn: () => sdk.admin.stockLocation.list(params),
    select: (data: any) => ({
      stock_locations: data?.stock_locations || data || [],
      count: data?.count || 0,
      offset: data?.offset || 0,
      limit: data?.limit || 20,
    }),
  });
};

export const useStockLocation = (id: string, options?: any) => {
  return useQuery({
    queryKey: stockLocationsQueryKeys.detail(id),
    queryFn: () => sdk.admin.stockLocation.retrieve(id),
    ...options,
  });
};

export const useCreateStockLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stockLocationData: any) => sdk.admin.stockLocation.create(stockLocationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockLocationsQueryKeys.lists() });
    },
  });
};

export const useUpdateStockLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.stockLocation.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: stockLocationsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: stockLocationsQueryKeys.lists() });
    },
  });
};

export const useDeleteStockLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sdk.admin.stockLocation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stockLocationsQueryKeys.lists() });
    },
  });
};





