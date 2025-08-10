// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const SaudiPaymentMethod = model.define("saudi_payment_method", {
  id: model.id().primaryKey(),
  
  // Payment Method Details
  name: model.text(),
  code: model.text().unique(), // "mada", "stc_pay", "tabby", "tamara", "apple_pay", "google_pay"
  type: model.enum(["card", "wallet", "bnpl", "bank_transfer", "cash"]),
  
  // Configuration
  is_active: model.boolean().default(true),
  is_default: model.boolean().default(false),
  sort_order: model.number().default(0),
  
  // Provider Configuration
  provider: model.enum(["mada", "stc", "tabby", "tamara", "moyasar", "paytabs", "hyperpay"]),
  api_endpoint: model.text().nullable(),
  merchant_id: model.text().nullable(),
  api_key: model.text().nullable(),
  secret_key: model.text().nullable(),
  
  // mada Specific
  mada_terminal_id: model.text().nullable(),
  mada_bank_code: model.text().nullable(),
  
  // STC Pay Specific
  stc_merchant_code: model.text().nullable(),
  stc_branch_id: model.text().nullable(),
  
  // BNPL Configuration (Tabby/Tamara)
  bnpl_min_amount: model.number().nullable(),
  bnpl_max_amount: model.number().nullable(),
  installment_plans: model.json().nullable(), // Available installment options
  
  // Bank Transfer (SARIE)
  bank_name: model.text().nullable(),
  iban: model.text().nullable(),
  swift_code: model.text().nullable(),
  
  // Transaction Fees
  fixed_fee: model.number().default(0),
  percentage_fee: model.number().default(0),
  fee_currency: model.text().default("SAR"),
  
  // Limits
  min_transaction_amount: model.number().nullable(),
  max_transaction_amount: model.number().nullable(),
  daily_limit: model.number().nullable(),
  monthly_limit: model.number().nullable(),
  
  // Security
  supports_3ds: model.boolean().default(true),
  encryption_enabled: model.boolean().default(true),
  tokenization_enabled: model.boolean().default(false),
  
  // Regional Support
  supported_cities: model.json().nullable(), // For cash on delivery
  supported_regions: model.json(), // Array of supported regions
  
  // Integration Settings
  webhook_url: model.text().nullable(),
  webhook_secret: model.text().nullable(),
  callback_url: model.text().nullable(),
  
  // Arabic Support
  arabic_name: model.text(),
  arabic_description: model.text().nullable(),
  
  // Customer Experience
  payment_flow: model.enum(["redirect", "iframe", "api", "mobile_app"]).default("redirect"),
  supports_refunds: model.boolean().default(true),
  refund_processing_days: model.number().default(3),
  
  // Compliance
  pci_compliant: model.boolean().default(true),
  sama_approved: model.boolean().default(true), // Saudi Central Bank approval
  
  // Performance
  success_rate: model.number().default(0),
  average_processing_time: model.number().default(0), // in seconds
  last_health_check: model.dateTime().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default SaudiPaymentMethod





