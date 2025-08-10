// @ts-nocheck
import { model } from "@medusajs/utils"

/**
 * Amazon-style keyword targeting model for PPC campaigns
 */
export const AdKeyword = model.define("AdKeyword", {
  id: model.id({ prefix: "adkw" }).primaryKey(),
  
  // Associations
  campaign_id: model.text().index(),
  ad_group_id: model.text().index(),
  
  // Keyword Information
  keyword_text: model.text(), // The actual keyword
  match_type: model.enum(["exact", "phrase", "broad", "negative_exact", "negative_phrase", "negative_broad"]),
  
  // Bidding
  bid: model.bigNumber(), // Bid amount in cents
  bid_adjustment: model.float().default(1.0), // Bid adjustment multiplier
  
  // Status
  status: model.enum(["active", "paused", "archived"]).default("active"),
  
  // Amazon-style Quality & Relevance
  quality_score: model.float().nullable(), // 1-10 quality score
  first_page_bid: model.bigNumber().nullable(), // Suggested bid for first page
  top_of_page_bid: model.bigNumber().nullable(), // Suggested bid for top of page
  
  // Performance Metrics
  impressions: model.bigNumber().default(0),
  clicks: model.bigNumber().default(0),
  spend: model.bigNumber().default(0),
  sales: model.bigNumber().default(0),
  orders: model.bigNumber().default(0),
  
  // Search Term Performance (Amazon Search Term Report concept)
  search_terms: model.json().nullable(), // Array of actual search terms that triggered this keyword
  
  // Calculated Metrics
  ctr: model.float().nullable(),
  cpc: model.bigNumber().nullable(),
  acos: model.float().nullable(),
  roas: model.float().nullable(),
  conversion_rate: model.float().nullable(),
  
  // Keyword Research Data
  search_volume: model.bigNumber().nullable(), // Monthly search volume
  competition: model.enum(["low", "medium", "high"]).nullable(),
  suggested_bid_range_min: model.bigNumber().nullable(),
  suggested_bid_range_max: model.bigNumber().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
  deleted_at: model.dateTime().nullable(),
})

export default AdKeyword





