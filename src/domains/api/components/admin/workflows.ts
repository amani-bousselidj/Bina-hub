// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sdk } from "../../client"
import { HttpTypes } from "@medusajs/types"

export const workflowsQueryKeys = {
  all: ["workflows"] as const,
  lists: () => [...workflowsQueryKeys.all, "list"] as const,
  list: (params?: any) => [...workflowsQueryKeys.lists(), params] as const,
  details: () => [...workflowsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...workflowsQueryKeys.details(), id] as const,
  executions: (id: string) => [...workflowsQueryKeys.detail(id), "executions"] as const,
}

// Use workflow executions which are available in the SDK
export const useWorkflowExecutions = (params?: HttpTypes.AdminGetWorkflowExecutionsParams) => {
  return useQuery({
    queryKey: workflowsQueryKeys.list(params),
    queryFn: () => sdk.admin.workflowExecution.list(params),
  })
}

export const useWorkflowExecution = (id: string) => {
  return useQuery({
    queryKey: workflowsQueryKeys.detail(id),
    queryFn: () => sdk.admin.workflowExecution.retrieve(id),
    enabled: !!id,
  })
}

// Pre-defined workflow types for marketplace
export enum WorkflowType {
  ORDER_APPROVAL = "order-approval",
  PRODUCT_APPROVAL = "product-approval", 
  VENDOR_ONBOARDING = "vendor-onboarding",
  REFUND_PROCESSING = "refund-processing",
  INVENTORY_ADJUSTMENT = "inventory-adjustment",
  PROMOTION_APPROVAL = "promotion-approval",
}

// Helper function to filter workflow executions by type
export const useWorkflowExecutionsByType = (workflowType: WorkflowType) => {
  return useQuery({
    queryKey: ["workflow-executions", "by-type", workflowType],
    queryFn: async () => {
      const executions = await sdk.admin.workflowExecution.list()
      // Filter by workflow type - this would need to be implemented based on your workflow metadata
      return executions.workflow_executions?.filter(execution => 
        execution.workflow_id?.includes(workflowType)
      ) || []
    },
  })
}

// Marketplace-specific workflow execution helpers
export const useOrderApprovalExecutions = () => {
  return useWorkflowExecutionsByType(WorkflowType.ORDER_APPROVAL)
}

export const useProductApprovalExecutions = () => {
  return useWorkflowExecutionsByType(WorkflowType.PRODUCT_APPROVAL)
}

export const useVendorOnboardingExecutions = () => {
  return useWorkflowExecutionsByType(WorkflowType.VENDOR_ONBOARDING)
}





