import { useUserData, useAuth } from '@/contexts';
import { UserStatsCalculator } from '@/services/UserStatsCalculator';

export const useSharedStats = () => {
  const { user } = useAuth();
  
  // Mock data for now - these should be fetched from Supabase
  const orders: any[] = [];
  const invoices: any[] = [];
  const projects: any[] = [];
  const warranties: any[] = [];
  const profile = null; // User profile type mismatch, using null for now
  const stats = { total: 0, active: 0, completed: 0 };
  
  const financialStats = UserStatsCalculator.calculateFinancialStats(orders, invoices, projects);
  const projectStats = UserStatsCalculator.calculateProjectStats(projects);
  const warrantyStats = UserStatsCalculator.calculateWarrantyStats(warranties);
  const orderStats = UserStatsCalculator.calculateOrderStats(orders);
  const loyaltyStats = UserStatsCalculator.calculateLoyaltyStats(profile, orders, projects);
  
  return {
    basicStats: stats,
    financialStats,
    projectStats,
    warrantyStats,
    orderStats,
    loyaltyStats,
  };
};


