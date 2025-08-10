// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const BusinessReport = model.define("business_report", {
  id: model.id().primaryKey(),
  
  // Report Configuration
  name: model.text(),
  description: model.text().nullable(),
  report_type: model.enum([
    "sales", "products", "customers", "inventory", "tax", 
    "marketing", "financial", "operational", "custom"
  ]),
  
  // Report Parameters
  date_range_type: model.enum(["daily", "weekly", "monthly", "quarterly", "yearly", "custom"]),
  start_date: model.dateTime(),
  end_date: model.dateTime(),
  
  // Filters and Grouping
  filters: model.json().nullable(), // Filter criteria
  group_by: model.json().nullable(), // Grouping dimensions
  sort_by: model.text().nullable(),
  sort_order: model.enum(["asc", "desc"]).default("desc"),
  
  // Report Data
  report_data: model.json(), // Actual report results
  summary_metrics: model.json().nullable(), // Key metrics summary
  
  // Visualization
  chart_type: model.enum(["line", "bar", "pie", "table", "grid"]).default("table"),
  visualization_config: model.json().nullable(),
  
  // Schedule Configuration
  is_scheduled: model.boolean().default(false),
  schedule_frequency: model.enum(["daily", "weekly", "monthly"]).nullable(),
  schedule_day: model.number().nullable(), // Day of week/month
  recipients: model.json().nullable(), // Email list for scheduled reports
  
  // Export Configuration
  export_formats: model.json().default(["pdf", "csv", "excel"]),
  last_exported_at: model.dateTime().nullable(),
  
  // Performance
  generation_time_ms: model.number().nullable(),
  data_points_count: model.number().nullable(),
  
  // Access Control
  created_by: model.text(),
  is_public: model.boolean().default(false),
  shared_with: model.json().nullable(), // User IDs with access
  
  // Status
  status: model.enum(["draft", "published", "archived"]).default("draft"),
  last_generated_at: model.dateTime().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
BusinessReport.belongsTo(() => import("../../user/models/User").then(m => m.default), {
  foreignKey: "created_by"
})

export default BusinessReport





