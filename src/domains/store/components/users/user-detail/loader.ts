// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { productsQueryKeys } from "@/domains/shared/hooks/api/products"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const userDetailQuery = (id: string) => ({
  queryKey: productsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.user.retrieve(id),
})

export const userLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = userDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}




