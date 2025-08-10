// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const ZATCACompliance = model.define("zatca_compliance", {
  id: model.id().primaryKey(),
  
  // Business Registration
  commercial_registry_number: model.text().nullable(),
  tax_identification_number: model.text().nullable(), // TIN
  vat_registration_number: model.text().nullable(),
  
  // ZATCA Configuration
  zatca_environment: model.enum(["sandbox", "production"]).default("sandbox"),
  zatca_solution_name: model.text().default("Binna Commerce"),
  zatca_solution_version: model.text().default("1.0.0"),
  
  // E-Invoice Configuration
  e_invoice_enabled: model.boolean().default(true),
  phase_2_enabled: model.boolean().default(true),
  real_time_reporting: model.boolean().default(true),
  
  // Certificate Management
  zatca_certificate: model.text().nullable(),
  certificate_expiry_date: model.dateTime().nullable(),
  private_key: model.text().nullable(),
  
  // API Configuration
  zatca_api_endpoint: model.text().nullable(),
  zatca_api_username: model.text().nullable(),
  zatca_api_password: model.text().nullable(),
  
  // Invoice Sequence
  invoice_counter: model.number().default(1),
  credit_note_counter: model.number().default(1),
  debit_note_counter: model.number().default(1),
  
  // QR Code Configuration
  qr_code_enabled: model.boolean().default(true),
  qr_code_format: model.enum(["base64", "svg"]).default("base64"),
  
  // Compliance Status
  compliance_status: model.enum(["pending", "compliant", "non_compliant", "expired"]).default("pending"),
  last_compliance_check: model.dateTime().nullable(),
  compliance_expiry_date: model.dateTime().nullable(),
  
  // Error Handling
  last_submission_error: model.text().nullable(),
  failed_submissions_count: model.number().default(0),
  auto_retry_enabled: model.boolean().default(true),
  
  // Reporting
  daily_reporting_enabled: model.boolean().default(true),
  monthly_reporting_enabled: model.boolean().default(true),
  automated_vat_return: model.boolean().default(true),
  
  // Language Settings
  default_invoice_language: model.enum(["arabic", "english", "bilingual"]).default("bilingual"),
  arabic_company_name: model.text().nullable(),
  english_company_name: model.text().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default ZATCACompliance





