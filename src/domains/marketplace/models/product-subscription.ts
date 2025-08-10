// @ts-nocheck
import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductSubscription = model
  .define("ProductSubscription", {
    id: model.id({ prefix: "ps" }).primaryKey(),
    product_id: model.text(),
    product: model.belongsTo(() => Product, {
      mappedBy: "subscription_info"
    }),
    interval: model.enum(["day", "week", "month", "year"]),
    interval_count: model.number().default(1),
    trial_period_days: model.number().nullable(),
    min_cycles: model.number().nullable(),
    max_cycles: model.number().nullable(),
    auto_renew: model.boolean().default(true),
    prorate_on_change: model.boolean().default(false),
    cancellation_policy: model.text().nullable(),
    setup_fee: model.number().default(0),
    discount_first_cycle: model.number().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_product_subscription_product_id",
      on: ["product_id"],
      unique: true,
    },
    {
      name: "IDX_product_subscription_interval",
      on: ["interval", "interval_count"],
      unique: false,
    }
  ])

export default ProductSubscription





