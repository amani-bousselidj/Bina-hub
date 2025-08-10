// @ts-nocheck
import { CurrencyInfo } from "@/domains/shared/services/data/currencies"

export type ConditionalShippingOptionPriceAccessor =
  | `conditional_region_prices.${string}`
  | `conditional_currency_prices.${string}`

export type ConditionalPriceInfo = {
  type: "currency" | "region"
  field: string
  name: string
  currency: CurrencyInfo
}

