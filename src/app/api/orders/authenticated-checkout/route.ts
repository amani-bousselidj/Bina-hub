import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Authenticated user checkout
export async function POST(req: Request) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

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
      // Add user ID for authenticated checkout
      normalized.user_id = session.user.id
      return normalized
    })()
    
    const { items } = body || {}
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items required' }, { status: 400 })
    }

    // Use authenticated checkout RPC or fallback to guest with user_id
    let data, error;
    
    try {
      // Try the authenticated function first
      const result = await supabase.rpc('checkout_authenticated_with_project_log', { payload: body });
      data = result.data;
      error = result.error;
    } catch (rpcError: any) {
      console.log('Authenticated RPC not found, falling back to guest checkout with user_id');
      // Fallback to guest checkout with user_id if authenticated RPC doesn't exist
      const result = await supabase.rpc('checkout_guest_with_project_log', { payload: body });
      data = result.data;
      error = result.error;
      
      // If successful, manually create expense record
      if (!error && data?.order_number) {
        try {
          const total = Array.isArray(body.items)
            ? body.items.reduce((s: number, it: any) => s + (Number(it.unit_price || it.price || 0) * Number(it.quantity || 1)), 0)
            : 0;
            
          // Insert expense manually since we used guest checkout
          await supabase.from('user_expenses').insert({
            user_id: session.user.id,
            amount: total,
            category: 'marketplace_purchase',
            description: `Order: ${data.order_number} from ${body.store_name || 'Store'}`,
            store_name: body.store_name
          });
        } catch (expenseError) {
          console.warn('Failed to create expense record:', expenseError);
        }
      }
    }

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Create invoice for authenticated user
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

      // Insert into invoices with user association
      await supabase.from('invoices').insert({
        invoice_number: `INV-${Date.now()}`,
        store_name: body.store_name || 'متجر',
        amount: total,
        status: 'pending',
        issue_date: new Date().toISOString(),
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        items: itemsJson,
        user_id: session.user.id, // Associate with user
        customer_name: body.name,
        customer_email: body.email,
        customer_phone: body.phone
      })
    } catch (invoiceError) {
      console.warn('Invoice creation failed:', invoiceError)
    }

    return NextResponse.json({
      success: true,
      order_number: data?.order_number || data?.project_id || `ORD-${Date.now()}`,
      message: 'Order placed successfully'
    })

  } catch (error: any) {
    console.error('Authenticated checkout error:', error)
    return NextResponse.json({ error: error?.message || 'Checkout failed' }, { status: 500 })
  }
}
