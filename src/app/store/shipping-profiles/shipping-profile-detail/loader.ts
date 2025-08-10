// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { shippingProfileQueryKeys } from "@/domains/shared/hooks/api/shipping-profiles"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const shippingProfileQuery = (id: string) => ({
  queryKey: shippingProfileQueryKeys.detail(id),
  queryFn: async () => sdk.admin.shippingProfile.retrieve(id),
})

export const shippingProfileLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.shipping_profile_id
  const query = shippingProfileQuery(id!)

  return queryClient.ensureQueryData(query)
}

