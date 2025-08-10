// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ShippingZone = model.define("shipping_zone", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  
  // Geographic Configuration
  countries: model.json(), // Array of country codes
  states: model.json().nullable(), // Array of state/province codes
  zip_codes: model.json().nullable(), // Array of zip code patterns
  
  // Zone Configuration
  is_active: model.boolean().default(true),
  priority: model.number().default(0), // Higher priority zones are checked first
  
  // Shipping Methods in this Zone
  shipping_methods: model.json().nullable(), // Array of available shipping method IDs
  
  // Restrictions
  minimum_order_value: model.number().nullable(),
  maximum_order_value: model.number().nullable(),
  weight_restrictions: model.json().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default ShippingZone





