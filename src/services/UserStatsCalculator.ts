import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Order, Warranty, Project, Invoice, UserStats, UserProfile } from '@/contexts/UserDataContext';

export class UserStatsCalculator {
  private static supabase = createClientComponentClient();

  // Get real user stats from Supabase
  static async getUserStatsFromSupabase(userId: string): Promise<UserStats | null> {
    try {
      // Fetch real data from Supabase
      const { data: orders } = await this.supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId);

      const { data: projects } = await this.supabase
        .from('construction_projects')
        .select('*')
        .eq('user_id', userId);

      const { data: profile } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (orders && projects && profile) {
        return this.calculateUserStats(orders, [], projects, [], profile);
      }
      return null;
    } catch (error) {
      console.error('Error fetching user stats from Supabase:', error);
      return null;
    }
  }
  // Calculate comprehensive user statistics
  static calculateUserStats(
    orders: Order[],
    warranties: Warranty[],
    projects: Project[],
    invoices: Invoice[],
    profile: UserProfile | null
  ): UserStats {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Basic counts
    const activeWarranties = warranties.filter(w => w.status === 'active').length;
    const activeProjects = projects.filter(p => p.status === 'in-progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalOrders = orders.length;
    const totalInvoices = invoices.length;

    // Monthly spending calculation
    const monthlySpent = orders
      .filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + order.total, 0);

    // Balance amount (could be actual balance or total spent)
    const balanceAmount = profile?.totalSpent || 
      orders.reduce((sum, order) => sum + order.total, 0);

    // AI insights count (mock for now, could be calculated from user activity)
    const aiInsights = this.calculateAIInsights(orders, projects, warranties);

    // Community posts (mock for now, would come from social features)
    const communityPosts = 12; // Mock data

    return {
      activeWarranties,
      activeProjects,
      completedProjects,
      totalOrders,
      totalInvoices,
      monthlySpent,
      balanceAmount,
      aiInsights,
      communityPosts,
      loyaltyPoints: profile?.loyaltyPoints || 0,
      currentLevel: profile?.currentLevel || 1,
    };
  }

  // Calculate detailed financial statistics
  static calculateFinancialStats(orders: Order[], invoices: Invoice[], projects: Project[]) {
    const currentDate = new Date();
    
    // Total spending
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Monthly spending by month
    const monthlySpending = this.getMonthlySpending(orders);
    
    // Project spending
    const projectSpending = projects.reduce((sum, project) => sum + project.spent, 0);
    
    // Outstanding invoices
    const outstandingInvoices = invoices
      .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
    
    // Average order value
    const averageOrderValue = orders.length > 0 ? totalSpent / orders.length : 0;
    
    // This year's spending
    const thisYearSpending = orders
      .filter(order => new Date(order.orderDate).getFullYear() === currentDate.getFullYear())
      .reduce((sum, order) => sum + order.total, 0);

    return {
      totalSpent,
      monthlySpending,
      projectSpending,
      outstandingInvoices,
      averageOrderValue,
      thisYearSpending,
    };
  }

  // Calculate project statistics
  static calculateProjectStats(projects: Project[]) {
    const totalBudget = projects.reduce((sum, project) => sum + project.budget, 0);
    const totalSpent = projects.reduce((sum, project) => sum + project.spent, 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    const projectsByStatus = {
      planning: projects.filter(p => p.status === 'planning').length,
      inProgress: projects.filter(p => p.status === 'in-progress').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'on-hold').length,
    };

    const averageProjectBudget = projects.length > 0 ? totalBudget / projects.length : 0;
    const averageProjectSpent = projects.length > 0 ? totalSpent / projects.length : 0;

    return {
      totalBudget,
      totalSpent,
      budgetUtilization,
      projectsByStatus,
      averageProjectBudget,
      averageProjectSpent,
    };
  }

  // Calculate warranty statistics
  static calculateWarrantyStats(warranties: Warranty[]) {
    const totalValue = warranties.reduce((sum, warranty) => sum + warranty.value, 0);
    
    const warrantyByStatus = {
      active: warranties.filter(w => w.status === 'active').length,
      expired: warranties.filter(w => w.status === 'expired').length,
      claimed: warranties.filter(w => w.status === 'claimed').length,
    };

    // Warranties expiring soon (within 3 months)
    const expiringIcon = new Date();
    expiringIcon.setMonth(expiringIcon.getMonth() + 3);
    
    const expiringSoon = warranties.filter(warranty => {
      const expiryDate = new Date(warranty.expiryDate);
      return warranty.status === 'active' && expiryDate <= expiringIcon;
    }).length;

    const averageWarrantyValue = warranties.length > 0 ? totalValue / warranties.length : 0;

    return {
      totalValue,
      warrantyByStatus,
      expiringSoon,
      averageWarrantyValue,
    };
  }

  // Calculate order statistics
  static calculateOrderStats(orders: Order[]) {
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      returned: orders.filter(o => o.status === 'returned').length,
    };

    const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = orders.length > 0 ? totalValue / orders.length : 0;

    // Orders by month (last 12 months)
    const ordersByMonth = this.getOrdersByMonth(orders);

    // Most frequent stores
    const storeFrequency = this.calculateStoreFrequency(orders);

    return {
      ordersByStatus,
      totalValue,
      averageOrderValue,
      ordersByMonth,
      storeFrequency,
    };
  }

  // Calculate loyalty and engagement stats
  static calculateLoyaltyStats(profile: UserProfile | null, orders: Order[], projects: Project[]) {
    if (!profile) {
      return {
        loyaltyPoints: 0,
        currentLevel: 1,
        nextLevelPoints: 1000,
        engagementScore: 0,
      };
    }

    const loyaltyPoints = profile.loyaltyPoints;
    const currentLevel = profile.currentLevel;
    
    // Calculate next level threshold
    const nextLevelPoints = currentLevel * 1000; // Simple formula
    
    // Calculate engagement score based on activity
    const engagementScore = this.calculateEngagementScore(orders, projects, profile);

    return {
      loyaltyPoints,
      currentLevel,
      nextLevelPoints,
      engagementScore,
    };
  }

  // Helper methods
  private static calculateAIInsights(orders: Order[], projects: Project[], warranties: Warranty[]): number {
    // Mock calculation - in real app, this would be based on AI analysis
    let insights = 0;
    
    // Insight for high spending
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    if (totalSpent > 10000) insights++;
    
    // Insight for project management
    const activeProjects = projects.filter(p => p.status === 'in-progress').length;
    if (activeProjects > 2) insights++;
    
    // Insight for warranty management
    const activeWarranties = warranties.filter(w => w.status === 'active').length;
    if (activeWarranties > 5) insights++;
    
    // Additional mock insights
    insights += Math.floor(Math.random() * 3); // Random 0-2 additional insights
    
    return insights;
  }

  private static getMonthlySpending(orders: Order[]): { month: string; amount: number }[] {
    const monthlyData: { [key: string]: number } = {};
    
    orders.forEach(order => {
      const date = new Date(order.orderDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + order.total;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }));
  }

  private static getOrdersByMonth(orders: Order[]): { month: string; count: number }[] {
    const monthlyData: { [key: string]: number } = {};
    
    orders.forEach(order => {
      const date = new Date(order.orderDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }

  private static calculateStoreFrequency(orders: Order[]): { store: string; count: number }[] {
    const storeData: { [key: string]: number } = {};
    
    orders.forEach(order => {
      storeData[order.store] = (storeData[order.store] || 0) + 1;
    });

    return Object.entries(storeData)
      .sort(([, a], [, b]) => b - a)
      .map(([store, count]) => ({ store, count }))
      .slice(0, 5); // Top 5 stores
  }

  private static calculateEngagementScore(orders: Order[], projects: Project[], profile: UserProfile): number {
    let score = 0;
    
    // Points for recent orders (last 30 days)
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate >= thirtyDaysAgo;
    });
    score += recentOrders.length * 10;
    
    // Points for active projects
    const activeProjects = projects.filter(p => p.status === 'in-progress');
    score += activeProjects.length * 20;
    
    // Points for total spending
    score += Math.floor(profile.totalSpent / 100);
    
    // Points for loyalty level
    score += profile.currentLevel * 50;
    
    // Normalize to 0-100 scale
    return Math.min(100, score);
  }
}

export default UserStatsCalculator;


