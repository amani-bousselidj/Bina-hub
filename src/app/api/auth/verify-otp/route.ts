import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(req: Request) {
  try {
    const { phone, token } = await req.json()
    if (!phone || !token) return NextResponse.json({ error: 'phone and token required' }, { status: 400 })

    const client = createClient()
    const { data, error } = await client.auth.verifyOtp({ phone, token, type: 'sms' })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ verified: true, user: data?.user || null })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
