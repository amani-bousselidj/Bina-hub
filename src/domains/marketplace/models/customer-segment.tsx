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

export enum SegmentType {
  DYNAMIC = "dynamic",
  STATIC = "static",
  BEHAVIORAL = "behavioral",
  DEMOGRAPHIC = "demographic",
  GEOGRAPHIC = "geographic",
  PSYCHOGRAPHIC = "psychographic",
}

export enum SegmentCriteriaOperator {
  EQUALS = "equals",
  NOT_EQUALS = "not_equals",
  GREATER_THAN = "greater_than",
  LESS_THAN = "less_than",
  GREATER_THAN_OR_EQUAL = "greater_than_or_equal",
  LESS_THAN_OR_EQUAL = "less_than_or_equal",
  CONTAINS = "contains",
  NOT_CONTAINS = "not_contains",
  STARTS_WITH = "starts_with",
  ENDS_WITH = "ends_with",
  IN = "in",
  NOT_IN = "not_in",
  IS_NULL = "is_null",
  IS_NOT_NULL = "is_not_null",
  BETWEEN = "between",
  NOT_BETWEEN = "not_between",
}

export enum SegmentStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
  ARCHIVED = "archived",
}

@Entity({ tableName: "customer_segment" })
export class CustomerSegment {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Enum(() => SegmentType)
  type!: SegmentType

  @Enum(() => SegmentStatus)
  status: SegmentStatus = SegmentStatus.DRAFT

  // Segment criteria configuration
  @Property({ columnType: "jsonb" })
  criteria!: {
    conditions: Array<{
      field: string // e.g., "total_spent", "order_count", "last_order_date", "email"
      operator: SegmentCriteriaOperator
      value: any
      data_type: "string" | "number" | "date" | "boolean" | "array"
    }>
    logic: "AND" | "OR" // How to combine multiple conditions
  }

  // Auto-update settings for dynamic segments
  @Property({ columnType: "boolean", default: false })
  auto_update: boolean = false

  @Property({ columnType: "integer", nullable: true })
  refresh_interval_hours?: number // How often to recalculate dynamic segments

  // Segment statistics
  @Property({ columnType: "integer", default: 0 })
  customer_count: number = 0

  @Property({ columnType: "timestamptz", nullable: true })
  last_calculated_at?: Date

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => CustomerSegmentMember, (member) => member.segment)
  members = new Collection<CustomerSegmentMember>(this)

  @OneToMany(() => EmailCampaign, (campaign) => campaign.target_segment)
  email_campaigns = new Collection<EmailCampaign>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "cseg")
    }
  }
}

@Entity({ tableName: "customer_segment_member" })
export class CustomerSegmentMember {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  segment_id!: string

  @Property({ columnType: "text" })
  customer_id!: string

  @Property({ columnType: "timestamptz" })
  added_at: Date = new Date()

  @Property({ columnType: "boolean", default: false })
  manually_added: boolean = false // true if manually added, false if auto-calculated

  @ManyToOne(() => CustomerSegment)
  segment!: CustomerSegment

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "csegmem")
    }
  }
}

export enum CampaignType {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in_app",
  WEBHOOK = "webhook",
}

export enum CampaignStatus {
  DRAFT = "draft",
  SCHEDULED = "scheduled",
  RUNNING = "running",
  PAUSED = "paused",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum TriggerType {
  MANUAL = "manual",
  SCHEDULED = "scheduled",
  EVENT_BASED = "event_based",
  ABANDONED_CART = "abandoned_cart",
  WELCOME_SERIES = "welcome_series",
  WIN_BACK = "win_back",
  BIRTHDAY = "birthday",
  MILESTONE = "milestone",
}

@Entity({ tableName: "email_campaign" })
export class EmailCampaign {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Enum(() => CampaignType)
  type: CampaignType = CampaignType.EMAIL

  @Enum(() => CampaignStatus)
  status: CampaignStatus = CampaignStatus.DRAFT

  @Enum(() => TriggerType)
  trigger_type!: TriggerType

  // Target segment
  @Property({ columnType: "text", nullable: true })
  target_segment_id?: string

  @ManyToOne(() => CustomerSegment)
  target_segment?: CustomerSegment

  // Email content
  @Property({ columnType: "text" })
  subject!: string

  @Property({ columnType: "text", nullable: true })
  from_name?: string

  @Property({ columnType: "text", nullable: true })
  from_email?: string

  @Property({ columnType: "text", nullable: true })
  reply_to?: string

  @Property({ columnType: "text" })
  html_content!: string

  @Property({ columnType: "text", nullable: true })
  text_content?: string

  // Scheduling
  @Property({ columnType: "timestamptz", nullable: true })
  scheduled_at?: Date

  @Property({ columnType: "jsonb", nullable: true })
  recurring_schedule?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly"
    interval: number // e.g., every 2 weeks
    days_of_week?: number[] // 0-6, Sunday=0
    day_of_month?: number // 1-31
    end_date?: string
  }

  // Event-based trigger configuration
  @Property({ columnType: "jsonb", nullable: true })
  trigger_config?: {
    event_name?: string // e.g., "cart_abandoned", "order_placed"
    delay_minutes?: number // Wait time before sending
    conditions?: Array<{
      field: string
      operator: string
      value: any
    }>
  }

  // Campaign statistics
  @Property({ columnType: "integer", default: 0 })
  sent_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  delivered_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  opened_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  clicked_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  unsubscribed_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  bounced_count: number = 0

  @Property({ columnType: "timestamptz", nullable: true })
  last_sent_at?: Date

  // A/B testing
  @Property({ columnType: "boolean", default: false })
  is_ab_test: boolean = false

  @Property({ columnType: "jsonb", nullable: true })
  ab_test_config?: {
    test_percentage: number // 0-100
    subject_variants?: string[]
    content_variants?: string[]
    winner_criteria: "open_rate" | "click_rate" | "conversion_rate"
    test_duration_hours: number
  }

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => CampaignDelivery, (delivery) => delivery.campaign)
  deliveries = new Collection<CampaignDelivery>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "ecmp")
    }
  }
}

export enum DeliveryStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  OPENED = "opened",
  CLICKED = "clicked",
  BOUNCED = "bounced",
  FAILED = "failed",
  UNSUBSCRIBED = "unsubscribed",
}

@Entity({ tableName: "campaign_delivery" })
export class CampaignDelivery {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  campaign_id!: string

  @Property({ columnType: "text" })
  customer_id!: string

  @Property({ columnType: "text" })
  email_address!: string

  @Enum(() => DeliveryStatus)
  status: DeliveryStatus = DeliveryStatus.PENDING

  @Property({ columnType: "timestamptz", nullable: true })
  sent_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  delivered_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  opened_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  clicked_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  bounced_at?: Date

  @Property({ columnType: "text", nullable: true })
  bounce_reason?: string

  @Property({ columnType: "text", nullable: true })
  failure_reason?: string

  // Tracking
  @Property({ columnType: "text", nullable: true })
  tracking_id?: string

  @Property({ columnType: "text", nullable: true })
  message_id?: string // External email service message ID

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @ManyToOne(() => EmailCampaign)
  campaign!: EmailCampaign

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "cmpdeliv")
    }
  }
}





