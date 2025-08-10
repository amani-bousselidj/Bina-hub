import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserProfile, Order, Warranty, Project, Invoice } from '@/contexts/UserDataContext';

export class UserDataSyncService {
  private supabase = createClientComponentClient();

  // Sync data across all user pages
  async syncAllUserData(userId: string) {
    try {
      const [profile, orders, warranties, projects, invoices] = await Promise.all([
        this.syncProfile(userId),
        this.syncOrders(userId),
        this.syncWarranties(userId),
        this.syncProjects(userId),
        this.syncInvoices(userId)
      ]);

      return {
        profile,
        orders,
        warranties,
        projects,
        invoices,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error syncing user data:', error);
      throw error;
    }
  }

  // Profile synchronization
  async syncProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.avatar_url || '',
        city: data.city || '',
        memberSince: data.created_at || new Date().toISOString(),
        accountType: data.account_type || 'free',
        loyaltyPoints: data.loyalty_points || 0,
        currentLevel: data.current_level || 1,
        totalSpent: data.total_spent || 0
      } : null;
    } catch (error) {
      console.error('Error syncing profile:', error);
      return null;
    }
  }

  // Orders synchronization
  async syncOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          id,
          order_number,
          store_name,
          total_amount,
          status,
          order_date,
          expected_delivery,
          actual_delivery,
          shipping_address,
          payment_method,
          tracking_number,
          order_items (
            product_name,
            quantity,
            unit_price
          )
        `)
        .eq('user_id', userId)
        .order('order_date', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        store: order.store_name,
        items: (order.order_items || []).map((item: any) => ({
          name: item.product_name,
          quantity: item.quantity,
          price: item.unit_price
        })),
        total: order.total_amount,
        status: order.status,
        orderDate: order.order_date,
        expectedDelivery: order.expected_delivery,
        actualDelivery: order.actual_delivery,
        shippingAddress: order.shipping_address,
        paymentMethod: order.payment_method,
        trackingNumber: order.tracking_number
      }));
    } catch (error) {
      console.error('Error syncing orders:', error);
      return [];
    }
  }

  // Warranties synchronization
  async syncWarranties(userId: string): Promise<Warranty[]> {
    try {
      const { data, error } = await this.supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId)
        .order('purchase_date', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(warranty => ({
        id: warranty.id,
        productName: warranty.product_name,
        store: warranty.store_name,
        purchaseDate: warranty.purchase_date,
        expiryDate: warranty.expiry_date,
        status: warranty.status,
        claimId: warranty.claim_id,
        warrantyType: warranty.warranty_type,
        value: warranty.product_value || 0
      }));
    } catch (error) {
      console.error('Error syncing warranties:', error);
      return [];
    }
  }

  // Projects synchronization
  async syncProjects(userId: string): Promise<Project[]> {
    try {
      const { data, error } = await this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(project => ({
        id: project.id,
        name: project.name,
        description: project.description || '',
        status: project.status,
        startDate: project.start_date,
        endDate: project.end_date,
        budget: project.budget || 0,
        spent: project.spent || 0,
        location: project.location || '',
        type: project.project_type || ''
      }));
    } catch (error) {
      console.error('Error syncing projects:', error);
      return [];
    }
  }

  // Invoices synchronization
  async syncInvoices(userId: string): Promise<Invoice[]> {
    try {
      const { data, error } = await this.supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          store_name,
          total_amount,
          status,
          issue_date,
          due_date,
          invoice_items (
            description,
            quantity,
            unit_price,
            total_price
          )
        `)
        .eq('user_id', userId)
        .order('issue_date', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(invoice => ({
        id: invoice.id,
        invoiceNumber: invoice.invoice_number,
        store: invoice.store_name,
        amount: invoice.total_amount,
        status: invoice.status,
        issueDate: invoice.issue_date,
        dueDate: invoice.due_date,
        items: (invoice.invoice_items || []).map((item: any) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total_price
        }))
      }));
    } catch (error) {
      console.error('Error syncing invoices:', error);
      return [];
    }
  }

  // Real-time subscription setup
  setupRealTimeSync(userId: string, onDataChange: (data: any) => void) {
    const channels = [
      this.supabase
        .channel('profile_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
          (payload) => onDataChange({ type: 'profile', payload })
        ),
      
      this.supabase
        .channel('orders_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${userId}` },
          (payload) => onDataChange({ type: 'orders', payload })
        ),
      
      this.supabase
        .channel('warranties_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'warranties', filter: `user_id=eq.${userId}` },
          (payload) => onDataChange({ type: 'warranties', payload })
        ),
      
      this.supabase
        .channel('projects_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${userId}` },
          (payload) => onDataChange({ type: 'projects', payload })
        ),
      
      this.supabase
        .channel('invoices_changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'invoices', filter: `user_id=eq.${userId}` },
          (payload) => onDataChange({ type: 'invoices', payload })
        )
    ];

    // Subscribe to all channels
    channels.forEach(channel => channel.subscribe());

    // Return cleanup function
    return () => {
      channels.forEach(channel => {
        this.supabase.removeChannel(channel);
      });
    };
  }

  // Update operations
  async updateOrder(orderId: string, updates: Partial<Order>) {
    const { error } = await this.supabase
      .from('orders')
      .update({
        store_name: updates.store,
        total_amount: updates.total,
        status: updates.status,
        expected_delivery: updates.expectedDelivery,
        actual_delivery: updates.actualDelivery,
        shipping_address: updates.shippingAddress,
        payment_method: updates.paymentMethod,
        tracking_number: updates.trackingNumber
      })
      .eq('id', orderId);

    if (error) {
      throw error;
    }
  }

  async updateWarranty(warrantyId: string, updates: Partial<Warranty>) {
    const { error } = await this.supabase
      .from('warranties')
      .update({
        product_name: updates.productName,
        store_name: updates.store,
        status: updates.status,
        claim_id: updates.claimId,
        warranty_type: updates.warrantyType,
        product_value: updates.value
      })
      .eq('id', warrantyId);

    if (error) {
      throw error;
    }
  }

  async updateProject(projectId: string, updates: Partial<Project>) {
    const { error } = await this.supabase
      .from('projects')
      .update({
        name: updates.name,
        description: updates.description,
        status: updates.status,
        end_date: updates.endDate,
        budget: updates.budget,
        spent: updates.spent,
        location: updates.location,
        project_type: updates.type
      })
      .eq('id', projectId);

    if (error) {
      throw error;
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { error } = await this.supabase
      .from('profiles')
      .update({
        name: updates.name,
        phone: updates.phone,
        city: updates.city,
        account_type: updates.accountType,
        loyalty_points: updates.loyaltyPoints,
        current_level: updates.currentLevel,
        total_spent: updates.totalSpent
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }
  }

  // Cache management
  private cacheKey = 'binna_user_data_cache';
  
  setCachedData(userId: string, data: any) {
    if (typeof window !== 'undefined') {
      const cacheData = {
        userId,
        data,
        timestamp: Date.now(),
        expiry: Date.now() + (30 * 60 * 1000) // 30 minutes
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    }
  }

  getCachedData(userId: string) {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(this.cacheKey);
        if (cached) {
          const cacheData = JSON.parse(cached);
          if (cacheData.userId === userId && cacheData.expiry > Date.now()) {
            return cacheData.data;
          }
        }
      } catch (error) {
        console.error('Error reading cache:', error);
      }
    }
    return null;
  }

  clearCache() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.cacheKey);
    }
  }
}

export const userDataSyncService = new UserDataSyncService();

// Singleton instance export
export default userDataSyncService;
