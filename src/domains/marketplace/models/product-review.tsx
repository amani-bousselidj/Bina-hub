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

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  SPAM = "spam",
}

export enum ReviewType {
  PRODUCT = "product",
  ORDER = "order",
  VENDOR = "vendor",
  SERVICE = "service",
}

@Entity({ tableName: "product_review" })
export class ProductReview {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  product_id!: string

  @Property({ columnType: "text", nullable: true })
  customer_id?: string

  @Property({ columnType: "text", nullable: true })
  order_id?: string // Verified purchase tracking

  @Property({ columnType: "text" })
  customer_name!: string

  @Property({ columnType: "text" })
  customer_email!: string

  @Enum(() => ReviewType)
  type: ReviewType = ReviewType.PRODUCT

  @Enum(() => ReviewStatus)
  status: ReviewStatus = ReviewStatus.PENDING

  // Rating (1-5 stars)
  @Property({ columnType: "integer" })
  rating!: number

  @Property({ columnType: "text" })
  title!: string

  @Property({ columnType: "text" })
  content!: string

  // Review metadata
  @Property({ columnType: "boolean", default: false })
  is_verified_purchase: boolean = false

  @Property({ columnType: "boolean", default: false })
  is_anonymous: boolean = false

  @Property({ columnType: "text", nullable: true })
  variant_id?: string // Specific variant reviewed

  // Helpfulness tracking
  @Property({ columnType: "integer", default: 0 })
  helpful_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  not_helpful_count: number = 0

  // Media attachments
  @Property({ columnType: "jsonb", nullable: true })
  images?: Array<{
    url: string
    alt_text?: string
    caption?: string
  }>

  @Property({ columnType: "jsonb", nullable: true })
  videos?: Array<{
    url: string
    thumbnail?: string
    caption?: string
  }>

  // Moderation
  @Property({ columnType: "text", nullable: true })
  moderation_notes?: string

  @Property({ columnType: "text", nullable: true })
  rejection_reason?: string

  @Property({ columnType: "timestamptz", nullable: true })
  moderated_at?: Date

  @Property({ columnType: "text", nullable: true })
  moderated_by?: string

  // Response from merchant
  @Property({ columnType: "text", nullable: true })
  merchant_response?: string

  @Property({ columnType: "timestamptz", nullable: true })
  merchant_response_at?: Date

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => ReviewVote, (vote) => vote.review)
  votes = new Collection<ReviewVote>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "rev")
    }
  }
}

export enum VoteType {
  HELPFUL = "helpful",
  NOT_HELPFUL = "not_helpful",
}

@Entity({ tableName: "review_vote" })
export class ReviewVote {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  review_id!: string

  @Property({ columnType: "text", nullable: true })
  customer_id?: string

  @Property({ columnType: "text", nullable: true })
  ip_address?: string // For anonymous voting

  @Enum(() => VoteType)
  vote_type!: VoteType

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @ManyToOne(() => ProductReview)
  review!: ProductReview

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "revvote")
    }
  }
}

@Entity({ tableName: "review_summary" })
export class ReviewSummary {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", unique: true })
  product_id!: string

  @Property({ columnType: "integer", default: 0 })
  total_reviews: number = 0

  @Property({ columnType: "numeric", precision: 3, scale: 2, default: 0 })
  average_rating: number = 0

  // Rating distribution
  @Property({ columnType: "integer", default: 0 })
  rating_1_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  rating_2_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  rating_3_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  rating_4_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  rating_5_count: number = 0

  // Review quality metrics
  @Property({ columnType: "integer", default: 0 })
  verified_reviews_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  reviews_with_images_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  reviews_with_videos_count: number = 0

  @Property({ columnType: "timestamptz", nullable: true })
  last_review_at?: Date

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "revsum")
    }
  }
}

export enum IncentiveType {
  DISCOUNT = "discount",
  POINTS = "points",
  FREE_SHIPPING = "free_shipping",
  GIFT_CARD = "gift_card",
}

export enum IncentiveStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SCHEDULED = "scheduled",
  EXPIRED = "expired",
}

@Entity({ tableName: "review_incentive" })
export class ReviewIncentive {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Enum(() => IncentiveType)
  incentive_type!: IncentiveType

  @Enum(() => IncentiveStatus)
  status: IncentiveStatus = IncentiveStatus.ACTIVE

  // Incentive configuration
  @Property({ columnType: "jsonb" })
  incentive_config!: {
    discount_percentage?: number
    discount_amount?: number
    points_amount?: number
    gift_card_amount?: number
    free_shipping?: boolean
    minimum_rating?: number // Minimum rating required for incentive
    require_images?: boolean
    require_minimum_length?: number
  }

  // Trigger conditions
  @Property({ columnType: "jsonb" })
  trigger_conditions!: {
    days_after_purchase?: number
    order_status?: string[]
    product_categories?: string[]
    customer_segments?: string[]
    minimum_order_value?: number
  }

  // Usage tracking
  @Property({ columnType: "integer", default: 0 })
  invitations_sent: number = 0

  @Property({ columnType: "integer", default: 0 })
  reviews_submitted: number = 0

  @Property({ columnType: "integer", default: 0 })
  incentives_claimed: number = 0

  // Date restrictions
  @Property({ columnType: "timestamptz", nullable: true })
  starts_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  ends_at?: Date

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => ReviewInvitation, (invitation) => invitation.incentive)
  invitations = new Collection<ReviewInvitation>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "revinc")
    }
  }
}

export enum InvitationStatus {
  SENT = "sent",
  OPENED = "opened",
  CLICKED = "clicked",
  REVIEWED = "reviewed",
  EXPIRED = "expired",
}

@Entity({ tableName: "review_invitation" })
export class ReviewInvitation {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  incentive_id!: string

  @Property({ columnType: "text" })
  customer_id!: string

  @Property({ columnType: "text" })
  order_id!: string

  @Property({ columnType: "text" })
  product_id!: string

  @Property({ columnType: "text" })
  email_address!: string

  @Enum(() => InvitationStatus)
  status: InvitationStatus = InvitationStatus.SENT

  @Property({ columnType: "text", unique: true })
  invitation_token!: string

  @Property({ columnType: "timestamptz" })
  sent_at: Date = new Date()

  @Property({ columnType: "timestamptz", nullable: true })
  opened_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  clicked_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  reviewed_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  expires_at?: Date

  @Property({ columnType: "text", nullable: true })
  review_id?: string // Link to submitted review

  @Property({ columnType: "boolean", default: false })
  incentive_claimed: boolean = false

  @Property({ columnType: "timestamptz", nullable: true })
  incentive_claimed_at?: Date

  @ManyToOne(() => ReviewIncentive)
  incentive!: ReviewIncentive

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "revinvite")
    }
  }
}





