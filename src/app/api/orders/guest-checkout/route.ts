import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

// Guest checkout via secure RPC (atomic)
export async function POST(req: Request) {
  const client = createClient()
  try {
    const raw = await req.json()
    // Normalize payload to RPC shape
    const body = (() => {
      const normalized: any = { ...raw }
      if (raw?.customer) {
        normalized.name = raw.customer.name ?? raw.name
        normalized.email = raw.customer.email ?? raw.email
        normalized.phone = raw.customer.phone ?? raw.phone
      }
      if (Array.isArray(raw?.items)) {
        normalized.items = raw.items.map((it: any) => ({
          product_id: it.product_id ?? it.id ?? it.productId,
          quantity: it.quantity ?? 1,
          unit_price: it.unit_price ?? it.price ?? it.unitPrice,
        }))
      }
      return normalized
    })()
    const { items } = body || {}
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items required' }, { status: 400 })
    }

    const { data, error } = await client.rpc('checkout_guest_with_project_log', { payload: body })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Demo-only: create a minimal invoice if table/permissions allow
    try {
      const total = Array.isArray(body.items)
        ? body.items.reduce((s: number, it: any) => s + (Number(it.unit_price || it.price || 0) * Number(it.quantity || 1)), 0)
        : 0
      const itemsJson = Array.isArray(body.items) ? body.items.map((it: any) => ({
        description: it.name || it.product_id || 'Item',
        quantity: it.quantity || 1,
        unitPrice: it.unit_price || it.price || 0,
        total: (Number(it.unit_price || it.price || 0) * Number(it.quantity || 1))
      })) : []
      // Best-effort insert into public.invoices if exists and RLS permits anon insert for demo
      // Fields used are aligned with existing seed scripts (invoice_number, store_name, amount, status, issue_date, due_date, items)
      await (client as any).from('invoices').insert({
        invoice_number: `INV-${Date.now()}`,
        store_name: body.store_name || 'متجر',
        amount: total,
        status: 'paid',
        issue_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 7*24*3600*1000).toISOString(),
        items: itemsJson,
      })
    } catch (_) {
      // ignore demo invoice failure (likely RLS)
    }

    return NextResponse.json({ ok: true, order_number: data?.order_number })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
