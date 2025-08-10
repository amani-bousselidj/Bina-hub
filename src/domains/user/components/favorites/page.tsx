'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EnhancedCard, Button } from '@/components/ui/enhanced-components';

interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  addedDate: string;
}

interface FavoriteStore {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  location: string;
  category: string;
  image: string;
  verified: boolean;
  addedDate: string;
}

export default function UserFavoritesPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'stores'>('products');
  const [isClient, setIsClient] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState<FavoriteProduct[]>([]);
  const [favoriteStores, setFavoriteStores] = useState<FavoriteStore[]>([]);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Load real favorites data (placeholder for now - should connect to real API)
    loadFavoritesData();
  }, []);

  const loadFavoritesData = async () => {
    try {
      // This should be replaced with real API calls
      // For now, we'll use sample data to show functionality
      setFavoriteProducts([]);
      
      setFavoriteStores([
        {
          id: '1',
          name: 'متجر مواد البناء الحديث',
          description: 'متجر شامل لجميع مواد البناء والتشييد بأفضل الأسعار',
          rating: 4.6,
          reviews: 1250,
          location: 'الرياض - حي الملك فهد',
          category: 'مواد البناء',
          image: '/api/placeholder/300/200',
          verified: true,
          addedDate: '2024-01-12'
        },
        {
          id: '2',
          name: 'مؤسسة الحديد والفولاذ',
          description: 'متخصصون في توريد الحديد والمعادن لجميع أنواع المشاريع',
          rating: 4.8,
          reviews: 890,
          location: 'جدة - طريق الملك عبدالعزيز',
          category: 'حديد ومعادن',
          image: '/api/placeholder/300/200',
          verified: true,
          addedDate: '2024-01-08'
        },
        {
          id: '3',
          name: 'معرض البلاط الذهبي',
          description: 'أكبر معرض للبلاط والسيراميك والرخام في المملكة',
          rating: 4.4,
          reviews: 678,
          location: 'الدمام - الكورنيش',
          category: 'مواد التشطيب',
          image: '/api/placeholder/300/200',
          verified: false,
          addedDate: '2024-01-03'
        }
      ]);
      
      // TODO: Implement real API calls
      // const userFavorites = await getUserFavorites(userId);
      // setFavoriteProducts(userFavorites.products);
      // setFavoriteStores(userFavorites.stores);
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavoriteProducts([]);
      setFavoriteStores([]);
    }
  };

  const removeFromFavorites = (type: 'product' | 'store', id: string) => {
    if (type === 'product') {
      setFavoriteProducts(prev => prev.filter(product => product.id !== id));
    } else {
      setFavoriteStores(prev => prev.filter(store => store.id !== id));
    }
    // Show confirmation message
    console.log(`تم إزالة ${type === 'product' ? 'المنتج' : 'المتجر'} من المفضلة`);
  };

  const addToCart = (productId: string) => {
    // Navigate to cart with product added
    router.push('/user/cart');
    console.log(`تم إضافة المنتج ${productId} إلى السلة`);
  };

  const visitStore = (storeId: string) => {
    // Navigate to specific store page
    router.push(`/user/stores/${storeId}`);
    console.log(`زيارة المتجر ${storeId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ar-SA').format(price) + ' ر.س';
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {!isClient ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري التحميل...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">المفضلة</h1>
            <p className="text-gray-600">إدارة المنتجات والمتاجر المفضلة لديك</p>
          </div>

      {/* Tabs */}
      <div className="flex space-x-1 space-x-reverse bg-gray-100 p-1 rounded-lg mb-6 w-fit">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'products'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          المنتجات المفضلة ({favoriteProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'stores'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          المتاجر المفضلة ({favoriteStores.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {favoriteProducts.length === 0 ? (
            <EnhancedCard className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">❤️</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد منتجات مفضلة</h3>
              <p className="text-gray-500 mb-4">ابدأ بإضافة منتجات إلى قائمة المفضلة لتظهر هنا</p>
              <Button 
                onClick={() => router.push('/user/stores-browse')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                تصفح المنتجات
              </Button>
            </EnhancedCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteProducts.map((product) => (
                <EnhancedCard key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded">
                          غير متوفر
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => removeFromFavorites('product', product.id)}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                    >
                      <span className="text-red-500 text-lg">❤️</span>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-2">{product.store}</p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 mr-1">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through mr-2">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      أُضيف في {formatDate(product.addedDate)}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => addToCart(product.id)}
                        disabled={!product.inStock}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-300"
                      >
                        {product.inStock ? 'أضف للسلة' : 'غير متوفر'}
                      </Button>
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <div>
          {favoriteStores.length === 0 ? (
            <EnhancedCard className="p-12 text-center">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد متاجر مفضلة</h3>
              <p className="text-gray-500 mb-4">ابدأ بإضافة متاجر إلى قائمة المفضلة لتظهر هنا</p>
              <Button 
                onClick={() => router.push('/user/stores-browse')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                تصفح المتاجر
              </Button>
            </EnhancedCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteStores.map((store) => (
                <EnhancedCard key={store.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => removeFromFavorites('store', store.id)}
                      className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
                    >
                      <span className="text-red-500 text-lg">❤️</span>
                    </button>
                    {store.verified && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        متجر موثق
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {store.category}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2">{store.name}</h3>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {store.description}
                    </p>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(store.rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-600 mr-1">
                          ({store.reviews})
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">📍 {store.location}</p>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      أُضيف في {formatDate(store.addedDate)}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => visitStore(store.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        زيارة المتجر
                      </Button>
                    </div>
                  </div>
                </EnhancedCard>
              ))}
            </div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  );
}

