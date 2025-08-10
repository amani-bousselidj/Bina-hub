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

export enum InvoiceStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SENT = "sent",
  PAID = "paid",
  PARTIALLY_PAID = "partially_paid",
  OVERDUE = "overdue",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum InvoiceType {
  SALES = "sales",
  PURCHASE = "purchase",
  CREDIT_NOTE = "credit_note",
  DEBIT_NOTE = "debit_note",
  PROFORMA = "proforma",
}

export enum PaymentMethod {
  CASH = "cash",
  BANK_TRANSFER = "bank_transfer",
  CREDIT_CARD = "credit_card",
  DEBIT_CARD = "debit_card",
  PAYPAL = "paypal",
  STRIPE = "stripe",
  CRYPTOCURRENCY = "cryptocurrency",
  CHECK = "check",
  WIRE_TRANSFER = "wire_transfer",
  STORE_CREDIT = "store_credit",
}

export enum TaxType {
  VAT = "vat",
  GST = "gst",
  SALES_TAX = "sales_tax",
  EXCISE_TAX = "excise_tax",
  CUSTOMS_DUTY = "customs_duty",
  WITHHOLDING_TAX = "withholding_tax",
}

@Entity({ tableName: "financial_invoice" })
export class FinancialInvoice {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", unique: true })
  invoice_number!: string

  @Enum(() => InvoiceType)
  type!: InvoiceType

  @Enum(() => InvoiceStatus)
  status: InvoiceStatus = InvoiceStatus.DRAFT

  // Related entities
  @Property({ columnType: "text", nullable: true })
  order_id?: string

  @Property({ columnType: "text", nullable: true })
  customer_id?: string

  @Property({ columnType: "text", nullable: true })
  vendor_id?: string

  // Invoice details
  @Property({ columnType: "timestamptz" })
  invoice_date!: Date

  @Property({ columnType: "timestamptz", nullable: true })
  due_date?: Date

  @Property({ columnType: "text" })
  currency_code!: string

  // Address information
  @Property({ columnType: "jsonb" })
  billing_address!: {
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

  @Property({ columnType: "jsonb", nullable: true })
  shipping_address?: {
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
  }

  // Financial amounts
  @Property({ columnType: "numeric", precision: 12, scale: 2 })
  subtotal!: number

  @Property({ columnType: "numeric", precision: 12, scale: 2, default: 0 })
  discount_amount: number = 0

  @Property({ columnType: "numeric", precision: 12, scale: 2, default: 0 })
  tax_amount: number = 0

  @Property({ columnType: "numeric", precision: 12, scale: 2, default: 0 })
  shipping_amount: number = 0

  @Property({ columnType: "numeric", precision: 12, scale: 2 })
  total_amount!: number

  @Property({ columnType: "numeric", precision: 12, scale: 2, default: 0 })
  paid_amount: number = 0

  @Property({ columnType: "numeric", precision: 12, scale: 2, default: 0 })
  refunded_amount: number = 0

  // Payment terms
  @Property({ columnType: "text", nullable: true })
  payment_terms?: string

  @Property({ columnType: "text", nullable: true })
  notes?: string

  @Property({ columnType: "text", nullable: true })
  internal_notes?: string

  // References
  @Property({ columnType: "text", nullable: true })
  reference_number?: string

  @Property({ columnType: "text", nullable: true })
  purchase_order_number?: string

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => InvoiceLineItem, (item) => item.invoice)
  line_items = new Collection<InvoiceLineItem>(this)

  @OneToMany(() => InvoiceTaxLine, (tax) => tax.invoice)
  tax_lines = new Collection<InvoiceTaxLine>(this)

  @OneToMany(() => InvoicePayment, (payment) => payment.invoice)
  payments = new Collection<InvoicePayment>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "finv")
    }
  }
}

@Entity({ tableName: "invoice_line_item" })
export class InvoiceLineItem {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  invoice_id!: string

  @Property({ columnType: "text", nullable: true })
  product_id?: string

  @Property({ columnType: "text", nullable: true })
  variant_id?: string

  @Property({ columnType: "text" })
  title!: string

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Property({ columnType: "text", nullable: true })
  sku?: string

  @Property({ columnType: "integer" })
  quantity!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  unit_price!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2, default: 0 })
  discount_amount: number = 0

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  total!: number

  // Tax information
  @Property({ columnType: "boolean", default: true })
  is_taxable: boolean = true

  @Property({ columnType: "jsonb", nullable: true })
  tax_rates?: Array<{
    type: TaxType
    name: string
    rate: number
    amount: number
  }>

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @ManyToOne(() => FinancialInvoice)
  invoice!: FinancialInvoice

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "finvli")
    }
  }
}

@Entity({ tableName: "invoice_tax_line" })
export class InvoiceTaxLine {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  invoice_id!: string

  @Enum(() => TaxType)
  type!: TaxType

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text", nullable: true })
  code?: string

  @Property({ columnType: "numeric", precision: 5, scale: 4 })
  rate!: number // e.g., 0.2000 for 20%

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  taxable_amount!: number

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  tax_amount!: number

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @ManyToOne(() => FinancialInvoice)
  invoice!: FinancialInvoice

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "finvtx")
    }
  }
}

export enum PaymentStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

@Entity({ tableName: "invoice_payment" })
export class InvoicePayment {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  invoice_id!: string

  @Property({ columnType: "text", unique: true })
  payment_reference!: string

  @Enum(() => PaymentMethod)
  payment_method!: PaymentMethod

  @Enum(() => PaymentStatus)
  status!: PaymentStatus

  @Property({ columnType: "numeric", precision: 10, scale: 2 })
  amount!: number

  @Property({ columnType: "text" })
  currency_code!: string

  @Property({ columnType: "timestamptz" })
  payment_date!: Date

  @Property({ columnType: "timestamptz", nullable: true })
  cleared_date?: Date

  // Gateway information
  @Property({ columnType: "text", nullable: true })
  gateway_id?: string

  @Property({ columnType: "text", nullable: true })
  gateway_transaction_id?: string

  @Property({ columnType: "jsonb", nullable: true })
  gateway_response?: Record<string, any>

  // Bank/Check information
  @Property({ columnType: "text", nullable: true })
  bank_name?: string

  @Property({ columnType: "text", nullable: true })
  check_number?: string

  @Property({ columnType: "text", nullable: true })
  account_number?: string

  @Property({ columnType: "text", nullable: true })
  routing_number?: string

  // Notes
  @Property({ columnType: "text", nullable: true })
  notes?: string

  @Property({ columnType: "text", nullable: true })
  failure_reason?: string

  // Metadata
  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @ManyToOne(() => FinancialInvoice)
  invoice!: FinancialInvoice

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "finvpay")
    }
  }
}

export enum AccountType {
  ASSET = "asset",
  LIABILITY = "liability",
  EQUITY = "equity",
  REVENUE = "revenue",
  EXPENSE = "expense",
}

export enum AccountSubType {
  // Assets
  CURRENT_ASSET = "current_asset",
  FIXED_ASSET = "fixed_asset",
  INVENTORY = "inventory",
  ACCOUNTS_RECEIVABLE = "accounts_receivable",
  CASH = "cash",
  BANK = "bank",
  
  // Liabilities
  CURRENT_LIABILITY = "current_liability",
  LONG_TERM_LIABILITY = "long_term_liability",
  ACCOUNTS_PAYABLE = "accounts_payable",
  TAX_LIABILITY = "tax_liability",
  
  // Revenue
  SALES_REVENUE = "sales_revenue",
  SERVICE_REVENUE = "service_revenue",
  OTHER_REVENUE = "other_revenue",
  
  // Expenses
  COST_OF_GOODS_SOLD = "cost_of_goods_sold",
  OPERATING_EXPENSE = "operating_expense",
  ADMINISTRATIVE_EXPENSE = "administrative_expense",
  TAX_EXPENSE = "tax_expense",
}

@Entity({ tableName: "chart_of_accounts" })
export class ChartOfAccounts {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", unique: true })
  account_code!: string

  @Property({ columnType: "text" })
  account_name!: string

  @Enum(() => AccountType)
  account_type!: AccountType

  @Enum(() => AccountSubType)
  account_subtype!: AccountSubType

  @Property({ columnType: "text", nullable: true })
  parent_account_id?: string

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  @Property({ columnType: "boolean", default: false })
  is_system_account: boolean = false

  @Property({ columnType: "text" })
  currency_code!: string

  @Property({ columnType: "numeric", precision: 15, scale: 2, default: 0 })
  opening_balance: number = 0

  @Property({ columnType: "numeric", precision: 15, scale: 2, default: 0 })
  current_balance: number = 0

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => JournalEntry, (entry) => entry.account)
  journal_entries = new Collection<JournalEntry>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "acct")
    }
  }
}

export enum JournalEntryType {
  SALES = "sales",
  PURCHASE = "purchase",
  PAYMENT = "payment",
  RECEIPT = "receipt",
  ADJUSTMENT = "adjustment",
  TRANSFER = "transfer",
  OPENING_BALANCE = "opening_balance",
  CLOSING = "closing",
}

@Entity({ tableName: "journal_entry" })
export class JournalEntry {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", unique: true })
  entry_number!: string

  @Property({ columnType: "text" })
  account_id!: string

  @Enum(() => JournalEntryType)
  entry_type!: JournalEntryType

  @Property({ columnType: "timestamptz" })
  entry_date!: Date

  @Property({ columnType: "text" })
  description!: string

  @Property({ columnType: "text", nullable: true })
  reference?: string

  // Debit/Credit amounts
  @Property({ columnType: "numeric", precision: 15, scale: 2, default: 0 })
  debit_amount: number = 0

  @Property({ columnType: "numeric", precision: 15, scale: 2, default: 0 })
  credit_amount: number = 0

  @Property({ columnType: "text" })
  currency_code!: string

  // Related documents
  @Property({ columnType: "text", nullable: true })
  invoice_id?: string

  @Property({ columnType: "text", nullable: true })
  payment_id?: string

  @Property({ columnType: "text", nullable: true })
  order_id?: string

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @ManyToOne(() => ChartOfAccounts)
  account!: ChartOfAccounts

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "je")
    }
  }
}





