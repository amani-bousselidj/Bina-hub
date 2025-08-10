// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { productTypesQueryKeys } from "@/domains/shared/hooks/api/product-types"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const productTypeDetailQuery = (id: string) => ({
  queryKey: productTypesQueryKeys.detail(id),
  queryFn: async () => sdk.admin.productType.retrieve(id),
})

export const productTypeLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = productTypeDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}

