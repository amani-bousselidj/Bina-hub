-- View to expose product rows with store context (safe, optional mapping)
-- Mapping strategy:
--  - Match public.store_products.sku to public.products.barcode
--  - Match public.stores.user_id to public.store_products.user_id
--  - Expose store_id (stores.id), store_name, and a best-effort city/address text

CREATE OR REPLACE VIEW public.products_with_store AS
SELECT
    p.id,
    p.name,
    p.name_ar,
    p.barcode,
    p.price,
    p.category,
    p.quantity_in_stock,
    p.image_url,
    p.status,
    p.updated_at,
    st.id                           AS store_id,
    COALESCE(st.store_name, st.name) AS store_name,
        st.address                      AS store_city,
        NULL::numeric                   AS free_shipping_threshold,
        NULL::boolean                   AS free_shipping
FROM public.products p
LEFT JOIN public.store_products sp
    ON sp.sku = p.barcode
LEFT JOIN public.stores st
    ON st.user_id = sp.user_id;

-- Optional grants (RLS on base tables still applies)
GRANT SELECT ON public.products_with_store TO anon, authenticated;
