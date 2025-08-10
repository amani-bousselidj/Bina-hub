// Marketplace Components
export { ProductCard } from './ProductCard';
export { ProductGrid } from './ProductGrid';
export { CategoryFilter } from './CategoryFilter';
export { ProductSearch } from './ProductSearch';
export { MarketplaceLayout } from './MarketplaceLayout';
export { StoreCard } from './StoreCard';
export { AddToCart } from './AddToCart';
export { CartSidebar } from './CartSidebar';

// Marketplace types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  storeName: string;
  storeId: string;
  category?: string;
  stock?: number;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
  };
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  description: string;
  rating: number;
  productCount: number;
}

export interface Category {
  id: string;
  name: string;
  count?: number;
  icon?: string;
}



