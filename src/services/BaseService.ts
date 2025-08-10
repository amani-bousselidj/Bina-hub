import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';

export class BaseService {
  protected supabase = createClientComponentClient<Database>();
  
  protected handleError(error: any, message: string) {
    console.error(`${message}:`, error);
    throw new Error(`${message}: ${error.message}`);
  }
  
  protected async query(table: string, options: {
    filters?: Record<string, any>,
    select?: string,
    orderBy?: { column: string, ascending?: boolean },
    limit?: number,
    page?: number,
  } = {}) {
    try {
      let query = this.supabase.from(table).select(options.select || '*');
      
      // Apply filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }
      
      // Apply ordering
      if (options.orderBy) {
        query = query.order(
          options.orderBy.column, 
          { ascending: options.orderBy.ascending ?? true }
        );
      }
      
      // Apply pagination
      if (options.limit) {
        const from = options.page ? (options.page - 1) * options.limit : 0;
        const to = from + options.limit - 1;
        query = query.range(from, to);
      }
      
      return await query;
    } catch (error) {
      this.handleError(error, `Failed to query ${table}`);
      return { data: null, error };
    }
  }
  
  protected async insert(table: string, data: any) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      this.handleError(error, `Failed to insert into ${table}`);
      return { data: null, error };
    }
  }
  
  protected async update(table: string, id: string, data: any) {
    try {
      const { data: result, error } = await this.supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data: result, error: null };
    } catch (error) {
      this.handleError(error, `Failed to update ${table}`);
      return { data: null, error };
    }
  }
  
  protected async delete(table: string, id: string) {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { data: true, error: null };
    } catch (error) {
      this.handleError(error, `Failed to delete from ${table}`);
      return { data: false, error };
    }
  }

  // Additional convenience methods for common operations
  protected async getAll<T>(table: string, orderBy?: string) {
    try {
      let query = this.supabase.from(table).select('*');
      if (orderBy) {
        query = query.order(orderBy);
      }
      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      this.handleError(error, `Failed to get all from ${table}`);
      return { data: null, error };
    }
  }

  protected async getById<T>(table: string, id: string) {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      this.handleError(error, `Failed to get by id from ${table}`);
      return { data: null, error };
    }
  }

  protected async create<T>(table: string, data: any) {
    return this.insert(table, data);
  }

  protected async search<T>(table: string, column: string, searchTerm: string, limit?: number) {
    try {
      let query = this.supabase
        .from(table)
        .select('*')
        .ilike(column, `%${searchTerm}%`);
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      this.handleError(error, `Failed to search in ${table}`);
      return { data: null, error };
    }
  }
}

// Changed default export to instance export pattern
export const baseService = new BaseService();
export default baseService;


