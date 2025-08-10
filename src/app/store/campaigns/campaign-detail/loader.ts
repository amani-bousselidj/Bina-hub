// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"

import { campaignsQueryKeys } from "@/domains/shared/hooks/api/campaigns"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"
import { CAMPAIGN_DETAIL_FIELDS } from "./constants"

const campaignDetailQuery = (id: string) => ({
  queryKey: campaignsQueryKeys.detail(id),
  queryFn: async () =>
    sdk.admin.campaign.retrieve(id, {
      fields: CAMPAIGN_DETAIL_FIELDS,
    }),
})

export const campaignLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = campaignDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}

