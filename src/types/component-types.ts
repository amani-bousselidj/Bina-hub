import { ReactNode } from 'react';

export interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
  className?: string;
}

export interface ProductSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  availableStores?: Array<{ id: string; name: string }>;
  className?: string;
  showFilters?: boolean;
}

export interface CategoryFilterProps {
  categories: Array<{ id: string; name: string; count: number }>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export interface ProductGridProps {
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

export interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    store_id: string;
    stock?: number;
  };
  onAddToProject?: (productId: string) => void;
  onViewStore?: (storeId: string) => void;
  onViewProduct?: (productId: string) => void;
  showAddToProject?: boolean;
}

export interface EnhancedAddToCartProps {
  productId: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}


