// @ts-nocheck
import { model } from "@medusajs/utils"

/**
 * Amazon PPC-inspired advertising campaign model
 * Supports Sponsored Products, Sponsored Brands, Sponsored Display campaigns
 */
export const AdCampaign = model.define("AdCampaign", {
  id: model.id({ prefix: "adcamp" }).primaryKey(),
  
  // Basic Campaign Information
  name: model.text(),
  description: model.text().nullable(),
  status: model.enum(["active", "paused", "ended", "pending", "archived"]).default("pending"),
  
  // Campaign Type (Amazon-style)
  campaign_type: model.enum([
    "sponsored_products",     // Amazon Sponsored Products
    "sponsored_brands",       // Amazon Sponsored Brands
    "sponsored_display",      // Amazon Sponsored Display
    "video_ads",             // Amazon Sponsored Brands Video
    "dsp_display",           // Amazon DSP Display
    "audio_ads"              // Amazon Audio Ads
  ]),
  
  // Targeting & Strategy
  targeting_type: model.enum(["automatic", "manual", "product_targeting", "keyword_targeting"]).default("automatic"),
  bidding_strategy: model.enum(["dynamic_bids_down_only", "dynamic_bids_up_down", "fixed_bids"]).default("dynamic_bids_down_only"),
  
  // Budget & Bidding
  daily_budget: model.bigNumber(), // Daily budget in cents
  total_budget: model.bigNumber().nullable(), // Optional total budget limit
  default_bid: model.bigNumber().nullable(), // Default bid amount in cents
  
  // Scheduling
  start_date: model.dateTime(),
  end_date: model.dateTime().nullable(),
  
  // Portfolio Association (Amazon Portfolio concept)
  portfolio_id: model.text().nullable(),
  portfolio_name: model.text().nullable(),
  
  // Advanced Settings
  ad_group_default_bid: model.bigNumber().nullable(),
  placement_bidding: model.json().nullable(), // Placement-specific bid adjustments
  
  // Performance Metrics (calculated fields)
  impressions: model.bigNumber().default(0),
  clicks: model.bigNumber().default(0),
  spend: model.bigNumber().default(0),
  sales: model.bigNumber().default(0),
  orders: model.bigNumber().default(0),
  
  // Calculated Performance Metrics
  ctr: model.float().nullable(), // Click-through rate
  cpc: model.bigNumber().nullable(), // Cost per click
  acos: model.float().nullable(), // Advertising Cost of Sales
  roas: model.float().nullable(), // Return on Ad Spend
  
  // Amazon-style settings
  negative_exact_match_enabled: model.boolean().default(false),
  negative_phrase_match_enabled: model.boolean().default(false),
  
  // Store Association
  store_id: model.text(),
  seller_id: model.text(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
  deleted_at: model.dateTime().nullable(),
})

export default AdCampaign





