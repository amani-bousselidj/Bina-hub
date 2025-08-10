// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"

const CAMPAIGNS_QUERY_KEY = ["campaigns"] as const

// Fetch campaigns
export const useCampaigns = (query?: any) => {
  return useQuery({
    queryKey: [...CAMPAIGNS_QUERY_KEY, query],
    queryFn: async () => {
      const response = await sdk.admin.campaign.list(query)
      return response
    },
  })
}

// Fetch single campaign
export const useCampaign = (id: string) => {
  return useQuery({
    queryKey: [...CAMPAIGNS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await sdk.admin.campaign.retrieve(id)
      return response
    },
    enabled: !!id,
  })
}

// Create campaign
export const useCreateCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.campaign.create(data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY })
    },
  })
}

// Update campaign
export const useUpdateCampaign = (id: string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sdk.admin.campaign.update(id, data)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...CAMPAIGNS_QUERY_KEY, id] })
    },
  })
}

// Delete campaign
export const useDeleteCampaign = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await sdk.admin.campaign.delete(id)
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_QUERY_KEY })
    },
  })
}





