// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { orderId, reason } = await req.json();
  if (!orderId || !reason) return NextResponse.json({ error: 'يجب تحديد الطلب وسبب الإرجاع' }, { status: 400 });

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });

  // Check order ownership
  const { data: order } = await supabase.from('orders').select('id, user_id, status, is_returnable').eq('id', orderId).single();
  if (!order || order.user_id !== session.user.id) {
    return NextResponse.json({ error: 'لا يمكنك طلب إرجاع لهذا الطلب' }, { status: 403 });
  }
  if (!order.is_returnable || order.status !== 'delivered') {
    return NextResponse.json({ error: 'لا يمكن إرجاع هذا الطلب' }, { status: 400 });
  }

  // Mark as return requested
  await supabase.from('orders').update({ return_requested: true, return_reason: reason, return_status: 'pending' }).eq('id', orderId);
  return NextResponse.json({ success: true });
}





