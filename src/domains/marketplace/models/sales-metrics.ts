// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const SalesMetrics = model.define("sales_metrics", {
  id: model.id().primaryKey(),
  
  // Time Period
  date: model.dateTime(),
  period_type: model.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
  
  // Revenue Metrics
  gross_revenue: model.number().default(0),
  net_revenue: model.number().default(0),
  discounts_applied: model.number().default(0),
  taxes_collected: model.number().default(0),
  shipping_collected: model.number().default(0),
  
  // Order Metrics
  orders_count: model.number().default(0),
  completed_orders: model.number().default(0),
  cancelled_orders: model.number().default(0),
  refunded_orders: model.number().default(0),
  average_order_value: model.number().default(0),
  
  // Product Metrics
  products_sold: model.number().default(0),
  unique_products_sold: model.number().default(0),
  top_selling_product_id: model.text().nullable(),
  top_selling_category_id: model.text().nullable(),
  
  // Customer Metrics
  new_customers: model.number().default(0),
  returning_customers: model.number().default(0),
  unique_customers: model.number().default(0),
  customer_lifetime_value: model.number().default(0),
  
  // Conversion Metrics
  website_visitors: model.number().default(0),
  conversion_rate: model.number().default(0),
  cart_abandonment_rate: model.number().default(0),
  
  // Geographic Breakdown
  sales_by_country: model.json().nullable(),
  sales_by_region: model.json().nullable(),
  
  // Channel Breakdown
  sales_by_channel: model.json().nullable(), // Online, in-store, mobile app, etc.
  sales_by_source: model.json().nullable(), // Organic, paid ads, social, etc.
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default SalesMetrics





