'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { cartService, CartItem, CartSummary } from '@/services';

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartSummary, setCartSummary] = useState<CartSummary>({
    items: [],
    totalItems: 0,
    totalAmount: 0,
    storeGroups: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);
    
    try {
      const summary = await cartService.getCartSummary(user.id);
      setCartSummary(summary);
      setCartItems(summary.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (
    productId: string,
    storeId: string,
    quantity: number,
    price: number
  ) => {
    if (!user?.id) {
      setError('Please login to add items to cart');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await cartService.addToCart({
        user_id: user.id,
        product_id: productId,
        store_id: storeId,
        quantity,
        price
      });
      
      // Refresh cart after adding item
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart');
      console.error('Error adding to cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchCart]);

  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    if (!user?.id) {
      setError('Please login to update cart');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (quantity <= 0) {
        await cartService.removeFromCart(cartItemId);
      } else {
        await cartService.updateCartItemQuantity(cartItemId, quantity);
      }
      
      // Refresh cart after updating
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart item');
      console.error('Error updating cart item:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchCart]);

  const removeFromCart = useCallback(async (cartItemId: string) => {
    if (!user?.id) {
      setError('Please login to remove items from cart');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await cartService.removeFromCart(cartItemId);
      
      // Refresh cart after removing item
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item from cart');
      console.error('Error removing from cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, fetchCart]);

  const clearCart = useCallback(async () => {
    if (!user?.id) {
      setError('Please login to clear cart');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await cartService.clearCart(user.id);
      
      // Reset local state
      setCartItems([]);
      setCartSummary({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        storeGroups: {}
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
      console.error('Error clearing cart:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createOrder = useCallback(async (shippingAddress: any) => {
    if (!user?.id) {
      setError('Please login to create order');
      return null;
    }

    if (cartSummary.totalItems === 0) {
      setError('Cart is empty');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const orderId = await cartService.createOrder(user.id, shippingAddress);
      
      // Clear local cart state after successful order
      setCartItems([]);
      setCartSummary({
        items: [],
        totalItems: 0,
        totalAmount: 0,
        storeGroups: {}
      });

      return orderId;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      console.error('Error creating order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id, cartSummary.totalItems]);

  const getItemQuantity = useCallback((productId: string) => {
    const item = cartItems.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  const isInCart = useCallback((productId: string) => {
    return cartItems.some(item => item.product_id === productId);
  }, [cartItems]);

  return {
    // State
    cartItems,
    cartSummary,
    loading,
    error,
    
    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    createOrder,
    refreshCart: fetchCart,
    
    // Utilities
    getItemQuantity,
    isInCart,
    
    // Computed values
    totalItems: cartSummary.totalItems,
    totalAmount: cartSummary.totalAmount,
    storeGroups: cartSummary.storeGroups,
    isEmpty: cartSummary.totalItems === 0
  };
};


