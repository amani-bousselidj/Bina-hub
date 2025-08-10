// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const TaxCompliance = model.define("tax_compliance", {
  id: model.id().primaryKey(),
  
  // Tax Configuration
  tax_system: model.enum(["simple", "complex", "automated", "third_party"]).default("simple"),
  default_tax_calculation: model.enum(["origin", "destination"]).default("destination"),
  
  // Tax Authorities
  tax_authorities: model.json(), // Array of tax authority configurations
  
  // Nexus Configuration (Where business has tax obligations)
  tax_nexus: model.json(), // Array of jurisdictions where business must collect tax
  nexus_thresholds: model.json().nullable(), // Economic nexus thresholds by state/country
  
  // Digital Tax Settings
  digital_tax_enabled: model.boolean().default(false),
  vat_enabled: model.boolean().default(false),
  gst_enabled: model.boolean().default(false),
  
  // Tax Rates Management
  auto_update_rates: model.boolean().default(false),
  rate_update_frequency: model.enum(["daily", "weekly", "monthly"]).default("monthly"),
  last_rates_update: model.dateTime().nullable(),
  
  // Tax Reporting
  reporting_frequency: model.enum(["monthly", "quarterly", "annually"]).default("quarterly"),
  next_filing_date: model.dateTime().nullable(),
  auto_generate_reports: model.boolean().default(false),
  
  // Third-Party Integration
  tax_service_provider: model.enum(["avalara", "taxjar", "vertex", "custom", "none"]).default("none"),
  api_credentials: model.json().nullable(),
  
  // Compliance Features
  tax_exemption_enabled: model.boolean().default(false),
  reverse_charge_enabled: model.boolean().default(false), // For B2B VAT
  
  // Audit Trail
  audit_trail_enabled: model.boolean().default(true),
  retention_period_years: model.number().default(7),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default TaxCompliance





