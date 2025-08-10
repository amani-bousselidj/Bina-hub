import { BaseService } from './base-service';

export class StoreService extends BaseService {

  async getStore(storeId: string) {
    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
      .eq('id', storeId)
      .single();

    if (error) throw error;
    return data;
  }

  async getStoreProducts(storeId: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async updateStore(storeId: string, updates: any) {
    const { data, error } = await this.supabase
      .from('stores')
      .update(updates)
      .eq('id', storeId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getStoreOrders(storeId: string) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getStoreAnalytics(storeId: string) {
    const { data, error } = await this.supabase
      .from('store_analytics')
      .select('*')
      .eq('store_id', storeId)
      .single();

    if (error) throw error;
    return data;
  }
}

// Export singleton instance of StoreService
export const storeService = new StoreService();
export default storeService;
