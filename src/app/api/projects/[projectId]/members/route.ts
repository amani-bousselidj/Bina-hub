import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(_: Request, { params }: { params: { projectId: string } }) {
  const client = createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data, error } = await client.from('project_members').select('*').eq('project_id', params.projectId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ members: data || [] });
}

export async function POST(req: Request, { params }: { params: { projectId: string } }) {
  const client = createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();

  const insert = {
    project_id: params.projectId,
    user_id: body.user_id,
    role: body.role || 'member',
    invited_by: user.id,
  };
  const { data, error } = await client.from('project_members').insert(insert).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ member: data });
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
  const client = createClient();
  const { data: { user } } = await client.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get('id');
  if (!memberId) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await client.from('project_members').delete().eq('id', memberId).eq('project_id', params.projectId);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
