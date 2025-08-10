// @ts-nocheck
import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductBundle = model
  .define("ProductBundle", {
    id: model.id({ prefix: "pb" }).primaryKey(),
    bundle_id: model.text(),
    item_id: model.text(),
    bundle: model.belongsTo(() => Product, {
      mappedBy: "bundles"
    }),
    item: model.belongsTo(() => Product),
    quantity: model.number().default(1),
    sort_order: model.number().nullable(),
    required: model.boolean().default(true),
    allow_quantity_change: model.boolean().default(false),
    discount_percentage: model.number().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_product_bundle_bundle_id",
      on: ["bundle_id"],
      unique: false,
    },
    {
      name: "IDX_product_bundle_item_id", 
      on: ["item_id"],
      unique: false,
    }
  ])

export default ProductBundle





