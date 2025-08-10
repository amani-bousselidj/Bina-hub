import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(req: Request) {
  try {
    const { phone } = await req.json()
    if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 })

    const client = createClient()
    const { data, error } = await client.auth.signInWithOtp({ phone })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ sent: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
