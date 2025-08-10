-- Phase 5: Security hardening and RPCs for checkout and tracking
-- Create secure, atomic guest checkout and a safe tracking endpoint

-- Ensure required extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Helper: generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text AS $$
DECLARE
  ts text := to_char(now(), 'YYYYMMDDHH24MISSMS');
BEGIN
  RETURN 'ORD-' || ts;
END;
$$ LANGUAGE plpgsql;

-- Atomic guest checkout
-- payload example:
-- {
--   "items": [{"product_id":"uuid","quantity":2,"unit_price":123.45}],
--   "email":"x@y.com","phone":"+966..","name":"Guest",
--   "address":"...","project_id":"uuid-optional"
-- }
CREATE OR REPLACE FUNCTION public.checkout_guest_with_project_log(payload jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_number text := public.generate_order_number();
  v_customer_id uuid;
  v_store_id uuid;
  v_order_id uuid;
  v_subtotal numeric := 0;
  v_tax numeric := 0;
  v_shipping numeric := 0;
  v_total numeric := 0;
  v_item jsonb;
  v_price numeric;
  v_qty integer;
  v_product_id uuid;
  v_product_store uuid;
  v_project_id uuid := (payload->>'project_id')::uuid;
  v_email text := nullif(payload->>'email','');
  v_phone text := nullif(payload->>'phone','');
  v_name text := nullif(payload->>'name','');
BEGIN
  IF jsonb_typeof(payload->'items') <> 'array' OR jsonb_array_length(payload->'items') = 0 THEN
    RAISE EXCEPTION 'items required';
  END IF;

  -- Derive store_id from first product; enforce all items belong to same store
  SELECT p.store_id INTO v_store_id
  FROM products p
  WHERE p.id = ((payload->'items'->0->>'product_id')::uuid);
  IF v_store_id IS NULL THEN
    RAISE EXCEPTION 'invalid product/store';
  END IF;

  -- Validate all items and enforce same store
  FOR v_item IN SELECT jsonb_array_elements(payload->'items') LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := GREATEST(1, COALESCE((v_item->>'quantity')::int, 0));
    IF v_qty <= 0 OR v_product_id IS NULL THEN
      RAISE EXCEPTION 'invalid item';
    END IF;
    SELECT store_id INTO v_product_store FROM products WHERE id = v_product_id;
    IF v_product_store IS NULL OR v_product_store <> v_store_id THEN
      RAISE EXCEPTION 'all items must belong to same store';
    END IF;
  END LOOP;

  -- Ensure or create customer (by phone/email) scoped to store
  IF v_email IS NOT NULL OR v_phone IS NOT NULL THEN
    SELECT id INTO v_customer_id FROM customers
    WHERE store_id = v_store_id AND (
      (v_email IS NOT NULL AND email = v_email) OR
      (v_phone IS NOT NULL AND phone = v_phone)
    )
    LIMIT 1;

    IF v_customer_id IS NULL THEN
      INSERT INTO customers (name, email, phone, address, store_id)
      VALUES (COALESCE(v_name,'Guest'), v_email, v_phone, payload->>'address', v_store_id)
      RETURNING id INTO v_customer_id;
    END IF;
  ELSE
    -- create anonymous customer to satisfy FK
    INSERT INTO customers (name, phone, store_id)
    VALUES (COALESCE(v_name,'Guest'), 'N/A', v_store_id)
    RETURNING id INTO v_customer_id;
  END IF;

  -- Compute totals from products.price unless unit_price explicitly provided
  FOR v_item IN SELECT jsonb_array_elements(payload->'items') LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := GREATEST(1, COALESCE((v_item->>'quantity')::int, 1));
    v_price := COALESCE((v_item->>'unit_price')::numeric, (SELECT price FROM products WHERE id = v_product_id));
    IF v_price IS NULL THEN
      RAISE EXCEPTION 'missing price for product %', v_product_id;
    END IF;
    v_subtotal := v_subtotal + (v_price * v_qty);
  END LOOP;

  v_total := v_subtotal + v_tax + v_shipping;

  -- Create order
  INSERT INTO orders (
    order_number, customer_id, store_id, status, payment_status,
    subtotal, tax_amount, shipping_cost, total_amount, shipping_address
  ) VALUES (
    v_order_number, v_customer_id, v_store_id, 'pending', 'pending',
    v_subtotal, v_tax, v_shipping, v_total, payload->>'address'
  ) RETURNING id INTO v_order_id;

  -- Insert items
  FOR v_item IN SELECT jsonb_array_elements(payload->'items') LOOP
    v_product_id := (v_item->>'product_id')::uuid;
    v_qty := GREATEST(1, COALESCE((v_item->>'quantity')::int, 1));
    v_price := COALESCE((v_item->>'unit_price')::numeric, (SELECT price FROM products WHERE id = v_product_id));
    INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
    VALUES (v_order_id, v_product_id, v_qty, v_price, v_price * v_qty);
  END LOOP;

  -- Optional: log project expense if provided
  IF v_project_id IS NOT NULL AND EXISTS (SELECT 1 FROM projects WHERE id = v_project_id) THEN
    INSERT INTO project_expenses (project_id, amount, description, reference_type, reference_id)
    VALUES (v_project_id, v_total, 'Marketplace purchase', 'order', v_order_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN jsonb_build_object('order_number', v_order_number, 'order_id', v_order_id);
END;
$$;

REVOKE ALL ON FUNCTION public.checkout_guest_with_project_log(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.checkout_guest_with_project_log(jsonb) TO anon, authenticated;

-- Public tracking with explicit proofs (order_number + phone or email)
CREATE OR REPLACE FUNCTION public.get_order_tracking(p_order_number text, p_email text, p_phone text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_customer_id uuid;
  result jsonb;
BEGIN
  IF p_order_number IS NULL OR (p_email IS NULL AND p_phone IS NULL) THEN
    RAISE EXCEPTION 'order_number and (email or phone) required';
  END IF;

  SELECT o.id, o.customer_id INTO v_order_id, v_customer_id
  FROM orders o
  JOIN customers c ON c.id = o.customer_id
  WHERE o.order_number = p_order_number
    AND ((p_email IS NOT NULL AND c.email = p_email) OR (p_phone IS NOT NULL AND c.phone = p_phone))
  LIMIT 1;

  IF v_order_id IS NULL THEN
    RETURN jsonb_build_object('order', NULL);
  END IF;

  SELECT jsonb_build_object(
    'id', o.id,
    'order_number', o.order_number,
    'status', o.status,
    'created_at', o.created_at,
    'subtotal', o.subtotal,
    'tax_amount', o.tax_amount,
    'shipping_cost', o.shipping_cost,
    'total_amount', o.total_amount,
    'customer', jsonb_build_object('name', c.name, 'email', c.email, 'phone', c.phone),
    'items', (
      SELECT jsonb_agg(jsonb_build_object(
        'product_id', oi.product_id,
        'quantity', oi.quantity,
        'unit_price', oi.unit_price,
        'total_price', oi.total_price
      )) FROM order_items oi WHERE oi.order_id = o.id
    )
  )
  INTO result
  FROM orders o
  JOIN customers c ON c.id = o.customer_id
  WHERE o.id = v_order_id;

  RETURN jsonb_build_object('order', result);
END;
$$;

REVOKE ALL ON FUNCTION public.get_order_tracking(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(text, text, text) TO anon, authenticated;
