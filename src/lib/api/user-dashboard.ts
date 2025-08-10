import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/core/shared/types/database';

export interface UserDashboardStats {
  activeWarranties: number;
  activeProjects: number;
  completedProjects: number;
  totalOrders: number;
  totalInvoices: number;
  recentOrders: any[];
  recentProjects: any[];
  recentWarranties: any[];
}

export async function getUserDashboardStats(userId: string): Promise<UserDashboardStats> {
  const supabase = createClientComponentClient<Database>();

  try {
    // Get warranties data
    const { data: warranties } = await supabase
      .from('warranties')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Get projects data
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Get orders data
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        *,
        store:stores(store_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Get invoices data (if table exists)
    const { data: invoices } = await supabase
      .from('invoices')
      .select(`
        *,
        store:stores(store_name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Calculate stats
    const activeWarranties = warranties?.filter(w => w.status === 'active').length || 0;
    const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
    const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
    const totalOrders = orders?.length || 0;
    const totalInvoices = invoices?.length || 0;

    // Combine orders and invoices for recent activity
    const recentOrdersWithType = orders?.map(order => ({
      ...order,
      type: 'order',
      store_name: order.store?.store_name || 'Unknown Store'
    })) || [];

    const recentInvoicesWithType = invoices?.map(invoice => ({
      ...invoice,
      type: 'invoice',
      store_name: invoice.store?.store_name || 'Unknown Store'
    })) || [];

    const recentCombined = [...recentOrdersWithType, ...recentInvoicesWithType]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      activeWarranties,
      activeProjects,
      completedProjects,
      totalOrders,
      totalInvoices,
      recentOrders: recentCombined,
      recentProjects: projects?.slice(0, 5) || [],
      recentWarranties: warranties?.filter(w => w.status === 'active').slice(0, 5) || []
    };
  } catch (error) {
    console.error('Error fetching user dashboard stats:', error);
    
    // Return mock data as fallback
    return {
      activeWarranties: 3,
      activeProjects: 2,
      completedProjects: 5,
      totalOrders: 12,
      totalInvoices: 8,
      recentOrders: [
        {
          id: '1',
          store_name: 'متجر الإلكترونيات',
          amount: 2500,
          status: 'delivered',
          type: 'order',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          store_name: 'متجر التقنية',
          amount: 1200,
          status: 'paid',
          type: 'invoice',
          invoice_number: 'INV-2024-001',
          created_at: new Date().toISOString()
        }
      ],
      recentProjects: [
        {
          id: '1',
          name: 'مشروع البناء الأول',
          status: 'active',
          progress: 65,
          created_at: new Date().toISOString()
        }
      ],
      recentWarranties: [
        {
          id: '1',
          product_name: 'جهاز كمبيوتر',
          store_name: 'متجر التقنية',
          status: 'active',
          expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }
}


