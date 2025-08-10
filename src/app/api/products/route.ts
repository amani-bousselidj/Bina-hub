import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

// Returns marketplace products aligned to the actual schema (public.products)
// Output shape keeps UI stable; store fields are null until a proper relation is defined.
export async function GET(req: NextRequest) {
  try {
    const client = createClient()
    const { searchParams } = new URL(req.url)
  const storeId = searchParams.get('storeId')
    const category = searchParams.get('category')
  const q = searchParams.get('q')
  const warrantyOnly = searchParams.get('warranty') === 'true'
  const freeShipping = searchParams.get('freeShipping') === 'true'
  const city = searchParams.get('city')
  const sortBy = searchParams.get('sortBy') || 'updated_at'
  const sortOrder = (searchParams.get('order') || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc'

    // Try view first (includes optional store context), then fallback to base table
    const inStock = searchParams.get('inStock') === 'true'

    const buildFilters = (qb: any, isView: boolean) => {
      if (storeId) qb = qb.eq('store_id', storeId)
      if (category) qb = qb.eq('category', category)
      if (inStock) qb = qb.gt('quantity_in_stock', 0)
      if (freeShipping && isView) qb = qb.eq('free_shipping', true)
      if (city && isView) qb = qb.eq('store_city', city)
      if (q) {
        const pattern = `%${q}%`
        // columns may vary slightly between view and base
        qb = qb.or(
          `name.ilike.${pattern},name_ar.ilike.${pattern},barcode.ilike.${pattern}`
        )
      }
      return qb
    }

    const applyOrder = (qb: any, isView: boolean) => {
      // Whitelist sortable columns per source
      const baseAllowed = new Set(['price', 'name', 'updated_at', 'quantity_in_stock'])
      const viewAllowed = new Set(['price', 'name', 'updated_at', 'quantity_in_stock', 'store_name', 'store_city'])
      const allowed = isView ? viewAllowed : baseAllowed
      const col = allowed.has(sortBy) ? sortBy : 'updated_at'
      return qb.order(col, { ascending: sortOrder === 'asc' })
    }

  const viewQb = applyOrder(buildFilters(
      client
        .from('products_with_store')
        .select(
          'id,name,name_ar,barcode,price,category,quantity_in_stock,image_url,status,updated_at,store_id,store_name,store_city,free_shipping'
        )
    .limit(100)
  , true), true)
  const { data: viewData, error: viewError } = await viewQb

  let rows = viewData
  if (viewError || !Array.isArray(viewData) || viewData.length === 0) {
    const baseQb = applyOrder(buildFilters(
        client
          .from('products')
          .select('id,name,name_ar,barcode,price,category,quantity_in_stock,image_url,status,updated_at')
      .limit(100)
    , false), false)
      const { data: baseData, error: baseError } = await baseQb
      if (baseError) {
        if (process.env.NODE_ENV !== 'production') {
          const mock = buildDevMock()
          return NextResponse.json({ products: mock, hint: 'dev_mock_fallback' })
        }
        return NextResponse.json({ products: [], hint: 'products_query_error' })
      }
      rows = baseData
    }

  const products = (rows || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: '',
      price: Number(p.price ?? 0),
      category: p.category ?? null,
      stock: typeof p.quantity_in_stock === 'number' ? p.quantity_in_stock : null,
      imageUrl: p.image_url ?? null,
      storeId: p.store_id ?? null,
      storeName: p.store_name ?? null,
      city: p.store_city ?? null,
      lastUpdated: p.updated_at ?? null,
  freeShipping: p.free_shipping ?? null,
    }))

    if ((!products || products.length === 0) && process.env.NODE_ENV !== 'production') {
      const mock = buildDevMock()
      return NextResponse.json({ products: mock, hint: 'dev_mock_fallback' })
    }
    return NextResponse.json({ products })
  } catch (e: any) {
    if (process.env.NODE_ENV !== 'production') {
      const mock = buildDevMock()
      return NextResponse.json({ products: mock, hint: 'dev_mock_error_fallback', error: e?.message || 'unknown' })
    }
    return NextResponse.json({ products: [], error: e?.message || 'unknown' })
  }
}

function buildDevMock() {
  const now = new Date().toISOString()
  return [
    { id: 'm1', name: 'أسمنت 50كجم', description: '', price: 18.5, category: 'مواد البناء', stock: 120, imageUrl: null, storeId: null, storeName: 'متجر الرياض', city: 'الرياض', lastUpdated: now, freeShipping: false },
    { id: 'm2', name: 'حديد تسليح 12مم', description: '', price: 12.0, category: 'حديد', stock: 80, imageUrl: null, storeId: null, storeName: 'متجر جدة', city: 'جدة', lastUpdated: now, freeShipping: true },
    { id: 'm3', name: 'رمل (1م³)', description: '', price: 7.0, category: 'مواد البناء', stock: 60, imageUrl: null, storeId: null, storeName: 'متجر الدمام', city: 'الدمام', lastUpdated: now, freeShipping: false },
    { id: 'm4', name: 'بلوك أسمنتي', description: '', price: 1.5, category: 'بلوك', stock: 300, imageUrl: null, storeId: null, storeName: 'متجر الرياض', city: 'الرياض', lastUpdated: now, freeShipping: true },
    { id: 'm5', name: 'خرسانة جاهزة (م3)', description: '', price: 220, category: 'خرسانة', stock: 20, imageUrl: null, storeId: null, storeName: 'متجر جدة', city: 'جدة', lastUpdated: now, freeShipping: false },
    { id: 'm6', name: 'طابوق', description: '', price: 0.9, category: 'بلوك', stock: 500, imageUrl: null, storeId: null, storeName: 'متجر الدمام', city: 'الدمام', lastUpdated: now, freeShipping: false },
  ]
}
