import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Get user orders
export async function GET(req: Request) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    let orders = [];

    try {
      // Try to get user orders using the RPC function
      const { data: rpcOrders, error: rpcError } = await supabase.rpc('get_user_orders')
      
      if (!rpcError && rpcOrders) {
        orders = rpcOrders;
      } else {
        console.log('RPC function not available, falling back to direct queries');
        throw new Error('RPC not available');
      }
    } catch (rpcError) {
      console.log('Falling back to direct table queries');
      
      // Fallback: Get user orders directly from tables
      const { data: directOrders, error: directError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          updated_at,
          store_name,
          notes,
          items,
          payment_method,
          delivery_address
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (directError) {
        console.error('Error fetching orders directly:', directError);
        return NextResponse.json({ error: directError.message }, { status: 400 })
      }

      orders = directOrders || [];
    }

    return NextResponse.json({
      success: true,
      orders: orders || []
    })

  } catch (error: any) {
    console.error('User orders API error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch orders' }, { status: 500 })
  }
}
