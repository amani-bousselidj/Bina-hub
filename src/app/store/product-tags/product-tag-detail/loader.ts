// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { productTagsQueryKeys } from "@/domains/shared/hooks/api"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const productTagDetailQuery = (id: string) => ({
  queryKey: productTagsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.productTag.retrieve(id),
})

export const productTagLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = productTagDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}

