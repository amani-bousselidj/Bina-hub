'use client';

import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth';
import { createClient } from '@supabase/supabase-js';
import type { User as SupabaseUser } from '@supabase/auth-helpers-nextjs';

// Define simplified types for the hook compatible with Supabase
interface User {
  id: string;
  email?: string;
  full_name?: string;
  role?: string;
  email_verified?: boolean;
  created_at?: string;
  user_metadata?: any;
}

interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role?: string;
}

interface SignInData {
  email: string;
  password: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Adjust AuthService initialization
const authService = new AuthService();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data: session, error: fetchError } = await supabase.auth.getSession();
        if (fetchError) throw new Error(fetchError.message);
        const currentUser = session?.session?.user;
        if (currentUser) {
          setUser({
            id: currentUser.id,
            email: currentUser.email,
            user_metadata: currentUser.user_metadata,
            ...currentUser.user_metadata
          } as User);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get current user');
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return { user, loading, error };
}

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (data: SignInData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signIn(data.email, data.password);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signIn, loading, error };
}

export function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.signUp(data.email, data.password, {
        full_name: data.full_name,
        role: data.role
      });
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
}

export function useSignOut() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signOut, loading, error };
}

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(email);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error };
}

export function useUpdatePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.updatePassword(newPassword);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, loading, error };
}


