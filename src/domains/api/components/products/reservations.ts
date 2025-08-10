// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const reservationsQueryKeys = {
  all: ["reservations"] as const,
  lists: () => [...reservationsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...reservationsQueryKeys.lists(), params] as const,
  details: () => [...reservationsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...reservationsQueryKeys.details(), id] as const,
};

export const useReservations = (params?: any) => {
  return useQuery({
    queryKey: reservationsQueryKeys.list(params),
    queryFn: () => sdk.admin.reservation.list(params),
  });
};

export const useReservation = (id: string, options?: any) => {
  return useQuery({
    queryKey: reservationsQueryKeys.detail(id),
    queryFn: () => sdk.admin.reservation.retrieve(id),
    ...options,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationData: any) => sdk.admin.reservation.create(reservationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.lists() });
    },
  });
};

export const useCreateReservationItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationData: any) => sdk.admin.reservation.create(reservationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.lists() });
    },
  });
};

export const useUpdateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.reservation.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.lists() });
    },
  });
};

export const useDeleteReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sdk.admin.reservation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.lists() });
    },
  });
};

export const useCreateReservationItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reservationItemData: any) => sdk.admin.reservation.create(reservationItemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationsQueryKeys.lists() });
    },
  });
};





