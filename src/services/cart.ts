'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BaseService } from './base-service';

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  store_id: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image?: string;
  store_name: string;
  created_at: string;
  updated_at: string;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  storeGroups: Record<string, {
    store_name: string;
    items: CartItem[];
    subtotal: number;
  }>;
}

export class CartService extends BaseService {

  async getCartItems(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await this.supabase
        .from('simple_cart_items')
        .select(`
          *,
          products:product_id (
            name,
            images,
            price
          ),
          stores:store_id (
            name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(item => ({
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        store_id: item.store_id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.products?.name || 'Unknown Product',
        product_image: item.products?.images?.[0],
        store_name: item.stores?.name || 'Unknown Store',
        created_at: item.created_at,
        updated_at: item.updated_at
      })) || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  }

  async addToCart(item: {
    user_id: string;
    product_id: string;
    store_id: string;
    quantity: number;
    price: number;
  }): Promise<CartItem> {
    try {
      // Check if item already exists in cart
      const { data: existingItem } = await this.supabase
        .from('simple_cart_items')
        .select('*')
        .eq('user_id', item.user_id)
        .eq('product_id', item.product_id)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        return this.updateCartItemQuantity(
          existingItem.id,
          existingItem.quantity + item.quantity
        );
      }

      // Add new item to cart
      const { data, error } = await this.supabase
        .from('simple_cart_items')
        .insert([item])
        .select(`
          *,
          products:product_id (name, images),
          stores:store_id (name)
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        product_id: data.product_id,
        store_id: data.store_id,
        quantity: data.quantity,
        price: data.price,
        product_name: data.products?.name || 'Unknown Product',
        product_image: data.products?.images?.[0],
        store_name: data.stores?.name || 'Unknown Store',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    try {
      if (quantity <= 0) {
        await this.removeFromCart(cartItemId);
        throw new Error('Item removed from cart');
      }

      const { data, error } = await this.supabase
        .from('simple_cart_items')
        .update({ 
          quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartItemId)
        .select(`
          *,
          products:product_id (name, images),
          stores:store_id (name)
        `)
        .single();

      if (error) throw error;

      return {
        id: data.id,
        user_id: data.user_id,
        product_id: data.product_id,
        store_id: data.store_id,
        quantity: data.quantity,
        price: data.price,
        product_name: data.products?.name || 'Unknown Product',
        product_image: data.products?.images?.[0],
        store_name: data.stores?.name || 'Unknown Store',
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      throw error;
    }
  }

  async removeFromCart(cartItemId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('simple_cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart(userId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('simple_cart_items')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  async getCartSummary(userId: string): Promise<CartSummary> {
    try {
      const cartItems = await this.getCartItems(userId);
      
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const storeGroups = cartItems.reduce((groups, item) => {
        if (!groups[item.store_id]) {
          groups[item.store_id] = {
            store_name: item.store_name,
            items: [],
            subtotal: 0
          };
        }
        groups[item.store_id].items.push(item);
        groups[item.store_id].subtotal += item.price * item.quantity;
        return groups;
      }, {} as Record<string, { store_name: string; items: CartItem[]; subtotal: number; }>);

      return {
        items: cartItems,
        totalItems,
        totalAmount,
        storeGroups
      };
    } catch (error) {
      console.error('Error getting cart summary:', error);
      throw error;
    }
  }

  async createOrder(userId: string, shippingAddress: any): Promise<string> {
    try {
      const cartSummary = await this.getCartSummary(userId);
      
      // Create order in database
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: cartSummary.totalAmount,
          shipping_address: shippingAddress,
          status: 'pending',
          order_items: cartSummary.items
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Clear cart after successful order creation
      await this.clearCart(userId);

      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();
export default cartService;


