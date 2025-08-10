// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/core/shared/utils';
import { formatNumber, formatCurrency, formatDate, formatPercentage } from '@/core/shared/utils/formatting';
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  Filter,
  Store,
  Package,
  Star,
  MapPin,
  Phone,
  Clock,
  Check,
  X
} from 'lucide-react';

interface ProjectOrderComponentProps {
  projectId: string;
  projectName: string;
  onOrderCreated?: (orderId: string) => void;
  onCancel?: () => void;
}

interface Store {
  id: string;
  store_name: string;
  description: string;
  rating: number;
  total_reviews: number;
  city: string;
  phone: string;
  logo_url: string;
  is_verified: boolean;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  unit: string;
  stock_quantity: number;
  images: string[];
  store_id: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  store_name: string;
}

interface ProductWithStore extends Product {
  store_name: string;
  store_rating: number;
  store_verified: boolean;
}

export default function ProjectOrderComponent({
  projectId,
  projectName,
  onOrderCreated,
  onCancel
}: ProjectOrderComponentProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<ProductWithStore[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCart, setShowCart] = useState(false);

  const supabase = createClientComponentClient();
  
  // Get categories from Supabase instead of hardcoded
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from('product_categories')
          .select('id, name, name_ar')
          .order('name');
        
        if (error) throw error;
        
        const allCategories = [
          { id: 'all', name: 'جميع الفئات', name_ar: 'جميع الفئات' },
          ...(data || [])
        ];
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to basic categories if Supabase fails
        setCategories([
          { id: 'all', name: 'جميع الفئات', name_ar: 'جميع الفئات' },
          { id: 'concrete', name: 'خرسانة', name_ar: 'خرسانة' },
          { id: 'steel', name: 'حديد', name_ar: 'حديد' },
          { id: 'electrical', name: 'كهرباء', name_ar: 'كهرباء' },
          { id: 'plumbing', name: 'سباكة', name_ar: 'سباكة' },
          { id: 'tiles', name: 'بلاط', name_ar: 'بلاط' },
          { id: 'paint', name: 'دهانات', name_ar: 'دهانات' },
          { id: 'wood', name: 'خشب', name_ar: 'خشب' },
          { id: 'tools', name: 'أدوات', name_ar: 'أدوات' },
          { id: 'other', name: 'أخرى', name_ar: 'أخرى' }
        ]);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    
    loadCategories();
  }, []);

  useEffect(() => {
    loadStoresAndProducts();
  }, []);

  const loadStoresAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load stores
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('id, store_name, description, rating, total_reviews, city, phone, logo_url, is_verified')
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (storesError) throw storesError;

      // Load products with store information
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          id, name, description, price, original_price, unit, 
          stock_quantity, images, store_id, category,
          stores!products_store_id_fkey (store_name, rating, is_verified)
        `)
        .eq('is_active', true)
        .gt('stock_quantity', 0)
        .order('name');

      if (productsError) throw productsError;

      setStores(storesData || []);
      
      // Transform products to include store information
      const productsWithStore = productsData?.map(product => ({
        ...product,
        store_name: (product.stores as any)?.store_name || 'متجر غير معروف',
        store_rating: (product.stores as any)?.rating || 0,
        store_verified: (product.stores as any)?.is_verified || false
      })) || [];

      setProducts(productsWithStore);

    } catch (error) {
      console.error('Error loading stores and products:', error);
      setError('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStore = selectedStore === 'all' || product.store_id === selectedStore;

    return matchesSearch && matchesCategory && matchesStore;
  });

  const addToCart = (product: ProductWithStore, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock_quantity) }
            : item
        );
      } else {
        return [...prevCart, {
          product,
          quantity: Math.min(quantity, product.stock_quantity),
          store_name: product.store_name
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.min(quantity, item.product.stock_quantity) };
        }
        return item;
      })
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      setError('السلة فارغة');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('يجب تسجيل الدخول أولاً');
      }

      // Group cart items by store
      const itemsByStore = cart.reduce((groups, item) => {
        const storeId = item.product.store_id;
        if (!groups[storeId]) {
          groups[storeId] = [];
        }
        groups[storeId].push(item);
        return groups;
      }, {} as Record<string, CartItem[]>);

      // Create separate orders for each store
      const createdOrders = [];

      for (const [storeId, storeItems] of Object.entries(itemsByStore)) {
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        const subtotal = storeItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const taxAmount = subtotal * 0.15; // 15% VAT
        const totalAmount = subtotal + taxAmount;

        // Create order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: user.id,
            project_id: projectId,
            store_id: storeId,
            order_number: orderNumber,
            status: 'pending',
            payment_status: 'pending',
            subtotal: subtotal,
            tax_amount: taxAmount,
            total_amount: totalAmount,
            currency: 'SAR',
            delivery_type: 'standard',
            notes: `طلب لمشروع: ${projectName}`
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // Create order items
        const orderItems = storeItems.map(item => ({
          order_id: orderData.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          total_price: item.product.price * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        createdOrders.push(orderData.id);
      }

      // Clear cart and notify success
      setCart([]);
      setShowCart(false);

      if (onOrderCreated) {
        onOrderCreated(createdOrders[0]); // Return first order ID
      }

    } catch (error) {
      console.error('Error creating order:', error);
      setError('خطأ في إنشاء الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">طلب مواد للمشروع</h2>
          <p className="text-gray-600">{projectName}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Cart Button */}
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 ml-2" />
            السلة
            {getCartItemsCount() > 0 && (
              <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartItemsCount()}
              </span>
            )}
          </button>

          {/* Cancel Button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-5 h-5 ml-2" />
              إلغاء
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث عن المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name_ar}
              </option>
            ))}
          </select>

          {/* Store Filter */}
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">جميع المتاجر</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.store_name}
                {store.is_verified && ' ✓'}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          {filteredProducts.length === 0 ? (
            <Card className="p-8 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">لا توجد منتجات متاحة</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="h-48 bg-gray-200 relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    {product.store_verified && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
                        ✓ متجر موثق
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    {/* Store Info */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{product.store_name}</span>
                      </div>
                      {product.store_rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{product.store_rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(product.price)}
                        </span>
                        {product.original_price && product.original_price > product.price && (
                          <span className="text-sm text-gray-500 line-through mr-2">
                            {formatCurrency(product.original_price)}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">/{product.unit}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        متوفر: {product.stock_quantity}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock_quantity === 0}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة للسلة
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Shopping Cart */}
        {showCart && (
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <div className="p-4 border-b">
                <h3 className="font-semibold flex items-center">
                  <ShoppingCart className="w-5 h-5 ml-2" />
                  سلة التسوق ({getCartItemsCount()})
                </h3>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>السلة فارغة</p>
                  </div>
                ) : (
                  <div className="p-4 space-y-3">
                    {cart.map((item) => (
                      <div key={item.product.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                            <p className="text-xs text-gray-500">{item.store_name}</p>
                            <p className="text-sm font-semibold text-blue-600">
                              {formatCurrency(item.product.price)} × {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center border rounded text-sm"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock_quantity}
                              className="w-6 h-6 flex items-center justify-center border rounded text-sm disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatCurrency(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>المجموع الفرعي:</span>
                      <span>{formatCurrency(getCartTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>الضريبة (15%):</span>
                      <span>{formatCurrency(getCartTotal() * 0.15)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>الإجمالي:</span>
                      <span>{formatCurrency(getCartTotal() * 1.15)}</span>
                    </div>
                  </div>

                  <button
                    onClick={submitOrder}
                    disabled={submitting || cart.length === 0}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 ml-2" />
                        تأكيد الطلب
                      </>
                    )}
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}





