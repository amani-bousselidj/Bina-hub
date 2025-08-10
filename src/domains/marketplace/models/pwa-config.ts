// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const PWAConfig = model.define("pwa_config", {
  id: model.id().primaryKey(),
  
  // App Identity
  app_name: model.text(),
  app_short_name: model.text(),
  app_description: model.text(),
  
  // Visual Configuration
  theme_color: model.text().default("#000000"),
  background_color: model.text().default("#ffffff"),
  display: model.enum(["fullscreen", "standalone", "minimal-ui", "browser"]).default("standalone"),
  orientation: model.enum(["any", "natural", "landscape", "portrait"]).default("any"),
  
  // Icons
  icon_192: model.text().nullable(),
  icon_512: model.text().nullable(),
  apple_touch_icon: model.text().nullable(),
  favicon: model.text().nullable(),
  
  // App Configuration
  start_url: model.text().default("/"),
  scope: model.text().default("/"),
  
  // Features
  offline_enabled: model.boolean().default(true),
  push_notifications_enabled: model.boolean().default(false),
  background_sync_enabled: model.boolean().default(false),
  
  // Caching Strategy
  cache_strategy: model.enum(["cache_first", "network_first", "stale_while_revalidate"]).default("stale_while_revalidate"),
  cache_duration_hours: model.number().default(24),
  offline_pages: model.json().default([]), // Array of pages to cache for offline use
  
  // Install Prompt
  install_prompt_enabled: model.boolean().default(true),
  install_prompt_delay_days: model.number().default(3),
  install_prompt_min_visits: model.number().default(5),
  
  // Update Strategy
  auto_update_enabled: model.boolean().default(true),
  update_check_frequency_hours: model.number().default(6),
  force_update_after_days: model.number().default(30),
  
  // Analytics
  track_app_installs: model.boolean().default(true),
  track_offline_usage: model.boolean().default(true),
  track_push_notifications: model.boolean().default(true),
  
  // Platform Specific
  ios_status_bar_style: model.enum(["default", "black", "black-translucent"]).default("default"),
  android_splash_screen: model.text().nullable(),
  windows_tile_color: model.text().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default PWAConfig





