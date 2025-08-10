import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
  nameAr: string;
  slug: string;
  description?: string;
  parent_id?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  productCount?: number;
}

export interface Store {
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
  ownerId: string;
  rating?: number;
  reviewCount?: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: string;
  storeId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  hasWarranty?: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class MarketplaceService {
  private supabase = createClientComponentClient();

  // Products
  async getProducts(
    filters: ProductFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const { page = 1, limit = 20 } = pagination;
      const offset = (page - 1) * limit;

      let query = this.supabase
        .from('marketplace.products')
        .select(`
          *,
          stores:store_id (
            id,
            name,
            logo,
            rating
          ),
          categories:category_id (
            name,
            slug
          )
        `, { count: 'exact' });

      // Apply filters
      if (filters.category) {
        query = query.eq('categories.slug', filters.category);
      }

      if (filters.storeId) {
        query = query.eq('store_id', filters.storeId);
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }

      if (filters.inStock) {
        query = query.gt('stock_quantity', 0);
      }

      if (filters.hasWarranty) {
        query = query.not('warranty_details', 'is', null);
      }

      // Apply pagination
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching products:', error);
        return { products: [], total: 0 };
      }

      const products = (data || []).map(this.transformProduct);
      return { products, total: count || 0 };
    } catch (error) {
      console.error('Error in getProducts:', error);
      return { products: [], total: 0 };
    }
  }

  async getProduct(productId: string): Promise<Product | null> {
    try {
      const { data, error } = await this.supabase
        .from('marketplace.products')
        .select(`
          *,
          stores:store_id (
            id,
            name,
            logo,
            rating,
            description
          ),
          categories:category_id (
            name,
            slug
          )
        `)
        .eq('id', productId)
        .single();

      if (error || !data) {
        console.error('Error fetching product:', error);
        return null;
      }

      return this.transformProduct(data);
    } catch (error) {
      console.error('Error in getProduct:', error);
      return null;
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await this.supabase
        .from('marketplace.categories')
        .select(`
          *,
          product_count:products(count)
        `)
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching categories:', error);
        return [];
      }

      return (data || []).map(this.transformCategory);
    } catch (error) {
      console.error('Error in getCategories:', error);
      return [];
    }
  }

  async getCategory(categorySlug: string): Promise<Category | null> {
    try {
      const { data, error } = await this.supabase
        .from('marketplace.categories')
        .select(`
          *,
          product_count:products(count)
        `)
        .eq('slug', categorySlug)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.error('Error fetching category:', error);
        return null;
      }

      return this.transformCategory(data);
    } catch (error) {
      console.error('Error in getCategory:', error);
      return null;
    }
  }

  // Stores
  async getStores(pagination: PaginationOptions = {}): Promise<{ stores: Store[]; total: number }> {
    try {
      const { page = 1, limit = 20 } = pagination;
      const offset = (page - 1) * limit;

      const { data, error, count } = await this.supabase
        .from('marketplace.stores')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching stores:', error);
        return { stores: [], total: 0 };
      }

      const stores = (data || []).map(this.transformStore);
      return { stores, total: count || 0 };
    } catch (error) {
      console.error('Error in getStores:', error);
      return { stores: [], total: 0 };
    }
  }

  async getStore(storeId: string): Promise<Store | null> {
    try {
      const { data, error } = await this.supabase
        .from('marketplace.stores')
        .select('*')
        .eq('id', storeId)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        console.error('Error fetching store:', error);
        return null;
      }

      return this.transformStore(data);
    } catch (error) {
      console.error('Error in getStore:', error);
      return null;
    }
  }

  async getStoreProducts(
    storeId: string,
    filters: Omit<ProductFilters, 'storeId'> = {},
    pagination: PaginationOptions = {}
  ): Promise<{ products: Product[]; total: number }> {
    return this.getProducts({ ...filters, storeId }, pagination);
  }

  // Private transformation methods
  private transformProduct(data: any): Product {
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      price: parseFloat(data.price) || 0,
      category: data.categories?.slug || data.category || '',
      subcategory: data.subcategory,
      storeId: data.store_id,
      storeName: data.stores?.name || '',
      images: data.images || ['/api/placeholder/300/200'],
      specifications: data.specifications || {},
      warranty: data.warranty_details ? {
        duration: data.warranty_duration || 0,
        type: data.warranty_type || 'years',
        details: data.warranty_details
      } : undefined,
      stock: data.stock_quantity || 0,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  private transformCategory(data: any): Category {
    return {
      id: data.id,
      name: data.name,
      nameAr: data.name_ar || data.name,
      slug: data.slug,
      description: data.description,
      parent_id: data.parent_id,
      image_url: data.image_url,
      sort_order: data.sort_order || 0,
      is_active: data.is_active,
      productCount: data.product_count?.[0]?.count || 0
    };
  }

  private transformStore(data: any): Store {
    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      logo: data.logo || '/api/placeholder/100/100',
      coverImage: data.cover_image,
      theme: data.theme || {
        primaryColor: '#2563eb',
        secondaryColor: '#eff6ff'
      },
      contactInfo: data.contact_info || {
        email: '',
        phone: '',
        address: ''
      },
      ownerId: data.owner_id,
      rating: data.rating,
      reviewCount: data.review_count,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
}

// Export singleton instance
export const marketplaceService = new MarketplaceService();


