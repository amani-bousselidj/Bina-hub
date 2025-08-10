// Supabase Authentication Service
// Handles user authentication with Supabase
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone?: string;
  role: 'user' | 'store_admin' | 'store_owner' | 'store' | 'admin' | 'service_provider';
  account_type: 'free' | 'premium' | 'enterprise';
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
}

class SupabaseAuthService {
  private supabase: any;

  constructor() {
    this.supabase = createClientComponentClient();
  }

  public getSupabase() {
    return this.supabase;
  }

  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: {
    name?: string;
    phone?: string;
    role?: string;
    account_type?: string;
  }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata?.name || '',
            phone: metadata?.phone || '',
            role: metadata?.role || 'user',
            account_type: metadata?.account_type || 'free',
          },
        },
      });

      if (error) throw error;

      // Create user profile in our custom table
      if (data.user) {
        await this.createUserProfile(data.user, metadata);
      }

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        user: null, 
        session: null, 
        error: error instanceof Error ? error.message : 'Failed to sign up' 
      };
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Sign out
  async signOut() {
    await this.supabase.auth.signOut();
  }

  // Get current user
  async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error: error instanceof Error ? error.message : 'Failed to get user' };
    }
  }

  // Get current session
  async getSession(): Promise<{ session: Session | null; error: string | null }> {
    try {
      // Try direct Supabase session first
      try {
        const { data: { session }, error } = await this.supabase.auth.getSession();
        if (error) throw error;
        if (session) return { session, error: null };
      } catch (directError) {
        console.log('Direct session check failed');
      }
      
      return { session: null, error: null };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null, error: error instanceof Error ? error.message : 'Failed to get session' };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    if (this.supabase) {
      return this.supabase.auth.onAuthStateChange(callback);
    }
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  // Create user profile in our custom table
  private async createUserProfile(user: User, metadata?: any) {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .insert({
          id: user.id,
          user_id: user.id,
          email: user.email,
          display_name: metadata?.name || user.email?.split('@')[0] || 'مستخدم جديد',
          city: 'الرياض',
          account_type: metadata?.account_type || 'free',
          loyalty_points: 0,
          current_level: 1,
          total_spent: 0,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error creating user profile:', error);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  // Get user profile data
  async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) return { profile: null, error: error.message };
      return { profile: data };
    } catch (err: any) {
      return { profile: null, error: err.message };
    }
  }

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<any>) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return { profile: data, error: null };
    } catch (error) {
      console.error('Update user profile error:', error);
      return { profile: null, error: error instanceof Error ? error.message : 'Failed to update profile' };
    }
  }

  // Test connection
  async testConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      const { error } = await this.supabase.from('user_profiles').select('id').limit(1);
      if (error) return { connected: false, error: error.message };
      return { connected: true };
    } catch (err: any) {
      return { connected: false, error: err.message };
    }
  }
}

export const supabaseAuth = new SupabaseAuthService();


