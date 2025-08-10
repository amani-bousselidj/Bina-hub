import React, { useState, useEffect } from 'react';
import { ProductGrid } from '@/domains/marketplace/components/ProductGrid';
import { CategoryFilter } from '@/domains/marketplace/components/CategoryFilter';
import { ProductSearch } from '@/domains/marketplace/components/ProductSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeName: string;
  storeId: string;
  category: string;
  stock?: number;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
  };
}

interface Store {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  productCount: number;
}

interface MarketplaceLayoutProps {
  onAddToProject?: (productId: string) => void;
  onViewStore?: (storeId: string) => void;
  onViewProduct?: (productId: string) => void;
  showAddToProject?: boolean;
  projectContext?: boolean;
}

export const MarketplaceLayout: React.FC<MarketplaceLayoutProps> = ({
  onAddToProject,
  onViewStore,
  onViewProduct,
  showAddToProject = true,
  projectContext = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('products');

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock products data
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'بلاط سيراميك فاخر',
          description: 'بلاط سيراميك عالي الجودة مناسب للأرضيات والجدران',
          price: 45,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'متجر البناء الحديث',
          storeId: 'store1',
          category: 'building-materials',
          stock: 150,
          warranty: { duration: 2, type: 'years' }
        },
        {
          id: '2',
          name: 'مصباح LED ذكي',
          description: 'مصباح LED قابل للتحكم عبر التطبيق مع ألوان متعددة',
          price: 120,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'متجر الإضاءة المتقدمة',
          storeId: 'store2',
          category: 'lighting',
          stock: 50,
          warranty: { duration: 12, type: 'months' }
        },
        {
          id: '3',
          name: 'كرسي مكتب مريح',
          description: 'كرسي مكتب بتصميم مريح ومواد عالية الجودة',
          price: 850,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'أثاث المنزل العصري',
          storeId: 'store3',
          category: 'furniture',
          stock: 25,
          warranty: { duration: 1, type: 'years' }
        },
        {
          id: '4',
          name: 'خلاط كهربائي متعدد الاستخدامات',
          description: 'خلاط كهربائي قوي مع ملحقات متنوعة',
          price: 320,
          imageUrl: '/api/placeholder/300/200',
          storeName: 'أجهزة المطبخ الذكية',
          storeId: 'store4',
          category: 'appliances',
          stock: 0, // Out of stock
          warranty: { duration: 18, type: 'months' }
        },
      ];

      // Mock stores data
      const mockStores: Store[] = [
        {
          id: 'store1',
          name: 'متجر البناء الحديث',
          logo: '/api/placeholder/100/100',
          description: 'متخصصون في مواد البناء والتشطيب',
          rating: 4.8,
          productCount: 156
        },
        {
          id: 'store2',
          name: 'متجر الإضاءة المتقدمة',
          logo: '/api/placeholder/100/100',
          description: 'حلول الإضاءة الذكية والحديثة',
          rating: 4.6,
          productCount: 89
        },
        {
          id: 'store3',
          name: 'أثاث المنزل العصري',
          logo: '/api/placeholder/100/100',
          description: 'أثاث عصري بتصاميم فريدة',
          rating: 4.9,
          productCount: 203
        },
        {
          id: 'store4',
          name: 'أجهزة المطبخ الذكية',
          logo: '/api/placeholder/100/100',
          description: 'أجهزة مطبخ ذكية ومتطورة',
          rating: 4.5,
          productCount: 67
        },
      ];

      setProducts(mockProducts);
      setStores(mockStores);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Generate categories with counts
  const categories = [
    { id: 'all', name: 'جميع الفئات', count: products.length },
    { id: 'building-materials', name: 'مواد البناء', count: products.filter(p => p.category === 'building-materials').length },
    { id: 'lighting', name: 'الإضاءة', count: products.filter(p => p.category === 'lighting').length },
    { id: 'furniture', name: 'الأثاث', count: products.filter(p => p.category === 'furniture').length },
    { id: 'appliances', name: 'الأجهزة', count: products.filter(p => p.category === 'appliances').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {projectContext ? 'إضافة منتجات للمشروع' : 'متجر binaaHub'}
          </h1>
          <p className="text-gray-600">
            {projectContext 
              ? 'اختر المنتجات المناسبة لمشروعك من مجموعة واسعة من المتاجر'
              : 'اكتشف أفضل المنتجات من متاجر موثوقة'
            }
          </p>
        </div>

        {/* Search Component */}
        <ProductSearch
          value={searchQuery}
          onSearch={setSearchQuery}
          placeholder="ابحث في المنتجات"
          className="mb-4"
        />

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              المنتجات ({filteredProducts.length})
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              المتاجر ({stores.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6">
            <CategoryFilter
              selectedCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
            
            <ProductGrid
              category={activeCategory === 'all' ? undefined : activeCategory}
              searchQuery={searchQuery}
              projectContext={projectContext}
              emptyMessage={searchQuery ? 'لا توجد منتجات تطابق البحث' : 'لا توجد منتجات في هذه الفئة'}
            />
          </TabsContent>

          <TabsContent value="stores" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div 
                  key={store.id} 
                  className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
                  onClick={() => onViewStore?.(store.id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={store.logo} 
                      alt={store.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{store.name}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600">{store.rating}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{store.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      {store.productCount} منتج
                    </Badge>
                    <Button variant="ghost" size="sm">
                      زيارة المتجر →
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};


