import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Get store orders (for store owners)
export async function GET(req: Request) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const storeName = searchParams.get('store_name') || 'binaa Store'

    // Get store orders using the RPC function
    const { data: orders, error } = await supabase.rpc('get_store_orders', {
      p_store_name: storeName
    })

    if (error) {
      console.error('Error fetching store orders:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      orders: orders || [],
      store_name: storeName
    })

  } catch (error: any) {
    console.error('Store orders API error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch store orders' }, { status: 500 })
  }
}
