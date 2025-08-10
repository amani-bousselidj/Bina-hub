import { useState, useEffect } from 'react';
import { NextRequest } from 'next/server';
import { createHash, randomBytes } from 'crypto';

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
const CSRF_TOKEN_LENGTH = 32;

export interface CSRFToken {
  token: string;
  timestamp: number;
  signature: string;
}

// Generate CSRF token
export function generateCSRFToken(): string {
  const timestamp = Date.now();
  const randomToken = randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  
  // Create signature
  const signature = createHash('sha256')
    .update(`${randomToken}:${timestamp}:${CSRF_SECRET}`)
    .digest('hex');
  
  // Combine token parts
  const csrfToken = `${randomToken}:${timestamp}:${signature}`;
  
  return Buffer.from(csrfToken).toString('base64');
}

// Validate CSRF token
export function validateCSRFToken(token: string): boolean {
  try {
    // Decode token
    const decodedToken = Buffer.from(token, 'base64').toString('utf8');
    const [randomToken, timestampStr, signature] = decodedToken.split(':');
    
    if (!randomToken || !timestampStr || !signature) {
      return false;
    }
    
    const timestamp = parseInt(timestampStr);
    
    // Check if token is expired (1 hour expiry)
    const tokenAge = Date.now() - timestamp;
    if (tokenAge > 60 * 60 * 1000) {
      return false;
    }
    
    // Verify signature
    const expectedSignature = createHash('sha256')
      .update(`${randomToken}:${timestamp}:${CSRF_SECRET}`)
      .digest('hex');
    
    return signature === expectedSignature;
    
  } catch (error) {
    console.error('CSRF token validation error:', error);
    return false;
  }
}

// Validate CSRF token from request
export async function validateCSRF(request: NextRequest): Promise<boolean> {
  // Skip CSRF validation for GET requests
  if (request.method === 'GET') {
    return true;
  }
  
  // Get CSRF token from header
  const csrfToken = request.headers.get('X-CSRF-Token') || 
                   request.headers.get('x-csrf-token');
  
  if (!csrfToken) {
    // Try to get from form data
    try {
      const formData = await request.clone().formData();
      const formToken = formData.get('_csrf_token') as string;
      if (formToken) {
        return validateCSRFToken(formToken);
      }
    } catch (error) {
      // Not form data, try JSON
      try {
        const json = await request.clone().json();
        if (json._csrf_token) {
          return validateCSRFToken(json._csrf_token);
        }
      } catch (error) {
        // Neither form nor JSON
      }
    }
    
    return false;
  }
  
  return validateCSRFToken(csrfToken);
}

// CSRF middleware for API routes
export function withCSRFProtection(handler: Function) {
  return async function (request: NextRequest, ...args: any[]) {
    // Skip CSRF for GET requests
    if (request.method === 'GET') {
      return handler(request, ...args);
    }
    
    const isValid = await validateCSRF(request);
    
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing CSRF token' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(request, ...args);
  };
}

// React hook for CSRF token
export function useCSRFToken() {
  const [csrfToken, setCSRFToken] = useState<string | null>(null);
  
  useEffect(() => {
    // Get CSRF token from API
    fetch('/api/csrf-token')
      .then(response => response.json())
      .then(data => setCSRFToken(data.token))
      .catch(error => console.error('Failed to fetch CSRF token:', error));
  }, []);
  
  return csrfToken;
}

// API route to generate CSRF token
export async function GET() {
  const token = generateCSRFToken();
  
  return Response.json({ token }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}


