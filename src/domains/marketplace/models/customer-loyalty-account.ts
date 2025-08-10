// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const CustomerLoyaltyAccount = model.define("customer_loyalty_account", {
  id: model.id().primaryKey(),
  customer_id: model.text(),
  loyalty_program_id: model.text(),
  
  // Points Balance
  points_balance: model.number().default(0),
  lifetime_points_earned: model.number().default(0),
  lifetime_points_redeemed: model.number().default(0),
  
  // Tier Information
  current_tier: model.text().nullable(),
  tier_points: model.number().default(0),
  next_tier_points_required: model.number().nullable(),
  
  // Account Status
  is_active: model.boolean().default(true),
  joined_date: model.dateTime().default(new Date()),
  last_activity_date: model.dateTime().nullable(),
  
  // Birthday Tracking
  birthday_claimed_this_year: model.boolean().default(false),
  last_birthday_claim_year: model.number().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
CustomerLoyaltyAccount.belongsTo(() => import("../../customer/models/customer").then(m => m.default), {
  foreignKey: "customer_id"
})

CustomerLoyaltyAccount.belongsTo(() => import("./loyalty-program").then(m => m.default), {
  foreignKey: "loyalty_program_id"
})

export default CustomerLoyaltyAccount





