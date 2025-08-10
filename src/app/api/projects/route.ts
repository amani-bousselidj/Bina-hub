import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data, error } = await supabase.from('construction_projects').select('*').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ projects: data || [] })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Create a simple supabase client - auth will be handled by RLS
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // For now, use a placeholder user ID - in production this should come from proper auth
    const userId = 'user@binna' // This matches the existing test data
    
    // Hybrid approach: use required fields from migration schema, optional fields from simple schema
    const insert: any = {
      user_id: userId,
      project_name: body.name || body.project_name || null, // Required field from migration schema
      description: body.description ?? null,
      status: body.status ?? 'planning',
      location: body.location ?? null,
      budget: body.estimated_cost ?? body.budget ?? 0,
      type: body.type ?? body.project_type ?? 'residential',
      project_type: body.type ?? body.project_type ?? 'residential', // Also include migration schema field
    }

    // If lat/lng provided, include coordinates in location as JSON
    if (body.latitude && body.longitude) {
      const locationData = {
        address: body.location || '',
        coordinates: {
          lat: parseFloat(body.latitude),
          lng: parseFloat(body.longitude)
        }
      }
      insert.location = JSON.stringify(locationData)
    }

    const { data, error } = await supabase.from('construction_projects').insert(insert).select('*').single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ project: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'unknown' }, { status: 500 })
  }
}
