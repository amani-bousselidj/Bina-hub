// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ChatSession = model.define("chat_session", {
  id: model.id().primaryKey(),
  customer_id: model.text().nullable(),
  
  // Session Details
  session_type: model.enum(["live_chat", "bot_chat", "video_call"]).default("live_chat"),
  status: model.enum(["active", "waiting", "ended", "transferred"]).default("active"),
  
  // Participant Information
  agent_id: model.text().nullable(),
  customer_email: model.text().nullable(),
  customer_name: model.text().nullable(),
  visitor_id: model.text().nullable(), // For anonymous visitors
  
  // Session Context
  page_url: model.text().nullable(), // Page where chat was initiated
  referrer_url: model.text().nullable(),
  user_agent: model.text().nullable(),
  ip_address: model.text().nullable(),
  
  // Session Management
  queue_position: model.number().nullable(),
  wait_time_seconds: model.number().nullable(),
  response_time_seconds: model.number().nullable(),
  
  // Session Resolution
  ended_by: model.enum(["customer", "agent", "system", "timeout"]).nullable(),
  ending_reason: model.text().nullable(),
  satisfaction_rating: model.number().nullable(),
  
  // Timestamps
  started_at: model.dateTime().default(new Date()),
  ended_at: model.dateTime().nullable(),
  last_activity_at: model.dateTime().default(new Date()),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
ChatSession.belongsTo(() => import("../../customer/models/customer").then(m => m.default), {
  foreignKey: "customer_id"
})

ChatSession.belongsTo(() => import("../../user/models/User").then(m => m.default), {
  foreignKey: "agent_id"
})

export default ChatSession





