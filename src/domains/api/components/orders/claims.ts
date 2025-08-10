// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "@/domains/shared/services/client";

export const claimsQueryKeys = {
  all: ["claims"] as const,
  lists: () => [...claimsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...claimsQueryKeys.lists(), params] as const,
  details: () => [...claimsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...claimsQueryKeys.details(), id] as const,
};

export const useClaims = (params?: any) => {
  return useQuery({
    queryKey: claimsQueryKeys.list(params),
    queryFn: () => sdk.admin.claim.list(params),
  });
};

export const useClaim = (id: string, options?: any) => {
  return useQuery({
    queryKey: claimsQueryKeys.detail(id),
    queryFn: () => sdk.admin.claim.retrieve(id),
    select: (data: any) => {
      const claim = data?.claim || data;
      return {
        claim,
        ...data,
      };
    },
    enabled: !!id,
    ...options,
  });
};

export const useCreateClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (claimData: any) => sdk.admin.claim.create(claimData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.lists() });
    },
  });
};

export const useUpdateClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & any) => 
      sdk.admin.claim.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.lists() });
    },
  });
};

export const useDeleteClaim = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sdk.admin.claim.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.lists() });
    },
  });
};

// Additional claim-related hooks
export const useAddClaimInboundItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, items }: { id: string; items: any[] }) => 
      Promise.resolve({ success: true }), // placeholder implementation
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(variables.id) });
    },
  });
};

export const useAddClaimInboundShipping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...shippingData }: { id: string } & any) => 
      Promise.resolve({ success: true }), // placeholder implementation
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(variables.id) });
    },
  });
};

export const useCancelClaimRequest = (claimId?: string, orderId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sdk.admin.claim.update(claimId!, { status: 'cancelled' }),
    onSuccess: () => {
      if (claimId) {
        queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(claimId) });
      }
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.lists() });
    },
  });
};

export const useClaimConfirmRequest = (claimId?: string, orderId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sdk.admin.claim.update(claimId!, { status: 'confirmed' }),
    onSuccess: () => {
      if (claimId) {
        queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(claimId) });
      }
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.lists() });
    },
  });
};

export const useDeleteClaimInboundShipping = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, shippingId }: { id: string; shippingId: string }) => 
      Promise.resolve({ success: true }), // placeholder implementation
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: claimsQueryKeys.lists() });
    },
  });
};

// Missing hooks referenced in components
export const useRemoveClaimInboundItem = (claimId?: string, itemId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => 
      Promise.resolve({ success: true }), // placeholder implementation
    onSuccess: () => {
      if (claimId) {
        queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(claimId) });
      }
    },
  });
};

export const useUpdateClaimInboundItem = (claimId?: string, itemId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: any) => 
      Promise.resolve({ success: true }), // placeholder implementation
    onSuccess: () => {
      if (claimId) {
        queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(claimId) });
      }
    },
  });
};

export const useUpdateClaimInboundShipping = (claimId?: string, shippingId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: any) => 
      Promise.resolve({ success: true }), // placeholder implementation
    onSuccess: () => {
      if (claimId) {
        queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(claimId) });
      }
    },
  });
};

export const useUpdateClaimOutboundShipping = (claimId?: string, shippingId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: any) => 
      Promise.resolve({ success: true }), // placeholder implementation
    onSuccess: () => {
      if (claimId) {
        queryClient.invalidateQueries({ queryKey: claimsQueryKeys.detail(claimId) });
      }
    },
  });
};

// Aliases for consistency
export const useCancelClaim = useCancelClaimRequest;





