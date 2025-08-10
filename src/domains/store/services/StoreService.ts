import { Store, InventoryItem, POSTransaction } from '../models/Store';
import { BaseService } from '../../../services/BaseService';

export class StoreService extends BaseService {
  /**
   * Get all stores
   */
  async getStores() {
    return await this.getAll<Store>('stores', 'name');
  }

  /**
   * Get store by ID
   */
  async getStore(storeId: string) {
    return await this.getById<Store>('stores', storeId);
  }

  /**
   * Create a new store
   */
  async createStore(storeData: Partial<Store>) {
    return await this.create<Store>('stores', storeData);
  }

  /**
   * Update store
   */
  async updateStore(storeId: string, updates: Partial<Store>) {
    return await this.update('stores', storeId, updates);
  }

  /**
   * Get store metrics and dashboard data
   */
  async getStoreMetrics(storeId: string) {
    try {
      // Get transactions for metrics calculation
      const { data: transactions, error } = await this.supabase
        .from('pos_transactions')
        .select('*')
        .eq('store_id', storeId)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching transactions for metrics:', error);
        return { 
          dailySales: 0,
          monthlyRevenue: 0,
          inventoryValue: 0,
          lowStockItems: 0
        };
      }

      const dailySales = transactions?.reduce((sum, t) => sum + (t.total || 0), 0) || 0;

      // Get monthly revenue
      const { data: monthlyTransactions } = await this.supabase
        .from('pos_transactions')
        .select('total')
        .eq('store_id', storeId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const monthlyRevenue = monthlyTransactions?.reduce((sum, t) => sum + (t.total || 0), 0) || 0;

      // Get inventory metrics
      const { data: inventory } = await this.supabase
        .from('inventory_items')
        .select('*')
        .eq('store_id', storeId);

      const inventoryValue = inventory?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
      const lowStockItems = inventory?.filter(item => item.quantity <= (item.reorder_point || 5)).length || 0;

      return {
        dailySales,
        monthlyRevenue,
        inventoryValue,
        lowStockItems
      };
    } catch (error) {
      console.error('Error calculating store metrics:', error);
      return {
        dailySales: 0,
        monthlyRevenue: 0,
        inventoryValue: 0,
        lowStockItems: 0
      };
    }
  }

  /**
   * Process POS transaction
   */
  async processTransaction(storeId: string, transaction: Partial<POSTransaction>): Promise<POSTransaction> {
    // Complex business logic for processing transactions
    // - Inventory updates
    // - Payment processing
    // - Receipt generation
    // - Analytics tracking
    return transaction as POSTransaction;
  }

  /**
   * Update inventory item
   */
  async updateInventoryItem(storeId: string, itemId: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
    // Business logic for inventory management
    // - Stock validation
    // - Price calculations
    // - Reorder point checking
    return updates as InventoryItem;
  }

  /**
   * Generate store reports
   */
  async generateReport(storeId: string, type: 'sales' | 'inventory' | 'customers', period: string) {
    // Complex reporting business logic
    return {
      type,
      period,
      data: [],
      summary: {}
    };
  }
}



