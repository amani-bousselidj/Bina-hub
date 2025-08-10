/**
 * POSApp - Modern Touch POS System
 * Modern Touch POS System with Medusa.js Integration
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ProductService, OrderService } from '../../../lib/mock-medusa';
import ReceiptPrinter from './ReceiptPrinter';

interface Product {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  inventory_quantity: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const POSApp = React.memo(() => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any>(null);

  // Fetch products from Medusa.js
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productService = new ProductService();
        const productsData = await productService.list();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const processOrder = async () => {
    try {
      const orderService = new OrderService();
      const orderData = {
        items: cart.map(item => ({
          variant_id: item.product.id,
          quantity: item.quantity
        })),
        region_id: 'reg_01H4XXXX', // Saudi Arabia region
        payment_method: 'card', // or 'cash', 'mada', 'stc_pay'
      };

      await orderService.create(orderData);
      // Prepare receipt data
      const receiptData = {
        items: cart.map(item => ({
          name: item.product.title,
          qty: item.quantity,
          price: item.product.price
        })),
        total: calculateTotal() * 1.15,
        paymentMethod: 'card', // TODO: make dynamic
        cashier: 'Ali', // TODO: make dynamic
        date: new Date().toLocaleString('en-US')
      };
      setLastReceipt(receiptData);
      setShowReceipt(true);
      setCart([]);
      alert('Order processed successfully!');
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Error processing order. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Product Grid */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Point of Sale System</h1>
        
        {/* Category Filter */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 mr-2 rounded ${
              selectedCategory === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-700 border'
            }`}
          >
            All Products
          </button>
          {/* Add more category filters */}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-4 gap-4">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer transition-shadow"
            >
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-32 object-cover rounded mb-3"
              />
              <h3 className="font-medium text-gray-800 mb-2">{product.title}</h3>
              <p className="text-lg font-bold text-blue-600">
                {product.price.toLocaleString('en-US')} SAR
              </p>
              <p className="text-sm text-gray-500">
                Stock: {product.inventory_quantity}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
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
                    <p className="text-sm text-gray-500">
                      {item.product.price.toLocaleString('en-US')} SAR each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>{calculateTotal().toLocaleString('en-US')} SAR</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>VAT (15%):</span>
                <span>{(calculateTotal() * 0.15).toLocaleString('en-US')} SAR</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{(calculateTotal() * 1.15).toLocaleString('en-US')} SAR</span>
              </div>
            </div>

            <button
              onClick={processOrder}
              className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600 transition-colors"
            >
              Process Order
            </button>
            {showReceipt && lastReceipt && (
              <div className="mt-6">
                <ReceiptPrinter receiptData={lastReceipt} />
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => setShowReceipt(false)}
                >
                  Close Receipt
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

POSApp.displayName = 'POSApp';

export default POSApp;



