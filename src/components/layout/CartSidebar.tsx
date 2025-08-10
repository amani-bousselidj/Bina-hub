import React from 'react';

interface CartItem {
  product: { id: string; title: string; price: number };
  quantity: number;
}

export default function CartSidebar({ cart, onUpdate, onRemove, onCheckout }: {
  cart: CartItem[];
  onUpdate: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return (
    <div className="w-96 bg-white shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Current Order</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No items in cart</p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between py-2 border-b">
                <div className="flex-1">
                  <h4 className="font-medium">{item.product.title}</h4>
                  <p className="text-sm text-gray-500">{item.product.price.toLocaleString('en-US')} SAR each</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => onUpdate(item.product.id, item.quantity - 1)} className="px-2 py-1 bg-gray-200 rounded">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdate(item.product.id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
                  <button onClick={() => onRemove(item.product.id)} className="ml-2 text-red-600">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Total:</span>
              <span>{total.toLocaleString('en-US')} SAR</span>
            </div>
          </div>
          <button onClick={onCheckout} className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-colors">Checkout</button>
        </>
      )}
    </div>
  );
}


