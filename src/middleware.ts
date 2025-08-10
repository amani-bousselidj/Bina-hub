import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database';

// Cache for session data to reduce database calls
const sessionCache = new Map<string, { session: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  const url = req.nextUrl;

  // Static route optimizations - skip middleware for static assets
  if (url.pathname.startsWith('/_next') || 
      url.pathname.startsWith('/api/auth') ||
      url.pathname.includes('.')) {
    return res;
  }

  // Always allow access to landing page and public routes
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/clear-auth', '/products/new', '/store/storefront'];
  if (publicRoutes.includes(url.pathname)) {
    return res;
  }

  const supabase = createMiddlewareClient<Database>({ req, res });

  // Get the current session with caching
  let session: any = null;
  const authToken = req.headers.get('authorization') || req.cookies.get('sb-access-token')?.value;
  const cacheKey = authToken || 'anonymous';
  
  // Check cache first
  const cached = sessionCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    session = cached.session;
  } else {
    try {
      const { data, error } = await supabase.auth.getSession();
      session = data?.session;
      
      // Cache the session
      sessionCache.set(cacheKey, {
        session,
        timestamp: Date.now()
      });
      
      if (session) {
        console.log('✅ [Middleware] Found Supabase session for:', session.user.email);
      }
    } catch (error) {
      console.error('❌ [Middleware] Error getting session:', error);
    }
  }

  // Define protected and auth routes
  const isProtectedRoute = (url.pathname.startsWith('/user/') || url.pathname.startsWith('/store/')) && 
                           !url.pathname.startsWith('/store/storefront');
  const isAuthRoute = url.pathname.startsWith('/auth/login') || url.pathname.startsWith('/auth/signup');
  
  // Check if user is authenticated
  const isAuthenticated = !!session;

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  // Handle auth routes - redirect authenticated users to appropriate dashboard
  if (isAuthRoute && isAuthenticated) {
    try {
      // Get user profile to determine correct dashboard
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('user_type')
        .eq('user_id', session.user.id)
        .single();

      // Redirect based on user type
      if (profile?.user_type) {
        switch (profile.user_type) {
          case 'service-provider':
          case 'service_provider':
            return NextResponse.redirect(new URL('/service-provider/dashboard', req.url));
          case 'store':
          case 'store_owner':
            return NextResponse.redirect(new URL('/store/dashboard', req.url));
          case 'admin':
            return NextResponse.redirect(new URL('/admin/dashboard', req.url));
          case 'user':
          case 'customer':
          default:
            return NextResponse.redirect(new URL('/user/dashboard', req.url));
        }
      } else {
        // Fallback to user dashboard if no profile found
        return NextResponse.redirect(new URL('/user/dashboard', req.url));
      }
    } catch (error) {
      console.error('Error getting user profile in middleware:', error);
      // Fallback to user dashboard if there's an error
      return NextResponse.redirect(new URL('/user/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};




