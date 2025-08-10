// @ts-nocheck
import { DAL } from "@medusajs/framework/utils"
import {
  BeforeCreate,
  Entity,
  OnInit,
  PrimaryKey,
  Property,
  Enum,
  Collection,
  OneToMany,
  ManyToOne,
} from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/framework/utils"

export enum AutomationType {
  ABANDONED_CART = "abandoned_cart",
  WELCOME_SERIES = "welcome_series",
  WIN_BACK = "win_back",
  PRODUCT_RECOMMENDATION = "product_recommendation",
  CROSS_SELL = "cross_sell",
  UP_SELL = "up_sell",
  BIRTHDAY = "birthday",
  REVIEW_REQUEST = "review_request",
  RESTOCKING_ALERT = "restocking_alert",
  PRICE_DROP = "price_drop",
}

export enum AutomationStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

export enum TriggerCondition {
  CART_ABANDONED = "cart_abandoned",
  USER_REGISTERED = "user_registered",
  ORDER_PLACED = "order_placed",
  PRODUCT_VIEWED = "product_viewed",
  WISHLIST_ADDED = "wishlist_added",
  NO_PURCHASE = "no_purchase",
  BIRTHDAY = "birthday",
  PRODUCT_BACK_IN_STOCK = "product_back_in_stock",
  PRICE_CHANGED = "price_changed",
}

@Entity({ tableName: "marketing_automation" })
export class MarketingAutomation {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Enum(() => AutomationType)
  type!: AutomationType

  @Enum(() => AutomationStatus)
  status: AutomationStatus = AutomationStatus.DRAFT

  @Enum(() => TriggerCondition)
  trigger_condition!: TriggerCondition

  // Trigger configuration
  @Property({ columnType: "jsonb" })
  trigger_config!: {
    delay_minutes?: number // Wait time before triggering
    conditions?: Array<{
      field: string
      operator: string
      value: any
    }>
    filters?: {
      customer_segments?: string[]
      product_categories?: string[]
      order_value_min?: number
      order_value_max?: number
    }
  }

  // Action configuration
  @Property({ columnType: "jsonb" })
  action_config!: {
    email_template_id?: string
    sms_template_id?: string
    discount_code?: string
    product_recommendations?: {
      algorithm: "collaborative" | "content_based" | "trending" | "category_based"
      count: number
      filters?: Record<string, any>
    }
    custom_actions?: Array<{
      type: string
      config: Record<string, any>
    }>
  }

  // Success conditions (when to stop the automation)
  @Property({ columnType: "jsonb", nullable: true })
  success_conditions?: {
    order_placed?: boolean
    email_clicked?: boolean
    product_purchased?: boolean
    custom_event?: string
  }

  // Statistics
  @Property({ columnType: "integer", default: 0 })
  triggered_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  completed_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  success_count: number = 0

  @Property({ columnType: "numeric", precision: 5, scale: 2, default: 0 })
  conversion_rate: number = 0

  @Property({ columnType: "timestamptz", nullable: true })
  last_triggered_at?: Date

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => AutomationExecution, (execution) => execution.automation)
  executions = new Collection<AutomationExecution>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "mauto")
    }
  }
}

export enum ExecutionStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  SUCCESS = "success", // When success condition is met
}

@Entity({ tableName: "automation_execution" })
export class AutomationExecution {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  automation_id!: string

  @Property({ columnType: "text" })
  customer_id!: string

  @Property({ columnType: "text", nullable: true })
  trigger_data_id?: string // e.g., cart_id, order_id, product_id

  @Enum(() => ExecutionStatus)
  status: ExecutionStatus = ExecutionStatus.PENDING

  @Property({ columnType: "timestamptz" })
  triggered_at: Date = new Date()

  @Property({ columnType: "timestamptz", nullable: true })
  scheduled_for?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  started_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  completed_at?: Date

  @Property({ columnType: "text", nullable: true })
  failure_reason?: string

  // Result tracking
  @Property({ columnType: "jsonb", nullable: true })
  result_data?: {
    emails_sent?: number
    sms_sent?: number
    discounts_applied?: number
    recommendations_shown?: number
    actions_performed?: Array<{
      type: string
      timestamp: string
      success: boolean
      data?: any
    }>
  }

  // Success tracking
  @Property({ columnType: "boolean", default: false })
  success_achieved: boolean = false

  @Property({ columnType: "text", nullable: true })
  success_reason?: string

  @Property({ columnType: "timestamptz", nullable: true })
  success_at?: Date

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @ManyToOne(() => MarketingAutomation)
  automation!: MarketingAutomation

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "autoexec")
    }
  }
}

export enum RecommendationType {
  PRODUCT = "product",
  CATEGORY = "category",
  BUNDLE = "bundle",
  CROSS_SELL = "cross_sell",
  UP_SELL = "up_sell",
}

export enum RecommendationAlgorithm {
  COLLABORATIVE_FILTERING = "collaborative_filtering",
  CONTENT_BASED = "content_based",
  TRENDING = "trending",
  FREQUENTLY_BOUGHT_TOGETHER = "frequently_bought_together",
  RECENTLY_VIEWED = "recently_viewed",
  CATEGORY_BASED = "category_based",
  PRICE_BASED = "price_based",
}

@Entity({ tableName: "product_recommendation" })
export class ProductRecommendation {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  customer_id?: string // null for anonymous users

  @Property({ columnType: "text", nullable: true })
  session_id?: string // For anonymous tracking

  @Property({ columnType: "text" })
  context!: string // "product_page", "cart", "checkout", "email", etc.

  @Property({ columnType: "text", nullable: true })
  context_product_id?: string // Product being viewed when rec was generated

  @Enum(() => RecommendationType)
  type!: RecommendationType

  @Enum(() => RecommendationAlgorithm)
  algorithm!: RecommendationAlgorithm

  @Property({ columnType: "jsonb" })
  recommended_products!: Array<{
    product_id: string
    score: number // Confidence score 0-1
    reason?: string // "frequently bought together", "similar customers liked", etc.
    metadata?: Record<string, any>
  }>

  // Performance tracking
  @Property({ columnType: "integer", default: 0 })
  view_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  click_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  add_to_cart_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  purchase_count: number = 0

  @Property({ columnType: "numeric", precision: 10, scale: 2, default: 0 })
  revenue_generated: number = 0

  @Property({ columnType: "timestamptz", nullable: true })
  last_viewed_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  last_clicked_at?: Date

  // Expiration
  @Property({ columnType: "timestamptz", nullable: true })
  expires_at?: Date

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "prodrec")
    }
  }
}

@Entity({ tableName: "wishlist" })
export class Wishlist {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  customer_id!: string

  @Property({ columnType: "text" })
  name: string = "My Wishlist"

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Property({ columnType: "boolean", default: false })
  is_public: boolean = false

  @Property({ columnType: "jsonb" })
  items!: Array<{
    product_id: string
    variant_id?: string
    quantity?: number
    added_at: string
    notes?: string
    priority?: number // 1-5
  }>

  // Statistics
  @Property({ columnType: "integer", default: 0 })
  item_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  share_count: number = 0

  @Property({ columnType: "timestamptz", nullable: true })
  last_updated_at?: Date

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "wish")
    }
  }
}





