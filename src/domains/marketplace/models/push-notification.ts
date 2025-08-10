// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const PushNotification = model.define("push_notification", {
  id: model.id().primaryKey(),
  
  // Notification Content
  title: model.text(),
  body: model.text(),
  icon: model.text().nullable(),
  image: model.text().nullable(),
  
  // Targeting
  target_type: model.enum(["all_users", "specific_users", "user_segment", "custom"]),
  target_users: model.json().nullable(), // Array of user IDs
  target_segment: model.text().nullable(), // Customer segment ID
  target_criteria: model.json().nullable(), // Custom targeting criteria
  
  // Notification Behavior
  click_action: model.text().nullable(), // URL to open when notification is clicked
  actions: model.json().nullable(), // Array of action buttons
  require_interaction: model.boolean().default(false),
  silent: model.boolean().default(false),
  
  // Scheduling
  send_immediately: model.boolean().default(true),
  scheduled_at: model.dateTime().nullable(),
  timezone: model.text().default("UTC"),
  
  // Personalization
  personalized: model.boolean().default(false),
  personalization_template: model.text().nullable(),
  
  // Campaign Context
  campaign_id: model.text().nullable(),
  campaign_type: model.enum(["promotional", "transactional", "reminder", "alert"]).nullable(),
  
  // Delivery Status
  status: model.enum(["draft", "scheduled", "sending", "sent", "failed", "cancelled"]).default("draft"),
  sent_count: model.number().default(0),
  delivered_count: model.number().default(0),
  clicked_count: model.number().default(0),
  failed_count: model.number().default(0),
  
  // A/B Testing
  is_ab_test: model.boolean().default(false),
  ab_test_variant: model.text().nullable(),
  
  // Tracking
  tracking_enabled: model.boolean().default(true),
  utm_campaign: model.text().nullable(),
  utm_source: model.text().default("push_notification"),
  utm_medium: model.text().default("notification"),
  
  // Error Handling
  error_message: model.text().nullable(),
  retry_count: model.number().default(0),
  max_retries: model.number().default(3),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
  sent_at: model.dateTime().nullable(),
})

export default PushNotification





