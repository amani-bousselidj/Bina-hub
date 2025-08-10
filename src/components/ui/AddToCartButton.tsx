// @ts-nocheck
'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
  product: {
    id: string;
    store_id: string;
    name: string;
    description: string | null;
    barcode: string | null;
    price: number;
    stock: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  };
  store_name?: string;
  variant?: 'default' | 'small' | 'large';
  showQuantity?: boolean;
  className?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  store_name,
  variant = 'default',
  showQuantity = true,
  className = '',
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart();

  const currentQuantity = getItemQuantity(product.id);
  const isOutOfStock = product.stock <= 0;
  const isDisabled = disabled || isOutOfStock;

  const handleAddToCart = () => {
    if (isDisabled) return;
    addItem(product, 1, store_name);
  };

  const handleIncrease = () => {
    if (isDisabled || currentQuantity >= product.stock) return;
    if (currentQuantity === 0) {
      addItem(product, 1, store_name);
    } else {
      updateQuantity(product.id, currentQuantity + 1);
    }
  };

  const handleDecrease = () => {
    if (currentQuantity <= 0) return;
    updateQuantity(product.id, currentQuantity - 1);
  };

  // Size variants
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    default: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-5 h-5',
  };

  // If no quantity and showQuantity is true, show add button
  if (currentQuantity === 0 || !showQuantity) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isDisabled}
        className={`
          flex items-center gap-2 rounded-lg font-medium transition-colors
          ${sizeClasses[variant]}
          ${
            isDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }
          ${className}
        `}
        title={isOutOfStock ? 'نفد المخزون' : 'إضافة للسلة'}
      >
        {isOutOfStock ? (
          <>
            <ShoppingCart className={iconSizes[variant]} />
            {variant !== 'small' && 'نفد المخزون'}
          </>
        ) : (
          <>
            <Plus className={iconSizes[variant]} />
            {variant !== 'small' && 'إضافة للسلة'}
          </>
        )}
      </button>
    );
  }

  // Show quantity controls when item is in cart
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={handleDecrease}
        className={`
          flex items-center justify-center rounded-full bg-white border border-gray-300 
          hover:bg-gray-50 transition-colors
          ${variant === 'small' ? 'w-6 h-6' : variant === 'large' ? 'w-10 h-10' : 'w-8 h-8'}
        `}
      >
        <Minus className={iconSizes[variant]} />
      </button>

      <span
        className={`
        min-w-8 text-center font-medium
        ${variant === 'small' ? 'text-xs' : variant === 'large' ? 'text-lg' : 'text-sm'}
      `}
      >
        {currentQuantity}
      </span>

      <button
        onClick={handleIncrease}
        disabled={currentQuantity >= product.stock}
        className={`
          flex items-center justify-center rounded-full border transition-colors
          ${variant === 'small' ? 'w-6 h-6' : variant === 'large' ? 'w-10 h-10' : 'w-8 h-8'}
          ${
            currentQuantity >= product.stock
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        <Plus className={iconSizes[variant]} />
      </button>
    </div>
  );
}




