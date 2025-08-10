// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { collectionsQueryKeys } from "@/domains/shared/hooks/api/collections"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const collectionDetailQuery = (id: string) => ({
  queryKey: collectionsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.productCollection.retrieve(id),
})

export const collectionLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = collectionDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}




