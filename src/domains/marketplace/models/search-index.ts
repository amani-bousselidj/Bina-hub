// @ts-nocheck
import { model } from "@medusajs/framework/utils"

const SearchIndex = model.define("search_index", {
  id: model.id().primaryKey(),
  
  // Indexed Item
  item_type: model.enum(["product", "category", "collection", "content", "customer"]),
  item_id: model.text(),
  
  // Search Content
  title: model.text(),
  description: model.text().nullable(),
  content: model.text().nullable(),
  tags: model.json().nullable(), // Array of search tags
  
  // Search Attributes
  searchable_attributes: model.json(), // Key-value pairs for faceted search
  filterable_attributes: model.json(), // Attributes that can be filtered
  
  // Search Metadata
  search_weight: model.number().default(1.0), // Relevance weight
  popularity_score: model.number().default(0), // Based on clicks, purchases
  
  // SEO and Synonyms
  keywords: model.json().nullable(), // Array of additional keywords
  synonyms: model.json().nullable(), // Alternative search terms
  
  // Status
  is_active: model.boolean().default(true),
  indexed_at: model.dateTime().default(new Date()),
  
  // Full-Text Search Vectors (for PostgreSQL)
  search_vector: model.text().nullable(),
  
  // Timestamps
  created_at: model.dateTime().default(new Date()),
  updated_at: model.dateTime().default(new Date()),
})

export default SearchIndex





