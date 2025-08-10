// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const WebhookEndpoint = model.define("webhook_endpoint", {
  id: model.id().primaryKey(),
  
  // Endpoint Configuration
  name: model.text(),
  description: model.text().nullable(),
  url: model.text(),
  method: model.enum(["POST", "PUT", "PATCH"]).default("POST"),
  
  // Authentication
  auth_type: model.enum(["none", "bearer_token", "api_key", "basic_auth", "hmac"]).default("none"),
  auth_token: model.text().nullable(),
  auth_username: model.text().nullable(),
  auth_password: model.text().nullable(),
  hmac_secret: model.text().nullable(),
  
  // Event Subscription
  events: model.json(), // Array of event types to listen for
  event_filters: model.json().nullable(), // Additional filtering criteria
  
  // Request Configuration
  headers: model.json().default({}),
  payload_template: model.text().nullable(), // Custom payload template
  include_metadata: model.boolean().default(true),
  
  // Delivery Settings
  is_active: model.boolean().default(true),
  retry_enabled: model.boolean().default(true),
  max_retries: model.number().default(3),
  retry_delay_seconds: model.number().default(60),
  timeout_seconds: model.number().default(30),
  
  // Success/Failure Criteria
  success_status_codes: model.json().default([200, 201, 202, 204]),
  failure_status_codes: model.json().default([400, 401, 403, 404, 500]),
  
  // Rate Limiting
  rate_limit_enabled: model.boolean().default(false),
  max_requests_per_minute: model.number().nullable(),
  
  // Monitoring
  last_successful_delivery: model.dateTime().nullable(),
  last_failed_delivery: model.dateTime().nullable(),
  total_deliveries: model.number().default(0),
  successful_deliveries: model.number().default(0),
  failed_deliveries: model.number().default(0),
  
  // Health Check
  health_check_enabled: model.boolean().default(false),
  health_check_url: model.text().nullable(),
  health_check_interval_minutes: model.number().default(60),
  is_healthy: model.boolean().default(true),
  last_health_check: model.dateTime().nullable(),
  
  // Security
  allowed_ips: model.json().nullable(), // Array of allowed IP addresses
  user_agent: model.text().default("Binna-Webhook/1.0"),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default WebhookEndpoint





