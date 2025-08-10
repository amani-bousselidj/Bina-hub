// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const pluginsQueryKeys = {
  all: ["plugins"] as const,
  lists: () => [...pluginsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...pluginsQueryKeys.lists(), params] as const,
  details: () => [...pluginsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...pluginsQueryKeys.details(), id] as const,
};

export const usePlugins = (params?: any) => {
  return useQuery({
    queryKey: pluginsQueryKeys.list(params),
    queryFn: () => Promise.resolve({ plugins: [], count: 0, offset: 0, limit: 20 }), // placeholder
  });
};

export const usePlugin = (id: string, options?: any) => {
  return useQuery({
    queryKey: pluginsQueryKeys.detail(id),
    queryFn: () => Promise.resolve({ plugin: null }), // placeholder
    ...options,
  });
};

export const useInstallPlugin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => Promise.resolve({ plugin: data }), // placeholder
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pluginsQueryKeys.lists() });
    },
  });
};

export const useUpdatePlugin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      Promise.resolve({ plugin: { id, ...data } }), // placeholder
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pluginsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: pluginsQueryKeys.lists() });
    },
  });
};

export const useUninstallPlugin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Promise.resolve({ success: true }), // placeholder
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pluginsQueryKeys.lists() });
    },
  });
};





