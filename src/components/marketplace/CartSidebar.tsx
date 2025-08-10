'use client';

import React from 'react';
import { X, Plus, Minus, ShoppingBag, Truck, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { CartItem } from '@/services';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface StoreGroup {
  store_name: string;
  items: CartItem[];
  subtotal: number;
}

export const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { user } = useAuth();
  const {
    cartItems,
    cartSummary,
    loading,
    error,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount,
    storeGroups,
    isEmpty
  } = useCart();

  if (!isOpen) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(cartItemId);
    } else {
      await updateQuantity(cartItemId, newQuantity);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            {totalItems > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Auth Check */}
        {!user && (
          <div className="p-6 text-center border-b">
            <p className="text-gray-600 mb-4">Please sign in to view your cart</p>
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading cart...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 border-b">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Empty Cart */}
        {user && !loading && isEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Discover amazing products in our marketplace</p>
            <Link href="/marketplace">
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={onClose}>
                Browse Products
              </Button>
            </Link>
          </div>
        )}

        {/* Cart Items */}
        {user && !loading && !isEmpty && (
          <>
            <div className="flex-1 overflow-y-auto">
              {/* Group by Store */}
              {Object.entries(storeGroups).map(([storeId, group]) => (
                <div key={storeId} className="border-b bg-gray-50">
                  <div className="p-4 bg-gray-100">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      {(group as StoreGroup).store_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Subtotal: {formatPrice((group as StoreGroup).subtotal)}
                    </p>
                  </div>
                  
                  {(group as StoreGroup).items.map((item: CartItem) => (
                    <div key={item.id} className="p-4 border-b border-gray-200 last:border-b-0">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.product_name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatPrice(item.price)} each
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 ml-2"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t bg-white p-6 space-y-4">
              {/* Clear Cart Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="w-full text-gray-600 hover:text-gray-700"
              >
                Clear Cart
              </Button>

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(totalAmount)}</span>
              </div>

              {/* Checkout Button */}
              <Link href="/user/cart/checkout">
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  onClick={onClose}
                >
                  <CreditCard className="h-4 w-4" />
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/marketplace">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}


