// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const Localization = model.define("localization", {
  id: model.id().primaryKey(),
  
  // Language Configuration
  default_language: model.enum(["ar", "en", "ar-SA", "en-SA"]).default("ar-SA"),
  supported_languages: model.json().default(["ar-SA", "en-SA"]),
  rtl_enabled: model.boolean().default(true),
  
  // Arabic Settings
  arabic_font_family: model.text().default("Noto Sans Arabic"),
  arabic_calendar_enabled: model.boolean().default(true),
  hijri_calendar_enabled: model.boolean().default(true),
  
  // Regional Settings
  country_code: model.text().default("SA"),
  currency_code: model.text().default("SAR"),
  timezone: model.text().default("Asia/Riyadh"),
  
  // Number Formatting
  arabic_numerals: model.boolean().default(true), // Use Arabic-Indic numerals
  currency_format: model.text().default("{amount} ر.س"),
  decimal_separator: model.text().default("."),
  thousands_separator: model.text().default(","),
  
  // Date/Time Formatting
  date_format: model.text().default("YYYY/MM/DD"),
  time_format: model.text().default("HH:mm"),
  week_starts_on: model.enum(["saturday", "sunday", "monday"]).default("saturday"),
  
  // Prayer Times Integration
  prayer_times_enabled: model.boolean().default(false),
  city: model.text().default("Riyadh"),
  prayer_calculation_method: model.enum(["mecca", "egypt", "karachi", "tehran"]).default("mecca"),
  
  // Business Hours
  business_hours: model.json().default({
    saturday: { open: "09:00", close: "22:00", breaks: [{ start: "12:00", end: "13:00" }, { start: "17:30", end: "18:00" }] },
    sunday: { open: "09:00", close: "22:00", breaks: [{ start: "12:00", end: "13:00" }, { start: "17:30", end: "18:00" }] },
    monday: { open: "09:00", close: "22:00", breaks: [{ start: "12:00", end: "13:00" }, { start: "17:30", end: "18:00" }] },
    tuesday: { open: "09:00", close: "22:00", breaks: [{ start: "12:00", end: "13:00" }, { start: "17:30", end: "18:00" }] },
    wednesday: { open: "09:00", close: "22:00", breaks: [{ start: "12:00", end: "13:00" }, { start: "17:30", end: "18:00" }] },
    thursday: { open: "09:00", close: "22:00", breaks: [{ start: "12:00", end: "13:00" }, { start: "17:30", end: "18:00" }] },
    friday: { open: "14:00", close: "22:00", breaks: [] } // Friday prayer consideration
  }),
  
  // Seasonal Adjustments
  ramadan_hours_enabled: model.boolean().default(true),
  ramadan_business_hours: model.json().nullable(),
  
  // Address Format
  address_format: model.text().default("{building_number} {street_name}, {district}, {city} {postal_code}, {country}"),
  arabic_address_enabled: model.boolean().default(true),
  
  // Communication Preferences
  sms_language: model.enum(["ar", "en", "both"]).default("ar"),
  email_language: model.enum(["ar", "en", "both"]).default("both"),
  whatsapp_enabled: model.boolean().default(true),
  
  // Cultural Settings
  family_account_structure: model.boolean().default(true),
  gender_specific_products: model.boolean().default(false),
  modest_fashion_categories: model.boolean().default(true),
  
  // Legal/Compliance
  terms_language: model.enum(["ar", "en", "both"]).default("both"),
  privacy_policy_language: model.enum(["ar", "en", "both"]).default("both"),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default Localization





