// API Keys management
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'API Keys endpoint' });
}

export async function POST() {
  return NextResponse.json({ message: 'Create API Key' });
}



