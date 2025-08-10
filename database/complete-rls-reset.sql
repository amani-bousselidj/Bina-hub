-- Complete RLS Reset Script
-- Run this in your Supabase SQL editor to completely fix RLS issues

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

-- Step 3: Check if any tables are missing and create them if needed
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
    loyalty_points integer DEFAULT 0,
    current_level integer DEFAULT 1,
    total_spent numeric DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text,
    order_number text,
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
    invoice_number text,
    store_name text,
    amount numeric,
    status text,
    issue_date date,
    due_date date,
    items jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Step 4: Insert some sample data if tables are empty
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, loyalty_points, current_level, total_spent)
SELECT 'user@binna', 'مستخدم بناء', 'user@binna.com', '+966501234567', 'الرياض', 'premium', 2500, 3, 15750.00
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'user@binna');

INSERT INTO public.orders (user_id, order_number, store_name, items, total_amount, status, shipping_address, payment_method)
SELECT 'user@binna', 'ORD-2025-001', 'متجر مواد البناء المطور', 
       '[{"name": "إسمنت أبيض", "quantity": 20, "price": 125.00}, {"name": "رمل بناء", "quantity": 10, "price": 50.00}]'::jsonb,
       3000.00, 'delivered', 'الرياض، النرجس، المملكة العربية السعودية', 'بطاقة ائتمان'
WHERE NOT EXISTS (SELECT 1 FROM public.orders WHERE user_id = 'user@binna' AND order_number = 'ORD-2025-001');

INSERT INTO public.orders (user_id, order_number, store_name, items, total_amount, status, shipping_address, payment_method)
SELECT 'user@binna', 'ORD-2025-002', 'متجر الأدوات الحديثة', 
       '[{"name": "مفاتيح إنجليزية", "quantity": 5, "price": 75.00}, {"name": "مطرقة كهربائية", "quantity": 1, "price": 450.00}]'::jsonb,
       825.00, 'shipped', 'الرياض، النرجس، المملكة العربية السعودية', 'نقد عند التسليم'
WHERE NOT EXISTS (SELECT 1 FROM public.orders WHERE user_id = 'user@binna' AND order_number = 'ORD-2025-002');

INSERT INTO public.construction_projects (user_id, name, description, status, start_date, budget, spent, location, type)
SELECT 'user@binna', 'فيلا سكنية - النرجس', 'بناء فيلا سكنية حديثة بمساحة 500 متر مربع', 'in-progress', '2025-03-01', 650000, 425000, 'الرياض - النرجس', 'سكني'
WHERE NOT EXISTS (SELECT 1 FROM public.construction_projects WHERE user_id = 'user@binna' AND name = 'فيلا سكنية - النرجس');

INSERT INTO public.construction_projects (user_id, name, description, status, start_date, end_date, budget, spent, location, type)
SELECT 'user@binna', 'تجديد المطبخ', 'تجديد وتحديث المطبخ الرئيسي مع أجهزة حديثة', 'completed', '2025-01-15', '2025-03-10', 55000, 52000, 'الرياض - الملز', 'تجديد'
WHERE NOT EXISTS (SELECT 1 FROM public.construction_projects WHERE user_id = 'user@binna' AND name = 'تجديد المطبخ');

INSERT INTO public.warranties (user_id, product_name, store_name, purchase_date, expiry_date, status, warranty_type, value)
SELECT 'user@binna', 'مكيف سبليت 3 طن سامسونج', 'متجر الأجهزة المتطورة', '2024-06-15', '2027-06-15', 'active', 'ضمان الشركة المصنعة', 3200.00
WHERE NOT EXISTS (SELECT 1 FROM public.warranties WHERE user_id = 'user@binna' AND product_name = 'مكيف سبليت 3 طن سامسونج');

INSERT INTO public.warranties (user_id, product_name, store_name, purchase_date, expiry_date, status, warranty_type, value)
SELECT 'user@binna', 'ثلاجة إل جي 20 قدم', 'معرض الأجهزة الكهربائية', '2024-08-10', '2027-08-10', 'active', 'ضمان شامل', 4500.00
WHERE NOT EXISTS (SELECT 1 FROM public.warranties WHERE user_id = 'user@binna' AND product_name = 'ثلاجة إل جي 20 قدم');

INSERT INTO public.invoices (user_id, invoice_number, store_name, amount, status, issue_date, due_date, items)
SELECT 'user@binna', 'INV-2025-001', 'متجر مواد البناء المطور', 3450.00, 'paid', '2025-07-15', '2025-07-30',
       '[{"description": "إسمنت أبيض 50 كغ", "quantity": 20, "unitPrice": 125.00, "total": 2500.00}, {"description": "رمل بناء", "quantity": 10, "unitPrice": 50.00, "total": 500.00}, {"description": "ضريبة القيمة المضافة", "quantity": 1, "unitPrice": 450.00, "total": 450.00}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.invoices WHERE user_id = 'user@binna' AND invoice_number = 'INV-2025-001');

-- Step 5: Verify data was inserted
SELECT 'user_profiles' as table_name, count(*) as record_count FROM public.user_profiles
UNION ALL
SELECT 'orders', count(*) FROM public.orders
UNION ALL  
SELECT 'construction_projects', count(*) FROM public.construction_projects
UNION ALL
SELECT 'warranties', count(*) FROM public.warranties  
UNION ALL
SELECT 'invoices', count(*) FROM public.invoices;

-- Step 6: Show some sample data
SELECT 'Sample user profile:' as info;
SELECT * FROM public.user_profiles WHERE user_id = 'user@binna' LIMIT 1;

SELECT 'Sample orders:' as info;
SELECT id, order_number, store_name, total_amount, status FROM public.orders WHERE user_id = 'user@binna' LIMIT 3;

SELECT 'Sample projects:' as info; 
SELECT id, name, status, budget, spent FROM public.construction_projects WHERE user_id = 'user@binna' LIMIT 3;
