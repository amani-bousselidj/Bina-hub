import { Order, Warranty, Project, Invoice } from '@/core/shared/types/types';

// Note: QuickActions utilities for shared data filters
export class QuickActions {
  // Quick filters for common data queries
  static getRecentOrders(orders: Order[], days: number = 30): Order[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return orders.filter(order => new Date(order.createdAt) >= cutoffDate);
  }
  
  static getActiveWarranties(warranties: Warranty[]): Warranty[] {
    return warranties.filter(warranty => warranty.status === 'active');
  }
  
  static getExpiringWarranties(warranties: Warranty[], months: number = 3): Warranty[] {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() + months);
    
    return warranties.filter(warranty => warranty.status === 'active' && new Date(warranty.expiry_date) <= cutoffDate);
  }
  
  static getActiveProjects(projects: Project[]): Project[] {
    return projects.filter(project => project.status === 'in_progress');
  }
  
  static getOverdueInvoices(invoices: Invoice[]): Invoice[] {
    const today = new Date();
    return invoices.filter(invoice => invoice.status === 'pending' && new Date(invoice.due_date) < today);
  }
  
  static getPendingOrders(orders: Order[]): Order[] {
    return orders.filter(order => 
      order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
    );
  }
  
  // Quick calculations
  static calculateMonthlySpending(orders: Order[]): number {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return orders
      .filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
      })
      .reduce((sum, order) => sum + (order.total_amount || 0), 0);
  }
  
  static calculateProjectBudgetUtilization(projects: Project[]): number {
    // Simplified as projects do not have 'spent' property
    return 0;
  }
}


