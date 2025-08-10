// @ts-nocheck
import { model } from "@medusajs/framework/utils"
import MarketplaceVendor from "./marketplace-vendor"

const VendorCommission = model
  .define("VendorCommission", {
    id: model.id({ prefix: "vcom" }).primaryKey(),
    vendor_id: model.text(),
    vendor: model.belongsTo(() => MarketplaceVendor, {
      mappedBy: "commissions"
    }),
    order_id: model.text(),
    order_item_id: model.text().nullable(),
    product_id: model.text(),
    product_title: model.text(),
    
    // Financial Details
    sale_amount: model.number(),
    commission_rate: model.number(),
    commission_amount: model.number(),
    commission_type: model.enum(["percentage", "fixed"]),
    
    // Status
    status: model.enum(["pending", "approved", "paid", "disputed"]).default("pending"),
    payout_id: model.text().nullable(),
    paid_at: model.dateTime().nullable(),
    
    // Dates
    transaction_date: model.dateTime(),
    due_date: model.dateTime().nullable(),
    
    notes: model.text().nullable(),
    metadata: model.json().nullable(),
  })
  .indexes([
    {
      name: "IDX_vendor_commission_vendor_id",
      on: ["vendor_id"],
      unique: false,
    },
    {
      name: "IDX_vendor_commission_order_id",
      on: ["order_id"],
      unique: false,
    },
    {
      name: "IDX_vendor_commission_status",
      on: ["status"],
      unique: false,
    }
  ])

export default VendorCommission





