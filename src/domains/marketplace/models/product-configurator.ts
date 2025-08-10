// @ts-nocheck
import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductConfigurator = model
  .define("ProductConfigurator", {
    id: model.id({ prefix: "pc" }).primaryKey(),
    product_id: model.text(),
    product: model.belongsTo(() => Product, {
      mappedBy: "configurators"
    }),
    type: model.enum(["color", "size", "material", "custom", "text", "file_upload"]),
    name: model.text(),
    label: model.text(),
    description: model.text().nullable(),
    required: model.boolean().default(false),
    sort_order: model.number().default(0),
    price_modifier: model.number().default(0),
    price_type: model.enum(["fixed", "percentage"]).default("fixed"),
    min_value: model.number().nullable(),
    max_value: model.number().nullable(),
    allowed_values: model.json().nullable(), // For dropdown/select options
    validation_rules: model.json().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_product_configurator_product_id",
      on: ["product_id"],
      unique: false,
    },
    {
      name: "IDX_product_configurator_type",
      on: ["type"],
      unique: false,
    }
  ])

export default ProductConfigurator





