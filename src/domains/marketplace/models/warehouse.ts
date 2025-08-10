// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const Warehouse = model
  .define("Warehouse", {
    id: model.id({ prefix: "wh" }).primaryKey(),
    name: model.text(),
    code: model.text(),
    address: model.text().nullable(),
    city: model.text().nullable(),
    region: model.text().nullable(),
    postal_code: model.text().nullable(),
    country_code: model.text().default("SA"),
    contact_person: model.text().nullable(),
    contact_phone: model.text().nullable(),
    contact_email: model.text().nullable(),
    is_active: model.boolean().default(true),
    is_default: model.boolean().default(false),
    warehouse_type: model.enum(["main", "distribution", "returns", "dropship"]).default("main"),
    capacity: model.number().nullable(),
    current_utilization: model.number().default(0),
    operating_hours: model.json().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_warehouse_code_unique",
      on: ["code"],
      unique: true,
    },
    {
      name: "IDX_warehouse_is_default",
      on: ["is_default"],
      unique: false,
    }
  ])

export default Warehouse





