// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { apiKeysQueryKeys } from "@/domains/shared/hooks/api/api-keys"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const apiKeyDetailQuery = (id: string) => ({
  queryKey: apiKeysQueryKeys.detail(id),
  queryFn: async () => sdk.admin.apiKey.retrieve(id),
})

export const apiKeyLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = apiKeyDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}




