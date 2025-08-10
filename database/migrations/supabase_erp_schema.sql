-- ERP System Database Schema for Supabase
-- Run these SQL commands in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create ERP Customers Table
CREATE TABLE erp_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'السعودية',
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    vat_number VARCHAR(50),
    contact_person VARCHAR(255),
    payment_terms VARCHAR(100),
    credit_limit DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ERP Products Table
CREATE TABLE erp_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    stock INTEGER DEFAULT 0,
    min_stock INTEGER DEFAULT 10,
    max_stock INTEGER,
    unit VARCHAR(50) DEFAULT 'قطعة',
    description TEXT,
    description_ar TEXT,
    supplier VARCHAR(255),
    supplier_id UUID,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    images JSONB,
    specifications JSONB,
    is_service BOOLEAN DEFAULT FALSE,
    warranty_period INTEGER, -- in months
    expiry_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(100),
    weight DECIMAL(8,3),
    dimensions JSONB, -- {length, width, height}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ERP Orders Table
CREATE TABLE erp_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES erp_customers(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    total DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    vat_amount DECIMAL(12,2) DEFAULT 0,
    discount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    delivery_date TIMESTAMP WITH TIME ZONE,
    delivery_address TEXT,
    notes TEXT,
    items JSONB NOT NULL, -- Array of order items
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    reference_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ERP Invoices Table
CREATE TABLE erp_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID REFERENCES erp_customers(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    order_id UUID REFERENCES erp_orders(id) ON DELETE SET NULL,
    total DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    vat_amount DECIMAL(12,2) DEFAULT 0,
    discount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    items JSONB NOT NULL, -- Array of invoice items
    notes TEXT,
    terms TEXT,
    zatca_qr TEXT, -- ZATCA QR code
    zatca_hash VARCHAR(255), -- ZATCA hash
    pdf_path VARCHAR(500), -- Path to generated PDF
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create ERP Stock Movements Table
CREATE TABLE erp_stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES erp_products(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('in', 'out', 'adjustment')),
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(20) NOT NULL CHECK (reference_type IN ('purchase', 'sale', 'adjustment', 'transfer')),
    reference_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    created_by VARCHAR(255) NOT NULL
);

-- Create ERP Suppliers Table (Optional)
CREATE TABLE erp_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'السعودية',
    vat_number VARCHAR(50),
    contact_person VARCHAR(255),
    payment_terms VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create Indexes for better performance
CREATE INDEX idx_erp_customers_email ON erp_customers(email);
CREATE INDEX idx_erp_customers_status ON erp_customers(status);
CREATE INDEX idx_erp_customers_created_at ON erp_customers(created_at);

CREATE INDEX idx_erp_products_sku ON erp_products(sku);
CREATE INDEX idx_erp_products_barcode ON erp_products(barcode);
CREATE INDEX idx_erp_products_category ON erp_products(category);
CREATE INDEX idx_erp_products_status ON erp_products(status);
CREATE INDEX idx_erp_products_stock ON erp_products(stock);

CREATE INDEX idx_erp_orders_customer_id ON erp_orders(customer_id);
CREATE INDEX idx_erp_orders_order_number ON erp_orders(order_number);
CREATE INDEX idx_erp_orders_status ON erp_orders(status);
CREATE INDEX idx_erp_orders_order_date ON erp_orders(order_date);

CREATE INDEX idx_erp_invoices_customer_id ON erp_invoices(customer_id);
CREATE INDEX idx_erp_invoices_invoice_number ON erp_invoices(invoice_number);
CREATE INDEX idx_erp_invoices_status ON erp_invoices(status);
CREATE INDEX idx_erp_invoices_due_date ON erp_invoices(due_date);

CREATE INDEX idx_erp_stock_movements_product_id ON erp_stock_movements(product_id);
CREATE INDEX idx_erp_stock_movements_created_at ON erp_stock_movements(created_at);

-- Create triggers to automatically update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_erp_customers_updated_at BEFORE UPDATE ON erp_customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_erp_products_updated_at BEFORE UPDATE ON erp_products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_erp_orders_updated_at BEFORE UPDATE ON erp_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_erp_invoices_updated_at BEFORE UPDATE ON erp_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_erp_suppliers_updated_at BEFORE UPDATE ON erp_suppliers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE erp_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_suppliers ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (adjust as needed for your security requirements)
CREATE POLICY "Users can view all ERP customers" ON erp_customers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert ERP customers" ON erp_customers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update ERP customers" ON erp_customers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete ERP customers" ON erp_customers FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all ERP products" ON erp_products FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert ERP products" ON erp_products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update ERP products" ON erp_products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete ERP products" ON erp_products FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all ERP orders" ON erp_orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert ERP orders" ON erp_orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update ERP orders" ON erp_orders FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete ERP orders" ON erp_orders FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all ERP invoices" ON erp_invoices FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert ERP invoices" ON erp_invoices FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update ERP invoices" ON erp_invoices FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete ERP invoices" ON erp_invoices FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all ERP stock movements" ON erp_stock_movements FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert ERP stock movements" ON erp_stock_movements FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view all ERP suppliers" ON erp_suppliers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert ERP suppliers" ON erp_suppliers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update ERP suppliers" ON erp_suppliers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete ERP suppliers" ON erp_suppliers FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO erp_customers (name, email, phone, company, address, city, country, vat_number, total_orders, total_spent, status) VALUES
('أحمد محمد', 'ahmed@example.com', '+966501234567', 'شركة البناء الحديث', 'شارع الملك فهد', 'الرياض', 'السعودية', '300123456700003', 15, 45000.00, 'active'),
('فاطمة العلي', 'fatima@example.com', '+966507654321', 'مؤسسة التجارة المتقدمة', 'شارع العليا', 'جدة', 'السعودية', '300123456700004', 8, 32000.00, 'active'),
('محمد السعيد', 'mohammed@example.com', '+966551234567', 'مجموعة المقاولات الكبرى', 'شارع الأمير محمد', 'الدمام', 'السعودية', '300123456700005', 12, 58000.00, 'active');

INSERT INTO erp_products (name, name_ar, sku, price, cost, category, stock, min_stock, unit, description, description_ar, status) VALUES
('أسمنت بورتلاندي', 'أسمنت بورتلاندي', 'CEM-001', 25.00, 18.00, 'مواد البناء', 500, 100, 'كيس', 'أسمنت بورتلاندي عالي الجودة', 'أسمنت بورتلاندي عالي الجودة', 'active'),
('حديد تسليح 12 مم', 'حديد تسليح 12 مم', 'REB-012', 2800.00, 2500.00, 'الحديد والمعادن', 50, 20, 'طن', 'حديد تسليح عالي الكربون', 'حديد تسليح عالي الكربون', 'active'),
('بلاط سيراميك', 'بلاط سيراميك', 'CER-001', 45.00, 35.00, 'السيراميك والبلاط', 200, 50, 'متر مربع', 'بلاط سيراميك فاخر', 'بلاط سيراميك فاخر', 'active'),
('دهان داخلي', 'دهان داخلي', 'PNT-001', 120.00, 90.00, 'الدهانات', 80, 25, 'جالون', 'دهان داخلي عالي الجودة', 'دهان داخلي عالي الجودة', 'active');

INSERT INTO erp_orders (order_number, customer_id, customer_name, total, subtotal, vat_amount, status, payment_status, order_date, items) VALUES
('ORD-20240614-001', (SELECT id FROM erp_customers WHERE email = 'ahmed@example.com'), 'أحمد محمد', 4312.50, 3750.00, 562.50, 'confirmed', 'paid', NOW(), '[{"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'CEM-001') || '", "product_name": "أسمنت بورتلاندي", "sku": "CEM-001", "quantity": 150, "price": 25.00, "total": 3750.00, "vat_rate": 15, "vat_amount": 562.50}]'),
('ORD-20240614-002', (SELECT id FROM erp_customers WHERE email = 'fatima@example.com'), 'فاطمة العلي', 5175.00, 4500.00, 675.00, 'pending', 'pending', NOW(), '[{"product_id": "' || (SELECT id FROM erp_products WHERE sku = 'CER-001') || '", "product_name": "بلاط سيراميك", "sku": "CER-001", "quantity": 100, "price": 45.00, "total": 4500.00, "vat_rate": 15, "vat_amount": 675.00}]');

INSERT INTO erp_invoices (invoice_number, customer_id, customer_name, order_id, total, subtotal, vat_amount, status, issue_date, due_date, items) VALUES
('INV-20240614-001', (SELECT id FROM erp_customers WHERE email = 'ahmed@example.com'), 'أحمد محمد', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240614-001'), 4312.50, 3750.00, 562.50, 'paid', NOW(), NOW() + INTERVAL '30 days', '[{"description": "أسمنت بورتلاندي", "quantity": 150, "price": 25.00, "vat_rate": 15, "vat_amount": 562.50, "total": 3750.00}]'),
('INV-20240614-002', (SELECT id FROM erp_customers WHERE email = 'fatima@example.com'), 'فاطمة العلي', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240614-002'), 5175.00, 4500.00, 675.00, 'sent', NOW(), NOW() + INTERVAL '30 days', '[{"description": "بلاط سيراميك", "quantity": 100, "price": 45.00, "vat_rate": 15, "vat_amount": 675.00, "total": 4500.00}]');

-- Create sample stock movements
INSERT INTO erp_stock_movements (product_id, product_name, type, quantity, reference_type, reference_id, created_by) VALUES
((SELECT id FROM erp_products WHERE sku = 'CEM-001'), 'أسمنت بورتلاندي', 'out', 150, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240614-001'), 'system'),
((SELECT id FROM erp_products WHERE sku = 'CER-001'), 'بلاط سيراميك', 'out', 100, 'sale', (SELECT id FROM erp_orders WHERE order_number = 'ORD-20240614-002'), 'system');

-- Create a view for dashboard analytics
CREATE OR REPLACE VIEW erp_dashboard_stats AS
SELECT 
    (SELECT COALESCE(SUM(total), 0) FROM erp_invoices WHERE status = 'paid') as total_revenue,
    (SELECT COALESCE(SUM(total), 0) FROM erp_invoices WHERE status = 'paid' AND payment_date >= date_trunc('month', CURRENT_DATE)) as monthly_revenue,
    (SELECT COUNT(*) FROM erp_orders) as total_orders,
    (SELECT COUNT(*) FROM erp_orders WHERE status = 'pending') as pending_orders,
    (SELECT COUNT(*) FROM erp_customers) as total_customers,
    (SELECT COUNT(*) FROM erp_customers WHERE created_at >= date_trunc('month', CURRENT_DATE)) as new_customers,
    (SELECT COUNT(*) FROM erp_products WHERE stock <= min_stock) as low_stock_items,
    (SELECT COUNT(*) FROM erp_invoices) as total_invoices,
    (SELECT COUNT(*) FROM erp_invoices WHERE status IN ('sent', 'overdue') AND due_date < CURRENT_DATE) as overdue_invoices;
