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

export enum GiftCardType {
  DIGITAL = "digital",
  PHYSICAL = "physical",
  VIRTUAL = "virtual",
}

export enum GiftCardStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
  USED = "used",
  CANCELLED = "cancelled",
}

export enum DeliveryMethod {
  EMAIL = "email",
  SMS = "sms",
  PRINT = "print",
  PHYSICAL_MAIL = "physical_mail",
}

@Entity({ tableName: "gift_card" })
export class GiftCard {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", unique: true })
  code!: string

  @Enum(() => GiftCardType)
  type!: GiftCardType

  @Enum(() => GiftCardStatus)
  status: GiftCardStatus = GiftCardStatus.ACTIVE

  @Enum(() => DeliveryMethod)
  delivery_method!: DeliveryMethod

  // Financial details
  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  original_amount!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  current_balance!: number

  @Property({ columnType: "text" })
  currency_code!: string

  // Purchaser information
  @Property({ columnType: "text", nullable: true })
  purchaser_customer_id?: string

  @Property({ columnType: "text", nullable: true })
  purchaser_order_id?: string

  @Property({ columnType: "text" })
  purchaser_name!: string

  @Property({ columnType: "text" })
  purchaser_email!: string

  // Recipient information
  @Property({ columnType: "text" })
  recipient_name!: string

  @Property({ columnType: "text" })
  recipient_email!: string

  @Property({ columnType: "text", nullable: true })
  recipient_phone?: string

  @Property({ columnType: "text", nullable: true })
  personal_message?: string

  // Delivery details
  @Property({ columnType: "timestamptz", nullable: true })
  scheduled_delivery_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  delivered_at?: Date

  @Property({ columnType: "boolean", default: false })
  is_delivered: boolean = false

  // Expiration
  @Property({ columnType: "timestamptz", nullable: true })
  expires_at?: Date

  @Property({ columnType: "boolean", default: false })
  never_expires: boolean = false

  // Design customization
  @Property({ columnType: "text", nullable: true })
  template_id?: string

  @Property({ columnType: "jsonb", nullable: true })
  design_config?: {
    background_image?: string
    background_color?: string
    text_color?: string
    font_family?: string
    custom_css?: string
  }

  // Usage restrictions
  @Property({ columnType: "numeric", precision: 10, scale: 2, nullable: true })
  minimum_order_amount?: number

  @Property({ columnType: "jsonb", nullable: true })
  applicable_products?: string[]

  @Property({ columnType: "jsonb", nullable: true })
  applicable_categories?: string[]

  @Property({ columnType: "jsonb", nullable: true })
  excluded_products?: string[]

  @Property({ columnType: "jsonb", nullable: true })
  excluded_categories?: string[]

  // Physical gift card details
  @Property({ columnType: "jsonb", nullable: true })
  physical_details?: {
    shipping_address: {
      first_name: string
      last_name: string
      company?: string
      address_line_1: string
      address_line_2?: string
      city: string
      state?: string
      postal_code: string
      country_code: string
      phone?: string
    }
    tracking_number?: string
    carrier?: string
    shipped_at?: string
  }

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => GiftCardTransaction, (transaction) => transaction.gift_card)
  transactions = new Collection<GiftCardTransaction>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "gc")
    }
  }
}

export enum TransactionType {
  PURCHASE = "purchase",
  REDEMPTION = "redemption",
  REFUND = "refund",
  EXPIRATION = "expiration",
  ADJUSTMENT = "adjustment",
  TRANSFER = "transfer",
}

@Entity({ tableName: "gift_card_transaction" })
export class GiftCardTransaction {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  gift_card_id!: string

  @Enum(() => TransactionType)
  type!: TransactionType

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  amount!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  balance_before!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  balance_after!: number

  @Property({ columnType: "text", nullable: true })
  order_id?: string

  @Property({ columnType: "text", nullable: true })
  customer_id?: string

  @Property({ columnType: "text", nullable: true })
  reference?: string

  @Property({ columnType: "text", nullable: true })
  notes?: string

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @ManyToOne(() => GiftCard)
  gift_card!: GiftCard

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "gctx")
    }
  }
}

export enum StoreCreditType {
  REFUND = "refund",
  LOYALTY = "loyalty",
  COMPENSATION = "compensation",
  PROMOTIONAL = "promotional",
  MANUAL = "manual",
}

export enum StoreCreditStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  EXPIRED = "expired",
  USED = "used",
}

@Entity({ tableName: "store_credit" })
export class StoreCredit {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  customer_id!: string

  @Enum(() => StoreCreditType)
  type!: StoreCreditType

  @Enum(() => StoreCreditStatus)
  status: StoreCreditStatus = StoreCreditStatus.ACTIVE

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  original_amount!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  current_balance!: number

  @Property({ columnType: "text" })
  currency_code!: string

  @Property({ columnType: "text", nullable: true })
  reason?: string

  @Property({ columnType: "text", nullable: true })
  source_order_id?: string

  @Property({ columnType: "text", nullable: true })
  source_return_id?: string

  @Property({ columnType: "text", nullable: true })
  issued_by?: string // Admin user who issued the credit

  // Expiration
  @Property({ columnType: "timestamptz", nullable: true })
  expires_at?: Date

  @Property({ columnType: "boolean", default: false })
  never_expires: boolean = false

  // Usage restrictions
  @Property({ columnType: "numeric", precision: 10, scale: 2, nullable: true })
  minimum_order_amount?: number

  @Property({ columnType: "jsonb", nullable: true })
  applicable_products?: string[]

  @Property({ columnType: "jsonb", nullable: true })
  applicable_categories?: string[]

  @Property({ columnType: "jsonb", nullable: true })
  excluded_products?: string[]

  @Property({ columnType: "jsonb", nullable: true })
  excluded_categories?: string[]

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => StoreCreditTransaction, (transaction) => transaction.store_credit)
  transactions = new Collection<StoreCreditTransaction>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "sc")
    }
  }
}

@Entity({ tableName: "store_credit_transaction" })
export class StoreCreditTransaction {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  store_credit_id!: string

  @Enum(() => TransactionType)
  type!: TransactionType

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  amount!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  balance_before!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  balance_after!: number

  @Property({ columnType: "text", nullable: true })
  order_id?: string

  @Property({ columnType: "text", nullable: true })
  reference?: string

  @Property({ columnType: "text", nullable: true })
  notes?: string

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @ManyToOne(() => StoreCredit)
  store_credit!: StoreCredit

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "sctx")
    }
  }
}

@Entity({ tableName: "gift_card_template" })
export class GiftCardTemplate {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  @Property({ columnType: "text", nullable: true })
  preview_image?: string

  @Property({ columnType: "jsonb" })
  design_config!: {
    background_image?: string
    background_color: string
    text_color: string
    accent_color?: string
    font_family: string
    font_size: number
    layout: "classic" | "modern" | "minimal" | "festive"
    logo_url?: string
    border_style?: string
    border_color?: string
    custom_css?: string
  }

  @Property({ columnType: "jsonb" })
  layout_config!: {
    show_logo: boolean
    show_border: boolean
    show_background_pattern: boolean
    title_position: "top" | "center" | "bottom"
    message_position: "top" | "center" | "bottom"
    code_position: "top" | "center" | "bottom"
  }

  @Property({ columnType: "integer", default: 0 })
  usage_count: number = 0

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "gct")
    }
  }
}





