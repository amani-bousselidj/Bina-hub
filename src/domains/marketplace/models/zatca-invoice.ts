// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ZATCAInvoice = model.define("zatca_invoice", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  
  // ZATCA Identifiers
  zatca_invoice_uuid: model.text().unique(),
  zatca_invoice_hash: model.text(),
  zatca_previous_invoice_hash: model.text().nullable(),
  zatca_sequence_number: model.number(),
  
  // Invoice Classification
  invoice_type: model.enum(["standard", "simplified", "credit_note", "debit_note"]),
  invoice_subtype: model.enum(["b2b", "b2c", "export", "import"]),
  
  // QR Code
  qr_code_data: model.text(),
  qr_code_image: model.text().nullable(),
  
  // Arabic Content
  arabic_invoice_number: model.text(),
  arabic_customer_name: model.text().nullable(),
  arabic_customer_address: model.json().nullable(),
  arabic_line_items: model.json(),
  
  // Tax Details
  total_vat_amount: model.number(),
  vat_breakdown: model.json(), // Array of VAT rates and amounts
  exemption_reason: model.text().nullable(),
  exemption_code: model.text().nullable(),
  
  // ZATCA Submission
  submission_status: model.enum(["pending", "submitted", "accepted", "rejected", "warning"]).default("pending"),
  submission_timestamp: model.dateTime().nullable(),
  zatca_response: model.json().nullable(),
  
  // Validation
  validation_status: model.enum(["valid", "invalid", "warning"]),
  validation_errors: model.json().nullable(),
  validation_warnings: model.json().nullable(),
  
  // Digital Signature
  digital_signature: model.text().nullable(),
  signature_timestamp: model.dateTime().nullable(),
  certificate_serial_number: model.text().nullable(),
  
  // Compliance Flags
  is_real_time_reported: model.boolean().default(false),
  is_archived: model.boolean().default(false),
  archive_reason: model.text().nullable(),
  
  // Retry Mechanism
  retry_count: model.number().default(0),
  max_retries: model.number().default(3),
  next_retry_at: model.dateTime().nullable(),
  
  // Audit Trail
  created_by: model.text(),
  last_modified_by: model.text().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Note: Relationships will be defined in the module configuration

export default ZATCAInvoice





