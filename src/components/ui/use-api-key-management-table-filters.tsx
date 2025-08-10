// @ts-nocheck
import { createDataTableFilterHelper } from "@medusajs/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDataTableDateFilters } from "../../../data-table/helpers/general/use-data-table-date-filters"

const filterHelper = createDataTableFilterHelper<any>()

export const useApiKeyManagementTableFilters = () => {
  const { t } = useTranslation()
  const dateFilters = useDataTableDateFilters()

  return useMemo(
    () => [
      filterHelper.accessor("type", {
        label: t("fields.type"),
        type: "radio",
        options: [
          {
            label: t("general.all"),
            value: "",
          },
          {
            label: "Publishable",
            value: "publishable",
          },
          {
            label: "Secret", 
            value: "secret",
          },
        ],
      }),
      ...dateFilters,
    ],
    [t, dateFilters]
  )
}




