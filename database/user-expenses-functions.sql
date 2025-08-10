-- Create function to get user expenses based on their orders
CREATE OR REPLACE FUNCTION get_user_expenses()
RETURNS TABLE (
  id text,
  order_number text,
  description text,
  amount numeric,
  category text,
  project_name text,
  store_name text,
  date text,
  created_at timestamp with time zone,
  order_items jsonb,
  payment_method text,
  tags text[]
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Get user ID from current session
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Return user's order data as expenses
  RETURN QUERY
  SELECT 
    o.id::text as id,
    o.order_number,
    COALESCE(o.notes, 'Purchase from ' || COALESCE(s.name, 'Unknown Store')) as description,
    o.total_amount as amount,
    COALESCE(p.category, 'General') as category,
    pr.title as project_name,
    COALESCE(s.name, 'Unknown Store') as store_name,
    o.created_at::date::text as date,
    o.created_at,
    o.items as order_items,
    COALESCE(o.payment_method, 'Cash on Delivery') as payment_method,
    ARRAY[]::text[] as tags
  FROM orders o
  LEFT JOIN stores s ON o.store_id = s.id
  LEFT JOIN projects pr ON o.project_id = pr.id
  LEFT JOIN products p ON (o.items->0->>'product_id')::uuid = p.id
  WHERE o.user_id = auth.uid()
  ORDER BY o.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_expenses() TO authenticated;

-- Also create a simpler version that works with existing schema
CREATE OR REPLACE FUNCTION get_user_expenses_simple()
RETURNS TABLE (
  id text,
  description text,
  amount numeric,
  store_name text,
  date text,
  created_at timestamp with time zone
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Get user ID from current session
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;

  -- Return simplified user expenses from orders or invoices
  RETURN QUERY
  SELECT 
    COALESCE(o.id::text, i.id::text) as id,
    COALESCE(o.notes, i.notes, 'Purchase') as description,
    COALESCE(o.total_amount, i.amount, 0) as amount,
    COALESCE(o.store_name, i.store_name, 'Unknown Store') as store_name,
    COALESCE(o.created_at::date::text, i.issue_date::text) as date,
    COALESCE(o.created_at, i.created_at) as created_at
  FROM (
    SELECT 
      id, notes, total_amount, store_name, created_at
    FROM orders 
    WHERE user_id = auth.uid()
    
    UNION ALL
    
    SELECT 
      id, customer_name as notes, amount as total_amount, store_name, created_at
    FROM invoices 
    WHERE user_id = auth.uid()
  ) o
  LEFT JOIN invoices i ON false -- Just for type compatibility
  ORDER BY created_at DESC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_user_expenses_simple() TO authenticated;
