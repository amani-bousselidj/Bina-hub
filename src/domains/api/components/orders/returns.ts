// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const returnsQueryKeys = {
  all: ["returns"] as const,
  lists: () => [...returnsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...returnsQueryKeys.lists(), params] as const,
  details: () => [...returnsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...returnsQueryKeys.details(), id] as const,
};

export const useReturns = (params?: any) => {
  return useQuery({
    queryKey: returnsQueryKeys.list(params),
    queryFn: () => sdk.admin.return.list(params),
  });
};

export const useReturn = (id: string, options?: any) => {
  return useQuery({
    queryKey: returnsQueryKeys.detail(id),
    queryFn: () => sdk.admin.return.retrieve(id),
    select: (data: any) => {
      const return_data = data?.return || data;
      return {
        return: return_data,
        ...data,
      };
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (returnData: any) => sdk.admin.return.create(returnData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: returnsQueryKeys.lists() });
    },
  });
};

export const useUpdateReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.return.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: returnsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: returnsQueryKeys.lists() });
    },
  });
};

export const useDeleteReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sdk.admin.return.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: returnsQueryKeys.lists() });
    },
  });
};

export const useCancelReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sdk.admin.return.update(id, { status: 'cancelled' }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: returnsQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: returnsQueryKeys.lists() });
    },
  });
};

export const useReceiveReturn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.return.update(id, { status: 'received', ...data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: returnsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: returnsQueryKeys.lists() });
    },
  });
};





