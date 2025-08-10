import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(req: NextRequest) {
  const client = createClient()
  const { searchParams } = new URL(req.url)
  const orderNumber = searchParams.get('order_number')
  const email = searchParams.get('email')
  const phone = searchParams.get('phone')

  if (!orderNumber || (!email && !phone)) {
    return NextResponse.json({ error: 'order_number and (email or phone) required' }, { status: 400 })
  }

  const { data, error } = await client.rpc('get_order_tracking', {
    p_order_number: orderNumber,
    p_email: email,
    p_phone: phone,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data || { order: null })
}
