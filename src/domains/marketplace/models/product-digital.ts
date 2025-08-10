// @ts-nocheck
import { model } from "@medusajs/framework/utils"
import Product from "./product"

const ProductDigital = model
  .define("ProductDigital", {
    id: model.id({ prefix: "pd" }).primaryKey(),
    product_id: model.text(),
    product: model.belongsTo(() => Product, {
      mappedBy: "digital_info"
    }),
    file_url: model.text().nullable(),
    file_name: model.text().nullable(),
    file_size: model.number().nullable(),
    file_type: model.text().nullable(),
    download_limit: model.number().nullable(),
    download_count: model.number().default(0),
    expires_at: model.dateTime().nullable(),
    license_key: model.text().nullable(),
    activation_required: model.boolean().default(false),
    instructions: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_product_digital_product_id",
      on: ["product_id"],
      unique: true,
    },
    {
      name: "IDX_product_digital_license_key",
      on: ["license_key"],
      unique: true,
      where: "license_key IS NOT NULL",
    }
  ])

export default ProductDigital





