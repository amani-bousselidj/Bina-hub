-- Quick RLS Status Check
-- Run this in Supabase SQL Editor to see current state

-- Check if RLS is disabled on tables
SELECT 
    schemaname,
    tablename,
    CASE WHEN rowsecurity THEN 'RLS ENABLED ❌' ELSE 'RLS DISABLED ✅' END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices')
ORDER BY tablename;

-- Check if data exists in tables  
SELECT 'user_profiles' as table_name, count(*) as record_count FROM public.user_profiles
UNION ALL
SELECT 'orders', count(*) FROM public.orders  
UNION ALL
SELECT 'construction_projects', count(*) FROM public.construction_projects
UNION ALL
SELECT 'warranties', count(*) FROM public.warranties
UNION ALL  
SELECT 'invoices', count(*) FROM public.invoices;

-- Check if there are any policies still active
SELECT 
    tablename,
    policyname,
    'Policy still exists ❌' as status
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices')
ORDER BY tablename;

-- Try simple insert test
INSERT INTO public.user_profiles (user_id, display_name, email) 
VALUES ('test@binna', 'Test User', 'test@binna.com')
ON CONFLICT (user_id) DO NOTHING;

-- Check if insert worked
SELECT user_id, display_name, email FROM public.user_profiles WHERE user_id = 'test@binna';
