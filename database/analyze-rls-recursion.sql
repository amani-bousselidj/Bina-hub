-- Recursion Pattern Analysis Script
-- This script helps identify the exact cause of RLS recursion

-- Step 1: Show the exact policy definitions causing issues
SELECT 
    'Policy Definition Analysis' as section,
    tablename,
    policyname,
    cmd as command_type,
    CASE 
        WHEN qual IS NOT NULL THEN 'USING: ' || qual
        ELSE 'No USING clause'
    END as using_clause,
    CASE 
        WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check  
        ELSE 'No WITH CHECK clause'
    END as with_check_clause
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename = 'user_profiles'
ORDER BY policyname;

-- Step 2: Check for circular references in policies
WITH policy_refs AS (
    SELECT 
        tablename,
        policyname,
        qual as policy_expression,
        CASE 
            WHEN qual ILIKE '%user_profiles%' THEN 'References user_profiles'
            WHEN qual ILIKE '%auth.uid()%' THEN 'Uses auth.uid()'
            WHEN qual ILIKE '%current_user%' THEN 'Uses current_user'
            WHEN qual ILIKE '%session_user%' THEN 'Uses session_user'
            ELSE 'Other reference'
        END as reference_type
    FROM pg_policies 
    WHERE schemaname = 'public'
    AND qual IS NOT NULL
)
SELECT * FROM policy_refs 
WHERE tablename IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices')
ORDER BY tablename, reference_type;

-- Step 3: Check auth.uid() function availability and behavior
SELECT 'Checking auth functions...' as info;

-- Test if auth.uid() function exists and is accessible
SELECT 
    p.proname as function_name,
    p.provolatile as volatility,
    p.prosecdef as security_definer,
    p.proisstrict as is_strict
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'auth' AND p.proname = 'uid';

-- Step 4: Check for any recursive policy patterns
SELECT 
    'Recursive Pattern Check' as analysis,
    p1.tablename as table1,
    p1.policyname as policy1,
    p2.tablename as table2, 
    p2.policyname as policy2,
    'Potential circular reference' as issue
FROM pg_policies p1, pg_policies p2
WHERE p1.schemaname = 'public' 
AND p2.schemaname = 'public'
AND p1.tablename != p2.tablename
AND p1.qual ILIKE '%' || p2.tablename || '%'
AND p2.qual ILIKE '%' || p1.tablename || '%';

-- Step 5: Simple test queries to isolate the issue
SELECT 'Testing basic access patterns...' as test_info;

-- Test 1: Check if we can access pg_policies itself
SELECT count(*) as policy_count 
FROM pg_policies 
WHERE schemaname = 'public';

-- Test 2: Check table existence  
SELECT 
    table_name,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t.table_name) 
        THEN 'EXISTS' 
        ELSE 'MISSING' 
    END as status
FROM (VALUES 
    ('user_profiles'),
    ('orders'), 
    ('construction_projects'),
    ('warranties'),
    ('invoices')
) AS t(table_name);

-- Step 6: Identify the exact recursion trigger
SELECT 
    'RLS Recursion Analysis' as analysis_type,
    tablename,
    policyname,
    CASE
        WHEN qual ILIKE '%auth.uid()%' AND qual ILIKE '%user_profiles%' THEN 'HIGH RISK: Uses auth.uid() + references user_profiles'
        WHEN qual ILIKE '%EXISTS%' AND qual ILIKE '%SELECT%' THEN 'MEDIUM RISK: Uses subquery with EXISTS'
        WHEN qual ILIKE '%user_id%' AND qual ILIKE '%=%' THEN 'LOW RISK: Simple user_id equality'
        ELSE 'UNKNOWN PATTERN'
    END as risk_level,
    qual as full_policy_expression
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices')
ORDER BY 
    CASE 
        WHEN qual ILIKE '%auth.uid()%' AND qual ILIKE '%user_profiles%' THEN 1
        WHEN qual ILIKE '%EXISTS%' AND qual ILIKE '%SELECT%' THEN 2
        ELSE 3
    END,
    tablename;
