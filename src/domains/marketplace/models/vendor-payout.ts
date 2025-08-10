// @ts-nocheck
import { model } from "@medusajs/framework/utils"
import MarketplaceVendor from "./marketplace-vendor"

const VendorPayout = model
  .define("VendorPayout", {
    id: model.id({ prefix: "vpay" }).primaryKey(),
    vendor_id: model.text(),
    vendor: model.belongsTo(() => MarketplaceVendor, {
      mappedBy: "payouts"
    }),
    
    // Payout Details
    payout_amount: model.number(),
    commission_total: model.number(),
    fees_deducted: model.number().default(0),
    tax_deducted: model.number().default(0),
    net_amount: model.number(),
    
    // Period Covered
    period_start: model.dateTime(),
    period_end: model.dateTime(),
    
    // Payment Information
    payment_method: model.enum(["bank_transfer", "paypal", "stripe", "check"]).default("bank_transfer"),
    payment_reference: model.text().nullable(),
    bank_account: model.text().nullable(),
    
    // Status
    status: model.enum(["pending", "processing", "completed", "failed", "cancelled"]).default("pending"),
    processed_at: model.dateTime().nullable(),
    completed_at: model.dateTime().nullable(),
    
    // Related Commissions
    commission_ids: model.json(), // Array of commission IDs included in this payout
    
    notes: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_vendor_payout_vendor_id",
      on: ["vendor_id"],
      unique: false,
    },
    {
      name: "IDX_vendor_payout_status",
      on: ["status"],
      unique: false,
    },
    {
      name: "IDX_vendor_payout_period",
      on: ["period_start", "period_end"],
      unique: false,
    }
  ])

export default VendorPayout





