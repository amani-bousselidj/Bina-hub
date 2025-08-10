import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Get user expenses
export async function GET(req: Request) {
  const supabase = createServerComponentClient({ cookies })
  
  try {
    // Check authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId') || undefined;

  let expenses: any[] = [];

    try {
      // Try to get user expenses using the RPC function
      const { data: rpcExpenses, error: rpcError } = await supabase.rpc('get_user_expenses_simple', projectId ? { project_id: projectId } : {})
      
      if (!rpcError && rpcExpenses) {
        expenses = rpcExpenses;
      } else {
        console.log('RPC function not available, falling back to direct queries');
        throw new Error('RPC not available');
      }
    } catch (rpcError) {
      console.log('Falling back to direct table queries');
      
      // Fallback: Get user orders and invoices directly
      const [ordersResult, invoicesResult] = await Promise.allSettled([
        supabase
          .from('orders')
          .select('id, order_number, total_amount, store_name, created_at, notes, project_id')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('invoices')
          .select('id, amount, store_name, created_at, customer_name, project_id')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
      ]);

      // Process orders
      if (ordersResult.status === 'fulfilled' && (ordersResult.value as any).data) {
        const ordersData = (ordersResult.value as any).data as any[];
        const orderExpenses = ordersData
          .filter((order: any) => !projectId || order.project_id === projectId)
          .map((order: any) => ({
          id: order.id,
          description: order.notes || `Order ${order.order_number || order.id}`,
          amount: order.total_amount || 0,
          store_name: order.store_name || 'Unknown Store',
          date: order.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          created_at: order.created_at,
          type: 'order',
          project_id: order.project_id || null,
        }));
        expenses.push(...orderExpenses);
      }

      // Process invoices
      if (invoicesResult.status === 'fulfilled' && invoicesResult.value.data) {
        const invoiceExpenses = invoicesResult.value.data
          .filter((invoice: any) => !projectId || invoice.project_id === projectId)
          .map((invoice: any) => ({
          id: invoice.id,
          description: invoice.customer_name || 'Invoice Payment',
          amount: invoice.amount || 0,
          store_name: invoice.store_name || 'Unknown Store',
          date: invoice.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          created_at: invoice.created_at,
          type: 'invoice',
          project_id: invoice.project_id || null,
        }));
        expenses.push(...invoiceExpenses);
      }

      // Sort by created_at descending
      expenses.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return NextResponse.json({
      success: true,
      expenses: expenses || [],
      projectId: projectId || null
    })

  } catch (error: any) {
    console.error('User expenses API error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to fetch expenses' }, { status: 500 })
  }
}
