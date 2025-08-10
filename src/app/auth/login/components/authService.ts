import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User, LoginCredentials, AuthResponse, RegisterData } from './types';

const supabase = createClientComponentClient();

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Get user profile data
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }

        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          name: profile?.name || data.user.user_metadata?.name,
          user_type: profile?.user_type || 'user',
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        };

        return { success: true, user };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            user_type: data.user_type || 'user',
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: authData.user.id,
              email: authData.user.email,
              name: data.name,
              user_type: data.user_type || 'user',
            }
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }

        const user: User = {
          id: authData.user.id,
          email: authData.user.email || '',
          name: data.name,
          user_type: data.user_type || 'user',
          created_at: authData.user.created_at,
          updated_at: authData.user.updated_at || authData.user.created_at,
        };

        return { success: true, user };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Get user profile data
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        name: profile?.name || user.user_metadata?.name,
        user_type: profile?.user_type || 'user',
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
};
