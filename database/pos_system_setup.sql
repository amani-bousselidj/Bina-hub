-- POS System Database Setup
-- This script creates the necessary tables for the POS system to work

-- Create products table for POS (if not exists)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    cost_price DECIMAL(10,2) DEFAULT 0,
    quantity_in_stock INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100) DEFAULT 'عام',
    image_url TEXT,
    allow_discount BOOLEAN DEFAULT true,
    min_price DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table for POS (if not exists)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    tax_number VARCHAR(50),
    customer_type VARCHAR(20) DEFAULT 'individual' CHECK (customer_type IN ('individual', 'business')),
    outstanding_balance DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sales table for POS (if not exists)
CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID REFERENCES customers(id),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'transfer', 'credit', 'mixed')),
    payment_status VARCHAR(20) DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'partial')),
    notes TEXT,
    cashier_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sale_items table for POS (if not exists)
CREATE TABLE IF NOT EXISTS public.sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES sales(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create suspended_sales table for POS (if not exists)
CREATE TABLE IF NOT EXISTS public.suspended_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_data JSONB NOT NULL,
    suspended_by VARCHAR(100),
    suspended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some demo products for testing
INSERT INTO public.products (name, name_ar, barcode, price, cost_price, quantity_in_stock, category, allow_discount) VALUES
('Demo Product 1', 'منتج تجريبي 1', '1234567890123', 25.50, 15.00, 100, 'إلكترونيات', true),
('Demo Product 2', 'منتج تجريبي 2', '1234567890124', 45.75, 30.00, 50, 'ملابس', true),
('Demo Product 3', 'منتج تجريبي 3', '1234567890125', 12.25, 8.00, 200, 'أغذية', false),
('Demo Product 4', 'منتج تجريبي 4', '1234567890126', 67.99, 45.00, 75, 'منزلية', true),
('Demo Product 5', 'منتج تجريبي 5', '1234567890127', 33.50, 22.00, 150, 'كتب', true)
ON CONFLICT (barcode) DO NOTHING;

-- Insert some demo customers for testing
INSERT INTO public.customers (name, phone, email, customer_type, outstanding_balance) VALUES
('عميل عام', '0500000000', 'general@example.com', 'individual', 0),
('شركة الاختبار المحدودة', '0501111111', 'test@company.com', 'business', 0),
('أحمد محمد', '0502222222', 'ahmed@example.com', 'individual', 0),
('شركة التجارة العربية', '0503333333', 'trade@arabic.com', 'business', 150.75)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON sales(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id ON sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_items_product_id ON sale_items(product_id);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at 
    BEFORE UPDATE ON customers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed)
-- These would typically be handled by your database admin
-- GRANT ALL ON products TO authenticated;
-- GRANT ALL ON customers TO authenticated;
-- GRANT ALL ON sales TO authenticated;
-- GRANT ALL ON sale_items TO authenticated;
-- GRANT ALL ON suspended_sales TO authenticated;
