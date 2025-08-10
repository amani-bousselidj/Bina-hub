"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const dynamic = 'force-dynamic';

// Simple UI Components
const Card = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const spinnerSize = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : 'w-6 h-6';
  return (
    <svg className={`animate-spin text-blue-500 ${spinnerSize}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
    </svg>
  );
};

interface Store {
  id: string;
  name: string;
  description?: string;
  category: string;
  rating: number;
  image_url?: string;
  location?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image_url?: string;
  stock_quantity: number;
  is_available: boolean;
  store_id: string;
}

export default function StorefrontPage() {
  const params = useParams();
  const storeId = params?.id as string;
  
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClientComponentClient();

  useEffect(() => {
    if (storeId) {
      fetchStoreData();
    }
  }, [storeId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);
      
      // For now, use dummy data
      const storeData = getDummyStore(storeId);
      const productsData = getDummyProducts(storeId);
      
      setStore(storeData);
      setProducts(productsData);
      
      // Uncomment when Supabase is ready
      /*
      const [storeResult, productsResult] = await Promise.all([
        supabase.from('stores').select('*').eq('id', storeId).single(),
        supabase.from('products').select('*').eq('store_id', storeId).eq('is_available', true)
      ]);
      
      if (storeResult.data) setStore(storeResult.data);
      if (productsResult.data) setProducts(productsResult.data);
      */
    } catch (error) {
      console.error('Error fetching store data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDummyStore = (id: string): Store => ({
    id,
    name: 'متجر البناء المتميز',
    description: 'متجر شامل لجميع مواد البناء والتشييد مع أفضل الأسعار وأجود المنتجات',
    category: 'materials',
    rating: 4.5,
    location: 'الرياض، المملكة العربية السعودية',
    phone: '+966 11 123 4567',
    email: 'info@building-store.sa',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z'
  });

  const getDummyProducts = (storeId: string): Product[] => [
    {
      id: '1',
      name: 'أسمنت بورتلاند عادي - 50 كيس',
      description: 'أسمنت عالي الجودة مناسب لجميع أعمال البناء والخرسانة',
      price: 25.50,
      category: 'cement',
      image_url: '/products/cement.jpg',
      stock_quantity: 500,
      is_available: true,
      store_id: storeId
    },
    {
      id: '2',
      name: 'حديد تسليح 12 مم - طن',
      description: 'حديد تسليح عالي المقاومة مطابق للمواصفات السعودية',
      price: 2800.00,
      category: 'steel',
      image_url: '/products/rebar.jpg',
      stock_quantity: 50,
      is_available: true,
      store_id: storeId
    },
    {
      id: '3',
      name: 'طوب أحمر - ألف طوبة',
      description: 'طوب أحمر طبيعي عالي الجودة للبناء والعزل',
      price: 180.00,
      category: 'bricks',
      image_url: '/products/bricks.jpg',
      stock_quantity: 100,
      is_available: true,
      store_id: storeId
    },
    {
      id: '4',
      name: 'رمل بناء - متر مكعب',
      description: 'رمل نظيف مغسول مناسب لأعمال البناء والخرسانة',
      price: 45.00,
      category: 'sand',
      image_url: '/products/sand.jpg',
      stock_quantity: 200,
      is_available: true,
      store_id: storeId
    },
    {
      id: '5',
      name: 'بلاط سيراميك 60x60 سم',
      description: 'بلاط سيراميك فاخر مقاوم للماء والخدوش',
      price: 35.00,
      category: 'tiles',
      image_url: '/products/tiles.jpg',
      stock_quantity: 300,
      is_available: true,
      store_id: storeId
    },
    {
      id: '6',
      name: 'دهان داخلي أبيض - 20 لتر',
      description: 'دهان داخلي عالي الجودة قابل للغسيل ومقاوم للرطوبة',
      price: 95.00,
      category: 'paint',
      image_url: '/products/paint.jpg',
      stock_quantity: 80,
      is_available: true,
      store_id: storeId
    }
  ];

  const categories = [
    { value: 'all', label: 'جميع المنتجات' },
    { value: 'cement', label: 'الأسمنت' },
    { value: 'steel', label: 'الحديد' },
    { value: 'bricks', label: 'الطوب' },
    { value: 'sand', label: 'الرمل والحصى' },
    { value: 'tiles', label: 'البلاط والسيراميك' },
    { value: 'paint', label: 'الدهانات' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalCartValue = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">المتجر غير موجود</h2>
          <p className="text-gray-600 mb-4">لم يتم العثور على المتجر المطلوب</p>
          <Link href="/stores-browse" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            العودة للمتاجر
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/stores-browse" className="text-blue-500 hover:text-blue-600">
              ← العودة للمتاجر
            </Link>
            {getTotalCartItems() > 0 && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                السلة ({getTotalCartItems()}) - {getTotalCartValue().toFixed(2)} ر.س
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
              {store.description && (
                <p className="text-gray-600 mb-3">{store.description}</p>
              )}
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={star <= store.rating ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                  <span className="mr-1">({store.rating})</span>
                </div>
                {store.location && (
                  <div className="flex items-center gap-1">
                    <span>📍</span>
                    <span>{store.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              {store.phone && (
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>{store.phone}</span>
                </div>
              )}
              {store.email && (
                <div className="flex items-center gap-2">
                  <span>✉️</span>
                  <span>{store.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                فئة المنتج
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </label>
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">لم يتم العثور على منتجات تطابق معايير البحث</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📦</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-green-600">
                    {product.price.toFixed(2)} ر.س
                  </span>
                  <span className="text-sm text-gray-500">
                    متوفر: {product.stock_quantity}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  {cart[product.id] ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center font-semibold">
                        {cart[product.id]}
                      </span>
                      <button
                        onClick={() => addToCart(product.id)}
                        className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      إضافة للسلة
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {getTotalCartItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <span className="font-semibold">إجمالي السلة: </span>
              <span className="text-green-600 font-bold text-lg">
                {getTotalCartValue().toFixed(2)} ر.س
              </span>
              <span className="text-gray-500 mr-2">({getTotalCartItems()} منتج)</span>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/checkout?store=${storeId}&items=${Object.keys(cart).length}`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                إتمام الطلب
              </Link>
              <Link
                href={`/auth/login?redirect=/storefront/${storeId}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

