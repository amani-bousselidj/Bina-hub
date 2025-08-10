'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from './MarketplaceProvider';
import { ProductGrid } from '@/domains/marketplace/components/ProductGrid';
import { CategoryFilter } from '@/domains/marketplace/components/CategoryFilter';
import { ProductSearch } from '@/domains/marketplace/components/ProductSearch';
import { ShoppingCart } from './ShoppingCart';
import { CartSidebar } from './CartSidebar';
import { useAuth } from '@/core/shared/auth/AuthProvider';
import { useCart } from '../../hooks/useCart';
import { ShoppingBag, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui';

interface MarketplaceViewProps {
  showHeader?: boolean;
  className?: string;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ 
  showHeader = true,
  className = ''
}) => {
  const { isProjectContext, projectId } = useMarketplace();
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [category, setCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

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
              Filters
            </Button>
            
            {/* Cart toggle for all users */}
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Cart
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {totalItems}
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <ProductSearch 
                value={searchQuery}
                onSearch={setSearchQuery}
                placeholder={isProjectContext ? 'Search project products...' : 'Search all products...'}
                className="pl-10"
              />
            </div>
          </div>
          
          <ProductGrid 
            category={category} 
            searchQuery={searchQuery}
            projectContext={isProjectContext}
            projectId={projectId}
          />
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default MarketplaceView;


