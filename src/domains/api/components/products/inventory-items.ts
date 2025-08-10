// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const inventoryItemsQueryKeys = {
  all: ["inventory-items"] as const,
  lists: () => [...inventoryItemsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...inventoryItemsQueryKeys.lists(), params] as const,
};

export const useInventoryItems = (params?: any) => {
  return useQuery({
    queryKey: inventoryItemsQueryKeys.list(params),
    queryFn: () => sdk.admin.inventoryItem.list(params),
    select: (data: any) => ({
      inventory_items: data?.inventory_items || data || [],
      count: data?.count || 0,
      offset: data?.offset || 0,
      limit: data?.limit || 20,
    }),
  });
};

// Placeholder implementations for missing methods
export const useInventoryItem = (id: string, options?: any) => {
  return { data: null, isLoading: false, isError: false, error: null };
};

export const useCreateInventoryItem = () => {
  return { mutateAsync: async () => ({}), isLoading: false };
};

export const useUpdateInventoryItem = () => {
  return { mutateAsync: async () => ({}), isLoading: false };
};

export const useDeleteInventoryItem = () => {
  return { mutateAsync: async () => ({}), isLoading: false };
};

export const useBatchInventoryItemsLocationLevels = () => {
  return { mutateAsync: async () => ({}), isLoading: false };
};





