// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const LoyaltyProgram = model.define("loyalty_program", {
  id: model.id().primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  
  // Program Configuration
  points_per_dollar: model.number().default(1),
  minimum_spend: model.number().default(0),
  maximum_points_per_order: model.number().nullable(),
  
  // Program Status
  is_active: model.boolean().default(true),
  start_date: model.dateTime().nullable(),
  end_date: model.dateTime().nullable(),
  
  // Tier Configuration
  enable_tiers: model.boolean().default(false),
  tier_thresholds: model.json().nullable(), // JSON array of tier requirements
  
  // Referral Program
  enable_referrals: model.boolean().default(false),
  referral_points: model.number().default(0),
  referrer_points: model.number().default(0),
  
  // Birthday Rewards
  enable_birthday_rewards: model.boolean().default(false),
  birthday_points: model.number().default(0),
  
  // Terms and Conditions
  terms_and_conditions: model.text().nullable(),
  points_expiry_days: model.number().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default LoyaltyProgram





