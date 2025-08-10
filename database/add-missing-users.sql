-- Quick Multi-User Addition Script
-- Run this in Supabase SQL Editor to add all missing user types

-- Add the main customer user
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type, loyalty_points, current_level, total_spent)
SELECT 'user@binna', 'مستخدم بناء', 'user@binna.com', '+966501234567', 'الرياض', 'premium', 'customer', 2500, 3, 15750.00
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'user@binna');

-- Add admin user
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type, permissions)
SELECT 'admin@binna', 'مدير النظام', 'admin@binna.com', '+966501234568', 'الرياض', 'admin', 'admin', 
       '["manage_users", "manage_stores", "view_analytics", "manage_orders", "system_settings"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'admin@binna');

-- Add store owner 1
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type, store_id)
SELECT 'store1@binna', 'صاحب متجر مواد البناء', 'store1@binna.com', '+966501234569', 'الرياض', 'business', 'store_owner', 'store-001'
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'store1@binna');

-- Add store owner 2
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type, store_id)
SELECT 'store2@binna', 'صاحب متجر الأدوات', 'store2@binna.com', '+966501234570', 'جدة', 'business', 'store_owner', 'store-002'
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'store2@binna');

-- Add service provider
INSERT INTO public.user_profiles (user_id, display_name, email, phone, city, account_type, user_type)
SELECT 'provider@binna', 'مقاول أعمال البناء', 'provider@binna.com', '+966501234571', 'الرياض', 'business', 'service_provider'
WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = 'provider@binna');

-- Update stores table with proper information
UPDATE public.stores SET 
    name = 'متجر مواد البناء المطور',
    owner_user_id = 'store1@binna',
    description = 'متجر متخصص في جميع مواد البناء والإنشاءات',
    address = 'شارع الملك فهد، الرياض',
    city = 'الرياض',
    phone = '+966112345678',
    email = 'store1@binna.com',
    category = 'building_materials'
WHERE store_id = 'store-001';

UPDATE public.stores SET 
    name = 'متجر الأدوات الحديثة',
    owner_user_id = 'store2@binna',
    description = 'متجر متخصص في الأدوات والمعدات المهنية',
    address = 'شارع التحلية، جدة',
    city = 'جدة',
    phone = '+966126543210',
    email = 'store2@binna.com',
    category = 'tools_equipment'
WHERE store_id = 'store-002';

-- Insert service provider
INSERT INTO public.service_providers (provider_id, user_id, name, service_type, description, location, phone, email, rating)
SELECT 'provider-001', 'provider@binna', 'مقاولات الإنشاءات المتقدمة', 'construction', 'شركة متخصصة في أعمال البناء والتشطيبات', 'الرياض', '+966501234571', 'provider@binna.com', 4.8
WHERE NOT EXISTS (SELECT 1 FROM public.service_providers WHERE provider_id = 'provider-001');

-- Add orders for user@binna
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

-- Add construction projects for user@binna
INSERT INTO public.construction_projects (user_id, name, description, status, start_date, budget, spent, location, type)
SELECT 'user@binna', 'فيلا سكنية - النرجس', 'بناء فيلا سكنية حديثة بمساحة 500 متر مربع', 'in-progress', '2025-03-01', 650000, 425000, 'الرياض - النرجس', 'سكني'
WHERE NOT EXISTS (SELECT 1 FROM public.construction_projects WHERE name = 'فيلا سكنية - النرجس');

INSERT INTO public.construction_projects (user_id, name, description, status, start_date, end_date, budget, spent, location, type)
SELECT 'user@binna', 'تجديد المطبخ', 'تجديد وتحديث المطبخ الرئيسي مع أجهزة حديثة', 'completed', '2025-01-15', '2025-03-10', 55000, 52000, 'الرياض - الملز', 'تجديد'
WHERE NOT EXISTS (SELECT 1 FROM public.construction_projects WHERE name = 'تجديد المطبخ');

-- Add warranties for user@binna
INSERT INTO public.warranties (user_id, product_name, store_id, store_name, purchase_date, expiry_date, status, warranty_type, value)
SELECT 'user@binna', 'مكيف سبليت 3 طن سامسونج', 'store-001', 'متجر مواد البناء المطور', '2024-06-15', '2027-06-15', 'active', 'ضمان الشركة المصنعة', 3200.00
WHERE NOT EXISTS (SELECT 1 FROM public.warranties WHERE product_name = 'مكيف سبليت 3 طن سامسونج');

INSERT INTO public.warranties (user_id, product_name, store_id, store_name, purchase_date, expiry_date, status, warranty_type, value)
SELECT 'user@binna', 'ثلاجة إل جي 20 قدم', 'store-001', 'متجر مواد البناء المطور', '2024-08-10', '2027-08-10', 'active', 'ضمان شامل', 4500.00
WHERE NOT EXISTS (SELECT 1 FROM public.warranties WHERE product_name = 'ثلاجة إل جي 20 قدم');

-- Add invoices for user@binna
INSERT INTO public.invoices (user_id, store_id, invoice_number, store_name, amount, status, issue_date, due_date, items)
SELECT 'user@binna', 'store-001', 'INV-2025-001', 'متجر مواد البناء المطور', 3450.00, 'paid', '2025-07-15', '2025-07-30',
       '[{"description": "إسمنت أبيض 50 كغ", "quantity": 20, "unitPrice": 125.00, "total": 2500.00}, {"description": "رمل بناء", "quantity": 10, "unitPrice": 50.00, "total": 500.00}]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.invoices WHERE invoice_number = 'INV-2025-001');

-- Add material prices
INSERT INTO public.material_prices (store_id, material_name, category, price, unit, stock_quantity)
VALUES 
('store-001', 'إسمنت أبيض', 'cement', 125.00, 'كيس 50 كغ', 500),
('store-001', 'رمل بناء', 'sand', 50.00, 'متر مكعب', 200),
('store-002', 'مفاتيح إنجليزية', 'tools', 75.00, 'قطعة', 150),
('store-002', 'مطرقة كهربائية', 'tools', 450.00, 'قطعة', 25)
ON CONFLICT DO NOTHING;

-- Verification queries
SELECT 'Final User Count by Type:' as info;
SELECT 
    user_type,
    count(*) as user_count,
    string_agg(user_id, ', ') as users
FROM public.user_profiles 
GROUP BY user_type
ORDER BY user_type;

SELECT 'Data Distribution:' as info;
SELECT 'user_profiles' as table_name, count(*) as total_records FROM public.user_profiles
UNION ALL
SELECT 'stores', count(*) FROM public.stores
UNION ALL  
SELECT 'orders', count(*) FROM public.orders
UNION ALL
SELECT 'construction_projects', count(*) FROM public.construction_projects
UNION ALL
SELECT 'warranties', count(*) FROM public.warranties
UNION ALL
SELECT 'invoices', count(*) FROM public.invoices
UNION ALL
SELECT 'service_providers', count(*) FROM public.service_providers
UNION ALL
SELECT 'material_prices', count(*) FROM public.material_prices;
