// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const orderEditsQueryKeys = {
  all: ["order-edits"] as const,
  lists: () => [...orderEditsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...orderEditsQueryKeys.lists(), params] as const,
  details: () => [...orderEditsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...orderEditsQueryKeys.details(), id] as const,
};

export const useOrderEdits = (params?: any) => {
  return useQuery({
    queryKey: orderEditsQueryKeys.list(params),
    queryFn: () => Promise.resolve({ order_edits: [], count: 0, offset: 0, limit: 20 }), // placeholder
  });
};

export const useOrderEdit = (id: string, options?: any) => {
  return useQuery({
    queryKey: orderEditsQueryKeys.detail(id),
    queryFn: () => Promise.resolve({ order_edit: null }), // placeholder
    ...options,
  });
};

export const useCreateOrderEdit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderEditData: any) => Promise.resolve({ order_edit: orderEditData }), // placeholder
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderEditsQueryKeys.lists() });
    },
  });
};

export const useUpdateOrderEdit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      Promise.resolve({ order_edit: { id, ...data } }), // placeholder
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderEditsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: orderEditsQueryKeys.lists() });
    },
  });
};

export const useDeleteOrderEdit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve({ success: true }), // placeholder
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderEditsQueryKeys.lists() });
    },
  });
};

export const useCancelOrderEdit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve({ success: true }), // placeholder
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderEditsQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderEditsQueryKeys.lists() });
    },
  });
};





