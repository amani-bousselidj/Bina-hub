-- Additional Tables for Store Management, Users, and Warranties
-- Run this after the main ERP schema

-- Create Stores Table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    description TEXT,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    region VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'السعودية',
    default_currency_code VARCHAR(3) DEFAULT 'SAR',
    theme VARCHAR(50) DEFAULT 'blue',
    language VARCHAR(10) DEFAULT 'ar',
    timezone VARCHAR(50) DEFAULT 'Asia/Riyadh',
    tax_rate DECIMAL(5,2) DEFAULT 15.00,
    shipping_fee DECIMAL(10,2) DEFAULT 25.00,
    free_shipping_threshold DECIMAL(10,2) DEFAULT 500.00,
    business_hours JSONB,
    settings JSONB,
    rating DECIMAL(3,2) DEFAULT 4.5,
    total_sales DECIMAL(15,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'store_owner', 'admin', 'employee')),
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    avatar_url VARCHAR(500),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'السعودية',
    preferences JSONB,
    total_spent DECIMAL(12,2) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Warranties Table
CREATE TABLE IF NOT EXISTS warranties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    warranty_number VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID REFERENCES erp_products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES erp_customers(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    order_id UUID REFERENCES erp_orders(id) ON DELETE SET NULL,
    purchase_date TIMESTAMP WITH TIME ZONE NOT NULL,
    warranty_start TIMESTAMP WITH TIME ZONE NOT NULL,
    warranty_end TIMESTAMP WITH TIME ZONE NOT NULL,
    warranty_period INTEGER NOT NULL, -- in months
    warranty_type VARCHAR(50) DEFAULT 'manufacturer',
    coverage_details TEXT,
    terms_conditions TEXT,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'claimed', 'void')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Warranty Claims Table
CREATE TABLE IF NOT EXISTS warranty_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    warranty_id UUID REFERENCES warranties(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES erp_customers(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    claim_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    issue_type VARCHAR(50) NOT NULL CHECK (issue_type IN ('manufacturing_defect', 'wear_and_tear', 'performance_issue', 'damage', 'other')),
    issue_description TEXT NOT NULL,
    quantity_affected INTEGER DEFAULT 1,
    total_quantity INTEGER DEFAULT 1,
    quantity_used_previously INTEGER DEFAULT 0,
    quantity_remaining INTEGER DEFAULT 1,
    preferred_resolution TEXT,
    damage_photos JSONB,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'completed')),
    store_response TEXT,
    estimated_completion TIMESTAMP WITH TIME ZONE,
    tracking_number VARCHAR(100),
    value DECIMAL(10,2) NOT NULL,
    resolution_cost DECIMAL(10,2),
    resolution_details TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Store Reviews Table for ratings/evaluations
CREATE TABLE IF NOT EXISTS store_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES erp_customers(id) ON DELETE CASCADE,
    order_id UUID REFERENCES erp_orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_title VARCHAR(255),
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_votes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('pending', 'published', 'hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_stores_email ON stores(email);
CREATE INDEX idx_stores_status ON stores(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_store_id ON users(store_id);
CREATE INDEX idx_warranties_warranty_number ON warranties(warranty_number);
CREATE INDEX idx_warranties_customer_id ON warranties(customer_id);
CREATE INDEX idx_warranties_status ON warranties(status);
CREATE INDEX idx_warranty_claims_warranty_id ON warranty_claims(warranty_id);
CREATE INDEX idx_warranty_claims_status ON warranty_claims(status);
CREATE INDEX idx_store_reviews_store_id ON store_reviews(store_id);

-- Create update triggers
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warranties_updated_at BEFORE UPDATE ON warranties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warranty_claims_updated_at BEFORE UPDATE ON warranty_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_store_reviews_updated_at BEFORE UPDATE ON store_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view stores" ON stores FOR SELECT USING (true);
CREATE POLICY "Store owners can update their store" ON stores FOR UPDATE USING (auth.uid()::text = (SELECT id FROM users WHERE email = stores.email AND role = 'store_owner')::text);

CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view warranties" ON warranties FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Store owners can manage warranties" ON warranties FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view warranty claims" ON warranty_claims FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can create warranty claims" ON warranty_claims FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Store owners can update warranty claims" ON warranty_claims FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view store reviews" ON store_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "Users can create store reviews" ON store_reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert sample data

-- Insert store data
INSERT INTO stores (name, name_ar, description, email, phone, address, city, region, country, business_hours, settings, rating, total_sales, total_orders) VALUES
('متجر بِنّا للمواد الإنشائية', 'متجر بِنّا للمواد الإنشائية', 'متجر متخصص في بيع مواد البناء والإنشاء بأعلى جودة وأفضل الأسعار', 'store@binna.com', '+966112345678', 'شارع الملك فهد، حي العليا', 'الرياض', 'منطقة الرياض', 'المملكة العربية السعودية', 
'{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "14:00", "close": "18:00"}, "saturday": {"open": "08:00", "close": "18:00"}, "sunday": {"open": "مغلق", "close": "مغلق"}}',
'{"notifications": {"email": true, "sms": true, "push": true}, "security": {"twoFactor": true, "sessionTimeout": 30}, "integrations": {"payment_gateways": ["mada", "visa", "mastercard"], "shipping_providers": ["aramex", "dhl", "smsa"]}}',
4.7, 250000.00, 156);

-- Insert users
INSERT INTO users (email, name, phone, role, store_id, address, city, total_spent, total_orders, loyalty_points) VALUES
('admin@binna.com', 'مدير النظام', '+966501111111', 'admin', NULL, 'الرياض', 'الرياض', 0, 0, 0),
('store@binna.com', 'مدير المتجر', '+966112345678', 'store_owner', (SELECT id FROM stores WHERE email = 'store@binna.com'), 'شارع الملك فهد، حي العليا', 'الرياض', 0, 0, 0),
('user@binna.com', 'عميل تجريبي', '+966507777777', 'user', NULL, 'حي النخيل، الرياض', 'الرياض', 15750.00, 12, 315);

-- Insert sample warranties
INSERT INTO warranties (warranty_number, product_id, product_name, customer_id, customer_name, order_id, purchase_date, warranty_start, warranty_end, warranty_period, coverage_details, quantity, unit_price, total_value) VALUES
('W001', (SELECT id FROM erp_products WHERE sku = 'CEM-001'), 'أسمنت بورتلاندي', (SELECT id FROM erp_customers WHERE email = 'ahmed@example.com'), 'أحمد محمد', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240614-001'), '2024-06-14', '2024-06-14', '2026-06-14', 24, 'ضمان ضد عيوب التصنيع', 150, 25.00, 3750.00),
('W002', (SELECT id FROM erp_products WHERE sku = 'CER-001'), 'بلاط سيراميك', (SELECT id FROM erp_customers WHERE email = 'fatima@example.com'), 'فاطمة العلي', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240614-002'), '2024-06-14', '2024-06-14', '2025-06-14', 12, 'ضمان ضد الكسر والتشقق', 100, 45.00, 4500.00);

-- Insert sample warranty claims
INSERT INTO warranty_claims (claim_number, warranty_id, customer_id, customer_name, customer_email, customer_phone, issue_type, issue_description, quantity_affected, total_quantity, preferred_resolution, damage_photos, priority, value, status) VALUES
('CLAIM-001', (SELECT id FROM warranties WHERE warranty_number = 'W001'), (SELECT id FROM erp_customers WHERE email = 'ahmed@example.com'), 'أحمد محمد', 'ahmed@example.com', '+966501234567', 'manufacturing_defect', 'بعض أكياس الأسمنت تحتوي على كتل صلبة وقد تكون منتهية الصلاحية', 10, 150, 'استبدال الأكياس المعيبة', '[]', 'medium', 250.00, 'pending'),
('CLAIM-002', (SELECT id FROM warranties WHERE warranty_number = 'W002'), (SELECT id FROM erp_customers WHERE email = 'fatima@example.com'), 'فاطمة العلي', 'fatima@example.com', '+966507654321', 'wear_and_tear', 'ظهور تشققات في البلاط بعد التركيب بفترة قصيرة', 5, 100, 'استبدال القطع المتشققة', '["damage-photo-1.jpg", "damage-photo-2.jpg"]', 'high', 225.00, 'in_progress');

-- Insert sample store reviews
INSERT INTO store_reviews (store_id, customer_id, order_id, rating, review_text, review_title, verified_purchase) VALUES
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'ahmed@example.com'), (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240614-001'), 5, 'خدمة ممتازة وجودة عالية. أنصح بالتعامل مع هذا المتجر', 'تجربة رائعة', true),
((SELECT id FROM stores WHERE email = 'store@binna.com'), (SELECT id FROM erp_customers WHERE email = 'fatima@example.com'), (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240614-002'), 4, 'منتجات جيدة وأسعار مناسبة. التوصيل كان سريع', 'راضية عن الخدمة', true);

-- Create a function to update store ratings based on reviews
CREATE OR REPLACE FUNCTION update_store_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE stores 
    SET rating = (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 4.5)
        FROM store_reviews 
        WHERE store_id = COALESCE(NEW.store_id, OLD.store_id) 
        AND status = 'published'
    )
    WHERE id = COALESCE(NEW.store_id, OLD.store_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Create trigger to automatically update store ratings
CREATE TRIGGER update_store_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON store_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_store_rating();
