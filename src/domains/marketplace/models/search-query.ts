// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const SearchQuery = model.define("search_query", {
  id: model.id().primaryKey(),
  customer_id: model.text().nullable(),
  
  // Query Details
  query_text: model.text(),
  normalized_query: model.text(), // Cleaned/standardized version
  
  // Search Context
  search_type: model.enum(["product", "category", "content", "global"]).default("product"),
  filters_applied: model.json().nullable(), // Applied filters
  sort_order: model.text().nullable(),
  
  // Results
  results_count: model.number().default(0),
  clicked_result_id: model.text().nullable(),
  click_position: model.number().nullable(),
  
  // Session Context
  session_id: model.text().nullable(),
  page_url: model.text().nullable(),
  referrer_url: model.text().nullable(),
  user_agent: model.text().nullable(),
  
  // Geography
  ip_address: model.text().nullable(),
  country_code: model.text().nullable(),
  
  // Conversion Tracking
  led_to_cart_add: model.boolean().default(false),
  led_to_purchase: model.boolean().default(false),
  order_id: model.text().nullable(),
  
  // Query Performance
  response_time_ms: model.number().nullable(),
  
  // Timestamps
  searched_at: model.dateTime().default(new Date()),
  created_at: model.dateTime().default(new Date()),
})

// Relationships
SearchQuery.belongsTo(() => import("../../customer/models/customer").then(m => m.default), {
  foreignKey: "customer_id"
})

export default SearchQuery





