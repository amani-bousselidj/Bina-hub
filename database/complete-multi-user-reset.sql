-- Complete Multi-User RLS Reset Script
-- Run this in your Supabase SQL editor to fix RLS issues for ALL user types

-- Step 1: Drop ALL policies on all tables
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Get all policies and drop them
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public' 
              AND tablename IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices', 'service_providers', 'stores', 'material_prices'))
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.schemaname || '.' || r.tablename;
    END LOOP;
END $$;

-- Step 2: Disable RLS on all tables completely
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_prices DISABLE ROW LEVEL SECURITY;

-- Step 3: Ensure all table structures exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text UNIQUE,
    display_name text,
    email text,
    phone text,
    city text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    account_type text DEFAULT 'free',
    user_type text DEFAULT 'customer', -- 'customer', 'admin', 'store_owner', 'service_provider'
    loyalty_points integer DEFAULT 0,
    current_level integer DEFAULT 1,
    total_spent numeric DEFAULT 0,
    permissions jsonb DEFAULT '[]'::jsonb,
    store_id text NULL, -- For store owners
    status text DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS public.stores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id text UNIQUE,
    name text,
    owner_user_id text,
    description text,
    address text,
    city text,
    phone text,
    email text,
    category text,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text,
    order_number text,
    store_id text,
    store_name text,
    items jsonb,
    total_amount numeric,
    status text,
    created_at timestamp with time zone DEFAULT now(),
    shipping_address text,
    payment_method text,
    tracking_number text
);

CREATE TABLE IF NOT EXISTS public.construction_projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text,
    name text,
    description text,
    status text,
    start_date date,
    end_date date,
    budget numeric,
    spent numeric DEFAULT 0,
    location text,
    type text,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.warranties (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text,
    product_name text,
    store_id text,
    store_name text,
    purchase_date date,
    expiry_date date,
    status text,
    warranty_type text,
    value numeric,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text,
    store_id text,
    invoice_number text,
    store_name text,
    amount numeric,
    status text,
    issue_date date,
    due_date date,
    items jsonb,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.service_providers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id text UNIQUE,
    user_id text,
    name text,
    service_type text,
    description text,
    location text,
    phone text,
    email text,
    rating numeric DEFAULT 0,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.material_prices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id text,
    material_name text,
    category text,
    price numeric,
    unit text,
    stock_quantity integer DEFAULT 0,
    last_updated timestamp with time zone DEFAULT now()
);

-- Step 4: Insert sample data for ALL user types

-- Regular Customer
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type, loyalty_points, current_level, total_spent)
SELECT 'user@binna', 'مستخدم بناء', 'user@binna.com', '+966501234567', 'الرياض', 'premium', 'customer', 2500, 3, 15750.00
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'user@binna');

-- Admin User
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type, permissions)
SELECT 'admin@binna', 'مدير النظام', 'admin@binna.com', '+966501234568', 'الرياض', 'admin', 'admin', 
       '["manage_users", "manage_stores", "view_analytics", "manage_orders", "system_settings"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'admin@binna');

-- Store Owner 1
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type, store_id)
SELECT 'store1@binna', 'صاحب متجر مواد البناء', 'store1@binna.com', '+966501234569', 'الرياض', 'business', 'store_owner', 'store-001'
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'store1@binna');

-- Store Owner 2  
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type, store_id)
SELECT 'store2@binna', 'صاحب متجر الأدوات', 'store2@binna.com', '+966501234570', 'جدة', 'business', 'store_owner', 'store-002'
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'store2@binna');

-- Service Provider
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type)
SELECT 'provider@binna', 'مقاول أعمال البناء', 'provider@binna.com', '+966501234571', 'الرياض', 'business', 'service_provider'
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'provider@binna');

-- Insert Stores
INSERT INTO public.stores (store_id, name, owner_user_id, description, address, city, phone, email, category)
SELECT 'store-001', 'متجر مواد البناء المطور', 'store1@binna', 'متجر متخصص في جميع مواد البناء والإنشاءات', 'شارع الملك فهد، الرياض', 'الرياض', '+966112345678', 'store1@binna.com', 'building_materials'
WHERE NOT EXISTS (SELECT 1 FROM public.stores WHERE store_id = 'store-001');

INSERT INTO public.stores (store_id, name, owner_user_id, description, address, city, phone, email, category)
SELECT 'store-002', 'متجر الأدوات الحديثة', 'store2@binna', 'متجر متخصص في الأدوات والمعدات المهنية', 'شارع التحلية، جدة', 'جدة', '+966126543210', 'store2@binna.com', 'tools_equipment'
WHERE NOT EXISTS (SELECT 1 FROM public.stores WHERE store_id = 'store-002');

-- Insert Service Provider
INSERT INTO public.service_providers (provider_id, user_id, name, service_type, description, location, phone, email, rating)
SELECT 'provider-001', 'provider@binna', 'مقاولات الإنشاءات المتقدمة', 'construction', 'شركة متخصصة في أعمال البناء والتشطيبات', 'الرياض', '+966501234571', 'provider@binna.com', 4.8
WHERE NOT EXISTS (SELECT 1 FROM public.service_providers WHERE provider_id = 'provider-001');

-- Insert Orders for different users
INSERT INTO public.orders (user_id, order_number, store_id, store_name, items, total_amount, status, shipping_address, payment_method)
SELECT 'user@binna', 'ORD-2025-001', 'store-001', 'متجر مواد البناء المطور', 
       '[{"name": "إسمنت أبيض", "quantity": 20, "price": 125.00}, {"name": "رمل بناء", "quantity": 10, "price": 50.00}]'::jsonb,
       3000.00, 'delivered', 'الرياض، النرجس، المملكة العربية السعودية', 'بطاقة ائتمان'
WHERE NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = 'ORD-2025-001');

INSERT INTO public.orders (user_id, order_number, store_id, store_name, items, total_amount, status, shipping_address, payment_method)
SELECT 'user@binna', 'ORD-2025-002', 'store-002', 'متجر الأدوات الحديثة', 
       '[{"name": "مفاتيح إنجليزية", "quantity": 5, "price": 75.00}, {"name": "مطرقة كهربائية", "quantity": 1, "price": 450.00}]'::jsonb,
       825.00, 'shipped', 'الرياض، النرجس، المملكة العربية السعودية', 'نقد عند التسليم'
WHERE NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = 'ORD-2025-002');

-- Insert Construction Projects
INSERT INTO public.construction_projects (user_id, name, description, status, start_date, budget, spent, location, type)
SELECT 'user@binna', 'فيلا سكنية - النرجس', 'بناء فيلا سكنية حديثة بمساحة 500 متر مربع', 'in-progress', '2025-03-01', 650000, 425000, 'الرياض - النرجس', 'سكني'
WHERE NOT EXISTS (SELECT 1 FROM public.construction_projects WHERE name = 'فيلا سكنية - النرجس');

INSERT INTO public.construction_projects (user_id, name, description, status, start_date, end_date, budget, spent, location, type)
SELECT 'user@binna', 'تجديد المطبخ', 'تجديد وتحديث المطبخ الرئيسي مع أجهزة حديثة', 'completed', '2025-01-15', '2025-03-10', 55000, 52000, 'الرياض - الملز', 'تجديد'
WHERE NOT EXISTS (SELECT 1 FROM public.construction_projects WHERE name = 'تجديد المطبخ');

-- Insert Warranties
INSERT INTO public.warranties (user_id, product_name, store_id, store_name, purchase_date, expiry_date, status, warranty_type, value)
SELECT 'user@binna', 'مكيف سبليت 3 طن سامسونج', 'store-001', 'متجر مواد البناء المطور', '2024-06-15', '2027-06-15', 'active', 'ضمان الشركة المصنعة', 3200.00
WHERE NOT EXISTS (SELECT 1 FROM public.warranties WHERE product_name = 'مكيف سبليت 3 طن سامسونج');

-- Insert Invoices  
INSERT INTO public.invoices (user_id, store_id, invoice_number, store_name, amount, status, issue_date, due_date, items)
SELECT 'user@binna', 'store-001', 'INV-2025-001', 'متجر مواد البناء المطور', 3450.00, 'paid', '2025-07-15', '2025-07-30',
       '[{"description": "إسمنت أبيض 50 كغ", "quantity": 20, "unitPrice": 125.00, "total": 2500.00}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.invoices WHERE invoice_number = 'INV-2025-001');

-- Insert Material Prices
INSERT INTO public.material_prices (store_id, material_name, category, price, unit, stock_quantity)
VALUES 
('store-001', 'إسمنت أبيض', 'cement', 125.00, 'كيس 50 كغ', 500),
('store-001', 'رمل بناء', 'sand', 50.00, 'متر مكعب', 200),
('store-002', 'مفاتيح إنجليزية', 'tools', 75.00, 'قطعة', 150),
('store-002', 'مطرقة كهربائية', 'tools', 450.00, 'قطعة', 25)
ON CONFLICT DO NOTHING;

-- Step 5: Verify all data was inserted  
SELECT 'Data Summary:' as info;
SELECT 
    'user_profiles' as table_name, 
    count(*) as total_records,
    count(*) FILTER (WHERE user_type = 'customer') as customers,
    count(*) FILTER (WHERE user_type = 'admin') as admins,
    count(*) FILTER (WHERE user_type = 'store_owner') as store_owners,
    count(*) FILTER (WHERE user_type = 'service_provider') as service_providers
FROM public.user_profiles

UNION ALL

SELECT 'stores', count(*), 0, 0, 0, 0 FROM public.stores
UNION ALL  
SELECT 'orders', count(*), 0, 0, 0, 0 FROM public.orders
UNION ALL
SELECT 'construction_projects', count(*), 0, 0, 0, 0 FROM public.construction_projects
UNION ALL
SELECT 'warranties', count(*), 0, 0, 0, 0 FROM public.warranties
UNION ALL
SELECT 'invoices', count(*), 0, 0, 0, 0 FROM public.invoices
UNION ALL
SELECT 'service_providers', count(*), 0, 0, 0, 0 FROM public.service_providers
UNION ALL
SELECT 'material_prices', count(*), 0, 0, 0, 0 FROM public.material_prices;

-- Step 6: Show sample data for each user type
SELECT 'All User Types:' as info;
SELECT user_id, display_name, user_type, account_type, city FROM public.user_profiles ORDER BY user_type;

SELECT 'Sample Stores:' as info;
SELECT store_id, name, owner_user_id, city, category FROM public.stores;

SELECT 'Sample Orders:' as info;
SELECT order_number, user_id, store_name, total_amount, status FROM public.orders LIMIT 5;
