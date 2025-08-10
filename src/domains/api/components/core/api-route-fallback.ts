// Fallback for API routes that require Medusa backend
import { NextResponse } from 'next/server';

export function createFallbackResponse() {
  return NextResponse.json(
    { 
      error: 'This API endpoint requires a Medusa backend server. Please configure your Medusa backend URL.',
      message: 'API route not available in frontend-only mode'
    },
    { status: 503 }
  );
}

export function isMedusaBackendAvailable(): boolean {
  // Check if we're in build time or if Medusa backend is available
  return typeof window === 'undefined' && 
         process.env.NODE_ENV !== 'production' &&
         process.env.MEDUSA_BACKEND_URL !== undefined;
}



