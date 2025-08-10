-- RLS Policy Diagnostic Script
-- Run this in your Supabase SQL editor to analyze current policies before reset

-- Step 1: Check all existing policies and their definitions
SELECT 
    schemaname,
    tablename, 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Step 2: Check RLS status on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    relowner
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices', 'service_providers', 'stores', 'material_prices')
ORDER BY tablename;

-- Step 3: Check for any custom functions used in policies
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_result(p.oid) as return_type,
    pg_get_function_arguments(p.oid) as arguments,
    p.prosrc as function_body
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND (p.prosrc ILIKE '%user%' OR p.prosrc ILIKE '%auth%' OR p.prosrc ILIKE '%profile%')
ORDER BY p.proname;

-- Step 4: Check for any triggers that might affect RLS
SELECT 
    t.tgname as trigger_name,
    c.relname as table_name,
    p.proname as function_name,
    pg_get_triggerdef(t.oid) as trigger_definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND c.relname IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices', 'service_providers', 'stores', 'material_prices')
ORDER BY c.relname, t.tgname;

-- Step 5: Check for any foreign key relationships that might cause recursion
SELECT
    tc.table_name as source_table,
    kcu.column_name as source_column,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public'
AND (tc.table_name IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices', 'service_providers', 'stores', 'material_prices')
     OR ccu.table_name IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices', 'service_providers', 'stores', 'material_prices'))
ORDER BY tc.table_name;

-- Step 6: Check auth schema functions (common source of RLS issues)
SELECT 
    p.proname as function_name,
    pg_get_function_result(p.oid) as return_type,
    pg_get_function_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'auth'
AND p.proname IN ('uid', 'jwt', 'role', 'email')
ORDER BY p.proname;

-- Step 7: Test a simple query to trigger the exact error
-- This will show us the exact recursion path
SELECT 'Testing user_profiles access...' as test;
-- Uncomment the line below to test (may cause recursion error)
-- SELECT count(*) FROM public.user_profiles WHERE user_id = 'user@binna';

-- Step 8: Check if there are any policies referencing other tables
SELECT 
    p.schemaname,
    p.tablename,
    p.policyname,
    p.qual,
    p.with_check
FROM pg_policies p
WHERE p.schemaname = 'public'
AND (p.qual ILIKE '%user_profiles%' 
     OR p.qual ILIKE '%orders%' 
     OR p.qual ILIKE '%construction_projects%'
     OR p.qual ILIKE '%warranties%'
     OR p.qual ILIKE '%invoices%'
     OR p.with_check ILIKE '%user_profiles%'
     OR p.with_check ILIKE '%orders%'
     OR p.with_check ILIKE '%construction_projects%'
     OR p.with_check ILIKE '%warranties%'
     OR p.with_check ILIKE '%invoices%')
ORDER BY p.tablename, p.policyname;
