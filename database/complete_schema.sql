-- =====================================================
-- BINNA PLATFORM - UNIFIED DATABASE SCHEMA
-- World-Class Amazon.sa-Style Marketplace & ERP
-- =====================================================
-- Created: July 9, 2025
-- Purpose: Single source of truth for all database tables
-- Architecture: DDD-aligned with clear domain boundaries
-- =====================================================

-- Drop existing tables if they exist (for fresh setup)
DROP SCHEMA IF EXISTS marketplace CASCADE;
DROP SCHEMA IF EXISTS stores CASCADE;
DROP SCHEMA IF EXISTS construction CASCADE;
DROP SCHEMA IF EXISTS admin CASCADE;
DROP SCHEMA IF EXISTS users CASCADE;
DROP SCHEMA IF EXISTS payments CASCADE;
DROP SCHEMA IF EXISTS logistics CASCADE;
DROP SCHEMA IF EXISTS analytics CASCADE;

-- Create schemas for domain separation
CREATE SCHEMA marketplace;
CREATE SCHEMA stores;
CREATE SCHEMA construction;
CREATE SCHEMA admin;
CREATE SCHEMA users;
CREATE SCHEMA payments;
CREATE SCHEMA logistics;
CREATE SCHEMA analytics;

-- =====================================================
-- USERS DOMAIN - Identity Management
-- =====================================================

-- Users table (unified across all domains)
CREATE TABLE users.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'customer',
    status VARCHAR(20) DEFAULT 'active',
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    metadata JSONB
);

-- User sessions for authentication
CREATE TABLE users.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- User permissions and roles
CREATE TABLE users.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users.user_permissions (
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES users.permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users.users(id),
    PRIMARY KEY (user_id, permission_id)
);

-- =====================================================
-- MARKETPLACE DOMAIN - Customer-Facing Marketplace
-- =====================================================

-- Stores/Vendors in the marketplace
CREATE TABLE marketplace.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending',
    is_featured BOOLEAN DEFAULT false,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Store settings and configuration
CREATE TABLE marketplace.store_settings (
    store_id UUID PRIMARY KEY REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    business_hours JSONB,
    payment_methods JSONB,
    shipping_options JSONB,
    return_policy TEXT,
    terms_of_service TEXT,
    privacy_policy TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products in the marketplace
CREATE TABLE marketplace.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    category VARCHAR(100),
    subcategory VARCHAR(100),
    brand VARCHAR(100),
    weight DECIMAL(8,2),
    dimensions JSONB,
    images JSONB,
    status VARCHAR(20) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    UNIQUE(store_id, slug)
);

-- Product variants (size, color, etc.)
CREATE TABLE marketplace.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES marketplace.products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    barcode VARCHAR(100),
    price DECIMAL(10,2),
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    weight DECIMAL(8,2),
    options JSONB,
    images JSONB,
    inventory_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product categories
CREATE TABLE marketplace.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES marketplace.categories(id),
    image_url TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping carts
CREATE TABLE marketplace.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart items
CREATE TABLE marketplace.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES marketplace.carts(id) ON DELETE CASCADE,
    product_id UUID REFERENCES marketplace.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES marketplace.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE marketplace.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    fulfillment_status VARCHAR(20) DEFAULT 'pending',
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    billing_address JSONB,
    shipping_address JSONB,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Order items
CREATE TABLE marketplace.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES marketplace.orders(id) ON DELETE CASCADE,
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES marketplace.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES marketplace.product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_variant VARCHAR(255),
    product_sku VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customer reviews
CREATE TABLE marketplace.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES marketplace.products(id) ON DELETE CASCADE,
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    order_id UUID REFERENCES marketplace.orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    images JSONB,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- STORES DOMAIN - Individual Store Management
-- =====================================================

-- Store inventory
CREATE TABLE stores.inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES marketplace.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES marketplace.product_variants(id) ON DELETE CASCADE,
    location VARCHAR(255) DEFAULT 'main',
    quantity INTEGER NOT NULL DEFAULT 0,
    reserved_quantity INTEGER DEFAULT 0,
    available_quantity INTEGER GENERATED ALWAYS AS (quantity - reserved_quantity) STORED,
    reorder_point INTEGER DEFAULT 0,
    reorder_quantity INTEGER DEFAULT 0,
    cost_price DECIMAL(10,2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory movements
CREATE TABLE stores.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    product_id UUID REFERENCES marketplace.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES marketplace.product_variants(id) ON DELETE CASCADE,
    movement_type VARCHAR(20) NOT NULL, -- 'in', 'out', 'adjustment', 'transfer'
    quantity INTEGER NOT NULL,
    reference_id UUID,
    reference_type VARCHAR(50), -- 'order', 'purchase', 'adjustment', 'transfer'
    location VARCHAR(255) DEFAULT 'main',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users.users(id)
);

-- Store staff
CREATE TABLE stores.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    permissions JSONB,
    hourly_rate DECIMAL(8,2),
    is_active BOOLEAN DEFAULT true,
    hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    terminated_at TIMESTAMP,
    created_by UUID REFERENCES users.users(id)
);

-- Store sales/transactions
CREATE TABLE stores.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    order_id UUID REFERENCES marketplace.orders(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES stores.staff(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES users.users(id) ON DELETE SET NULL,
    sale_number VARCHAR(50) UNIQUE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- POS system configuration
CREATE TABLE stores.pos_settings (
    store_id UUID PRIMARY KEY REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    receipt_template TEXT,
    tax_rate DECIMAL(5,2) DEFAULT 15.00,
    default_payment_method VARCHAR(50) DEFAULT 'cash',
    auto_print_receipt BOOLEAN DEFAULT true,
    sound_enabled BOOLEAN DEFAULT true,
    theme VARCHAR(50) DEFAULT 'default',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONSTRUCTION DOMAIN - Construction-Specific Features
-- =====================================================

-- Construction projects
CREATE TABLE construction.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'planning',
    start_date DATE,
    end_date DATE,
    estimated_budget DECIMAL(12,2),
    actual_budget DECIMAL(12,2),
    client_name VARCHAR(255),
    client_contact JSONB,
    location_address TEXT,
    location_coordinates POINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users.users(id),
    metadata JSONB
);

-- Project supervisors
CREATE TABLE construction.project_supervisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES construction.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    assigned_by UUID REFERENCES users.users(id)
);

-- Supervisor balances and spending
CREATE TABLE construction.supervisor_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supervisor_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES construction.projects(id) ON DELETE CASCADE,
    balance DECIMAL(12,2) DEFAULT 0,
    authorized_limit DECIMAL(12,2) DEFAULT 0,
    spent_amount DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spending authorizations
CREATE TABLE construction.spending_authorizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supervisor_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES construction.projects(id) ON DELETE CASCADE,
    amount DECIMAL(12,2) NOT NULL,
    purpose TEXT NOT NULL,
    authorization_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users.users(id),
    notes TEXT
);

-- Construction materials catalog
CREATE TABLE construction.materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    unit VARCHAR(50),
    standard_price DECIMAL(10,2),
    specifications JSONB,
    supplier_info JSONB,
    quality_grade VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project materials usage
CREATE TABLE construction.project_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES construction.projects(id) ON DELETE CASCADE,
    material_id UUID REFERENCES construction.materials(id) ON DELETE CASCADE,
    quantity_planned DECIMAL(10,2),
    quantity_used DECIMAL(10,2) DEFAULT 0,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(12,2),
    supplier VARCHAR(255),
    delivery_date DATE,
    quality_check BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quality control inspections
CREATE TABLE construction.quality_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES construction.projects(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    inspection_type VARCHAR(100),
    inspection_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    score INTEGER CHECK (score >= 0 AND score <= 100),
    findings TEXT,
    recommendations TEXT,
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Warranties for construction items
CREATE TABLE construction.warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES construction.projects(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    vendor VARCHAR(255),
    purchase_date DATE,
    warranty_start_date DATE,
    warranty_end_date DATE,
    warranty_terms TEXT,
    document_url TEXT,
    status VARCHAR(20) DEFAULT 'active',
    claim_details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PAYMENTS DOMAIN - Financial Operations
-- =====================================================

-- Payment methods
CREATE TABLE payments.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'card', 'bank_account', 'digital_wallet'
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'mada', 'stc_pay'
    last_four VARCHAR(4),
    brand VARCHAR(50),
    expiry_month INTEGER,
    expiry_year INTEGER,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Payment transactions
CREATE TABLE payments.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES marketplace.orders(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    payment_method_id UUID REFERENCES payments.payment_methods(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'SAR',
    status VARCHAR(20) DEFAULT 'pending',
    transaction_type VARCHAR(20) NOT NULL, -- 'payment', 'refund', 'chargeback'
    gateway VARCHAR(50) NOT NULL,
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Store commissions
CREATE TABLE payments.store_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    order_id UUID REFERENCES marketplace.orders(id) ON DELETE CASCADE,
    commission_rate DECIMAL(5,2) NOT NULL,
    commission_amount DECIMAL(10,2) NOT NULL,
    order_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    payment_reference VARCHAR(255)
);

-- =====================================================
-- LOGISTICS DOMAIN - Shipping and Fulfillment
-- =====================================================

-- Shipping providers
CREATE TABLE logistics.shipping_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    api_endpoint TEXT,
    is_active BOOLEAN DEFAULT true,
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping rates
CREATE TABLE logistics.shipping_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES logistics.shipping_providers(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    min_weight DECIMAL(8,2),
    max_weight DECIMAL(8,2),
    base_rate DECIMAL(10,2) NOT NULL,
    per_kg_rate DECIMAL(10,2),
    delivery_time VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments
CREATE TABLE logistics.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES marketplace.orders(id) ON DELETE CASCADE,
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES logistics.shipping_providers(id) ON DELETE SET NULL,
    tracking_number VARCHAR(255),
    status VARCHAR(20) DEFAULT 'preparing',
    shipping_cost DECIMAL(10,2),
    estimated_delivery DATE,
    actual_delivery TIMESTAMP,
    pickup_address JSONB,
    delivery_address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ANALYTICS DOMAIN - Business Intelligence
-- =====================================================

-- Sales analytics
CREATE TABLE analytics.sales_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES marketplace.stores(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    revenue DECIMAL(12,2) DEFAULT 0,
    orders_count INTEGER DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    products_sold INTEGER DEFAULT 0,
    new_customers INTEGER DEFAULT 0,
    returning_customers INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, date)
);

-- Product performance
CREATE TABLE analytics.product_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES marketplace.products(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    sales INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, date)
);

-- Customer analytics
CREATE TABLE analytics.customer_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    last_order_date DATE,
    customer_segment VARCHAR(50),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADMIN DOMAIN - Platform Management
-- =====================================================

-- System settings
CREATE TABLE admin.system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT,
    description TEXT,
    type VARCHAR(50) DEFAULT 'string',
    is_public BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users.users(id)
);

-- Audit logs
CREATE TABLE admin.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Platform notifications
CREATE TABLE admin.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    data JSONB,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users.users(email);
CREATE INDEX idx_users_role ON users.users(role);
CREATE INDEX idx_users_status ON users.users(status);

-- Store indexes
CREATE INDEX idx_stores_owner_id ON marketplace.stores(owner_id);
CREATE INDEX idx_stores_status ON marketplace.stores(status);
CREATE INDEX idx_stores_category ON marketplace.stores(category);

-- Product indexes
CREATE INDEX idx_products_store_id ON marketplace.products(store_id);
CREATE INDEX idx_products_category ON marketplace.products(category);
CREATE INDEX idx_products_status ON marketplace.products(status);
CREATE INDEX idx_products_name ON marketplace.products(name);

-- Order indexes
CREATE INDEX idx_orders_user_id ON marketplace.orders(user_id);
CREATE INDEX idx_orders_status ON marketplace.orders(status);
CREATE INDEX idx_orders_created_at ON marketplace.orders(created_at);
CREATE INDEX idx_orders_order_number ON marketplace.orders(order_number);

-- Inventory indexes
CREATE INDEX idx_inventory_store_id ON stores.inventory(store_id);
CREATE INDEX idx_inventory_product_id ON stores.inventory(product_id);
CREATE INDEX idx_inventory_location ON stores.inventory(location);

-- Construction indexes
CREATE INDEX idx_projects_store_id ON construction.projects(store_id);
CREATE INDEX idx_projects_status ON construction.projects(status);
CREATE INDEX idx_projects_created_by ON construction.projects(created_by);

-- Payment indexes
CREATE INDEX idx_transactions_order_id ON payments.transactions(order_id);
CREATE INDEX idx_transactions_user_id ON payments.transactions(user_id);
CREATE INDEX idx_transactions_status ON payments.transactions(status);

-- Analytics indexes
CREATE INDEX idx_sales_metrics_store_date ON analytics.sales_metrics(store_id, date);
CREATE INDEX idx_product_metrics_product_date ON analytics.product_metrics(product_id, date);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON marketplace.stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON marketplace.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON marketplace.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SECURITY POLICIES (Row Level Security)
-- =====================================================

-- Enable RLS on sensitive tables
ALTER TABLE users.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments.transactions ENABLE ROW LEVEL SECURITY;

-- Example policies (customize based on your needs)
CREATE POLICY "Users can view their own data" ON users.users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Store owners can manage their stores" ON marketplace.stores
    FOR ALL USING (auth.uid() = owner_id);

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert default permissions
INSERT INTO users.permissions (name, description, resource, action) VALUES
('create_product', 'Create new products', 'products', 'create'),
('edit_product', 'Edit existing products', 'products', 'update'),
('delete_product', 'Delete products', 'products', 'delete'),
('view_orders', 'View orders', 'orders', 'read'),
('manage_inventory', 'Manage inventory', 'inventory', 'manage'),
('view_analytics', 'View analytics', 'analytics', 'read'),
('manage_staff', 'Manage staff', 'staff', 'manage'),
('process_payments', 'Process payments', 'payments', 'process');

-- Insert default categories
INSERT INTO marketplace.categories (name, slug, description) VALUES
('Construction', 'construction', 'Construction materials and tools'),
('Electronics', 'electronics', 'Electronic devices and gadgets'),
('Home & Garden', 'home-garden', 'Home improvement and gardening'),
('Automotive', 'automotive', 'Car parts and accessories'),
('Fashion', 'fashion', 'Clothing and accessories'),
('Food & Beverage', 'food-beverage', 'Food and drinks'),
('Health & Beauty', 'health-beauty', 'Health and beauty products'),
('Sports & Recreation', 'sports-recreation', 'Sports and recreation equipment');

-- Insert default system settings
INSERT INTO admin.system_settings (key, value, description, type, is_public) VALUES
('site_name', 'Binna Platform', 'Website name', 'string', true),
('site_description', 'Saudi Arabia''s Leading Marketplace & ERP Platform', 'Website description', 'string', true),
('default_currency', 'SAR', 'Default currency', 'string', true),
('tax_rate', '15.00', 'Default tax rate percentage', 'number', true),
('commission_rate', '5.00', 'Default commission rate percentage', 'number', false),
('maintenance_mode', 'false', 'Enable maintenance mode', 'boolean', true);

-- Insert default shipping providers
INSERT INTO logistics.shipping_providers (name, code, is_active) VALUES
('Aramex', 'aramex', true),
('SMSA', 'smsa', true),
('FedEx', 'fedex', true),
('UPS', 'ups', true),
('Local Delivery', 'local', true);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Store analytics view
CREATE VIEW analytics.store_dashboard AS
SELECT 
    s.id as store_id,
    s.name as store_name,
    s.rating,
    s.review_count,
    COUNT(DISTINCT p.id) as total_products,
    COUNT(DISTINCT o.id) as total_orders,
    COALESCE(SUM(oi.price * oi.quantity), 0) as total_revenue,
    COUNT(DISTINCT o.user_id) as unique_customers
FROM marketplace.stores s
LEFT JOIN marketplace.products p ON s.id = p.store_id
LEFT JOIN marketplace.order_items oi ON s.id = oi.store_id
LEFT JOIN marketplace.orders o ON oi.order_id = o.id
GROUP BY s.id, s.name, s.rating, s.review_count;

-- Product performance view
CREATE VIEW analytics.product_performance AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.price,
    s.name as store_name,
    COUNT(DISTINCT oi.id) as total_sales,
    SUM(oi.quantity) as total_quantity_sold,
    SUM(oi.price * oi.quantity) as total_revenue,
    AVG(r.rating) as average_rating,
    COUNT(DISTINCT r.id) as review_count
FROM marketplace.products p
JOIN marketplace.stores s ON p.store_id = s.id
LEFT JOIN marketplace.order_items oi ON p.id = oi.product_id
LEFT JOIN marketplace.reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, p.price, s.name;

-- Customer insights view
CREATE VIEW analytics.customer_insights AS
SELECT 
    u.id as customer_id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as average_order_value,
    MAX(o.created_at) as last_order_date,
    MIN(o.created_at) as first_order_date
FROM users.users u
JOIN marketplace.orders o ON u.id = o.user_id
WHERE u.role = 'customer'
GROUP BY u.id, u.first_name, u.last_name, u.email;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Database schema created successfully
SELECT 'Binna Platform Database Schema Created Successfully!' as message;
SELECT 'Total Tables: ' || COUNT(*) as table_count FROM information_schema.tables WHERE table_schema IN ('marketplace', 'stores', 'construction', 'admin', 'users', 'payments', 'logistics', 'analytics');
