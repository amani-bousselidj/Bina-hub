// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const MarketplaceVendor = model
  .define("MarketplaceVendor", {
    id: model.id({ prefix: "vendor" }).primaryKey(),
    store_id: model.text().nullable(),
    business_name: model.text(),
    business_type: model.enum(["individual", "company", "corporation"]).default("company"),
    legal_name: model.text().nullable(),
    tax_id: model.text().nullable(),
    commercial_registration: model.text().nullable(),
    license_number: model.text().nullable(),
    
    // Contact Information
    contact_person: model.text(),
    email: model.text(),
    phone: model.text().nullable(),
    website: model.text().nullable(),
    
    // Address
    address: model.text().nullable(),
    city: model.text().nullable(),
    region: model.text().nullable(),
    postal_code: model.text().nullable(),
    country_code: model.text().default("SA"),
    
    // Banking Information
    bank_name: model.text().nullable(),
    bank_account_number: model.text().nullable(),
    iban: model.text().nullable(),
    swift_code: model.text().nullable(),
    
    // Marketplace Settings
    commission_rate: model.number().default(0.05), // 5% default commission
    commission_type: model.enum(["percentage", "fixed"]).default("percentage"),
    minimum_payout: model.number().default(100),
    payout_schedule: model.enum(["weekly", "biweekly", "monthly"]).default("monthly"),
    
    // Status & Verification
    status: model.enum(["pending", "approved", "suspended", "rejected"]).default("pending"),
    is_verified: model.boolean().default(false),
    verification_documents: model.json().nullable(),
    approved_at: model.dateTime().nullable(),
    approved_by: model.text().nullable(),
    
    // Performance Metrics
    rating: model.number().default(0),
    total_sales: model.number().default(0),
    total_commission: model.number().default(0),
    total_products: model.number().default(0),
    total_orders: model.number().default(0),
    
    // Settings
    auto_approve_products: model.boolean().default(false),
    can_edit_prices: model.boolean().default(true),
    can_manage_inventory: model.boolean().default(true),
    notification_settings: model.json().nullable(),
    
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_vendor_email_unique",
      on: ["email"],
      unique: true,
    },
    {
      name: "IDX_vendor_tax_id",
      on: ["tax_id"],
      unique: true,
      where: "tax_id IS NOT NULL",
    },
    {
      name: "IDX_vendor_status",
      on: ["status"],
      unique: false,
    }
  ])

export default MarketplaceVendor





