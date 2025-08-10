"use client"

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Typography, EnhancedCard, Button } from '@/components/ui/enhanced-components';
import { ShoppingCart, Heart, Plus, Minus, X, Store, Package, CreditCard, Truck, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic'

interface CartItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  store: string;
  storeId: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  shippingCost?: number;
  estimatedDelivery?: string;
}

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  store: string;
  storeId: string;
  availability: 'in-stock' | 'limited' | 'out-of-stock';
  addedDate: string;
}

export default function ShoppingPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'CART001',
      productId: 'PROD001',
      name: 'أسمنت أبيض عالي الجودة - 50 كيس',
      image: '/images/cement.jpg',
      price: 15,
      originalPrice: 18,
      quantity: 25,
      store: 'متجر مواد البناء المتقدمة',
      storeId: 'STORE001',
      availability: 'in-stock',
      shippingCost: 50,
      estimatedDelivery: '2024-03-25'
    },
    {
      id: 'CART002',
      productId: 'PROD002',
      name: 'مضخة مياه غاطسة عالية الكفاءة',
      image: '/images/pump.jpg',
      price: 850,
      quantity: 1,
      store: 'معرض الأدوات الصحية',
      storeId: 'STORE002',
      availability: 'limited',
      shippingCost: 25,
      estimatedDelivery: '2024-03-28'
    },
    {
      id: 'CART003',
      productId: 'PROD003',
      name: 'كابلات كهربائية مقاومة للحريق - 100 متر',
      image: '/images/cables.jpg',
      price: 95,
      quantity: 2,
      store: 'متجر الكهربائيات المنزلية',
      storeId: 'STORE003',
      availability: 'in-stock',
      shippingCost: 15,
      estimatedDelivery: '2024-03-26'
    }
  ]);

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 'WISH001',
      productId: 'PROD004',
      name: 'مكيف هواء مركزي 36000 وحدة',
      image: '/images/ac.jpg',
      price: 2400,
      originalPrice: 2800,
      store: 'معرض التكييف المركزي',
      storeId: 'STORE004',
      availability: 'in-stock',
      addedDate: '2024-03-15'
    },
    {
      id: 'WISH002',
      productId: 'PROD005',
      name: 'أرضيات خشبية فاخرة - 20 متر مربع',
      image: '/images/flooring.jpg',
      price: 1200,
      store: 'معرض الأرضيات والسيراميك',
      storeId: 'STORE005',
      availability: 'limited',
      addedDate: '2024-03-10'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'cart' | 'wishlist'>('cart');

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  const moveToCart = (wishlistItem: WishlistItem) => {
    const cartItem: CartItem = {
      id: `CART${Date.now()}`,
      productId: wishlistItem.productId,
      name: wishlistItem.name,
      image: wishlistItem.image,
      price: wishlistItem.price,
      originalPrice: wishlistItem.originalPrice,
      quantity: 1,
      store: wishlistItem.store,
      storeId: wishlistItem.storeId,
      availability: wishlistItem.availability,
      shippingCost: 20,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setCartItems([...cartItems, cartItem]);
    removeFromWishlist(wishlistItem.id);
  };

  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartShipping = cartItems.reduce((sum, item) => sum + (item.shippingCost || 0), 0);
  const cartTotal = cartSubtotal + cartShipping;

  const getAvailabilityText = (availability: string) => {
    switch(availability) {
      case 'in-stock': return 'متوفر';
      case 'limited': return 'كمية محدودة';
      case 'out-of-stock': return 'غير متوفر';
      default: return 'غير معروف';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch(availability) {
      case 'in-stock': return 'text-green-600';
      case 'limited': return 'text-orange-600';
      case 'out-of-stock': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <Typography variant="heading" size="3xl" weight="bold" className="text-gray-900 mb-2 flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          التسوق والمفضلة
        </Typography>
        <Typography variant="body" size="lg" className="text-gray-600">
          إدارة سلة التسوق والمنتجات المفضلة
        </Typography>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab('cart')}
          className={`px-6 py-3 font-medium flex items-center gap-2 ${
            activeTab === 'cart'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          سلة التسوق ({cartItems.length})
        </button>
        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-6 py-3 font-medium flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Heart className="w-5 h-5" />
          المفضلة ({wishlistItems.length})
        </button>
      </div>

      {activeTab === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
                  سلة التسوق فارغة
                </Typography>
                <Typography variant="body" size="lg" className="text-gray-500 mb-4">
                  ابدأ بإضافة المنتجات إلى سلة التسوق
                </Typography>
                <Link href="/stores">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => alert('Button clicked')}>
                    تصفح المتاجر
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <EnhancedCard key={item.id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0">
                        {/* Product image placeholder */}
                        <Package className="w-full h-full text-gray-400 p-4" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900">
                              {item.name}
                            </Typography>
                            <Typography variant="caption" size="sm" className="text-gray-600 flex items-center gap-1">
                              <Store className="w-4 h-4" />
                              {item.store}
                            </Typography>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <Typography variant="caption" size="sm" className={`font-medium ${getAvailabilityColor(item.availability)}`}>
                              {getAvailabilityText(item.availability)}
                            </Typography>
                          </div>

                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              {item.originalPrice && (
                                <Typography variant="caption" size="sm" className="text-gray-500 line-through">
                                  {(item.originalPrice * item.quantity).toLocaleString('en-US')} ر.س
                                </Typography>
                              )}
                              <Typography variant="subheading" size="lg" weight="bold" className="text-blue-600">
                                {(item.price * item.quantity).toLocaleString('en-US')} ر.س
                              </Typography>
                            </div>
                            
                            {item.shippingCost && (
                              <Typography variant="caption" size="sm" className="text-gray-600 flex items-center gap-1">
                                <Truck className="w-4 h-4" />
                                شحن: {item.shippingCost} ر.س
                              </Typography>
                            )}
                            
                            {item.estimatedDelivery && (
                              <Typography variant="caption" size="sm" className="text-gray-600">
                                التسليم: {new Date(item.estimatedDelivery).toLocaleDateString('en-US')}
                              </Typography>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </EnhancedCard>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <EnhancedCard className="p-6 sticky top-8">
                <Typography variant="subheading" size="xl" weight="semibold" className="mb-4">ملخص الطلب</Typography>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <Typography variant="body" size="lg">المجموع الفرعي:</Typography>
                    <Typography variant="body" size="lg" weight="medium">{cartSubtotal.toLocaleString('en-US')} ر.س</Typography>
                  </div>
                  
                  <div className="flex justify-between">
                    <Typography variant="body" size="lg">الشحن:</Typography>
                    <Typography variant="body" size="lg" weight="medium">{cartShipping.toLocaleString('en-US')} ر.س</Typography>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <Typography variant="subheading" size="lg" weight="bold">الإجمالي:</Typography>
                      <Typography variant="subheading" size="lg" weight="bold" className="text-blue-600">{cartTotal.toLocaleString('en-US')} ر.س</Typography>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 flex items-center justify-center gap-2" onClick={() => alert('Button clicked')}>
                  <CreditCard className="w-5 h-5" />
                  إتمام الشراء
                </Button>
                
                <Link href="/stores" className="block mt-3">
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => alert('Button clicked')}>
                    متابعة التسوق
                  </Button>
                </Link>
              </EnhancedCard>
            </div>
          )}
        </div>
      )}

      {activeTab === 'wishlist' && (
        <div>
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Typography variant="subheading" size="xl" weight="semibold" className="text-gray-600 mb-2">
                لا توجد منتجات مفضلة
              </Typography>
              <Typography variant="body" size="lg" className="text-gray-500 mb-4">
                ابدأ بإضافة المنتجات إلى قائمة المفضلة
              </Typography>
              <Link href="/stores">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => alert('Button clicked')}>
                  تصفح المتاجر
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <EnhancedCard key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-4">
                      <Package className="w-full h-full text-gray-400 p-8" />
                    </div>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <Typography variant="subheading" size="lg" weight="semibold" className="text-gray-900 mb-2">
                    {item.name}
                  </Typography>
                  
                  <Typography variant="caption" size="sm" className="text-gray-600 flex items-center gap-1 mb-3">
                    <Store className="w-4 h-4" />
                    {item.store}
                  </Typography>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      {item.originalPrice && (
                        <Typography variant="caption" size="sm" className="text-gray-500 line-through">
                          {item.originalPrice.toLocaleString('en-US')} ر.س
                        </Typography>
                      )}
                      <Typography variant="subheading" size="lg" weight="bold" className="text-blue-600">
                        {item.price.toLocaleString('en-US')} ر.س
                      </Typography>
                    </div>
                    
                    <Typography variant="caption" size="sm" className={`font-medium ${getAvailabilityColor(item.availability)}`}>
                      {getAvailabilityText(item.availability)}
                    </Typography>
                  </div>
                  
                  <Typography variant="caption" size="sm" className="text-gray-500 mb-4">
                    أُضيف في: {new Date(item.addedDate).toLocaleDateString('en-US')}
                  </Typography>
                  
                  <div className="space-y-2">
                    <Button
                      onClick={() => moveToCart(item)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                      disabled={item.availability === 'out-of-stock'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      نقل إلى السلة
                    </Button>
                    
                    <Link href={`/products/${item.productId}`}>
                      <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => alert('Button clicked')}>
                        عرض التفاصيل
                      </Button>
                    </Link>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
