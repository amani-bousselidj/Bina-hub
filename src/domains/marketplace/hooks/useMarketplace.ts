import { useState, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image?: string;
}

interface MarketplaceFilters {
  category?: string;
  priceRange?: [number, number];
  searchTerm?: string;
  storeId?: string;
  inStock?: boolean;
  warrantyOnly?: boolean;
  freeShipping?: boolean;
  city?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export const useMarketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<MarketplaceFilters>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (filters: MarketplaceFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.storeId) params.set('storeId', filters.storeId);
      if (filters.category && filters.category !== 'all') params.set('category', filters.category);
  if (filters.searchTerm) params.set('q', filters.searchTerm);
  if (filters.inStock) params.set('inStock', 'true');
  if (filters.warrantyOnly) params.set('warranty', 'true');
  if (filters.freeShipping) params.set('freeShipping', 'true');
  if (filters.city) params.set('city', filters.city);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.order) params.set('order', filters.order);

      const res = await fetch(`/api/products${params.toString() ? `?${params.toString()}` : ''}`);
      if (!res.ok) throw new Error(`Failed to load products: ${res.status}`);
      const json = await res.json();
      setProducts(json.products || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Shallow compare to prevent redundant filter state updates
  const shallowEqual = (a: Record<string, any>, b: Record<string, any>) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
      if (a[k] !== b[k]) return false;
    }
    return true;
  };

  // Derive categories from current products whenever they change
  useEffect(() => {
    try {
      const uniqueCats = Array.from(
        new Set((products || []).map((row: any) => row?.category).filter(Boolean))
      );
      setCategories(uniqueCats as string[]);
    } catch (err) {
      console.error('Error deriving categories:', err);
    }
  }, [products]);

  useEffect(() => { fetchProducts(filters); }, [fetchProducts, filters]);

  const updateFilters = useCallback((newFilters: Partial<MarketplaceFilters>) => {
    setFilters(prev => {
      const next = { ...prev, ...newFilters } as MarketplaceFilters;
      return shallowEqual(prev as Record<string, any>, next as Record<string, any>) ? prev : next;
    });
  }, []);

  const addProductToSelection = (product: Product) => {
    // Placeholder implementation
    console.log('Product added to selection:', product);
  };

  return {
    products,
    loading,
    filters,
    error,
    categories,
    fetchProducts,
    updateFilters,
    addProductToSelection,
    isProjectContext: false,
    projectId: null
  };
};



