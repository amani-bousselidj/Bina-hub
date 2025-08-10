// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { code: rawCode } = await req.json();
  if (!rawCode) return NextResponse.json({ error: 'رمز الدعوة مطلوب' }, { status: 400 });

  // Normalize invitation code: remove 'BinnaHub - ' prefix and all spaces
  let code = rawCode.replace(/^BinnaHub\s*-\s*/i, '').replace(/\s+/g, '');

  // Find user or store with this invitation code
  const { data: user } = await supabase.from('users').select('id').eq('invitation_code', code).single();
  const { data: store } = await supabase.from('stores').select('id').eq('invitation_code', code).single();
  if (!user && !store) {
    return NextResponse.json({ error: 'رمز الدعوة غير صحيح' }, { status: 404 });
  }

  // Get current user
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });

  // Prevent self-invitation
  if ((user && user.id === session.user.id) || (store && store.id === session.user.id)) {
    return NextResponse.json({ error: 'لا يمكنك تفعيل رمز الدعوة الخاص بك' }, { status: 400 });
  }

  // Save commission/invitation record (simple version)
  await supabase.from('invitation_commissions').insert({
    invited_user_id: session.user.id,
    inviter_user_id: user?.id || null,
    inviter_store_id: store?.id || null,
    code,
    activated_at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}





