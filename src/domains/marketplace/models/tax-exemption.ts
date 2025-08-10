// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const TaxExemption = model.define("tax_exemption", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  
  // Exemption Details
  exemption_type: model.enum(["resale", "non_profit", "government", "educational", "religious", "agricultural", "other"]),
  exemption_reason: model.text().nullable(),
  certificate_number: model.text().unique(),
  
  // Jurisdiction
  exempt_in_countries: model.json().default([]),
  exempt_in_states: model.json().default([]),
  exempt_tax_types: model.json().default([]), // sales_tax, vat, gst, etc.
  
  // Certificate Information
  certificate_file_url: model.text().nullable(),
  certificate_expiry_date: model.dateTime().nullable(),
  issuing_authority: model.text().nullable(),
  
  // Validation
  status: model.enum(["pending", "approved", "rejected", "expired", "revoked"]).default("pending"),
  validated_by: model.text().nullable(),
  validated_at: model.dateTime().nullable(),
  validation_notes: model.text().nullable(),
  
  // Automatic Verification
  auto_verification_attempted: model.boolean().default(false),
  auto_verification_result: model.text().nullable(),
  
  // Usage Tracking
  times_used: model.number().default(0),
  last_used_at: model.dateTime().nullable(),
  
  // Notifications
  expiry_notification_sent: model.boolean().default(false),
  renewal_reminder_sent: model.boolean().default(false),
  
  // Timestamps
  applied_date: model.dateTime().default(new Date()),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
TaxExemption.belongsTo(() => import("../../customer/models/customer").then(m => m.default), {
  foreignKey: "customer_id"
})

TaxExemption.belongsTo(() => import("../../user/models/User").then(m => m.default), {
  foreignKey: "validated_by"
})

export default TaxExemption





