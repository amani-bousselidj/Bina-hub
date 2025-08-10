// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ShippingCarrier = model.define("shipping_carrier", {
  id: model.id().primaryKey(),
  name: model.text(),
  code: model.text().unique(), // E.g., "fedex", "ups", "dhl", "usps"
  
  // API Configuration
  api_endpoint: model.text().nullable(),
  api_key: model.text().nullable(),
  api_secret: model.text().nullable(),
  account_number: model.text().nullable(),
  
  // Carrier Settings
  is_active: model.boolean().default(true),
  supports_tracking: model.boolean().default(false),
  supports_real_time_rates: model.boolean().default(false),
  supports_label_printing: model.boolean().default(false),
  
  // Service Configuration
  available_services: model.json().nullable(), // Array of service types
  service_mapping: model.json().nullable(), // Map internal names to carrier service codes
  
  // Default Settings
  default_package_type: model.text().nullable(),
  default_weight_unit: model.enum(["lb", "kg", "oz", "g"]).default("lb"),
  default_dimension_unit: model.enum(["in", "cm", "ft", "m"]).default("in"),
  
  // Rate Calculation
  markup_type: model.enum(["percentage", "fixed", "none"]).default("none"),
  markup_value: model.number().default(0),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default ShippingCarrier





