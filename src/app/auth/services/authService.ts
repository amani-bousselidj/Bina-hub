import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

export interface UserProfile {
  user_id: string;
  user_type: 'user' | 'service-provider' | 'store' | 'admin';
  display_name?: string;
  phone?: string;
  role?: string;
  account_type?: string;
}

class AuthService {
  private supabase = createClientComponentClient();

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user || undefined };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async signUp(email: string, password: string, userType: string, metadata?: any): Promise<AuthResult> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: userType,
            ...metadata
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, user: data.user || undefined };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase.auth.signOut();
      return { error: error?.message };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getUserProfile(userId: string): Promise<{ profile?: UserProfile; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        return { error: error.message };
      }

      return { profile: data };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async createUserProfile(profile: UserProfile): Promise<{ error?: string }> {
    try {
      const { error } = await this.supabase
        .from('user_profiles')
        .insert(profile);

      return { error: error?.message };
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  getDashboardRoute(userType: string): string {
    switch (userType) {
      case 'service-provider':
        return '/service-provider/dashboard';
      case 'store':
        return '/store/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/user/dashboard';
    }
  }
}

export const authService = new AuthService();
