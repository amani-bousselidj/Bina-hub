// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"
import { taxRegionsQueryKeys } from "@/domains/shared/hooks/api/tax-regions"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const taxRegionDetailQuery = (id: string) => ({
  queryKey: taxRegionsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.taxRegion.retrieve(id),
})

export const taxRegionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.province_id
  const query = taxRegionDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}




