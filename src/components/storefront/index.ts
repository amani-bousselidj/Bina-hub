// Storefront Components
export { StorefrontHeader } from './StorefrontHeader';
export { StorefrontProducts } from './StorefrontProducts';
export { StorefrontLayout } from './StorefrontLayout';

// Re-export marketplace components that are used in storefronts
export { StoreCard } from '../marketplace/StoreCard';

// Export types
export interface StorefrontStore {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
  };
  rating: number;
  productCount: number;
}

export interface StorefrontProduct {
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


