import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function POST(req: Request) {
  try {
    const { phone, projectId, orgId } = await req.json()
    if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 })

    const client = createClient()
    const invitation = {
      phone,
      project_id: projectId || null,
      org_id: orgId || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    const { data, error } = await client.from('invitations').insert(invitation).select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // TODO: integrate SMS provider
    return NextResponse.json({ invitation: data, sms: 'queued' })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
