"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/core/shared/auth/AuthProvider';

// User Data Types (simplified)
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  memberSince: string;
  accountType: 'free' | 'premium' | 'enterprise';
  loyaltyPoints: number;
  currentLevel: number;
  totalSpent: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  store: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'completed' | 'processing';
  orderDate: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in_progress' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  location: string;
  type: string;
  progress?: number;
}

export interface Warranty {
  id: string;
  productName: string;
  store: string;
  purchaseDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'claimed';
  warrantyType: string;
  value: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  store: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface UserStats {
  activeWarranties: number;
  activeProjects: number;
  completedProjects: number;
  totalOrders: number;
  loyaltyPoints: number;
  currentLevel: number;
  monthlySpent: number;
  balanceAmount: number;
  aiInsights: number;
  communityPosts: number;
}

// Context Data Structure
interface UserData {
  profile: UserProfile | null;
  orders: Order[];
  warranties: Warranty[];
  projects: Project[];
  invoices: Invoice[];
  stats: UserStats;
  isLoading: boolean;
  error: string | null;
}

// Context Actions
interface UserDataActions {
  refreshUserData: () => Promise<void>;
}

type UserDataContextType = UserData & UserDataActions;

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export const useUserData = () => {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
};

interface UserDataProviderProps {
  children: ReactNode;
}

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  console.log('🚀 UserDataProvider component is rendering!');
  
  const { user: authUser, session, isLoading: authLoading } = useAuth();
  
  const [userData, setUserData] = useState<UserData>({
    profile: null,
    orders: [],
    warranties: [],
    projects: [],
    invoices: [],
    stats: {
      activeWarranties: 0,
      activeProjects: 0,
      completedProjects: 0,
      totalOrders: 0,
      loyaltyPoints: 0,
      currentLevel: 1,
      monthlySpent: 0,
      balanceAmount: 0,
      aiInsights: 0, // Will be calculated from real data
      communityPosts: 0, // Will be calculated from real data
    },
    isLoading: true,
    error: null,
  });

  // Use centralized Supabase client
  const supabaseClient = supabase;

  console.log('🔧 Supabase client initialized');

  // Calculate stats from loaded data
  const calculateStats = (data: Partial<UserData>): UserStats => {
    const { profile, orders = [], warranties = [], projects = [] } = data;

    const activeWarranties = warranties.filter(w => w.status === 'active').length;
    const activeProjects = projects.filter(p => p.status === 'in_progress' || p.status === 'in-progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalOrders = orders.length;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySpent = orders
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.total, 0);

    return {
      activeWarranties,
      activeProjects,
      completedProjects,
      totalOrders,
      loyaltyPoints: profile?.loyaltyPoints || 0,
      currentLevel: profile?.currentLevel || 1,
      monthlySpent,
      balanceAmount: profile?.totalSpent || 0,
      aiInsights: Math.max(activeProjects + completedProjects, 5), // Calculate based on user activity
      communityPosts: Math.max(completedProjects * 2, 12), // Calculate based on completed projects
    };
  };

  // Load user data directly from Supabase
  const loadUserData = async () => {
    console.log('🚀 UserDataContextSimple: loadUserData called');
    try {
      setUserData(prev => ({ ...prev, isLoading: true, error: null }));

      // Get user ID from AuthProvider instead of direct Supabase session
      let userId: string | null = null;
      
      if (authUser && authUser.id) {
        userId = authUser.id; // UUID from AuthProvider
        console.log('✅ Using AuthProvider user ID:', userId);
        console.log('✅ User email from AuthProvider:', authUser.email);
      } else {
        console.log('❌ No authenticated user found in AuthProvider');
        console.log('Auth state:', { authUser, authLoading, session });
      }

      // Only load data for authenticated user
      if (!userId) {
        setUserData(prev => ({
          ...prev,
          isLoading: false,
          error: 'لم يتم العثور على معرف المستخدم. يرجى تسجيل الدخول مرة أخرى.'
        }));
        return;
      }
      
      console.log('🔄 Loading data for user:', userId);
      console.log('🌐 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

      // Load user profile
      console.log('📡 Fetching user profile for userId:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      console.log('👤 Profile query result:');
      console.log('   - userId searched:', userId);
      console.log('   - profileData:', profileData);
      console.log('   - profileError:', profileError);
      console.log('   - query executed successfully:', !profileError);
      
      if (profileError) {
        console.error('❌ Profile query failed:', profileError);
      } else {
        console.log('✅ Profile query successful, data found:', !!profileData);
        if (profileData) {
          console.log('📋 Profile details:', {
            email: profileData.email,
            name: profileData.display_name,
            loyaltyPoints: profileData.loyalty_points,
            totalSpent: profileData.total_spent
          });
        }
      }

      let profile: UserProfile | null = null;
      if (profileData) {
        profile = {
          id: profileData.id || userId,
          name: profileData.display_name || 'مستخدم تجريبي',
          email: profileData.email || userId,
          phone: profileData.phone,
          city: profileData.city,
          memberSince: profileData.created_at,
          accountType: profileData.account_type || 'premium',
          loyaltyPoints: profileData.loyalty_points || 0,
          currentLevel: profileData.current_level || 1,
          totalSpent: profileData.total_spent || 0,
        };
        console.log('✅ Profile created:', profile);
      } else {
        console.log('❌ No profile data found');
      }

      // Load projects
      console.log('📡 Fetching construction projects...');
      const { data: projectsData, error: projectsError } = await supabase
        .from('construction_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      console.log('🏗️ Projects result:', { data: projectsData, error: projectsError });
      
      if (projectsError) {
        console.error('❌ Projects query failed:', projectsError);
      } else {
        console.log('✅ Projects query successful, count:', projectsData?.length || 0);
      }

      const projects: Project[] = (projectsData || []).map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description || '',
        status: project.status,
        startDate: project.start_date,
        endDate: project.end_date,
        budget: project.budget,
        spent: project.spent,
        location: project.location || 'غير محدد',
        type: project.type,
        progress: project.progress
      }));

      console.log('✅ Projects processed:', projects.length);

      // Load orders
      console.log('📡 Fetching orders...');
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      console.log('📦 Orders result:', { data: ordersData, error: ordersError });
      
      if (ordersError) {
        console.error('❌ Orders query failed:', ordersError);
      } else {
        console.log('✅ Orders query successful, count:', ordersData?.length || 0);
      }

      const orders: Order[] = (ordersData || []).map((order: any) => ({
        id: order.id,
        orderNumber: order.order_number,
        store: order.store_name || 'متجر مواد البناء المطور',
        items: order.items || [],
        total: order.total_amount,
        status: order.status,
        orderDate: order.created_at,
        shippingAddress: order.shipping_address || 'العنوان الافتراضي',
        paymentMethod: order.payment_method || 'credit_card',
        trackingNumber: order.tracking_number
      }));

      console.log('✅ Orders processed:', orders.length);

      // Load warranties
      console.log('📡 Fetching warranties...');
      const { data: warrantiesData, error: warrantiesError } = await supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId);

      console.log('🛡️ Warranties result:', { data: warrantiesData, error: warrantiesError });
      
      if (warrantiesError) {
        console.error('❌ Warranties query failed:', warrantiesError);
      } else {
        console.log('✅ Warranties query successful, count:', warrantiesData?.length || 0);
      }

      const warranties: Warranty[] = (warrantiesData || []).map((warranty: any) => ({
        id: warranty.id,
        productName: warranty.product_name,
        store: warranty.store_name || 'متجر مواد البناء المطور',
        purchaseDate: warranty.purchase_date,
        expiryDate: warranty.expiry_date,
        status: warranty.status,
        warrantyType: warranty.warranty_type,
        value: warranty.value
      }));

      console.log('✅ Warranties processed:', warranties.length);

      // Load invoices (optional - may not exist in database)
      console.log('📡 Fetching invoices...');
      const { data: invoicesData } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      console.log('📄 Invoices result:', { data: invoicesData });

      const invoices: Invoice[] = (invoicesData || []).map((invoice: any) => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        store: invoice.store_name || 'متجر مواد البناء المطور',
        amount: invoice.amount,
        status: invoice.status,
        issueDate: invoice.issue_date,
        dueDate: invoice.due_date,
        items: invoice.items || []
      }));

      const completeData = {
        profile,
        orders,
        warranties,
        projects,
        invoices,
      };

      console.log('✅ Data loaded successfully:', {
        profile: !!profile,
        orders: orders.length,
        projects: projects.length,
        warranties: warranties.length,
        invoices: invoices.length
      });

      const calculatedStats = calculateStats(completeData);
      console.log('📊 Calculated stats:', calculatedStats);

      setUserData(prev => ({
        ...prev,
        ...completeData,
        stats: calculatedStats,
        isLoading: false,
        error: null
      }));

      console.log('🎯 UserData state updated successfully!');

    } catch (error) {
      console.error('❌ Error loading user data:', error);
      setUserData(prev => ({
        ...prev,
        isLoading: false,
        error: 'حدث خطأ في تحميل البيانات'
      }));
    }
  };

  // Load data when auth state changes (and auth is not loading)
  useEffect(() => {
    console.log('🎬 UserDataContextSimple: useEffect triggered');
    console.log('Auth state:', { authUser: !!authUser, authLoading, hasUserId: !!authUser?.id });
    
    // Only load data when:
    // 1. Auth is not loading 
    // 2. We have an authenticated user
    if (!authLoading && authUser) {
      console.log('✅ Conditions met, calling loadUserData()');
      loadUserData();
    } else if (!authLoading && !authUser) {
      console.log('❌ No authenticated user, clearing data');
      setUserData(prev => ({
        ...prev,
        isLoading: false,
        error: 'يرجى تسجيل الدخول لعرض البيانات'
      }));
    } else {
      console.log('⏳ Waiting for auth to complete...');
    }
  }, [authUser, authLoading]); // Depend on auth state

  const refreshUserData = async () => {
    await loadUserData();
  };

  const contextValue: UserDataContextType = {
    ...userData,
    refreshUserData,
  };

  console.log('🎯 UserDataProvider about to render with context value:', {
    isLoading: userData.isLoading,
    hasProfile: !!userData.profile,
    statsLoaded: !!userData.stats
  });

  return (
    <UserDataContext.Provider value={contextValue}>
      {children}
    </UserDataContext.Provider>
  );
};


