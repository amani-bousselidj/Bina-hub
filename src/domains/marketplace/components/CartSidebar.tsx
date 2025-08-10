'use client';

import React from 'react';
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/core/shared/currency/format';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  if (!isOpen) return null;

  const formatPrice = (price: number) => formatCurrency(price);

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
    } else {
      updateQuantity(cartItemId, newQuantity);
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
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">سلة التسوق</h2>
            {cart.itemCount > 0 && (
              <Badge variant="default" className="text-xs">
                {cart.itemCount} عنصر
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Empty state */}
          {cart.items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">سلة التسوق فارغة</h3>
              <p className="text-gray-600 mb-4">اكتشف منتجات رائعة في المتجر</p>
              <Button onClick={onClose} variant="outline">
                تصفح المنتجات
              </Button>
            </div>
          )}

          {cart.items.length > 0 && (
            <div className="space-y-4">
              {/* Cart Summary */}
              <div className="bg-blue-50 p-3 rounded-lg border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-700">العناصر: {cart.items.length}</span>
                  <span className="font-semibold text-blue-800">
                    المجموع: {formatPrice(cart.total || 0)}
                  </span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-3">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex gap-3 p-3 rounded border">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-blue-600 font-semibold text-sm">
                          {formatPrice(item.price)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          
                          <span className="mx-2 text-sm font-medium min-w-[2ch] text-center">
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
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          المجموع: {formatPrice(item.price * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 text-xs h-6 px-2"
                          onClick={() => removeFromCart(item.id)}
                        >
                          حذف
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer - only show when cart has items */}
        {cart.items.length > 0 && (
          <div className="border-t bg-white p-4 space-y-3">
            {/* Clear Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="w-full text-gray-600 hover:text-gray-700"
            >
              تفريغ السلة
            </Button>

            {/* Total */}
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>الإجمالي:</span>
              <span className="text-blue-600">{formatPrice(cart.total || 0)}</span>
            </div>

            {/* Checkout Button */}
            <Link href={cart.projectId ? `/user/cart/checkout?projectId=${cart.projectId}` : "/user/cart/checkout"}>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={onClose}
              >
                <CreditCard className="h-4 w-4" />
                المتابعة إلى الدفع
              </Button>
            </Link>

            {/* Continue Shopping */}
            <Link href="/marketplace">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={onClose}
              >
                متابعة التسوق
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
