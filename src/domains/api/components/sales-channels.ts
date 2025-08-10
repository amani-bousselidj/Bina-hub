// Sales channels management
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Sales Channels endpoint' });
}

export async function POST() {
  return NextResponse.json({ message: 'Create Sales Channel' });
}



