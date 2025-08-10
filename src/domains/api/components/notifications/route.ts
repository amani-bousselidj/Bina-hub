// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ notifications: [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json({ success: true, notification: body });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true });
}



