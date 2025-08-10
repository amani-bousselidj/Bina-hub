import { BaseService } from './base-service';

export class OrderService extends BaseService {

  async createOrder(orderData: any) {
    return this.insert('orders', orderData);
  }

  async getOrder(orderId: string) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          ),
          stores (*)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      this.handleError(error, 'Failed to fetch order');
      return { data: null, error };
    }
  }

  async getUserOrders(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          ),
          stores (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      this.handleError(error, 'Failed to fetch user orders');
      return { data: null, error };
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.update('orders', orderId, { status });
  }

  async getOrdersByProject(projectId: string) {
    try {
      const { data, error } = await this.supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      this.handleError(error, 'Failed to fetch project orders');
      return { data: null, error };
    }
  }

  async cancelOrder(orderId: string) {
    return this.update('orders', orderId, { status: 'cancelled' });
  }
}

export const orderService = new OrderService();
export default orderService;


