"use client";
import React, { useState, useEffect } from 'react';
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
  location?: string;
  phone?: string;
  email?: string;
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
  store?: Store;
}

export default function StorefrontMainPage() {
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
  const [selectedStore, setSelectedStore] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      
      // For now, use dummy data
      const productsData = getAllDummyProducts();
      setProducts(productsData);
      
      // Uncomment when Supabase is ready
      /*
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          store:stores(id, name, description, category, rating, location, phone, email)
        `)
        .eq('is_available', true);
      
      if (data) {
        setProducts(data);
      }
      */
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAllDummyProducts = (): Product[] => {
    const stores = [
      {
        id: '1',
        name: 'متجر البناء المتميز',
        description: 'متجر شامل لجميع مواد البناء والتشييد',
        category: 'materials',
        rating: 4.5,
        location: 'الرياض، المملكة العربية السعودية',
        phone: '+966 11 123 4567',
        email: 'info@building-store.sa'
      },
      {
        id: '2',
        name: 'مؤسسة الحديد والأجهزة',
        description: 'متخصصون في الحديد والمعدات الثقيلة',
        category: 'tools',
        rating: 4.2,
        location: 'جدة، المملكة العربية السعودية',
        phone: '+966 12 987 6543',
        email: 'contact@irontools.sa'
      },
      {
        id: '3',
        name: 'معرض الأدوات الصحية',
        description: 'جميع أنواع الأدوات والتجهيزات الصحية',
        category: 'plumbing',
        rating: 4.7,
        location: 'الدمام، المملكة العربية السعودية',
        phone: '+966 13 456 7890',
        email: 'info@plumbing-store.sa'
      }
    ];

    return [
      // Store 1 Products
      {
        id: '1',
        name: 'أسمنت بورتلاند عادي - 50 كيس',
        description: 'أسمنت عالي الجودة مناسب لجميع أعمال البناء والخرسانة',
        price: 25.50,
        category: 'cement',
        stock_quantity: 500,
        is_available: true,
        store_id: '1',
        store: stores[0]
      },
      {
        id: '2',
        name: 'حديد تسليح 12 مم - طن',
        description: 'حديد تسليح عالي المقاومة مطابق للمواصفات السعودية',
        price: 2800.00,
        category: 'steel',
        stock_quantity: 50,
        is_available: true,
        store_id: '1',
        store: stores[0]
      },
      {
        id: '3',
        name: 'طوب أحمر - ألف طوبة',
        description: 'طوب أحمر طبيعي عالي الجودة للبناء والعزل',
        price: 180.00,
        category: 'bricks',
        stock_quantity: 100,
        is_available: true,
        store_id: '1',
        store: stores[0]
      },
      {
        id: '4',
        name: 'دهان داخلي أبيض - 20 لتر',
        description: 'دهان داخلي عالي الجودة قابل للغسيل ومقاوم للرطوبة',
        price: 95.00,
        category: 'paint',
        stock_quantity: 80,
        is_available: true,
        store_id: '1',
        store: stores[0]
      },
      // Store 2 Products
      {
        id: '5',
        name: 'مثقاب كهربائي 750 واط',
        description: 'مثقاب كهربائي قوي مع مجموعة ريش متنوعة',
        price: 320.00,
        category: 'tools',
        stock_quantity: 25,
        is_available: true,
        store_id: '2',
        store: stores[1]
      },
      {
        id: '6',
        name: 'منشار دائري 1400 واط',
        description: 'منشار دائري احترافي للقطع الدقيق',
        price: 580.00,
        category: 'tools',
        stock_quantity: 15,
        is_available: true,
        store_id: '2',
        store: stores[1]
      },
      {
        id: '7',
        name: 'حديد زاوية 5x5 سم - 6 متر',
        description: 'حديد زاوية مجلفن عالي الجودة',
        price: 45.00,
        category: 'steel',
        stock_quantity: 200,
        is_available: true,
        store_id: '2',
        store: stores[1]
      },
      // Store 3 Products
      {
        id: '8',
        name: 'مغسلة بورسلين أبيض',
        description: 'مغسلة بورسلين فاخرة مع خلاط',
        price: 450.00,
        category: 'plumbing',
        stock_quantity: 30,
        is_available: true,
        store_id: '3',
        store: stores[2]
      },
      {
        id: '9',
        name: 'مرحاض إفرنجي مع خزان',
        description: 'مرحاض إفرنجي كامل مع خزان علوي',
        price: 380.00,
        category: 'plumbing',
        stock_quantity: 20,
        is_available: true,
        store_id: '3',
        store: stores[2]
      },
      {
        id: '10',
        name: 'خلاط مياه حديث',
        description: 'خلاط مياه بتصميم عصري وجودة عالية',
        price: 150.00,
        category: 'plumbing',
        stock_quantity: 40,
        is_available: true,
        store_id: '3',
        store: stores[2]
      },
      {
        id: '11',
        name: 'بلاط سيراميك 60x60 سم',
        description: 'بلاط سيراميك فاخر مقاوم للماء والخدوش',
        price: 35.00,
        category: 'tiles',
        stock_quantity: 300,
        is_available: true,
        store_id: '1',
        store: stores[0]
      },
      {
        id: '12',
        name: 'رمل بناء - متر مكعب',
        description: 'رمل نظيف مغسول مناسب لأعمال البناء والخرسانة',
        price: 45.00,
        category: 'sand',
        stock_quantity: 200,
        is_available: true,
        store_id: '1',
        store: stores[0]
      }
    ];
  };

  const categories = [
    { value: 'all', label: 'جميع المنتجات' },
    { value: 'cement', label: 'الأسمنت' },
    { value: 'steel', label: 'الحديد' },
    { value: 'bricks', label: 'الطوب' },
    { value: 'sand', label: 'الرمل والحصى' },
    { value: 'tiles', label: 'البلاط والسيراميك' },
    { value: 'paint', label: 'الدهانات' },
    { value: 'tools', label: 'الأدوات والمعدات' },
    { value: 'plumbing', label: 'الأدوات الصحية' },
  ];

  const priceRanges = [
    { value: 'all', label: 'جميع الأسعار' },
    { value: '0-50', label: 'أقل من 50 ر.س' },
    { value: '50-200', label: '50 - 200 ر.س' },
    { value: '200-500', label: '200 - 500 ر.س' },
    { value: '500-1000', label: '500 - 1000 ر.س' },
    { value: '1000+', label: 'أكثر من 1000 ر.س' },
  ];

  const sortOptions = [
    { value: 'name', label: 'الاسم' },
    { value: 'price-low', label: 'السعر: الأقل أولاً' },
    { value: 'price-high', label: 'السعر: الأعلى أولاً' },
    { value: 'rating', label: 'التقييم' },
  ];

  const getUniqueStores = () => {
    const storeMap = new Map();
    products.forEach(product => {
      if (product.store && !storeMap.has(product.store.id)) {
        storeMap.set(product.store.id, product.store);
      }
    });
    return Array.from(storeMap.values());
  };

  const filteredAndSortedProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesStore = selectedStore === 'all' || product.store_id === selectedStore;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      let matchesPrice = true;
      if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
        if (max) {
          matchesPrice = product.price >= parseInt(min) && product.price <= parseInt(max);
        } else {
          matchesPrice = product.price >= parseInt(min);
        }
      }
      
      return matchesCategory && matchesStore && matchesSearch && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.store?.rating || 0) - (a.store?.rating || 0);
        default:
          return a.name.localeCompare(b.name, 'ar');
      }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">متجر بناء هب</h1>
              <p className="text-gray-600">اكتشف أفضل منتجات البناء والتشييد من المتاجر المتميزة</p>
            </div>
            {getTotalCartItems() > 0 && (
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg">
                السلة ({getTotalCartItems()}) - {getTotalCartValue().toFixed(2)} ر.س
              </div>
            )}
          </div>
          
          <div className="flex gap-4">
            <Link href="/user/stores-browse" className="text-blue-500 hover:text-blue-600">
              تصفح المتاجر
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600">جميع المنتجات</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <Card className="p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Category Filter */}
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

            {/* Store Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                المتجر
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">جميع المتاجر</option>
                {getUniqueStores().map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                السعر
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {priceRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ترتيب حسب
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Search */}
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            تم العثور على {filteredAndSortedProducts.length} منتج
            {selectedCategory !== 'all' && ` في فئة "${categories.find(c => c.value === selectedCategory)?.label}"`}
            {selectedStore !== 'all' && ` من ${getUniqueStores().find(s => s.id === selectedStore)?.name}`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">لم يتم العثور على منتجات تطابق معايير البحث</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl text-gray-400">📦</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                
                {product.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                )}
                
                {/* Store Info */}
                {product.store && (
                  <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                    <Link 
                      href={`/storefront/${product.store.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {product.store.name}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= (product.store?.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                      <span className="mr-1">({product.store.rating})</span>
                    </div>
                  </div>
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
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm w-full"
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
                href={`/checkout?items=${Object.keys(cart).length}`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                إتمام الطلب
              </Link>
              <Link
                href="/auth/login?redirect=/storefront"
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



