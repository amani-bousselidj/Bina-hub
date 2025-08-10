// @ts-nocheck
import { LoaderFunctionArgs } from "react-router-dom"
import { reservationItemsQueryKeys } from "@/domains/shared/hooks/api/reservations"
import { sdk } from "@/domains/shared/services/client"
import { queryClient } from "@/domains/shared/services/query-client"

const reservationDetailQuery = (id: string) => ({
  queryKey: reservationItemsQueryKeys.detail(id),
  queryFn: async () => sdk.admin.reservation.retrieve(id),
})

export const reservationItemLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id
  const query = reservationDetailQuery(id!)

  return queryClient.ensureQueryData(query)
}

