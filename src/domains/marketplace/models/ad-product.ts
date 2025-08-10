// @ts-nocheck
import { model } from "@medusajs/utils"

/**
 * Next-generation AI-powered product ads model for advanced advertising campaigns
 * Incorporates machine learning, voice commerce, and immersive features
 */
export const AdProduct = model.define("AdProduct", {
  id: model.id({ prefix: "adprd" }).primaryKey(),
  
  // Associations
  campaign_id: model.text().index(),
  ad_group_id: model.text().index(),
  product_id: model.text().index(), // Reference to the actual product being advertised
  
  // Enhanced AI-Powered Ad Creative Information
  headline: model.text().nullable(), // For Sponsored Brands
  description: model.text().nullable(),
  display_url: model.text().nullable(),
  landing_page_url: model.text().nullable(),
  
  // AI-Generated Content
  ai_generated_content: model.json().nullable(), // AI-created ad variations
  voice_ad_script: model.text().nullable(), // Voice commerce ad scripts
  multilingual_content: model.json().nullable(), // Arabic/English AI translations
  
  // Ad Assets (Enhanced with AI and AR/VR)
  logo_asset_id: model.text().nullable(), // Brand logo for Sponsored Brands
  image_assets: model.json().nullable(), // Array of image asset IDs
  video_asset_id: model.text().nullable(), // Video asset for video ads
  ar_model_asset_id: model.text().nullable(), // 3D/AR model asset
  vr_experience_id: model.text().nullable(), // VR showroom experience
  interactive_3d_model: model.text().nullable(), // Interactive 3D product model
  
  // Enhanced Status & Settings with AI Features
  status: model.enum(["active", "paused", "archived", "under_review", "rejected", "ai_optimizing"]).default("active"),
  ad_format: model.enum(["standard", "video", "brand_store", "ar_interactive", "vr_immersive", "voice_ad", "social_stream"]).default("standard"),
  
  // AI-Powered Bidding and Optimization
  custom_bid: model.bigNumber().nullable(),
  bid_adjustment: model.float().default(1.0),
  ai_bid_optimization: model.boolean().default(true), // Enable AI bid optimization
  ml_performance_score: model.float().nullable(), // Machine learning performance prediction
  ai_budget_distribution: model.json().nullable(), // AI-optimized budget allocation
  
  // Enhanced Product Targeting with AI
  product_targeting_enabled: model.boolean().default(false),
  target_asin_list: model.json().nullable(), // Array of target ASINs/Product IDs
  category_targeting: model.json().nullable(), // Target product categories
  ai_audience_segments: model.json().nullable(), // AI-generated audience segments
  lookalike_audiences: model.json().nullable(), // AI-created lookalike audiences
  behavioral_targeting: model.json().nullable(), // Behavior-based targeting data
  voice_search_keywords: model.json().nullable(), // Voice search optimization keywords
  
  // Advanced Performance Metrics
  impressions: model.bigNumber().default(0),
  clicks: model.bigNumber().default(0),
  spend: model.bigNumber().default(0),
  sales: model.bigNumber().default(0),
  orders: model.bigNumber().default(0),
  units_sold: model.bigNumber().default(0),
  
  // AI-Enhanced Attribution Metrics
  view_through_conversions: model.bigNumber().default(0),
  brand_searches: model.bigNumber().default(0),
  detail_page_views: model.bigNumber().default(0),
  voice_interactions: model.bigNumber().default(0), // Voice commerce interactions
  ar_engagements: model.bigNumber().default(0), // AR feature interactions
  vr_session_time: model.bigNumber().default(0), // VR experience duration
  social_engagements: model.bigNumber().default(0), // Social media interactions
  
  // AI-Calculated Metrics
  ctr: model.float().nullable(),
  cpc: model.bigNumber().nullable(),
  acos: model.float().nullable(),
  roas: model.float().nullable(),
  conversion_rate: model.float().nullable(),
  ai_quality_score: model.float().nullable(), // AI-generated quality score
  engagement_rate: model.float().nullable(), // Overall engagement rate
  voice_conversion_rate: model.float().nullable(), // Voice commerce conversion rate
  
  // Next-Generation Placement Performance
  placement_performance: model.json().nullable(), // Performance by placement (including AR/VR)
  immersive_performance: model.json().nullable(), // AR/VR specific performance data
  voice_placement_performance: model.json().nullable(), // Voice assistant placement performance
  social_platform_performance: model.json().nullable(), // Social media platform performance
  
  // AI-Enhanced Creative Performance
  creative_performance: model.json().nullable(), // Performance by different creative variations
  ai_content_performance: model.json().nullable(), // AI-generated content performance
  multimodal_performance: model.json().nullable(), // Cross-platform content performance
  personalization_performance: model.json().nullable(), // Personalized content performance
  
  // Sustainability and ESG Metrics
  carbon_footprint: model.float().nullable(), // Environmental impact of ad campaigns
  sustainability_score: model.float().nullable(), // ESG compliance score
  local_sourcing_preference: model.float().nullable(), // Local supplier preference weight
  
  // AI Learning and Optimization Data
  ai_learning_data: model.json().nullable(), // Machine learning training data
  optimization_history: model.json().nullable(), // Historical optimization changes
  a_b_test_data: model.json().nullable(), // A/B testing results and insights
  predictive_analytics: model.json().nullable(), // Future performance predictions
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
  deleted_at: model.dateTime().nullable(),
})

export default AdProduct





