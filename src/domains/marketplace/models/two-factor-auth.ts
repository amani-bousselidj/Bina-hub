// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const TwoFactorAuth = model.define("two_factor_auth", {
  id: model.id().primaryKey(),
  user_id: model.text().unique(),
  
  // 2FA Configuration
  is_enabled: model.boolean().default(false),
  method: model.enum(["totp", "sms", "email", "hardware_key"]).default("totp"),
  
  // TOTP (Time-based One-Time Password) Settings
  totp_secret: model.text().nullable(),
  totp_backup_codes: model.json().nullable(), // Array of backup codes
  totp_backup_codes_used: model.json().default([]),
  
  // SMS Settings
  phone_number: model.text().nullable(),
  phone_verified: model.boolean().default(false),
  phone_verification_code: model.text().nullable(),
  phone_verification_expires: model.dateTime().nullable(),
  
  // Email Settings
  email_verified: model.boolean().default(false),
  email_verification_code: model.text().nullable(),
  email_verification_expires: model.dateTime().nullable(),
  
  // Hardware Key Settings
  hardware_keys: model.json().default([]), // Array of registered hardware keys
  
  // Recovery Options
  recovery_email: model.text().nullable(),
  recovery_phone: model.text().nullable(),
  
  // Security Settings
  require_2fa_for_admin: model.boolean().default(true),
  require_2fa_for_sensitive_actions: model.boolean().default(true),
  remember_device_days: model.number().default(30),
  
  // Usage Tracking
  last_used_at: model.dateTime().nullable(),
  successful_attempts: model.number().default(0),
  failed_attempts: model.number().default(0),
  
  // Emergency Access
  emergency_access_codes: model.json().nullable(),
  emergency_codes_used: model.json().default([]),
  
  // Device Trust
  trusted_devices: model.json().default([]), // Array of trusted device fingerprints
  
  // Timestamps
  enabled_at: model.dateTime().nullable(),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
TwoFactorAuth.belongsTo(() => import("../../user/models/User").then(m => m.default), {
  foreignKey: "user_id"
})

export default TwoFactorAuth





