"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { supabaseAuth, AuthState } from '@/core/shared/auth/supabase-auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  testConnection: () => Promise<{ connected: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({ user: null, session: null, isLoading: true, error: null });

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
        setAuthState({ user: { id: session.user.id, email: session.user.email || '', name: profile?.display_name || 'مستخدم', avatar: session.user.user_metadata?.avatar_url, phone: profile?.phone, role: profile?.role, account_type: profile?.account_type }, session, isLoading: false, error: null });
      } else {
        setAuthState({ user: null, session: null, isLoading: false, error: null });
      }
    };
    fetchSession();
    const { data: listener } = supabaseAuth.getSupabase().auth.onAuthStateChange(() => fetchSession());
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const signIn = async (email: string, password: string) => supabaseAuth.signIn(email, password);
  const signUp = async (email: string, password: string, metadata?: any) => {
    const result = await supabaseAuth.signUp(email, password, metadata);
    return result.user ? { success: true } : { success: false, error: result.error || 'Failed to sign up' };
  };
  const signOut = async () => { await supabaseAuth.signOut(); setAuthState({ user: null, session: null, isLoading: false, error: null }); router.push('/auth/login'); };
  const testConnection = async () => supabaseAuth.testConnection();

  return <AuthContext.Provider value={{ ...authState, signIn, signUp, signOut, testConnection }}>{children}</AuthContext.Provider>;
};
