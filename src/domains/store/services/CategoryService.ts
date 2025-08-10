import { BaseService } from '../../../services/BaseService';

export interface Category {
  id: string;
  value: string;
  label: string;
  labelAr?: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
}

export class CategoryService extends BaseService {
  /**
   * Get all categories
   */
  async getCategories() {
    return await this.getAll<Category>('categories', 'sortOrder');
  }

  /**
   * Get categories for a specific domain (store, marketplace, etc.)
   */
  async getCategoriesByDomain(domain: string) {
    try {
      const { data, error } = await this.supabase
        .from('categories')
        .select('*')
        .eq('domain', domain)
        .eq('isActive', true)
        .order('sortOrder');

      if (error) {
        console.error('Error fetching categories by domain:', error);
        // Return fallback categories
        return this.getFallbackCategories(domain);
      }

      return { data, error: null };
    } catch (error) {
      console.error('Unexpected error fetching categories:', error);
      return this.getFallbackCategories(domain);
    }
  }

  /**
   * Get store product categories
   */
  async getStoreCategories() {
    return await this.getCategoriesByDomain('store');
  }

  /**
   * Get marketplace categories
   */
  async getMarketplaceCategories() {
    return await this.getCategoriesByDomain('marketplace');
  }

  /**
   * Fallback categories when Supabase is unavailable
   */
  private getFallbackCategories(domain: string) {
    const fallbackData = {
      store: [
        { id: '1', value: 'construction', label: 'مواد البناء', labelAr: 'مواد البناء', isActive: true, sortOrder: 1, domain: 'store' },
        { id: '2', value: 'tools', label: 'أدوات البناء', labelAr: 'أدوات البناء', isActive: true, sortOrder: 2, domain: 'store' },
        { id: '3', value: 'hardware', label: 'الأجهزة', labelAr: 'الأجهزة', isActive: true, sortOrder: 3, domain: 'store' },
        { id: '4', value: 'safety', label: 'معدات السلامة', labelAr: 'معدات السلامة', isActive: true, sortOrder: 4, domain: 'store' },
        { id: '5', value: 'electrical', label: 'المواد الكهربائية', labelAr: 'المواد الكهربائية', isActive: true, sortOrder: 5, domain: 'store' },
        { id: '6', value: 'plumbing', label: 'مواد السباكة', labelAr: 'مواد السباكة', isActive: true, sortOrder: 6, domain: 'store' }
      ],
      marketplace: [
        { id: '7', value: 'electronics', label: 'إلكترونيات', labelAr: 'إلكترونيات', isActive: true, sortOrder: 1, domain: 'marketplace' },
        { id: '8', value: 'furniture', label: 'أثاث', labelAr: 'أثاث', isActive: true, sortOrder: 2, domain: 'marketplace' },
        { id: '9', value: 'clothing', label: 'ملابس', labelAr: 'ملابس', isActive: true, sortOrder: 3, domain: 'marketplace' },
        { id: '10', value: 'books', label: 'كتب', labelAr: 'كتب', isActive: true, sortOrder: 4, domain: 'marketplace' }
      ]
    };

    return { 
      data: fallbackData[domain as keyof typeof fallbackData] || [], 
      error: null,
      isFallback: true 
    };
  }

  /**
   * Create new category
   */
  async createCategory(categoryData: Partial<Category>) {
    return await this.create<Category>('categories', categoryData);
  }

  /**
   * Update category
   */
  async updateCategory(categoryId: string, updates: Partial<Category>) {
    return await this.update('categories', categoryId, updates);
  }

  /**
   * Delete category
   */
  async deleteCategory(categoryId: string) {
    return await this.delete('categories', categoryId);
  }

  /**
   * Search categories
   */
  async searchCategories(searchTerm: string, domain?: string) {
    try {
      let query = this.supabase
        .from('categories')
        .select('*')
        .or(`label.ilike.%${searchTerm}%,labelAr.ilike.%${searchTerm}%`)
        .eq('isActive', true);

      if (domain) {
        query = query.eq('domain', domain);
      }

      const { data, error } = await query.order('sortOrder');

      if (error) {
        console.error('Error searching categories:', error);
        return { data: null, error };
      }

      return { data: data as Category[], error: null };
    } catch (error) {
      console.error('Unexpected error searching categories:', error);
      return { data: null, error };
    }
  }
}



