// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const SecurityEvent = model.define("security_event", {
  id: model.id().primaryKey(),
  
  // Event Classification
  event_type: model.enum([
    "login_attempt", "login_success", "login_failure", "logout",
    "password_change", "account_lockout", "suspicious_activity",
    "fraud_attempt", "data_access", "permission_change",
    "payment_fraud", "unusual_order", "bot_detected"
  ]),
  severity: model.enum(["low", "medium", "high", "critical"]).default("medium"),
  
  // Event Details
  description: model.text(),
  risk_score: model.number().default(0), // 0-100 risk score
  
  // User Context
  user_id: model.text().nullable(),
  customer_id: model.text().nullable(),
  session_id: model.text().nullable(),
  user_agent: model.text().nullable(),
  
  // Network Context
  ip_address: model.text(),
  country_code: model.text().nullable(),
  city: model.text().nullable(),
  isp: model.text().nullable(),
  is_vpn: model.boolean().default(false),
  is_proxy: model.boolean().default(false),
  
  // Request Context
  request_url: model.text().nullable(),
  request_method: model.text().nullable(),
  request_headers: model.json().nullable(),
  response_status: model.number().nullable(),
  
  // Fraud Detection
  fraud_indicators: model.json().nullable(), // Array of detected fraud patterns
  velocity_flags: model.json().nullable(), // Rate limiting flags
  device_fingerprint: model.text().nullable(),
  
  // Action Taken
  action_taken: model.enum(["none", "logged", "blocked", "challenged", "rate_limited", "account_suspended"]).default("logged"),
  automated_response: model.boolean().default(false),
  
  // Investigation
  investigation_status: model.enum(["new", "investigating", "resolved", "false_positive"]).default("new"),
  investigated_by: model.text().nullable(),
  investigation_notes: model.text().nullable(),
  
  // Related Events
  related_events: model.json().nullable(), // Array of related security event IDs
  
  // Timestamps
  detected_at: model.dateTime().default(new Date()),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
SecurityEvent.belongsTo(() => import("../../user/models/User").then(m => m.default), {
  foreignKey: "user_id"
})

SecurityEvent.belongsTo(() => import("../../customer/models/customer").then(m => m.default), {
  foreignKey: "customer_id"
})

export default SecurityEvent





