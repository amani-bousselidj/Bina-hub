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

export enum SEOEntityType {
  PRODUCT = "product",
  CATEGORY = "category",
  COLLECTION = "collection",
  PAGE = "page",
  BLOG_POST = "blog_post",
  CUSTOM = "custom",
}

export enum RedirectType {
  PERMANENT = "301",
  TEMPORARY = "302",
  FOUND = "303",
  SEE_OTHER = "307",
}

@Entity({ tableName: "seo_meta" })
export class SEOMeta {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Enum(() => SEOEntityType)
  entity_type!: SEOEntityType

  @Property({ columnType: "text" })
  entity_id!: string

  @Property({ columnType: "text", nullable: true })
  meta_title?: string

  @Property({ columnType: "text", nullable: true })
  meta_description?: string

  @Property({ columnType: "text", nullable: true })
  meta_keywords?: string

  @Property({ columnType: "text", nullable: true })
  canonical_url?: string

  @Property({ columnType: "text", nullable: true })
  og_title?: string

  @Property({ columnType: "text", nullable: true })
  og_description?: string

  @Property({ columnType: "text", nullable: true })
  og_image?: string

  @Property({ columnType: "text", nullable: true })
  og_type?: string

  @Property({ columnType: "text", nullable: true })
  twitter_title?: string

  @Property({ columnType: "text", nullable: true })
  twitter_description?: string

  @Property({ columnType: "text", nullable: true })
  twitter_image?: string

  @Property({ columnType: "text", nullable: true })
  twitter_card?: string

  @Property({ columnType: "jsonb", nullable: true })
  structured_data?: Record<string, any> // JSON-LD schema markup

  @Property({ columnType: "text", nullable: true })
  robots_meta?: string // noindex, nofollow, etc.

  @Property({ columnType: "boolean", default: true })
  is_indexable: boolean = true

  @Property({ columnType: "boolean", default: true })
  is_followable: boolean = true

  @Property({ columnType: "jsonb", nullable: true })
  custom_meta_tags?: Array<{
    name?: string
    property?: string
    content: string
    http_equiv?: string
  }>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "seo")
    }
  }
}

@Entity({ tableName: "url_redirect" })
export class URLRedirect {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", unique: true })
  source_path!: string

  @Property({ columnType: "text" })
  target_path!: string

  @Enum(() => RedirectType)
  redirect_type: RedirectType = RedirectType.PERMANENT

  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  @Property({ columnType: "boolean", default: false })
  is_regex: boolean = false

  @Property({ columnType: "text", nullable: true })
  description?: string

  @Property({ columnType: "integer", default: 0 })
  hit_count: number = 0

  @Property({ columnType: "timestamptz", nullable: true })
  last_hit_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  expires_at?: Date

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "redirect")
    }
  }
}

export enum PageStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
  SCHEDULED = "scheduled",
}

export enum PageType {
  STATIC = "static",
  LANDING = "landing",
  BLOG_POST = "blog_post",
  FAQ = "faq",
  LEGAL = "legal",
  CUSTOM = "custom",
}

@Entity({ tableName: "content_page" })
export class ContentPage {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", unique: true })
  slug!: string

  @Property({ columnType: "text" })
  title!: string

  @Property({ columnType: "text", nullable: true })
  subtitle?: string

  @Property({ columnType: "text" })
  content!: string

  @Property({ columnType: "text", nullable: true })
  excerpt?: string

  @Enum(() => PageType)
  type: PageType = PageType.STATIC

  @Enum(() => PageStatus)
  status: PageStatus = PageStatus.DRAFT

  @Property({ columnType: "text", nullable: true })
  featured_image?: string

  @Property({ columnType: "text", nullable: true })
  author_id?: string

  @Property({ columnType: "jsonb", nullable: true })
  tags?: string[]

  @Property({ columnType: "jsonb", nullable: true })
  categories?: string[]

  @Property({ columnType: "timestamptz", nullable: true })
  published_at?: Date

  @Property({ columnType: "timestamptz", nullable: true })
  scheduled_for?: Date

  @Property({ columnType: "integer", default: 0 })
  view_count: number = 0

  @Property({ columnType: "integer", default: 0 })
  sort_order: number = 0

  @Property({ columnType: "boolean", default: true })
  allow_comments: boolean = true

  @Property({ columnType: "boolean", default: false })
  is_featured: boolean = false

  @Property({ columnType: "text", nullable: true })
  template?: string

  @Property({ columnType: "jsonb", nullable: true })
  custom_fields?: Record<string, any>

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => PageComment, (comment) => comment.page)
  comments = new Collection<PageComment>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "page")
    }
  }
}

export enum CommentStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  SPAM = "spam",
}

@Entity({ tableName: "page_comment" })
export class PageComment {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  page_id!: string

  @Property({ columnType: "text", nullable: true })
  customer_id?: string

  @Property({ columnType: "text", nullable: true })
  parent_comment_id?: string

  @Property({ columnType: "text" })
  author_name!: string

  @Property({ columnType: "text" })
  author_email!: string

  @Property({ columnType: "text", nullable: true })
  author_website?: string

  @Property({ columnType: "text" })
  content!: string

  @Enum(() => CommentStatus)
  status: CommentStatus = CommentStatus.PENDING

  @Property({ columnType: "text", nullable: true })
  ip_address?: string

  @Property({ columnType: "text", nullable: true })
  user_agent?: string

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @ManyToOne(() => ContentPage)
  page!: ContentPage

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "comment")
    }
  }
}

@Entity({ tableName: "sitemap_entry" })
export class SitemapEntry {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", unique: true })
  url!: string

  @Enum(() => SEOEntityType)
  entity_type!: SEOEntityType

  @Property({ columnType: "text", nullable: true })
  entity_id?: string

  @Property({ columnType: "numeric", precision: 3, scale: 2, default: 0.5 })
  priority: number = 0.5

  @Property({ columnType: "text", default: "monthly" })
  change_frequency: string = "monthly" // always, hourly, daily, weekly, monthly, yearly, never

  @Property({ columnType: "timestamptz" })
  last_modified: Date = new Date()

  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  @Property({ columnType: "jsonb", nullable: true })
  alternate_urls?: Array<{
    url: string
    lang: string
  }>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "sitemap")
    }
  }
}

export enum MenuType {
  HEADER = "header",
  FOOTER = "footer",
  SIDEBAR = "sidebar",
  MOBILE = "mobile",
  CUSTOM = "custom",
}

export enum MenuItemType {
  PAGE = "page",
  CATEGORY = "category",
  COLLECTION = "collection",
  EXTERNAL = "external",
  CUSTOM = "custom",
}

@Entity({ tableName: "navigation_menu" })
export class NavigationMenu {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name!: string

  @Property({ columnType: "text", unique: true })
  handle!: string

  @Enum(() => MenuType)
  type!: MenuType

  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @OneToMany(() => NavigationMenuItem, (item) => item.menu)
  items = new Collection<NavigationMenuItem>(this)

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "navmenu")
    }
  }
}

@Entity({ tableName: "navigation_menu_item" })
export class NavigationMenuItem {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  menu_id!: string

  @Property({ columnType: "text", nullable: true })
  parent_item_id?: string

  @Property({ columnType: "text" })
  title!: string

  @Property({ columnType: "text" })
  url!: string

  @Enum(() => MenuItemType)
  type!: MenuItemType

  @Property({ columnType: "text", nullable: true })
  target?: string // _blank, _self, etc.

  @Property({ columnType: "text", nullable: true })
  css_class?: string

  @Property({ columnType: "text", nullable: true })
  icon?: string

  @Property({ columnType: "integer", default: 0 })
  sort_order: number = 0

  @Property({ columnType: "boolean", default: true })
  is_active: boolean = true

  @Property({ columnType: "jsonb", nullable: true })
  metadata?: Record<string, any>

  @Property({ columnType: "timestamptz" })
  created_at: Date = new Date()

  @Property({ columnType: "timestamptz", onUpdate: () => new Date() })
  updated_at: Date = new Date()

  @ManyToOne(() => NavigationMenu)
  menu!: NavigationMenu

  @BeforeCreate()
  @OnInit()
  beforeCreate() {
    if (!this.id) {
      this.id = generateEntityId(this.id, "navitem")
    }
  }
}





