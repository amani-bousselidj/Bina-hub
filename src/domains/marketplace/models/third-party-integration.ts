// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ThirdPartyIntegration = model.define("third_party_integration", {
  id: model.id().primaryKey(),
  
  // Integration Identity
  name: model.text(),
  provider: model.text(), // e.g., "mailchimp", "hubspot", "quickbooks", "stripe"
  category: model.enum([
    "accounting", "crm", "email_marketing", "payment", "shipping", 
    "analytics", "social_media", "erp", "inventory", "customer_service"
  ]),
  
  // Configuration
  is_active: model.boolean().default(false),
  configuration: model.json(), // Provider-specific configuration
  
  // API Credentials
  api_endpoint: model.text().nullable(),
  api_key: model.text().nullable(),
  api_secret: model.text().nullable(),
  access_token: model.text().nullable(),
  refresh_token: model.text().nullable(),
  token_expires_at: model.dateTime().nullable(),
  
  // OAuth Configuration
  oauth_enabled: model.boolean().default(false),
  oauth_state: model.text().nullable(),
  oauth_scopes: model.json().nullable(),
  
  // Sync Configuration
  sync_enabled: model.boolean().default(false),
  sync_frequency: model.enum(["real_time", "hourly", "daily", "weekly"]).default("daily"),
  last_sync_at: model.dateTime().nullable(),
  next_sync_at: model.dateTime().nullable(),
  
  // Data Mapping
  field_mappings: model.json().nullable(), // Map Binna fields to provider fields
  sync_direction: model.enum(["bidirectional", "to_provider", "from_provider"]).default("bidirectional"),
  conflict_resolution: model.enum(["binna_wins", "provider_wins", "manual"]).default("manual"),
  
  // Error Handling
  error_handling: model.enum(["ignore", "log", "alert", "retry"]).default("log"),
  max_errors_per_day: model.number().default(100),
  current_error_count: model.number().default(0),
  last_error_reset: model.dateTime().default(new Date()),
  
  // Monitoring
  health_status: model.enum(["healthy", "warning", "error", "disconnected"]).default("healthy"),
  last_health_check: model.dateTime().nullable(),
  uptime_percentage: model.number().default(100),
  
  // Usage Statistics
  api_calls_today: model.number().default(0),
  api_calls_this_month: model.number().default(0),
  rate_limit_remaining: model.number().nullable(),
  rate_limit_reset_at: model.dateTime().nullable(),
  
  // Features
  supported_features: model.json().default([]), // Array of supported integration features
  enabled_features: model.json().default([]), // Array of currently enabled features
  
  // Webhook Configuration
  webhook_url: model.text().nullable(),
  webhook_secret: model.text().nullable(),
  webhook_events: model.json().default([]),
  
  // Compliance
  data_retention_days: model.number().nullable(),
  gdpr_compliant: model.boolean().default(false),
  
  // Timestamps
  connected_at: model.dateTime().nullable(),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default ThirdPartyIntegration





