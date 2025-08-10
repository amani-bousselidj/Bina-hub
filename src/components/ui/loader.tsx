// @ts-nocheck
import { QueryClient } from "@tanstack/react-query"

import { HttpTypes } from "@medusajs/types"
import { productsQueryKeys } from "@/domains/shared/hooks/api/products"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const productsListQuery = () => ({
  queryKey: productsQueryKeys.list({
    limit: 20,
    offset: 0,
    is_giftcard: false,
  }),
  queryFn: async () =>
    sdk.admin.product.list({ limit: 20, offset: 0, is_giftcard: false }),
})

export const productsLoader = (client: QueryClient) => {
  return async () => {
    const query = productsListQuery()

    return (
      queryClient.getQueryData<HttpTypes.AdminProductListResponse>(
        query.queryKey
      ) ?? (await client.fetchQuery(query))
    )
  }
}




