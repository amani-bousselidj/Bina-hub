"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAuth, AuthUser, AuthState } from './supabase-auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  testConnection: () => Promise<{ connected: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchSession = async () => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const { data, error } = await supabaseAuth.getSupabase().auth.getSession();
      if (error) {
        setAuthState({ user: null, session: null, isLoading: false, error: error.message });
        return;
      }
      const session = data.session;
      if (session && session.user) {
        const { profile } = await supabaseAuth.getUserProfile(session.user.id);
        setAuthState({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.display_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'مستخدم',
            avatar: session.user.user_metadata?.avatar_url,
            phone: profile?.phone || session.user.user_metadata?.phone,
            role: profile?.role || session.user.user_metadata?.role || 'user',
            account_type: profile?.account_type || session.user.user_metadata?.account_type || 'free',
          },
          session,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({ user: null, session: null, isLoading: false, error: null });
      }
    };
    fetchSession();
    // Listen for auth state changes
    const { data: listener } = supabaseAuth.getSupabase().auth.onAuthStateChange(() => {
      fetchSession();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    return supabaseAuth.signIn(email, password);
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const result = await supabaseAuth.signUp(email, password, metadata);
    if (result.user) {
      return { success: true, error: undefined };
    } else {
      return { success: false, error: result.error || 'Failed to sign up' };
    }
  };

  const signOut = async () => {
    await supabaseAuth.signOut();
    setAuthState({ user: null, session: null, isLoading: false, error: null });
    router.push('/auth/login');
  };

  const testConnection = async () => {
    return supabaseAuth.testConnection();
  };

  return (
    <AuthContext.Provider value={{ ...authState, signIn, signUp, signOut, testConnection }}>
      {children}
    </AuthContext.Provider>
  );
};


