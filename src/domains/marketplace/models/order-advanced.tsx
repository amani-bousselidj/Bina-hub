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

export enum WorkflowStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  APPROVED = "approved",
  REJECTED = "rejected",
  ON_HOLD = "on_hold",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum WorkflowType {
  ORDER_APPROVAL = "order_approval",
  PAYMENT_APPROVAL = "payment_approval",
  INVENTORY_APPROVAL = "inventory_approval",
  DISCOUNT_APPROVAL = "discount_approval",
  REFUND_APPROVAL = "refund_approval",
  CUSTOM = "custom",
}

export enum FulfillmentStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  PARTIALLY_FULFILLED = "partially_fulfilled",
  FULFILLED = "fulfilled",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum ShipmentStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  READY_TO_SHIP = "ready_to_ship",
  SHIPPED = "shipped",
  IN_TRANSIT = "in_transit",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  FAILED_DELIVERY = "failed_delivery",
  RETURNED = "returned",
}

@Entity({ tableName: "order_workflow" })
export class OrderWorkflow {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Enum(() => WorkflowType)
  type!: WorkflowType

  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  // Workflow configuration
  @Property({ columnType: "jsonb" })
  steps!: Array<{
    id: string
    name: string
    description?: string
    required: boolean
    auto_approve?: boolean
    approver_roles?: string[]
    conditions?: Array<{
      field: string
      operator: string
      value: any
    }>
    timeout_hours?: number
    actions?: Array<{
      type: string
      config: Record<string, any>
    }>
  }>

  // Trigger conditions
  @Property({ columnType: "jsonb", nullable: true })
  trigger_conditions?: {
    order_value_min?: number
    order_value_max?: number
    customer_groups?: string[]
    product_categories?: string[]
    payment_methods?: string[]
    shipping_countries?: string[]
    custom_conditions?: Array<{
      field: string
      operator: string
      value: any
    }>
  }

  // Statistics
  @Property({ columnType: "integer", default: 0 })
  total_executions: number = 0

  @Property({ columnType: "integer", default: 0 })
  approved_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  rejected_count: number = 0

  @Property({ columnType: "numeric", precision: 10, scale: 2, default: 0 })
  average_processing_time_hours: number = 0

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => OrderWorkflowExecution, (execution) => execution.workflow)
  executions = new Collection<OrderWorkflowExecution>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "owf")
    }
  }
}

@Entity({ tableName: "order_workflow_execution" })
export class OrderWorkflowExecution {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  workflow_id!: string

  @Property({ columnType: "text" })
  order_id!: string

  @Enum(() => WorkflowStatus)
  status: WorkflowStatus = WorkflowStatus.PENDING

  @Property({ columnType: "text", nullable: true })
  current_step_id?: string

  @Property({ columnType: "timestamptz" })
  started_at: Date = new Date()

  @Property({ columnType: "timestamptz", nullable: true })
  completed_at?: Date

  @Property({ columnType: "text", nullable: true })
  completed_by?: string // User ID

  @Property({ columnType: "text", nullable: true })
  rejection_reason?: string

  // Step tracking
  @Property({ columnType: "jsonb" })
  step_history!: Array<{
    step_id: string
    status: WorkflowStatus
    started_at: string
    completed_at?: string
    completed_by?: string
    notes?: string
    auto_approved?: boolean
  }>

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @ManyToOne(() => OrderWorkflow)
  workflow!: OrderWorkflow

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "owfexec")
    }
  }
}

@Entity({ tableName: "order_fulfillment" })
export class OrderFulfillment {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  order_id!: string

  @Property({ columnType: "text", unique: true })
  fulfillment_number!: string

  @Enum(() => FulfillmentStatus)
  status: FulfillmentStatus = FulfillmentStatus.NOT_STARTED

  @Property({ columnType: "text", nullable: true })
  warehouse_id?: string

  @Property({ columnType: "text", nullable: true })
  assigned_to?: string // Staff member ID

  // Fulfillment details
  @Property({ columnType: "jsonb" })
  items!: Array<{
    order_item_id: string
    product_id: string
    variant_id?: string
    quantity_requested: number
    quantity_fulfilled: number
    warehouse_location?: string
    batch_number?: string
    serial_numbers?: string[]
    expiry_date?: string
  }>

  // Dates
  @Property({ columnType: "timestamptz", nullable: true })
  expected_date?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  started_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  completed_at?: Date

  // Notes and tracking
  @Property({ columnType: "text", nullable: true })
  notes?: string

  @Property({ columnType: "text", nullable: true })
  internal_notes?: string

  @Property({ columnType: "jsonb", nullable: true })
  tracking_info?: {
    picking_started_at?: string
    picking_completed_at?: string
    packing_started_at?: string
    packing_completed_at?: string
    quality_check_at?: string
    ready_to_ship_at?: string
  }

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => OrderShipment, (shipment) => shipment.fulfillment)
  shipments = new Collection<OrderShipment>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "fulfill")
    }
  }
}

@Entity({ tableName: "order_shipment" })
export class OrderShipment {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  fulfillment_id!: string

  @Property({ columnType: "text" })
  order_id!: string

  @Property({ columnType: "text", unique: true })
  shipment_number!: string

  @Enum(() => ShipmentStatus)
  status: ShipmentStatus = ShipmentStatus.PENDING

  // Carrier information
  @Property({ columnType: "text", nullable: true })
  carrier_name?: string

  @Property({ columnType: "text", nullable: true })
  carrier_service?: string

  @Property({ columnType: "text", nullable: true })
  tracking_number?: string

  @Property({ columnType: "text", nullable: true })
  tracking_url?: string

  // Shipping details
  @Property({ columnType: "jsonb" })
  shipping_address!: {
    company?: string
    first_name: string
    last_name: string
    address_line_1: string
    address_line_2?: string
    city: string
    state?: string
    postal_code?: string
    country_code: string
    phone?: string
    email?: string
  }

  @Property({ columnType: "jsonb" })
  package_details!: {
    weight?: number
    weight_unit?: string
    dimensions?: {
      length: number
      width: number
      height: number
      unit: string
    }
    package_count?: number
    declared_value?: number
    insurance_amount?: number
    signature_required?: boolean
  }

  // Shipping costs
  @Property({ columnType: "numeric", precision: 10, scale: 2, nullable: true })
  shipping_cost?: number

  @Property({ columnType: "numeric", precision: 10, scale: 2, nullable: true })
  insurance_cost?: number

  @Property({ columnType: "text", nullable: true })
  currency_code?: string

  // Dates
  @Property({ columnType: "timestamptz", nullable: true })
  shipped_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  estimated_delivery_date?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  delivered_at?: Date

  // Delivery tracking
  @Property({ columnType: "jsonb", nullable: true })
  delivery_tracking?: Array<{
    timestamp: string
    status: string
    location?: string
    description?: string
    signature?: string
  }>

  // Notes
  @Property({ columnType: "text", nullable: true })
  notes?: string

  @Property({ columnType: "text", nullable: true })
  delivery_instructions?: string

  // Return information
  @Property({ columnType: "text", nullable: true })
  return_tracking_number?: string

  @Property({ columnType: "timestamptz", nullable: true })
  returned_at?: Date

  @Property({ columnType: "text", nullable: true })
  return_reason?: string

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @ManyToOne(() => OrderFulfillment)
  fulfillment!: OrderFulfillment

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "ship")
    }
  }
}

export enum ReturnReason {
  DAMAGED = "damaged",
  DEFECTIVE = "defective",
  WRONG_ITEM = "wrong_item",
  NOT_AS_DESCRIBED = "not_as_described",
  SIZE_ISSUE = "size_issue",
  CHANGE_OF_MIND = "change_of_mind",
  BETTER_PRICE_FOUND = "better_price_found",
  DELAYED_DELIVERY = "delayed_delivery",
  DUPLICATE_ORDER = "duplicate_order",
  OTHER = "other",
}

export enum ReturnStatus {
  REQUESTED = "requested",
  APPROVED = "approved",
  REJECTED = "rejected",
  ITEMS_RECEIVED = "items_received",
  INSPECTING = "inspecting",
  PROCESSING = "processing",
  REFUNDED = "refunded",
  EXCHANGED = "exchanged",
  RESTOCKED = "restocked",
  CANCELLED = "cancelled",
}

@Entity({ tableName: "order_return" })
export class OrderReturn {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  order_id!: string

  @Property({ columnType: "text", unique: true })
  return_number!: string

  @Enum(() => ReturnStatus)
  status: ReturnStatus = ReturnStatus.REQUESTED

  @Enum(() => ReturnReason)
  reason!: ReturnReason

  @Property({ columnType: "text", nullable: true })
  reason_description?: string

  // Return items
  @Property({ columnType: "jsonb" })
  items!: Array<{
    order_item_id: string
    product_id: string
    variant_id?: string
    quantity_ordered: number
    quantity_returned: number
    unit_price: number
    reason?: ReturnReason
    condition?: "new" | "used" | "damaged" | "defective"
    photos?: string[]
    notes?: string
  }>

  // Customer information
  @Property({ columnType: "text" })
  customer_id!: string

  @Property({ columnType: "text", nullable: true })
  customer_notes?: string

  // Processing information
  @Property({ columnType: "text", nullable: true })
  processed_by?: string // Staff member ID

  @Property({ columnType: "timestamptz", nullable: true })
  approved_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  rejected_at?: Date

  @Property({ columnType: "text", nullable: true })
  rejection_reason?: string

  // Return shipping
  @Property({ columnType: "text", nullable: true })
  return_tracking_number?: string

  @Property({ columnType: "text", nullable: true })
  return_carrier?: string

  @Property({ columnType: "timestamptz", nullable: true })
  items_received_at?: Date

  // Financial information
  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  return_amount!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2, default: 0 })
  restocking_fee: number = 0

  @Property({ columnType: "numeric", precision: 10, scale: 2, default: 0 })
  refund_amount: number = 0

  @Property({ columnType: "text" })
  currency_code!: string

  @Property({ columnType: "timestamptz", nullable: true })
  refunded_at?: Date

  @Property({ columnType: "text", nullable: true })
  refund_reference?: string

  // Replacement order
  @Property({ columnType: "text", nullable: true })
  replacement_order_id?: string

  // Notes
  @Property({ columnType: "text", nullable: true })
  internal_notes?: string

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
      this.id = generateEntityId(this.id, "ret")
    }
  }
}





