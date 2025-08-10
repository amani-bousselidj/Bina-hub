// @ts-nocheck
import { model, ProductUtils } from "@medusajs/framework/utils"

import ProductCategory from "./product-category"
import ProductCollection from "./product-collection"
import ProductImage from "./product-image"
import ProductOption from "./product-option"
import ProductTag from "./product-tag"
import ProductType from "./product-type"
import ProductVariant from "./product-variant"
import ProductBundle from "./product-bundle"
import ProductConfigurator from "./product-configurator"
import ProductDigital from "./product-digital"
import ProductSubscription from "./product-subscription"

const Product = model
  .define("Product", {
    id: model.id({ prefix: "prod" }).primaryKey(),
    title: model.text().searchable(),
    handle: model.text(),
    subtitle: model.text().searchable().nullable(),
    description: model.text().searchable().nullable(),
    is_giftcard: model.boolean().default(false),
    status: model
      .enum(ProductUtils.ProductStatus)
      .default(ProductUtils.ProductStatus.DRAFT),
    thumbnail: model.text().nullable(),
    weight: model.text().nullable(),
    length: model.text().nullable(),
    height: model.text().nullable(),
    width: model.text().nullable(),
    origin_country: model.text().nullable(),
    hs_code: model.text().nullable(),
    mid_code: model.text().nullable(),
    material: model.text().nullable(),
    discountable: model.boolean().default(true),
    external_id: model.text().nullable(),
    metadata: model.json().nullable(),
    variants: model.hasMany(() => ProductVariant, {
      mappedBy: "product",
    }),
    type: model
      .belongsTo(() => ProductType, {
        mappedBy: "products",
      })
      .nullable(),
    tags: model.manyToMany(() => ProductTag, {
      mappedBy: "products",
      pivotTable: "product_tags",
    }),
    options: model.hasMany(() => ProductOption, {
      mappedBy: "product",
    }),
    images: model.hasMany(() => ProductImage, {
      mappedBy: "product",
    }),
    collection: model
      .belongsTo(() => ProductCollection, {
        mappedBy: "products",
      })
      .nullable(),
    categories: model.manyToMany(() => ProductCategory, {
      pivotTable: "product_category_product",
      mappedBy: "products",
    }),
    bundles: model.hasMany(() => ProductBundle, {
      mappedBy: "bundle",
    }),
    bundle_items: model.hasMany(() => ProductBundle, {
      mappedBy: "item",
    }),
    configurators: model.hasMany(() => ProductConfigurator, {
      mappedBy: "product",
    }),
    is_bundle: model.boolean().default(false),
    bundle_type: model.enum(["fixed", "dynamic", "kit"]).nullable(),
    // Add digital product relationship
    digital_info: model.hasOne(() => ProductDigital, {
      mappedBy: "product",
    }),
    // Add subscription relationship
    subscription_info: model.hasOne(() => ProductSubscription, {
      mappedBy: "product",
    }),
    // Add product type indicators
    is_digital: model.boolean().default(false),
    is_subscription: model.boolean().default(false),
  })
  .cascades({
    delete: ["variants", "options", "images", "bundles", "configurators", "digital_info", "subscription_info"],
  })
  .indexes([
    {
      name: "IDX_product_handle_unique",
      on: ["handle"],
      unique: true,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_type_id",
      on: ["type_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
    {
      name: "IDX_product_collection_id",
      on: ["collection_id"],
      unique: false,
      where: "deleted_at IS NULL",
    },
  ])

export default Product





