// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const StoreProductCatalog = model.define("store_product_catalog", {
  id: model.id().primaryKey(),
  store_id: model.text(),
  product_id: model.text(),
  
  // Store-Specific Product Configuration
  is_active: model.boolean().default(true),
  is_featured: model.boolean().default(false),
  sort_order: model.number().default(0),
  
  // Store-Specific Pricing
  override_price: model.boolean().default(false),
  store_price: model.number().nullable(),
  store_compare_price: model.number().nullable(),
  
  // Store-Specific Content
  override_title: model.boolean().default(false),
  store_title: model.text().nullable(),
  store_description: model.text().nullable(),
  store_images: model.json().nullable(),
  
  // Store-Specific SEO
  store_seo_title: model.text().nullable(),
  store_seo_description: model.text().nullable(),
  store_url_handle: model.text().nullable(),
  
  // Inventory Management
  track_inventory_separately: model.boolean().default(false),
  store_inventory_quantity: model.number().nullable(),
  store_inventory_policy: model.enum(["deny", "continue"]).nullable(),
  
  // Availability
  available_from: model.dateTime().nullable(),
  available_until: model.dateTime().nullable(),
  
  // Categories and Collections (Store-Specific)
  store_categories: model.json().nullable(),
  store_collections: model.json().nullable(),
  
  // Timestamps
  added_to_store_at: model.dateTime().default(new Date()),
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

// Relationships
StoreProductCatalog.belongsTo(() => import("./multi-store").then(m => m.default), {
  foreignKey: "store_id"
})

StoreProductCatalog.belongsTo(() => import("../../product/models/product").then(m => m.default), {
  foreignKey: "product_id"
})

// Unique constraint for store-product combination
StoreProductCatalog.indexes = [
  {
    unique: true,
    fields: ["store_id", "product_id"]
  }
]

export default StoreProductCatalog





