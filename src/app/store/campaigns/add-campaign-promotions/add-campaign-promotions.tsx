// @ts-nocheck
import { useParams } from "react-router-dom"
import { RouteFocusModal } from "@/components/modals"
import { useCampaign } from "@/domains/shared/hooks/api/campaigns"
import { AddCampaignPromotionsForm } from "./components"

export const AddCampaignPromotions = () => {
  const { id } = useParams()
  const { campaign, isError, error } = useCampaign(id!)

  if (isError) {
    throw error
  }

  return (
    <RouteFocusModal>
      {campaign && <AddCampaignPromotionsForm campaign={campaign} />}
    </RouteFocusModal>
  )
}

