// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const MultiStore = model.define("multi_store", {
  id: model.id().primaryKey(),
  
  // Store Identity
  name: model.text(),
  code: model.text().unique(), // URL-safe store identifier
  description: model.text().nullable(),
  
  // Store Configuration
  domain: model.text().unique(),
  subdomain: model.text().nullable(),
  is_primary: model.boolean().default(false),
  
  // Localization
  default_language: model.text().default("en"),
  supported_languages: model.json().default(["en"]),
  default_currency: model.text().default("USD"),
  supported_currencies: model.json().default(["USD"]),
  timezone: model.text().default("UTC"),
  
  // Store Settings
  is_active: model.boolean().default(true),
  is_public: model.boolean().default(true),
  requires_login: model.boolean().default(false),
  
  // Theme and Branding
  theme_id: model.text().nullable(),
  logo_url: model.text().nullable(),
  favicon_url: model.text().nullable(),
  brand_colors: model.json().nullable(),
  
  // SEO Settings
  meta_title: model.text().nullable(),
  meta_description: model.text().nullable(),
  meta_keywords: model.text().nullable(),
  
  // Store Hierarchy
  parent_store_id: model.text().nullable(),
  store_level: model.number().default(0),
  
  // Contact Information
  contact_email: model.text().nullable(),
  contact_phone: model.text().nullable(),
  address: model.json().nullable(),
  
  // Business Settings
  tax_settings: model.json().nullable(),
  shipping_settings: model.json().nullable(),
  payment_settings: model.json().nullable(),
  
  // Analytics
  analytics_code: model.text().nullable(),
  tracking_codes: model.json().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Self-referencing relationship for store hierarchy
MultiStore.belongsTo(() => MultiStore, {
  foreignKey: "parent_store_id"
})

MultiStore.hasMany(() => MultiStore, {
  foreignKey: "parent_store_id"
})

export default MultiStore





