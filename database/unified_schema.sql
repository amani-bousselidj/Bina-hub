-- ==========================================
-- BINNA PLATFORM - UNIFIED DATABASE SCHEMA
-- World-Class Amazon.sa-Style Marketplace
-- ==========================================

-- Created: January 9, 2025
-- Purpose: Single source of truth for all platform data
-- Architecture: Domain-Driven Design with clear boundaries

-- ==========================================
-- MARKETPLACE DOMAIN
-- ==========================================

-- Stores (Multi-vendor marketplace)
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    owner_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    commission_rate DECIMAL(5,2) DEFAULT 5.00,
    
    -- Business Information
    business_license VARCHAR(100),
    tax_number VARCHAR(50),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'SA',
    
    -- Metrics
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products (Unified product catalog)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    short_description TEXT,
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_price DECIMAL(10,2),
    
    -- Inventory
    sku VARCHAR(100) UNIQUE,
    barcode VARCHAR(100),
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 0,
    track_inventory BOOLEAN DEFAULT true,
    
    -- Product Details
    weight DECIMAL(8,2),
    dimensions_length DECIMAL(8,2),
    dimensions_width DECIMAL(8,2),
    dimensions_height DECIMAL(8,2),
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    featured BOOLEAN DEFAULT false,
    
    -- Categories
    category_id UUID,
    subcategory_id UUID,
    
    -- Images
    featured_image_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    parent_id UUID REFERENCES categories(id),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Images
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ORDERS DOMAIN
-- ==========================================

-- Orders (Multi-store orders)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL,
    
    -- Order Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    fulfillment_status VARCHAR(20) DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'processing', 'shipped', 'delivered')),
    
    -- Totals
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Shipping Address
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_postal_code VARCHAR(20),
    shipping_country VARCHAR(100),
    
    -- Billing Address
    billing_address_line1 VARCHAR(255),
    billing_address_line2 VARCHAR(255),
    billing_city VARCHAR(100),
    billing_state VARCHAR(100),
    billing_postal_code VARCHAR(20),
    billing_country VARCHAR(100),
    
    -- Metadata
    notes TEXT,
    internal_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    store_id UUID NOT NULL REFERENCES stores(id),
    
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    -- Product snapshot at time of order
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- USERS DOMAIN
-- ==========================================

-- Users (Customers, Store Owners, Admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    date_of_birth DATE,
    
    -- Preferences
    language VARCHAR(10) DEFAULT 'ar',
    timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
    currency VARCHAR(10) DEFAULT 'SAR',
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    
    -- Roles
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'store_owner', 'admin', 'super_admin')),
    
    -- Metadata
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Addresses
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    type VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
    is_default BOOLEAN DEFAULT false,
    
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(100),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'SA',
    phone VARCHAR(20),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- PAYMENTS DOMAIN
-- ==========================================

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id),
    
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'SAR',
    
    -- Payment Method
    payment_method VARCHAR(50) NOT NULL, -- 'mada', 'stc_pay', 'visa', 'mastercard', 'apple_pay'
    payment_provider VARCHAR(50) NOT NULL, -- 'tap', 'moyasar', 'payfort'
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
    
    -- Provider Details
    provider_transaction_id VARCHAR(255),
    provider_response TEXT,
    
    -- Timestamps
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- CONSTRUCTION DOMAIN
-- ==========================================

-- Construction Projects
CREATE TABLE construction_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Project Details
    project_type VARCHAR(50), -- 'residential', 'commercial', 'industrial'
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'completed', 'on_hold', 'cancelled')),
    
    -- Dates
    start_date DATE,
    end_date DATE,
    estimated_completion DATE,
    
    -- Budget
    budget DECIMAL(15,2),
    spent_amount DECIMAL(15,2) DEFAULT 0,
    
    -- Location
    location VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    postal_code VARCHAR(20),
    
    -- Management
    project_manager_id UUID REFERENCES users(id),
    supervisor_id UUID REFERENCES users(id),
    client_id UUID REFERENCES users(id),
    
    -- Progress
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Construction Materials
CREATE TABLE construction_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    -- Specifications
    brand VARCHAR(100),
    model VARCHAR(100),
    specifications JSONB,
    
    -- Pricing
    unit_price DECIMAL(10,2),
    unit_of_measure VARCHAR(20), -- 'kg', 'meter', 'piece', 'liter'
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    
    -- Images
    image_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Materials (Junction table)
CREATE TABLE project_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES construction_projects(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES construction_materials(id),
    
    quantity_required DECIMAL(10,2) NOT NULL,
    quantity_used DECIMAL(10,2) DEFAULT 0,
    unit_cost DECIMAL(10,2) NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    
    -- Status
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'ordered', 'delivered', 'used')),
    
    -- Dates
    required_date DATE,
    ordered_date DATE,
    delivered_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Construction Experts
CREATE TABLE construction_experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Professional Details
    specialization VARCHAR(100) NOT NULL,
    years_experience INTEGER,
    license_number VARCHAR(100),
    
    -- Rates
    hourly_rate DECIMAL(8,2),
    consultation_fee DECIMAL(8,2),
    
    -- Availability
    is_available BOOLEAN DEFAULT true,
    
    -- Ratings
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    
    -- Bio
    bio TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ANALYTICS DOMAIN
-- ==========================================

-- Store Analytics
CREATE TABLE store_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    
    -- Date
    date DATE NOT NULL,
    
    -- Sales Metrics
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    
    -- Traffic Metrics
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Product Metrics
    products_sold INTEGER DEFAULT 0,
    top_selling_product_id UUID,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(store_id, date)
);

-- ==========================================
-- SYSTEM TABLES
-- ==========================================

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    user_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Store indexes
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_stores_owner_id ON stores(owner_id);
CREATE INDEX idx_stores_verification_status ON stores(verification_status);

-- Product indexes
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_sku ON products(sku);

-- Order indexes
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
CREATE INDEX idx_order_items_store_id ON order_items(store_id);

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Payment indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Construction indexes
CREATE INDEX idx_construction_projects_status ON construction_projects(status);
CREATE INDEX idx_construction_projects_supervisor_id ON construction_projects(supervisor_id);
CREATE INDEX idx_project_materials_project_id ON project_materials(project_id);

-- Analytics indexes
CREATE INDEX idx_store_analytics_store_id_date ON store_analytics(store_id, date);

-- ==========================================
-- TRIGGERS FOR UPDATED_AT
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_addresses_updated_at BEFORE UPDATE ON user_addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_construction_projects_updated_at BEFORE UPDATE ON construction_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_construction_materials_updated_at BEFORE UPDATE ON construction_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_materials_updated_at BEFORE UPDATE ON project_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_construction_experts_updated_at BEFORE UPDATE ON construction_experts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SAMPLE DATA FOR TESTING
-- ==========================================

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('مواد البناء', 'construction-materials', 'جميع مواد البناء والإنشاء'),
('الأدوات الكهربائية', 'electrical-tools', 'أدوات كهربائية وإلكترونية'),
('السيراميك والبلاط', 'ceramics-tiles', 'سيراميك وبلاط للأرضيات والجدران'),
('الأبواب والنوافذ', 'doors-windows', 'أبواب ونوافذ بأنواعها'),
('الطلاء والدهانات', 'paints-coatings', 'طلاء ودهانات بجميع الألوان');

-- Insert sample admin user
INSERT INTO users (email, password_hash, first_name, last_name, role, status, email_verified) VALUES
('admin@binna.sa', '$2b$10$dummy_hash_here', 'مشرف', 'النظام', 'admin', 'active', true);

-- ==========================================
-- VIEWS FOR COMMON QUERIES
-- ==========================================

-- Store performance view
CREATE VIEW store_performance AS
SELECT 
    s.id,
    s.name,
    s.status,
    s.total_sales,
    s.total_orders,
    s.average_rating,
    s.total_reviews,
    COALESCE(COUNT(DISTINCT p.id), 0) as total_products,
    COALESCE(COUNT(DISTINCT o.id), 0) as recent_orders
FROM stores s
LEFT JOIN products p ON s.id = p.store_id AND p.status = 'active'
LEFT JOIN orders o ON o.id IN (
    SELECT DISTINCT oi.order_id 
    FROM order_items oi 
    WHERE oi.store_id = s.id 
    AND oi.created_at >= CURRENT_DATE - INTERVAL '30 days'
)
GROUP BY s.id, s.name, s.status, s.total_sales, s.total_orders, s.average_rating, s.total_reviews;

-- Product inventory view
CREATE VIEW product_inventory AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.quantity,
    p.min_quantity,
    s.name as store_name,
    CASE 
        WHEN p.quantity <= p.min_quantity THEN 'low'
        WHEN p.quantity <= (p.min_quantity * 2) THEN 'medium'
        ELSE 'good'
    END as stock_status
FROM products p
JOIN stores s ON p.store_id = s.id
WHERE p.status = 'active' AND p.track_inventory = true;

-- Order summary view
CREATE VIEW order_summary AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.total_amount,
    o.created_at,
    u.first_name || ' ' || u.last_name as customer_name,
    COUNT(oi.id) as item_count,
    COUNT(DISTINCT oi.store_id) as store_count
FROM orders o
JOIN users u ON o.customer_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.status, o.total_amount, o.created_at, u.first_name, u.last_name;

-- ==========================================
-- SECURITY POLICIES (RLS)
-- ==========================================

-- Enable RLS on sensitive tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE construction_projects ENABLE ROW LEVEL SECURITY;

-- Store owners can only see their own stores
CREATE POLICY store_owner_policy ON stores
    FOR ALL
    USING (owner_id = current_user_id());

-- Store owners can only manage their own products
CREATE POLICY product_owner_policy ON products
    FOR ALL
    USING (store_id IN (SELECT id FROM stores WHERE owner_id = current_user_id()));

-- Users can only see their own orders
CREATE POLICY user_order_policy ON orders
    FOR ALL
    USING (customer_id = current_user_id());

-- Users can only see their own profile
CREATE POLICY user_profile_policy ON users
    FOR ALL
    USING (id = current_user_id());

-- Project managers can only see their own projects
CREATE POLICY project_manager_policy ON construction_projects
    FOR ALL
    USING (project_manager_id = current_user_id() OR supervisor_id = current_user_id());

-- ==========================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ==========================================

-- Function to get current user ID (placeholder)
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    -- This should be implemented based on your authentication system
    -- For now, returning a placeholder
    RETURN '00000000-0000-0000-0000-000000000000'::UUID;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total DECIMAL;
BEGIN
    SELECT SUM(total_price) INTO total
    FROM order_items
    WHERE order_id = order_id;
    
    RETURN COALESCE(total, 0);
END;
$$ LANGUAGE plpgsql;

-- Function to update store metrics
CREATE OR REPLACE FUNCTION update_store_metrics(store_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE stores
    SET 
        total_sales = (
            SELECT COALESCE(SUM(oi.total_price), 0)
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE oi.store_id = store_id AND o.status = 'completed'
        ),
        total_orders = (
            SELECT COUNT(DISTINCT oi.order_id)
            FROM order_items oi
            JOIN orders o ON oi.order_id = o.id
            WHERE oi.store_id = store_id AND o.status = 'completed'
        )
    WHERE id = store_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- COMPLETION MESSAGE
-- ==========================================

-- Schema creation completed successfully
SELECT 'Binna Platform Database Schema Created Successfully!' as message;
