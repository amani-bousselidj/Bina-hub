// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const SupportTicket = model.define("support_ticket", {
  id: model.id().primaryKey(),
  ticket_number: model.text().unique(),
  customer_id: model.text().nullable(),
  
  // Ticket Details
  subject: model.text(),
  description: model.text(),
  category: model.enum(["general", "order", "product", "shipping", "billing", "technical", "complaint"]),
  priority: model.enum(["low", "medium", "high", "urgent"]).default("medium"),
  
  // Status Management
  status: model.enum(["open", "in_progress", "waiting_customer", "waiting_agent", "resolved", "closed"]).default("open"),
  assigned_agent_id: model.text().nullable(),
  
  // Customer Information
  customer_email: model.text(),
  customer_name: model.text(),
  customer_phone: model.text().nullable(),
  
  // Order Context
  order_id: model.text().nullable(),
  product_id: model.text().nullable(),
  
  // Resolution
  resolution_notes: model.text().nullable(),
  resolved_at: model.dateTime().nullable(),
  resolved_by: model.text().nullable(),
  
  // Customer Satisfaction
  satisfaction_rating: model.number().nullable(), // 1-5 stars
  satisfaction_feedback: model.text().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
  last_response_at: model.dateTime().default(new Date()),
})

// Relationships
SupportTicket.belongsTo(() => import("../../customer/models/customer").then(m => m.default), {
  foreignKey: "customer_id"
})

SupportTicket.belongsTo(() => import("../../order/models/order").then(m => m.default), {
  foreignKey: "order_id"
})

SupportTicket.belongsTo(() => import("../../user/models/User").then(m => m.default), {
  foreignKey: "assigned_agent_id"
})

export default SupportTicket





