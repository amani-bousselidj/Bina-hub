import { User, UserProfile, UserStats } from '../models/User';
import { BaseService } from '../../../services/BaseService';

export class UserService extends BaseService {
  /**
   * Get all users (admin function)
   */
  async getUsers() {
    return await this.getAll<User>('users', 'created_at');
  }

  /**
   * Get user by ID
   */
  async getUser(userId: string) {
    return await this.getById<User>('users', userId);
  }

  /**
   * Create new user
   */
  async createUser(userData: Partial<User>) {
    return await this.create<User>('users', userData);
  }

  /**
   * Update user
   */
  async updateUser(userId: string, updates: Partial<User>): Promise<{ data: User | null; error: any }> {
    return await this.update('users', userId, updates);
  }

  /**
   * Search users by name or email
   */
  async searchUsers(searchTerm: string, limit: number = 10) {
    return await this.search<User>('users', 'full_name', searchTerm, limit);
  }

  /**
   * Get user dashboard statistics
   */
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get user's projects
      const { data: projects } = await this.supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
      const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;

      // Get user's orders
      const { data: orders } = await this.supabase
        .from('orders')
        .select('total')
        .eq('user_id', userId);

      const totalSpent = orders?.reduce((sum: number, order: any) => sum + (order.total || 0), 0) || 0;
      const totalOrders = orders?.length || 0;

      // Get active warranties (assuming a warranties table)
      const { data: warranties } = await this.supabase
        .from('warranties')
        .select('*')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString());

      const activeWarranties = warranties?.length || 0;

      return {
        activeProjects,
        completedProjects,
        totalSpent,
        activeWarranties,
        totalOrders
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        activeProjects: 0,
        completedProjects: 0,
        totalSpent: 0,
        activeWarranties: 0,
        totalOrders: 0
      };
    }
  }

  /**
   * Update user profile information
   */
  async updateProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    // Business logic for profile updates
    // Validation, data transformation, etc.
    return profile as UserProfile;
  }

  /**
   * Get user activity feed
   */
  async getUserActivity(userId: string, limit: number = 10) {
    // Business logic for fetching user activities
    return [];
  }

  /**
   * Calculate user project costs
   */
  async calculateProjectCosts(userId: string, projectId: string) {
    // Complex business logic for cost calculations
    return {
      totalCost: 0,
      breakdown: [],
      recommendations: []
    };
  }
}



