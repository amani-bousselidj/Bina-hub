// Tax regions management
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Tax Regions endpoint' });
}

export async function POST() {
  return NextResponse.json({ message: 'Update Tax Regions' });
}



