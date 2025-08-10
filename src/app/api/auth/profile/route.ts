import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET() {
  const client = createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return NextResponse.json({ user: null, profile: null })
  const { data, error } = await client.from('user_profiles').select('*').eq('user_id', user.id).single()
  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ user, profile: data || null })
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const { data, error } = await client
      .from('user_profiles')
      .upsert({ user_id: user.id, ...body })
      .select('*')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ profile: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
