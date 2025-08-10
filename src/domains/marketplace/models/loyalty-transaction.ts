// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const LoyaltyTransaction = model.define("loyalty_transaction", {
  id: model.id().primaryKey(),
  customer_loyalty_account_id: model.text(),
  order_id: model.text().nullable(),
  
  // Transaction Details
  transaction_type: model.enum(["earned", "redeemed", "expired", "adjusted", "referral", "birthday"]),
  points_amount: model.number(), // Positive for earned, negative for redeemed
  description: model.text().nullable(),
  
  // Order Context
  order_total: model.number().nullable(),
  points_rate: model.number().nullable(),
  
  // Referral Context
  referred_customer_id: model.text().nullable(),
  referral_code: model.text().nullable(),
  
  // Redemption Context
  redemption_value: model.number().nullable(), // Dollar value if redeemed
  redemption_method: model.enum(["discount", "product", "cash"]).nullable(),
  
  // Transaction Status
  status: model.enum(["pending", "completed", "cancelled"]).default("completed"),
  processed_at: model.dateTime().default(new Date()),
  
  // Expiry Information
  expires_at: model.dateTime().nullable(),
  is_expired: model.boolean().default(false),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
LoyaltyTransaction.belongsTo(() => import("./customer-loyalty-account").then(m => m.default), {
  foreignKey: "customer_loyalty_account_id"
})

LoyaltyTransaction.belongsTo(() => import("../../order/models/order").then(m => m.default), {
  foreignKey: "order_id"
})

export default LoyaltyTransaction





