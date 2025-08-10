'use client';

import React from 'react';
import { useMarketplace } from './MarketplaceProvider';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';

export const ShoppingCart: React.FC = () => {
  const { 
    selectedProducts, 
    removeProductFromSelection, 
    updateProductQuantity,
    getTotalAmount,
    getProductCount,
    clearSelection 
  } = useMarketplace();

  const [isOpen, setIsOpen] = React.useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(price);
  };

  if (getProductCount() === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="relative"
        disabled
      >
        <ShoppingCartIcon className="h-5 w-5 ml-2" />
        السلة فارغة
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <ShoppingCartIcon className="h-5 w-5 ml-2" />
        السلة ({getProductCount()})
        {getProductCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {getProductCount()}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">المنتجات المختارة</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between border-b pb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.storeName}</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateProductQuantity(product.id, product.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{product.quantity}</span>
                    <button
                      onClick={() => updateProductQuantity(product.id, product.quantity + 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeProductFromSelection(product.id)}
                      className="text-red-500 hover:text-red-700 mr-2"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">المجموع:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(getTotalAmount())}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelection}
                  className="flex-1"
                >
                  مسح الكل
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    // TODO: Implement order confirmation
                    console.log('Proceeding to order confirmation...');
                  }}
                >
                  تأكيد الطلب
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;



