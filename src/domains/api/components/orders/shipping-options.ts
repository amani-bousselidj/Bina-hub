// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const shippingOptionsQueryKeys = {
  all: ["shipping-options"] as const,
  lists: () => [...shippingOptionsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...shippingOptionsQueryKeys.lists(), params] as const,
  details: () => [...shippingOptionsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...shippingOptionsQueryKeys.details(), id] as const,
};

export const useShippingOptions = (params?: any) => {
  return useQuery({
    queryKey: shippingOptionsQueryKeys.list(params),
    queryFn: () => sdk.admin.shippingOption.list(params),
    select: (data: any) => ({
      shipping_options: data?.shipping_options || data || [],
      count: data?.count || 0,
      offset: data?.offset || 0,
      limit: data?.limit || 20,
    }),
  });
};

export const useShippingOption = (id: string, options?: any) => {
  return useQuery({
    queryKey: shippingOptionsQueryKeys.detail(id),
    queryFn: () => sdk.admin.shippingOption.retrieve(id),
    ...options,
  });
};

export const useCreateShippingOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (shippingOptionData: any) => sdk.admin.shippingOption.create(shippingOptionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingOptionsQueryKeys.lists() });
    },
  });
};

export const useUpdateShippingOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.shippingOption.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shippingOptionsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: shippingOptionsQueryKeys.lists() });
    },
  });
};

export const useDeleteShippingOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sdk.admin.shippingOption.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shippingOptionsQueryKeys.lists() });
    },
  });
};





