// @ts-nocheck
import { model } from "@medusajs/utils"

/**
 * Amazon DSP-style audience targeting model for advanced advertising
 */
export const AdAudience = model.define("AdAudience", {
  id: model.id({ prefix: "adaud" }).primaryKey(),
  
  // Basic Information
  name: model.text(),
  description: model.text().nullable(),
  audience_type: model.enum([
    "custom",           // Custom audience based on specific criteria
    "lookalike",        // Lookalike audience based on existing customers
    "retargeting",      // Retargeting audience (website visitors, app users)
    "interest",         // Interest-based audience
    "demographic",      // Demographic-based audience
    "behavioral",       // Behavioral audience
    "geographic",       // Geographic audience
    "device",          // Device-based audience
    "amazon_audience"   // Amazon's predefined audiences
  ]),
  
  // Audience Configuration
  audience_criteria: model.json(), // Detailed audience targeting criteria
  size_estimate: model.bigNumber().nullable(), // Estimated audience size
  
  // Amazon-style Audience Sources
  data_source: model.enum([
    "website_visitors",     // Website pixel data
    "app_users",           // Mobile app users
    "customer_list",       // Uploaded customer emails/IDs
    "purchase_behavior",   // Purchase behavior on platform
    "product_viewers",     // Product detail page viewers
    "cart_abandoners",     // Shopping cart abandoners
    "amazon_shoppers",     // Amazon's shopper audiences
    "lifestyle_interests", // Amazon's lifestyle interest audiences
    "life_events"         // Life event-based audiences
  ]).nullable(),
  
  // Retargeting Settings
  lookback_window: model.integer().nullable(), // Days to look back for audience building
  frequency_cap: model.integer().nullable(), // Maximum impressions per user
  frequency_period: model.enum(["daily", "weekly", "monthly"]).nullable(),
  
  // Geographic Targeting
  geographic_criteria: model.json().nullable(), // Countries, regions, cities, postal codes
  radius_targeting: model.json().nullable(), // Latitude, longitude, radius for local targeting
  
  // Demographic Targeting
  age_range_min: model.integer().nullable(),
  age_range_max: model.integer().nullable(),
  gender: model.enum(["male", "female", "all"]).nullable(),
  household_income: model.enum(["low", "medium", "high", "all"]).nullable(),
  parental_status: model.enum(["parent", "non_parent", "all"]).nullable(),
  
  // Interest & Behavioral Targeting
  interests: model.json().nullable(), // Array of interest categories
  shopping_behaviors: model.json().nullable(), // Shopping behavior patterns
  brand_affinities: model.json().nullable(), // Brand preference data
  
  // Device & Platform Targeting
  device_types: model.json().nullable(), // desktop, mobile, tablet, connected_tv
  operating_systems: model.json().nullable(), // iOS, Android, Windows, etc.
  browsers: model.json().nullable(), // Chrome, Safari, Firefox, etc.
  
  // Amazon-specific Targeting
  amazon_shopping_segments: model.json().nullable(), // Amazon's shopping behavior segments
  prime_membership_status: model.enum(["prime", "non_prime", "all"]).nullable(),
  
  // Performance & Status
  status: model.enum(["active", "paused", "building", "ready", "expired"]).default("building"),
  last_updated_count: model.bigNumber().nullable(), // Last known audience size
  update_frequency: model.enum(["daily", "weekly", "monthly"]).default("daily"),
  
  // Campaign Associations
  campaigns_using: model.json().nullable(), // Array of campaign IDs using this audience
  
  // Privacy & Compliance
  data_retention_days: model.integer().default(180),
  gdpr_compliant: model.boolean().default(true),
  ccpa_compliant: model.boolean().default(true),
  
  // Store Association
  store_id: model.text(),
  seller_id: model.text(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
  deleted_at: model.dateTime().nullable(),
})

export default AdAudience





