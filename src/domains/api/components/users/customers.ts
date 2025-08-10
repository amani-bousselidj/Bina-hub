// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const customersQueryKeys = {
  all: ["customers"] as const,
  lists: () => [...customersQueryKeys.all, "list"] as const,
  list: (params?: any) => [...customersQueryKeys.lists(), params] as const,
  details: () => [...customersQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...customersQueryKeys.details(), id] as const,
};

export const useCustomers = (params?: any) => {
  return useQuery({
    queryKey: customersQueryKeys.list(params),
    queryFn: () => sdk.admin.customer.list(params),
  });
};

export const useCustomer = (id: string, options?: any) => {
  return useQuery({
    queryKey: customersQueryKeys.detail(id),
    queryFn: () => sdk.admin.customer.retrieve(id),
    ...options,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerData: any) => sdk.admin.customer.create(customerData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.customer.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sdk.admin.customer.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customersQueryKeys.lists() });
    },
  });
};





