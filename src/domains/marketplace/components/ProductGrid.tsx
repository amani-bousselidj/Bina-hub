import React, { useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from '@/components/ui/LoadingComponents';
import { useMarketplace as useProductsMarketplace } from '../hooks/useMarketplace';
import { useMarketplace as useProjectMarketplace } from './MarketplaceProvider';

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
  projectContext?: boolean;
  projectId?: string;
  storeId?: string;
  emptyMessage?: string;
  inStock?: boolean;
  warrantyOnly?: boolean;
  freeShipping?: boolean;
  city?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  category = 'all',
  searchQuery = '',
  projectContext = false,
  projectId,
  storeId,
  emptyMessage = 'لا توجد منتجات متاحة',
  inStock = false,
  warrantyOnly = false,
  freeShipping = false,
  city,
  sortBy,
  order,
}) => {
  const { products, loading, error, updateFilters } = useProductsMarketplace();
  const { addProductToSelection, isProjectContext: projectCtx } = useProjectMarketplace();

  // Sync filters to the marketplace hook
  useEffect(() => {
    updateFilters({
      category: category && category !== 'all' ? category : undefined,
      searchTerm: searchQuery || undefined,
      storeId: storeId || undefined,
    inStock: inStock || undefined,
    warrantyOnly: warrantyOnly || undefined,
    freeShipping: freeShipping || undefined,
    city: city || undefined,
    sortBy: sortBy || undefined,
    order: order || undefined,
    });
  }, [category, searchQuery, storeId, inStock, warrantyOnly, freeShipping, city, sortBy, order, updateFilters]);

  const handleAddToProject = (product: any, quantity: number = 1) => {
    if (projectCtx) {
      addProductToSelection(product as any, 1);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في تحميل المنتجات</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <LoadingSkeleton height="h-48" />
            <div className="p-4 space-y-3">
              <LoadingSkeleton height="h-4" />
              <LoadingSkeleton height="h-3" width="w-1/2" />
              <LoadingSkeleton height="h-3" />
              <div className="flex justify-between items-center">
                <LoadingSkeleton height="h-4" width="w-20" />
                <LoadingSkeleton height="h-8" width="w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
        <p className="text-gray-500">جرب البحث بكلمات مختلفة أو تصفح فئات أخرى</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={(product as any).imageUrl || (product as any).image || '/images/placeholder.png'}
          storeName={(product as any).storeName || 'متجر عام'}
          storeId={(product as any).storeId || 'default-store'}
          category={product.category}
          stock={(product as any).stock}
          freeShipping={(product as any).freeShipping === true}
          // warranty is omitted unless provided by API mapping
          onAddToProject={() => handleAddToProject(product)}
          onViewStore={(storeId) => console.log('View store:', storeId)}
          onViewProduct={(productId) => console.log('View product:', productId)}
          showAddToProject={projectCtx}
        />
      ))}
    </div>
  );
};



