-- ==========================================
-- USER DATA CONTEXT TABLES
-- Missing tables for UserDataContext integration
-- ==========================================

-- Warranties Table
CREATE TABLE IF NOT EXISTS warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Product Information
    product_name VARCHAR(255) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    
    -- Warranty Details
    warranty_type VARCHAR(100), -- 'manufacturer', 'extended', 'store'
    purchase_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed', 'cancelled')),
    
    -- Value and Claims
    product_value DECIMAL(10,2),
    claim_id VARCHAR(100),
    claim_date DATE,
    claim_amount DECIMAL(10,2),
    
    -- Metadata
    warranty_certificate_url VARCHAR(500),
    receipt_url VARCHAR(500),
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Invoice Information
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    
    -- Financial Details
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    
    -- Status and Dates
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Payment Information
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Metadata
    invoice_url VARCHAR(500),
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    
    -- Item Details
    description VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Profiles Enhancement (extends existing users table)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Extended Profile Information
    display_name VARCHAR(255),
    city VARCHAR(100),
    member_since DATE DEFAULT CURRENT_DATE,
    account_type VARCHAR(20) DEFAULT 'free' CHECK (account_type IN ('free', 'premium', 'enterprise')),
    
    -- Loyalty and Metrics
    loyalty_points INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    total_spent DECIMAL(15,2) DEFAULT 0,
    
    -- Settings
    notification_preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_warranties_user_id ON warranties(user_id);
CREATE INDEX IF NOT EXISTS idx_warranties_status ON warranties(status);
CREATE INDEX IF NOT EXISTS idx_warranties_expiry_date ON warranties(expiry_date);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Update Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_warranties_updated_at 
    BEFORE UPDATE ON warranties 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY warranties_user_policy ON warranties
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY invoices_user_policy ON invoices
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY invoice_items_user_policy ON invoice_items
    FOR ALL USING (
        invoice_id IN (
            SELECT id FROM invoices WHERE user_id = auth.uid()
        )
    );

CREATE POLICY user_profiles_policy ON user_profiles
    FOR ALL USING (auth.uid() = user_id);
