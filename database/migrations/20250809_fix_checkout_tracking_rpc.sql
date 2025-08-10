-- Align RPCs with actual schema (orders has items JSON and no customer_id or store_id)
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text AS $$
DECLARE
  ts text := to_char(now(), 'YYYYMMDDHH24MISSMS');
BEGIN
  RETURN 'ORD-' || ts;
END;
$$ LANGUAGE plpgsql;

-- New checkout function: derive store_name via products_with_store view; insert into orders with items JSON
CREATE OR REPLACE FUNCTION public.checkout_guest_with_project_log(payload jsonb)
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
BEGIN
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

  INSERT INTO public.orders (
    order_number, status, payment_status, total_amount, currency, items, shipping_address, delivery_address, store_name
  ) VALUES (
    v_order_number, 'pending', 'pending', v_total, 'SAR', v_items, payload->>'address', payload->>'address', v_store_name
  );

  RETURN jsonb_build_object('order_number', v_order_number);
END;
$$;

REVOKE ALL ON FUNCTION public.checkout_guest_with_project_log(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.checkout_guest_with_project_log(jsonb) TO anon, authenticated;

-- Tracking by order_number (email/phone accepted but not enforced due to schema)
CREATE OR REPLACE FUNCTION public.get_order_tracking(p_order_number text, p_email text, p_phone text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'id', o.id,
    'order_number', o.order_number,
    'status', o.status,
    'created_at', o.created_at,
    'total_amount', o.total_amount,
    'currency', o.currency,
    'shipping_address', o.shipping_address,
    'store_name', o.store_name,
    'items', o.items
  ) INTO result
  FROM public.orders o
  WHERE o.order_number = p_order_number
  LIMIT 1;

  RETURN jsonb_build_object('order', result);
END;
$$;

REVOKE ALL ON FUNCTION public.get_order_tracking(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(text, text, text) TO anon, authenticated;
