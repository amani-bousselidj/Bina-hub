'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace as useProductsMarketplace } from '../hooks/useMarketplace';
import { useMarketplace as useProjectMarketplace } from './MarketplaceProvider';
import { ProductGrid } from './ProductGrid';
import { CategoryFilter } from './CategoryFilter';
import { ProductSearch } from './ProductSearch';
import { ShoppingCart } from './ShoppingCart';
import { CartSidebar } from './CartSidebar';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';
import { StorePicker } from './StorePicker';

interface MarketplaceViewProps {
  showHeader?: boolean;
  className?: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ 
  showHeader = true,
  className = ''
}) => {
  // Project selection context
  const { isProjectContext, projectId } = useProjectMarketplace();
  const { user } = useAuth();
  const { cart, setProjectId } = useCart();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [storeId, setStoreId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [inStock, setInStock] = useState<boolean>(false);
  const [warrantyOnly, setWarrantyOnly] = useState<boolean>(false);
  const [freeShipping, setFreeShipping] = useState<boolean>(false);
  const [city, setCity] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('updated_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Keep cart tied to project context automatically
  useEffect(() => {
    if (isProjectContext && projectId) {
      setProjectId(projectId);
    } else {
      setProjectId(undefined);
    }
  }, [isProjectContext, projectId, setProjectId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="md:w-3/4">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`container mx-auto p-4 ${className}`}>
      {showHeader && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isProjectContext ? 'Select Products for Project' : 'Marketplace'}
          </h1>
          
          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              فلاتر
            </Button>

            {/* Store picker */}
            <StorePicker
              value={storeId}
              onChange={setStoreId}
              category={category}
              searchQuery={searchQuery}
            />
            
            {/* Cart toggle for all users */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                السلة
                {cart.itemCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {cart.itemCount}
                  </Badge>
                )}
              </Button>
            )}
            
            {/* Project cart for project context */}
            {isProjectContext && user && <ShoppingCart />}
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="sticky top-4 space-y-4">
            <CategoryFilter 
              onCategoryChange={setCategory} 
              selectedCategory={category} 
              inStock={inStock}
              warrantyOnly={warrantyOnly}
              freeShipping={freeShipping}
              onQuickFilterChange={(flags) => {
                if (typeof flags.inStock !== 'undefined') setInStock(flags.inStock);
                if (typeof flags.warrantyOnly !== 'undefined') setWarrantyOnly(flags.warrantyOnly);
                if (typeof flags.freeShipping !== 'undefined') setFreeShipping(flags.freeShipping);
              }}
            />
            
            {/* Mobile filter close button */}
            {showFilters && (
              <Button
                variant="outline"
                size="sm"
                className="w-full lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                Close Filters
              </Button>
            )}
          </div>
        </div>
        
        <div className="lg:w-3/4">
          <div className="mb-6">
            <div className="mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <ProductSearch 
                onSearch={setSearchQuery} 
                value={searchQuery}
                placeholder={isProjectContext ? 'ابحث في منتجات المشروع...' : 'ابحث في جميع المنتجات...'}
                className="pl-10"
              />
            </div>
          </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">المدينة</label>
                  <input className="border rounded px-2 py-1 w-full" value={city || ''} onChange={(e) => setCity(e.target.value || undefined)} placeholder="اختر/اكتب المدينة" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ترتيب حسب</label>
                  <select className="border rounded px-2 py-1 w-full" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="updated_at">الأحدث</option>
                    <option value="price">السعر</option>
                    <option value="name">الاسم</option>
                    <option value="quantity_in_stock">المخزون</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">الترتيب</label>
                  <select className="border rounded px-2 py-1 w-full" value={order} onChange={(e) => setOrder(e.target.value as 'asc' | 'desc')}>
                    <option value="desc">تنازلي</option>
                    <option value="asc">تصاعدي</option>
                  </select>
                </div>
              </div>
          
          <ProductGrid 
            category={category} 
            searchQuery={searchQuery}
            storeId={storeId}
            inStock={inStock}
            warrantyOnly={warrantyOnly}
            freeShipping={freeShipping}
            projectContext={isProjectContext}
              city={city}
              sortBy={sortBy}
              order={order}
            projectId={projectId || undefined}
          />
        </div>
      </div>
      
      {/* Enhanced Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default MarketplaceView;



