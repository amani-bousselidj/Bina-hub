import React from 'react';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from '@/components/ui/LoadingComponents';
import { useProducts } from '../../hooks/useMarketplace';
import { useMarketplace } from './MarketplaceProvider';

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    store_id: string;
    stock?: number;
    category?: string;
    tags?: string[];
    images?: string[];
    attributes?: Record<string, any>;
  }>;
  loading?: boolean;
  onAddToProject?: (productId: string) => void;
  onViewStore?: (storeId: string) => void;
  onViewProduct?: (productId: string) => void;
  showAddToProject?: boolean;
  emptyMessage?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  onAddToProject,
  onViewStore,
  onViewProduct,
  showAddToProject = false,
  emptyMessage = 'لا توجد منتجات متاحة',
}) => {
  const handleAddToProject = (product: any, quantity: number = 1) => {
    if (showAddToProject && onAddToProject) {
      onAddToProject(product.id);
    }
  };

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
          description={product.attributes?.description || 'No description available'}
          price={product.price}
          imageUrl={product.images?.[0] || '/placeholder-image.jpg'}
          storeName={product.attributes?.storeName || 'Unknown Store'}
          storeId={product.store_id}
          category={product.category}
          stock={product.stock}
          warranty={product.attributes?.warranty}
          onAddToProject={() => onAddToProject?.(product.id)}
          onViewStore={(storeId) => onViewStore?.(storeId)}
          onViewProduct={(productId) => onViewProduct?.(productId)}
          showAddToProject={showAddToProject}
        />
      ))}
    </div>
  );
};


