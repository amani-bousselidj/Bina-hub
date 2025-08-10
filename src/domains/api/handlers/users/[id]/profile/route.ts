// API route to get user profile via server-side proxy
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required',
      }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({
        success: false,
        error: 'Supabase configuration missing',
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('🔍 [Proxy] Getting user profile for:', userId);

    // Get user profile
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.log('❌ [Proxy] Profile query error:', error);
      // Don't throw error if profile doesn't exist, just return null
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({
          success: true,
          profile: null,
          message: 'Profile not found',
        });
      }
      throw error;
    }

    console.log('✅ [Proxy] Profile retrieved successfully');

    return NextResponse.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error('❌ [Proxy] Get profile error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get profile',
    }, { status: 500 });
  }
}

