import React from 'react';
import { ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeName: string;
}

interface MultiStoreCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

/**
 * Multi-store shopping cart
 * Supports products from multiple vendors
 */
export const MultiStoreCart: React.FC<MultiStoreCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  // Group items by store
  const itemsByStore = items.reduce((acc, item) => {
    if (!acc[item.storeName]) {
      acc[item.storeName] = [];
    }
    acc[item.storeName].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6" dir="rtl">
      <div className="flex items-center mb-6">
        <ShoppingCartIcon className="h-6 w-6 text-blue-600 ml-2" />
        <h2 className="text-xl font-bold text-gray-900">سلة التسوق</h2>
      </div>

      {Object.entries(itemsByStore).map(([storeName, storeItems]) => (
        <div key={storeName} className="mb-6 border-b border-gray-200 pb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {storeName}
          </h3>
          
          {storeItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2">
              <div className="flex items-center">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded-lg ml-3"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.price} ر.س</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="mr-3 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Cart Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-900">
            الإجمالي: {totalAmount.toFixed(2)} ر.س
          </span>
          <span className="text-sm text-gray-600">
            ({items.length} منتج من {Object.keys(itemsByStore).length} متجر)
          </span>
        </div>
        
        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          إتمام الشراء
        </button>
      </div>
    </div>
  );
};

export default MultiStoreCart;



