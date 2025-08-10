// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ShippingLabel = model.define("shipping_label", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  fulfillment_id: model.text().nullable(),
  shipping_carrier_id: model.text(),
  
  // Label Information
  tracking_number: model.text().unique(),
  label_url: model.text().nullable(), // URL to download label PDF
  label_format: model.enum(["pdf", "zpl", "png"]).default("pdf"),
  
  // Shipping Details
  service_type: model.text(), // E.g., "ground", "express", "overnight"
  package_type: model.text().nullable(),
  
  // Package Dimensions
  weight: model.number(),
  weight_unit: model.enum(["lb", "kg", "oz", "g"]).default("lb"),
  length: model.number().nullable(),
  width: model.number().nullable(),
  height: model.number().nullable(),
  dimension_unit: model.enum(["in", "cm", "ft", "m"]).default("in"),
  
  // Addresses
  from_address: model.json(),
  to_address: model.json(),
  
  // Cost Information
  shipping_cost: model.number(),
  insurance_cost: model.number().nullable(),
  total_cost: model.number(),
  
  // Status and Tracking
  status: model.enum(["created", "shipped", "in_transit", "delivered", "exception", "cancelled"]).default("created"),
  estimated_delivery_date: model.dateTime().nullable(),
  actual_delivery_date: model.dateTime().nullable(),
  
  // Label Creation
  created_at_carrier: model.dateTime().nullable(),
  label_created_by: model.text().nullable(), // User ID who created the label
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
ShippingLabel.belongsTo(() => import("../../order/models/order").then(m => m.default), {
  foreignKey: "order_id"
})

ShippingLabel.belongsTo(() => import("./shipping-carrier").then(m => m.default), {
  foreignKey: "shipping_carrier_id"
})

export default ShippingLabel





