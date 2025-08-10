-- Create authenticated checkout function and user expense tracking
-- Date: August 10, 2025

-- First, create user_expenses table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id text NOT NULL,
    order_id uuid,
    amount numeric NOT NULL,
    category text DEFAULT 'purchase',
    description text,
    date timestamp with time zone DEFAULT now(),
    store_name text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create authenticated checkout function
CREATE OR REPLACE FUNCTION public.checkout_authenticated_with_project_log(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_number text := public.generate_order_number();
  v_total numeric := 0;
  v_item jsonb;
  v_qty integer;
  v_price numeric;
  v_product_id uuid;
  v_items jsonb := '[]'::jsonb;
  v_store_name text := NULL;
  v_user_id text;
  v_order_id uuid;
BEGIN
  -- Get the authenticated user
  v_user_id := auth.uid()::text;
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  IF jsonb_typeof(payload->'items') <> 'array' OR jsonb_array_length(payload->'items') = 0 THEN
    RAISE EXCEPTION 'items required';
  END IF;

  -- derive store_name from the first product using the view (best effort)
  SELECT pws.store_name INTO v_store_name
  FROM public.products_with_store pws
  WHERE pws.id = ((payload->'items'->0->>'product_id')::uuid)
  LIMIT 1;

  -- compute totals and build items JSON
  FOR v_item IN SELECT jsonb_array_elements(payload->'items') LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := GREATEST(1, COALESCE((v_item->>'quantity')::int, 1));
    SELECT COALESCE((v_item->>'unit_price')::numeric, price) INTO v_price FROM public.products WHERE id = v_product_id;
    IF v_price IS NULL THEN
      RAISE EXCEPTION 'missing price for product %', v_product_id;
    END IF;
    v_total := v_total + (v_price * v_qty);
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'product_id', v_product_id,
      'quantity', v_qty,
      'unit_price', v_price,
      'total_price', v_price * v_qty
    ));
  END LOOP;

  -- Generate order ID
  v_order_id := gen_random_uuid();

  -- Insert into orders with user_id
  INSERT INTO public.orders (
    id, user_id, order_number, status, payment_status, total_amount, currency, items, 
    shipping_address, delivery_address, store_name
  ) VALUES (
    v_order_id, v_user_id, v_order_number, 'pending', 'pending', v_total, 'SAR', v_items, 
    payload->>'address', payload->>'address', v_store_name
  );

  -- Add to user expenses for tracking
  INSERT INTO public.user_expenses (
    user_id, order_id, amount, category, description, store_name
  ) VALUES (
    v_user_id, v_order_id, v_total, 'marketplace_purchase', 
    'Order: ' || v_order_number || ' from ' || COALESCE(v_store_name, 'Store'), 
    v_store_name
  );

  RETURN jsonb_build_object(
    'order_number', v_order_number,
    'order_id', v_order_id,
    'total_amount', v_total,
    'status', 'pending'
  );
END;
$$;

-- Grant permissions
REVOKE ALL ON FUNCTION public.checkout_authenticated_with_project_log(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.checkout_authenticated_with_project_log(jsonb) TO authenticated;

-- Create function to get user orders
CREATE OR REPLACE FUNCTION public.get_user_orders(p_user_id text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  order_number text,
  store_name text,
  total_amount numeric,
  status text,
  payment_status text,
  created_at timestamp with time zone,
  items jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id text;
BEGIN
  -- Use provided user_id or get from auth
  v_user_id := COALESCE(p_user_id, auth.uid()::text);
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT o.id, o.order_number, o.store_name, o.total_amount, o.status, 
         o.payment_status, o.created_at, o.items
  FROM public.orders o
  WHERE o.user_id = v_user_id
  ORDER BY o.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_orders(text) TO authenticated;

-- Create function to get user expenses
CREATE OR REPLACE FUNCTION public.get_user_expenses(p_user_id text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  amount numeric,
  category text,
  description text,
  date timestamp with time zone,
  store_name text,
  order_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id text;
BEGIN
  -- Use provided user_id or get from auth
  v_user_id := COALESCE(p_user_id, auth.uid()::text);
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  RETURN QUERY
  SELECT e.id, e.amount, e.category, e.description, e.date, e.store_name, e.order_id
  FROM public.user_expenses e
  WHERE e.user_id = v_user_id
  ORDER BY e.date DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_expenses(text) TO authenticated;

-- Create function to get store orders (for store owners)
CREATE OR REPLACE FUNCTION public.get_store_orders(p_store_name text)
RETURNS TABLE (
  id uuid,
  order_number text,
  user_id text,
  total_amount numeric,
  status text,
  payment_status text,
  created_at timestamp with time zone,
  items jsonb,
  shipping_address text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if current user has access to this store
  -- For now, we'll return orders for any authenticated user
  -- In production, you'd want to check store ownership
  
  RETURN QUERY
  SELECT o.id, o.order_number, o.user_id, o.total_amount, o.status, 
         o.payment_status, o.created_at, o.items, o.shipping_address
  FROM public.orders o
  WHERE o.store_name = p_store_name
  ORDER BY o.created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_store_orders(text) TO authenticated;

-- Enable RLS on new table
ALTER TABLE public.user_expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_expenses
CREATE POLICY "Users can view their own expenses" ON public.user_expenses
  FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own expenses" ON public.user_expenses
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Update orders table to include proper RLS if not already set
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'Users can view their own orders'
  ) THEN
    CREATE POLICY "Users can view their own orders" ON public.orders
      FOR SELECT USING (auth.uid()::text = user_id OR user_id IS NULL);
  END IF;
END $$;
