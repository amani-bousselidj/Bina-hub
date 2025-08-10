export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subcategory?: string;
  storeId: string;
  storeName: string;
  images: string[];
  specifications: Record<string, string>;
  warranty?: {
    duration: number;
    type: 'years' | 'months';
    details: string;
  };
  stock: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  productCount: number;
  parentCategory?: string;
  subcategories?: string[];
}

export interface Store {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  location: {
    city: string;
    area: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    whatsapp?: string;
  };
  rating: {
    average: number;
    count: number;
  };
  isVerified: boolean;
  categories: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  storeId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  city?: string;
  area?: string;
  inStock?: boolean;
  hasWarranty?: boolean;
  isVerifiedStore?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'rating' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

export interface MarketplaceSearchResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}


