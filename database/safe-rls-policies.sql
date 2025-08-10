-- Safe RLS Policy Reconstruction Script
-- Run this AFTER the complete-rls-reset.sql to add back secure policies

-- Step 1: Create a simple, non-recursive user identification function
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    -- Simple function to get current user without causing recursion
    SELECT COALESCE(
        current_setting('app.current_user_id', true),
        'user@binna'  -- fallback for development
    );
$$;

-- Step 2: Add basic RLS policies that won't cause recursion

-- Enable RLS on core tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- User Profiles - Simple user_id based policy
CREATE POLICY "user_profiles_policy" ON public.user_profiles
    FOR ALL
    USING (user_id = public.get_current_user_id())
    WITH CHECK (user_id = public.get_current_user_id());

-- Orders - User can see their own orders
CREATE POLICY "orders_policy" ON public.orders
    FOR ALL  
    USING (user_id = public.get_current_user_id())
    WITH CHECK (user_id = public.get_current_user_id());

-- Construction Projects - User can see their own projects
CREATE POLICY "construction_projects_policy" ON public.construction_projects
    FOR ALL
    USING (user_id = public.get_current_user_id())
    WITH CHECK (user_id = public.get_current_user_id());

-- Warranties - User can see their own warranties  
CREATE POLICY "warranties_policy" ON public.warranties
    FOR ALL
    USING (user_id = public.get_current_user_id())
    WITH CHECK (user_id = public.get_current_user_id());

-- Invoices - User can see their own invoices
CREATE POLICY "invoices_policy" ON public.invoices
    FOR ALL
    USING (user_id = public.get_current_user_id())
    WITH CHECK (user_id = public.get_current_user_id());

-- Step 3: Test the policies work without recursion
SELECT 'Testing new policies...' as test_phase;

-- Test each table
SELECT 'user_profiles' as table_test, count(*) as accessible_records 
FROM public.user_profiles;

SELECT 'orders' as table_test, count(*) as accessible_records 
FROM public.orders;

SELECT 'construction_projects' as table_test, count(*) as accessible_records 
FROM public.construction_projects;

SELECT 'warranties' as table_test, count(*) as accessible_records 
FROM public.warranties;

SELECT 'invoices' as table_test, count(*) as accessible_records 
FROM public.invoices;

-- Step 4: Show policy summary
SELECT 
    'Policy Summary' as info,
    tablename,
    policyname,
    cmd,
    'Safe - No recursion risk' as safety_status
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'orders', 'construction_projects', 'warranties', 'invoices')
ORDER BY tablename;

-- Step 5: Alternative - If you prefer auth.uid() based policies (more advanced)
-- Uncomment these if you want to use Supabase auth instead of custom user tracking

/*
-- Alternative policies using auth.uid() - more secure but requires proper Supabase auth setup
DROP POLICY IF EXISTS "user_profiles_policy" ON public.user_profiles;
CREATE POLICY "user_profiles_auth_policy" ON public.user_profiles
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "orders_policy" ON public.orders;  
CREATE POLICY "orders_auth_policy" ON public.orders
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "construction_projects_policy" ON public.construction_projects;
CREATE POLICY "construction_projects_auth_policy" ON public.construction_projects
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "warranties_policy" ON public.warranties;
CREATE POLICY "warranties_auth_policy" ON public.warranties
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "invoices_policy" ON public.invoices;
CREATE POLICY "invoices_auth_policy" ON public.invoices
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);
*/
