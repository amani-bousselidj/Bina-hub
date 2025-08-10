// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: 'يجب تحديد الطلب' }, { status: 400 });

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });

  // Check order ownership
  const { data: order } = await supabase.from('orders').select('id, user_id, status').eq('id', orderId).single();
  if (!order || order.user_id !== session.user.id) {
    return NextResponse.json({ error: 'لا يمكنك تأكيد هذا الطلب' }, { status: 403 });
  }
  if (order.status !== 'shipped') {
    return NextResponse.json({ error: 'لا يمكن تأكيد هذا الطلب الآن' }, { status: 400 });
  }

  // Mark as delivered
  await supabase.from('orders').update({ status: 'delivered', delivered_at: new Date().toISOString() }).eq('id', orderId);
  return NextResponse.json({ success: true });
}





