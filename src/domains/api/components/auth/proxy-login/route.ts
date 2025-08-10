// Proxy API route for Supabase auth to avoid CORS issues
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Attempt login
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (authError) {
      return NextResponse.json({
        success: false,
        error: authError.message,
        code: authError.status,
      });
    }
    
    if (!authData.user) {
      return NextResponse.json({
        success: false,
        error: 'No user data returned',
      });
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .limit(1)
      .single();
    
    // Clean up - sign out from server session
    await supabase.auth.signOut();
    
    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        emailConfirmed: !!authData.user.email_confirmed_at,
      },
      profile: profile ? {
        displayName: profile.display_name,
        loyaltyPoints: profile.loyalty_points,
      } : null,
      profileError: profileError?.message,
    });
    
  } catch (error) {
    console.error('Proxy auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}



