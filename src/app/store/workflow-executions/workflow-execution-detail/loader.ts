// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { workflowExecutionsQueryKeys } from "@/domains/shared/hooks/api/workflow-executions"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const executionDetailQuery = (id: string) => ({
  queryKey: workflowExecutionsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.workflowExecution.retrieve(id),
})

export const workflowExecutionLoader = async ({
  params,
}: LoaderFunctionArgs) => {
  const id = params.id
  const query = executionDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}

