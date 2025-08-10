// @ts-nocheck
import {
  AdminReturnReasonListParams,
  AdminReturnReasonListResponse,
} from "@medusajs/types"

import { returnReasonsQueryKeys } from "@/domains/shared/hooks/api/return-reasons"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const returnReasonListQuery = (query?: AdminReturnReasonListParams) => ({
  queryKey: returnReasonsQueryKeys.list(query),
  queryFn: async () => sdk.admin.returnReason.list(query),
})

export const returnReasonListLoader = async () => {
  const query = returnReasonListQuery()
  return (
    queryClient.getQueryData<AdminReturnReasonListResponse>(query.queryKey) ??
    (await queryClient.fetchQuery(query))
  )
}

