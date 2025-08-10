// @ts-nocheck
import { model } from "@medusajs/utils"

/**
 * Amazon-style advertising performance report model
 * Stores historical performance data for campaigns, ad groups, keywords, and products
 */
export const AdPerformanceReport = model.define("AdPerformanceReport", {
  id: model.id({ prefix: "adperf" }).primaryKey(),
  
  // Report Scope
  report_type: model.enum([
    "campaign_performance",
    "ad_group_performance", 
    "keyword_performance",
    "product_performance",
    "search_term_report",
    "placement_report",
    "audience_report"
  ]),
  
  // Time Period
  date: model.dateTime(), // Date for this performance data
  report_period: model.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]).default("daily"),
  
  // Entity References
  campaign_id: model.text().nullable(),
  ad_group_id: model.text().nullable(),
  keyword_id: model.text().nullable(),
  product_id: model.text().nullable(),
  
  // Core Metrics (Amazon PPC standard metrics)
  impressions: model.bigNumber().default(0),
  clicks: model.bigNumber().default(0),
  spend: model.bigNumber().default(0), // in cents
  sales: model.bigNumber().default(0), // attributed sales in cents
  orders: model.bigNumber().default(0),
  units_sold: model.bigNumber().default(0),
  
  // Calculated Performance Metrics
  ctr: model.float().nullable(), // Click-through rate (clicks/impressions)
  cpc: model.bigNumber().nullable(), // Cost per click (spend/clicks)
  acos: model.float().nullable(), // Advertising Cost of Sales (spend/sales)
  roas: model.float().nullable(), // Return on Ad Spend (sales/spend)
  conversion_rate: model.float().nullable(), // Orders/clicks
  cost_per_order: model.bigNumber().nullable(), // Spend/orders
  
  // Amazon Attribution Metrics
  detail_page_views: model.bigNumber().default(0),
  detail_page_view_rate: model.float().nullable(),
  add_to_cart: model.bigNumber().default(0),
  add_to_cart_rate: model.float().nullable(),
  purchase_rate: model.float().nullable(),
  
  // Advanced Attribution (Amazon DSP-style)
  view_through_conversions: model.bigNumber().default(0),
  brand_searches: model.bigNumber().default(0),
  new_to_brand_orders: model.bigNumber().default(0),
  new_to_brand_sales: model.bigNumber().default(0),
  
  // Search Term Data (for search term reports)
  search_term: model.text().nullable(),
  match_type_delivered: model.enum(["exact", "phrase", "broad", "close_variant"]).nullable(),
  
  // Placement Data (for placement reports)
  placement: model.enum([
    "top_of_search",
    "product_pages", 
    "other_on_amazon",
    "off_amazon"
  ]).nullable(),
  
  // Audience Data (for audience reports)
  audience_segment: model.text().nullable(),
  audience_type: model.enum(["interests", "demographics", "behaviors", "lookalike", "retargeting"]).nullable(),
  
  // Device & Geographic Performance
  device_type: model.enum(["desktop", "mobile", "tablet"]).nullable(),
  country_code: model.text().nullable(),
  region: model.text().nullable(),
  
  // Time-based Performance
  hour_of_day: model.integer().nullable(), // 0-23 for hourly performance
  day_of_week: model.integer().nullable(), // 1-7 for daily performance
  
  // Store Association
  store_id: model.text(),
  seller_id: model.text(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default AdPerformanceReport





