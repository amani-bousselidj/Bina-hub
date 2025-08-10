// @ts-nocheck
import { model } from "@medusajs/utils"

/**
 * Amazon-style Ad Group model for organizing ads within campaigns
 */
export const AdGroup = model.define("AdGroup", {
  id: model.id({ prefix: "adgrp" }).primaryKey(),
  
  // Basic Information
  name: model.text(),
  campaign_id: model.text().index(),
  status: model.enum(["active", "paused", "archived"]).default("active"),
  
  // Bidding
  default_bid: model.bigNumber(), // Default bid for keywords/products in this ad group
  bid_adjustments: model.json().nullable(), // Device, placement, audience bid adjustments
  
  // Targeting (Amazon-style)
  targeting_type: model.enum(["automatic", "manual"]).default("manual"),
  
  // For Sponsored Products - Product Targeting
  product_targeting_enabled: model.boolean().default(false),
  
  // Performance Metrics
  impressions: model.bigNumber().default(0),
  clicks: model.bigNumber().default(0),
  spend: model.bigNumber().default(0),
  sales: model.bigNumber().default(0),
  orders: model.bigNumber().default(0),
  
  // Calculated Metrics
  ctr: model.float().nullable(),
  cpc: model.bigNumber().nullable(),
  acos: model.float().nullable(),
  roas: model.float().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
  deleted_at: model.dateTime().nullable(),
})

export default AdGroup





