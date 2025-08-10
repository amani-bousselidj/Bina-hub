// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    console.log('🚪 [API] Logout request received');
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح'
    });

    // Define common cookie clearing options
    const clearCookieOptions = {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    };

    const clearClientCookieOptions = {
      path: '/',
      maxAge: 0,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    };

    // Clear all authentication-related cookies
    const cookiesToClear = [
      // Main session cookies
      { name: 'user-session', options: clearCookieOptions },
      { name: 'auth_session_active', options: clearCookieOptions },
      { name: 'temp_auth_user', options: clearClientCookieOptions },
      
      // User data cookies
      { name: 'user_email', options: clearCookieOptions },
      { name: 'user_name', options: clearCookieOptions },
      { name: 'account_type', options: clearCookieOptions },
      
      // Sync and remember cookies
      { name: 'sync_login_timestamp', options: clearCookieOptions },
      { name: 'remember_user', options: clearCookieOptions },
      { name: 'last_auth_sync', options: clearCookieOptions },
      
      // Supabase session cookies (common patterns)
      { name: 'sb-access-token', options: clearCookieOptions },
      { name: 'sb-refresh-token', options: clearCookieOptions },
      { name: 'supabase-auth-token', options: clearCookieOptions },
      { name: 'supabase.auth.token', options: clearCookieOptions },
    ];

    // Clear each cookie
    cookiesToClear.forEach(({ name, options }) => {
      response.cookies.set(name, '', options);
    });

    // Also try to clear Supabase session if it exists
    try {
      const cookieStore = await cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log('🚪 [API] Supabase logout warning:', error.message);
      }
    } catch (supabaseError) {
      console.log('🚪 [API] Supabase logout skipped (expected in local auth)');
    }

    // Set logout timestamp to prevent immediate redirects
    response.cookies.set('logout_timestamp', new Date().toISOString(), {
      path: '/',
      maxAge: 10, // 10 seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    console.log('✅ [API] Logout successful');
    
    return response;
  } catch (error) {
    console.error('❌ [API] Unexpected logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}





