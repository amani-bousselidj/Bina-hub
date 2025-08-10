'use client';

import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  storeId: string;
  storeName: string;
  stock?: number;
}

interface AddToCartProps {
  product: Product;
  variant?: 'default' | 'compact' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function AddToCart({
  product,
  variant = 'default',
  size = 'md',
  className = '',
  onSuccess,
  onError
}: AddToCartProps) {
  const { 
    cart,
    addToCart, 
    updateQuantity
  } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isProductInCart = !!cart.items.find((i: any) => i.id === product.id);
  const currentQuantityInCart = cart.items.find((i: any) => i.id === product.id)?.quantity || 0;
  const cartItem = cart.items.find((item: any) => item.id === product.id);

  const handleAddToCart = async () => {
    console.log('Adding to cart:', product);
    
    if (product.stock !== undefined && quantity > product.stock) {
      onError?.('Quantity exceeds available stock');
      return;
    }

    setIsAdding(true);
    
    try {
      // Add the item to cart with all required fields
      const cartItem = { 
        id: product.id, 
        name: product.name, 
        price: product.price,
        storeId: product.storeId,
        storeName: product.storeName
      };
      console.log('Cart item being added:', cartItem);
      
      addToCart(cartItem as any);
      // Then adjust to desired quantity if > 1
      if (quantity > 1) {
        await updateQuantity(product.id, quantity);
      }
      
      console.log('Item added to cart successfully');
      
      // Show success feedback
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      onSuccess?.();
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      onError?.(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!cartItem) return;
    
    try {
      await updateQuantity(cartItem.id, newQuantity);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update quantity';
      onError?.(errorMessage);
    }
  };

  const handleQuantityChange = (delta: number) => {
    if (isProductInCart) {
      const newQuantity = currentQuantityInCart + delta;
      if (newQuantity >= 0) {
        handleUpdateQuantity(newQuantity);
      }
    } else {
      const newQuantity = Math.max(1, quantity + delta);
      setQuantity(newQuantity);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-1';
      case 'lg': return 'text-base px-6 py-3';
      default: return 'text-sm px-4 py-2';
    }
  };

  if (variant === 'icon') {
    return (
      <Button
        onClick={handleAddToCart}
            disabled={isAdding}
        className={`p-2 ${className}`}
        variant="outline"
      >
        {showSuccess ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {isProductInCart ? (
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleQuantityChange(-1)}
              
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-2 text-sm font-medium min-w-[30px] text-center">
              {currentQuantityInCart}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleQuantityChange(1)}
                disabled={(product.stock !== undefined && currentQuantityInCart >= product.stock)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`${getButtonSize()} bg-blue-600 hover:bg-blue-700`}
          >
            {showSuccess ? (
              <Check className="h-3 w-3 mr-1" />
            ) : (
              <ShoppingCart className="h-3 w-3 mr-1" />
            )}
            {showSuccess ? 'Added!' : 'Add'}
          </Button>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-3 ${className}`}>
      {!isProductInCart && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Quantity:</span>
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-3 text-sm font-medium min-w-[40px] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleQuantityChange(1)}
              disabled={product.stock !== undefined && quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {isProductInCart ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">In Cart:</span>
            <div className="flex items-center gap-1 border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleQuantityChange(-1)}
                
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="px-3 text-sm font-medium min-w-[40px] text-center">
                {currentQuantityInCart}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleQuantityChange(1)}
                disabled={(product.stock !== undefined && currentQuantityInCart >= product.stock)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            // no global loading flag here
            className={`w-full ${getButtonSize()} bg-blue-600 hover:bg-blue-700`}
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add More
              </>
            )}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleAddToCart}
            disabled={isAdding || (product.stock !== undefined && product.stock <= 0)}
          className={`w-full ${getButtonSize()} bg-blue-600 hover:bg-blue-700`}
        >
          {showSuccess ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-400" />
              Added to Cart!
            </>
          ) : isAdding ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding to Cart...
            </>
          ) : product.stock !== undefined && product.stock <= 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      )}

      {product.stock !== undefined && (
        <p className="text-xs text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      )}
    </div>
  );
}



