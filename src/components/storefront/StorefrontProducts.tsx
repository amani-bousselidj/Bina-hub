import React, { useState } from 'react';
import { ProductGrid } from '../marketplace/ProductGrid';
import { CategoryFilter } from '../marketplace/CategoryFilter';
import { ProductSearch } from '../marketplace/ProductSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  featured?: boolean;
  onSale?: boolean;
  originalPrice?: number;
}

interface StorefrontProductsProps {
  storeId: string;
  storeName: string;
  products: Product[];
  loading?: boolean;
  onAddToProject?: (productId: string) => void;
  onViewProduct?: (productId: string) => void;
  showAddToProject?: boolean;
}

export const StorefrontProducts: React.FC<StorefrontProductsProps> = ({
  storeId,
  storeName,
  products,
  loading = false,
  onAddToProject,
  onViewProduct,
  showAddToProject = true,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter products based on search, category, and tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'featured' && product.featured) ||
      (activeTab === 'sale' && product.onSale);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  // Generate categories with counts
  const categories = [
    { id: 'all', name: 'جميع الفئات', count: products.length },
    ...Array.from(new Set(products.map(p => p.category))).map(category => ({
      id: category,
      name: getCategoryDisplayName(category),
      count: products.filter(p => p.category === category).length,
    })),
  ];

  // Get featured products
  const featuredProducts = products.filter(p => p.featured);
  const saleProducts = products.filter(p => p.onSale);

  // Transform products to match ProductGrid interface
  const transformedProducts = filteredProducts.map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    store_id: product.storeId,
    stock: product.stock,
    category: product.category,
    images: [product.imageUrl],
    attributes: {
      description: product.description,
      storeName: product.storeName,
      warranty: product.warranty
    }
  }));

  return (
    <div className="container mx-auto px-4">
      {/* Quick Stats */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{products.length}</div>
            <div className="text-sm text-gray-600">إجمالي المنتجات</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{featuredProducts.length}</div>
            <div className="text-sm text-gray-600">منتجات مميزة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{saleProducts.length}</div>
            <div className="text-sm text-gray-600">عروض خاصة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">فئات المنتجات</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <ProductSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={false}
      />

      {/* Product Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            جميع المنتجات ({products.length})
          </TabsTrigger>
          <TabsTrigger value="featured" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            المنتجات المميزة ({featuredProducts.length})
          </TabsTrigger>
          <TabsTrigger value="sale" className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            العروض الخاصة ({saleProducts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Products Grid */}
          <ProductGrid
            products={transformedProducts}
            loading={loading}
            onAddToProject={onAddToProject}
            onViewProduct={onViewProduct}
            showAddToProject={showAddToProject}
            emptyMessage={
              activeTab === 'featured' ? 'لا توجد منتجات مميزة حالياً' :
              activeTab === 'sale' ? 'لا توجد عروض خاصة حالياً' :
              'لا توجد منتجات في هذه الفئة'
            }
          />
        </TabsContent>
      </Tabs>

      {/* Special Offers Section */}
      {saleProducts.length > 0 && activeTab === 'all' && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="destructive">عروض محدودة</Badge>
            <h3 className="text-xl font-bold text-gray-900">عروض خاصة من {storeName}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {saleProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-lg border p-4">
                <div className="relative mb-3">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  {product.originalPrice && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      خصم {Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium text-sm mb-2 line-clamp-1">{product.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-red-600">{product.price} ر.س</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">{product.originalPrice} ر.س</span>
                  )}
                </div>
                {showAddToProject && (
                  <button 
                    onClick={() => onAddToProject?.(product.id)}
                    className="w-full bg-red-600 text-white text-xs py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    إضافة للمشروع
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get category display names
function getCategoryDisplayName(category: string): string {
  const categoryNames: Record<string, string> = {
    'building-materials': 'مواد البناء',
    'fixtures': 'التركيبات',
    'furniture': 'الأثاث',
    'appliances': 'الأجهزة',
    'lighting': 'الإضاءة',
    'flooring': 'الأرضيات',
    'painting': 'الدهانات',
    'plumbing': 'السباكة',
    'electrical': 'الكهرباء',
    'hvac': 'التكييف',
    'security': 'الأمان',
    'garden': 'الحدائق',
  };
  
  return categoryNames[category] || category;
}


