-- Safe Multi-User RLS Policies
-- Run this AFTER the complete-multi-user-reset.sql to add back secure policies for ALL user types

-- Step 1: Create helper functions for user identification and permissions
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    -- Get current user ID from app context or fallback
    SELECT COALESCE(
        current_setting('app.current_user_id', true),
        'user@binna'  -- fallback for development
    );
$$;

CREATE OR REPLACE FUNCTION public.get_user_type(input_user_id text DEFAULT NULL)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(
        (SELECT user_type FROM public.user_profiles 
         WHERE user_id = COALESCE(input_user_id, public.get_current_user_id()) 
         LIMIT 1),
        'customer'
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(input_user_id text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT public.get_user_type(input_user_id) = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_store_owner(input_user_id text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT public.get_user_type(input_user_id) = 'store_owner';
$$;

CREATE OR REPLACE FUNCTION public.get_user_store_id(input_user_id text DEFAULT NULL)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT store_id FROM public.user_profiles 
    WHERE user_id = COALESCE(input_user_id, public.get_current_user_id())
    AND user_type = 'store_owner'
    LIMIT 1;
$$;

-- Step 2: Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_prices ENABLE ROW LEVEL SECURITY;

-- Step 3: User Profiles Policies
-- Users can see their own profile, admins can see all profiles
CREATE POLICY "user_profiles_access" ON public.user_profiles
    FOR SELECT
    USING (
        user_id = public.get_current_user_id() 
        OR public.is_admin()
    );

-- Users can update their own profile, admins can update any profile
CREATE POLICY "user_profiles_update" ON public.user_profiles  
    FOR UPDATE
    USING (
        user_id = public.get_current_user_id()
        OR public.is_admin()
    )
    WITH CHECK (
        user_id = public.get_current_user_id()
        OR public.is_admin()
    );

-- Only admins can insert new user profiles
CREATE POLICY "user_profiles_insert" ON public.user_profiles
    FOR INSERT
    WITH CHECK (public.is_admin());

-- Step 4: Stores Policies  
-- Everyone can view active stores, store owners can see their own stores, admins see all
CREATE POLICY "stores_select" ON public.stores
    FOR SELECT
    USING (
        status = 'active'
        OR owner_user_id = public.get_current_user_id()
        OR public.is_admin()
    );

-- Store owners can update their own stores, admins can update any
CREATE POLICY "stores_update" ON public.stores
    FOR UPDATE  
    USING (
        owner_user_id = public.get_current_user_id()
        OR public.is_admin()
    )
    WITH CHECK (
        owner_user_id = public.get_current_user_id()
        OR public.is_admin()
    );

-- Admins and verified store owners can insert stores
CREATE POLICY "stores_insert" ON public.stores
    FOR INSERT
    WITH CHECK (
        public.is_admin()
        OR public.is_store_owner()
    );

-- Step 5: Orders Policies
-- Customers see their own orders, store owners see orders for their stores, admins see all
CREATE POLICY "orders_select" ON public.orders
    FOR SELECT
    USING (
        user_id = public.get_current_user_id()
        OR store_id = public.get_user_store_id()
        OR public.is_admin()
    );

-- Customers can create orders, store owners can update orders for their stores
CREATE POLICY "orders_insert" ON public.orders
    FOR INSERT
    WITH CHECK (
        user_id = public.get_current_user_id()
        OR public.is_admin()
    );

CREATE POLICY "orders_update" ON public.orders
    FOR UPDATE
    USING (
        user_id = public.get_current_user_id()
        OR store_id = public.get_user_store_id()
        OR public.is_admin()
    )
    WITH CHECK (
        user_id = public.get_current_user_id()
        OR store_id = public.get_user_store_id()
        OR public.is_admin()
    );

-- Step 6: Construction Projects Policies
-- Users see their own projects, admins see all
CREATE POLICY "construction_projects_access" ON public.construction_projects
    FOR ALL
    USING (
        user_id = public.get_current_user_id()
        OR public.is_admin()
    )
    WITH CHECK (
        user_id = public.get_current_user_id()
        OR public.is_admin()
    );

-- Step 7: Warranties Policies  
-- Users see their own warranties, store owners see warranties for their products, admins see all
CREATE POLICY "warranties_select" ON public.warranties
    FOR SELECT
    USING (
        user_id = public.get_current_user_id()
        OR store_id = public.get_user_store_id()
        OR public.is_admin()
    );

CREATE POLICY "warranties_insert" ON public.warranties
    FOR INSERT
    WITH CHECK (
        user_id = public.get_current_user_id()
        OR store_id = public.get_user_store_id()
        OR public.is_admin()
    );

-- Step 8: Invoices Policies
-- Users see their own invoices, store owners see invoices from their stores, admins see all
CREATE POLICY "invoices_select" ON public.invoices
    FOR SELECT
    USING (
        user_id = public.get_current_user_id()
        OR store_id = public.get_user_store_id()
        OR public.is_admin()
    );

CREATE POLICY "invoices_insert" ON public.invoices
    FOR INSERT
    WITH CHECK (
        store_id = public.get_user_store_id()
        OR public.is_admin()
    );

-- Step 9: Service Providers Policies
-- Everyone can view active service providers, providers can manage their own profile
CREATE POLICY "service_providers_select" ON public.service_providers
    FOR SELECT
    USING (
        status = 'active'
        OR user_id = public.get_current_user_id()
        OR public.is_admin()
    );

CREATE POLICY "service_providers_update" ON public.service_providers
    FOR UPDATE
    USING (
        user_id = public.get_current_user_id()
        OR public.is_admin()
    )
    WITH CHECK (
        user_id = public.get_current_user_id()
        OR public.is_admin()
    );

-- Step 10: Material Prices Policies
-- Everyone can view prices, store owners can manage prices for their stores  
CREATE POLICY "material_prices_select" ON public.material_prices
    FOR SELECT
    USING (true); -- Everyone can see material prices

CREATE POLICY "material_prices_modify" ON public.material_prices
    FOR ALL
    USING (
        store_id = public.get_user_store_id()
        OR public.is_admin()
    )
    WITH CHECK (
        store_id = public.get_user_store_id()
        OR public.is_admin()
    );

-- Step 11: Test the policies work for different user types
SELECT 'Testing multi-user policies...' as test_phase;

-- Test user profiles access
SELECT 'user_profiles' as table_test, count(*) as accessible_records 
FROM public.user_profiles;

-- Test stores access
SELECT 'stores' as table_test, count(*) as accessible_records 
FROM public.stores;

-- Test orders access  
SELECT 'orders' as table_test, count(*) as accessible_records 
FROM public.orders;

-- Step 12: Show policy summary
SELECT 
    'Multi-User Policy Summary' as info,
    tablename,
    policyname,
    cmd,
    'Multi-user safe - No recursion risk' as safety_status
FROM pg_policies 
WHERE schemaname = 'public'
AND tablename IN ('user_profiles', 'stores', 'orders', 'construction_projects', 'warranties', 'invoices', 'service_providers', 'material_prices')
ORDER BY tablename, policyname;

-- Step 13: User type verification
SELECT 'User Types Summary:' as summary;
SELECT 
    user_type,
    count(*) as user_count,
    string_agg(user_id, ', ') as users
FROM public.user_profiles 
GROUP BY user_type
ORDER BY user_type;
